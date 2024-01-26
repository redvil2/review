import fs from 'fs';
import path from 'path';
import {
  Readable,
  Transform,
  TransformCallback,
  Writable,
  pipeline,
} from 'stream';

import csv from 'csv-parser';

const SOURCE_PATH = process.argv[2];
const DESTINATION_PATH = process.argv[3];

console.log(
  `Generating translation files from ${SOURCE_PATH} to ${DESTINATION_PATH}`,
);

/**
 * Transform stream to cleanup the input data and removes all properties with empty values
 */
class CleanupTransformer extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: Record<string, string>,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const cleanedChunk = Object.entries(chunk)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const diff = Object.keys(chunk)
      .filter(key => !Object.keys(cleanedChunk).includes(key))
      .map(key => key.split(' | ')[1]);

    if (diff.length > 0) {
      console.warn(
        `The key '${
          chunk['Key']
        }' has empty values for the following languages: ${diff.join(', ')}`,
      );
    }

    this.push(cleanedChunk);
    callback();
  }
}

/**
 * Options for the RenamePropertyTransform
 */
type RenamePropertyTransformOptions = {
  oldName: string;
  newName: string;
};

/**
 * Transform stream to rename a given property of the chunk
 */
class RenamePropertyTransform extends Transform {
  oldName: string;
  newName: string;

  constructor(options: RenamePropertyTransformOptions) {
    super({ objectMode: true });

    this.oldName = options.oldName;
    this.newName = options.newName;
  }

  _transform(
    chunk: Record<string, string>,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const { [this.oldName]: value, ...rest } = chunk;
    this.push({ [this.newName]: value, ...rest });
    callback();
  }
}

type RestructureTransformOptions<T = Record<string, string> | undefined> = {
  transform: (key: string, chunk: Record<string, string>) => T;
};

/**
 * Transform stream to restructure the input chunk
 */
class RestructureTransform<
  T = Record<string, string> | undefined,
> extends Transform {
  transform: (key: string, chunk: Record<string, string>) => T;

  constructor(options: RestructureTransformOptions<T>) {
    super({ objectMode: true });

    this.transform = options.transform;
  }

  _transform(
    chunk: Record<string, string>,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const newChunk = Object.entries(chunk).reduce((acc, [key, value]) => {
      const trimmedValue = value.trim();
      // Remove quotation marks if they exist at the start and end of the string
      const newValue =
        trimmedValue.trim().startsWith('"') && trimmedValue.trim().endsWith('"')
          ? trimmedValue.substring(1, trimmedValue.length - 1)
          : trimmedValue;

      const transformedValue = this.transform(key, {
        ...chunk,
        [key]: newValue,
      });
      if (transformedValue) {
        return { ...acc, [key]: transformedValue };
      }
      return acc;
    }, {});

    this.push(newChunk);
    callback();
  }
}

/**
 * Readable Stream that provides a function to add a chunk to the stream
 */
class ProxyReadable<T> extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  addChunk(chunk: T): void {
    this.push(chunk);
  }

  _read(): void {
    return;
  }

  /**
   * Ends the stream
   */
  endStream(): void {
    this.push(null);
  }
}

type BinTransformerOptions = {
  selector: (chunk: Record<string, string>) => string;
  chunkTransformer: (chunk: Record<string, string>) => Record<string, string>;
};

/**
 * Transform stream which collects all chunks and sorts it into bins based on the given selector
 */
class BinTransformer extends Transform {
  selector: (chunk: Record<string, string>) => string;
  chunkTransformer: (chunk: Record<string, string>) => Record<string, string>;
  bins: Record<string, Record<string, string>[]> = {};
  order: string[] = [];

  constructor(options: BinTransformerOptions) {
    super({ objectMode: true });

    this.selector = options.selector;
    this.chunkTransformer = options.chunkTransformer;
  }

  _transform(
    chunk: Record<string, string>,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    const bin = this.selector(chunk);

    if (!this.bins[bin]) {
      this.bins[bin] = [];
      this.order.push(bin);
    }

    this.bins[bin] = [...this.bins[bin], this.chunkTransformer(chunk)];

    callback();
  }

  _flush(callback: TransformCallback): void {
    this.order.forEach(bin => {
      this.push({ key: bin, value: this.bins[bin] });
    });

    callback();
  }
}

type JsonSerializeTransformerOptions = {
  indentation: number;
};

/**
 * Transform Stream which outputs a json object as string line by line based on the chunk data
 */
class JsonSerializeTransformer extends Transform {
  indentation: number;

  initial = true;

  constructor(options: JsonSerializeTransformerOptions = { indentation: 2 }) {
    super({ objectMode: true });

    this.indentation = options.indentation;

    this.push('{\n');
  }

  prepend(depth: number, value: string): string {
    return `${' '.repeat(depth)}${value}`;
  }

  _transform(
    chunk: Record<string, Record<string, string>[]>,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    if (!this.initial) {
      this.push(this.prepend(this.indentation * 1, '},\n'));
    } else {
      this.initial = false;
    }

    this.push(
      this.prepend(this.indentation * 1, `${JSON.stringify(chunk.key)}: {\n`),
    );

    chunk.value.forEach((value, index) => {
      const isLast = index === chunk.value.length - 1;
      const key = Object.keys(value)[0];
      this.push(
        this.prepend(
          this.indentation * 2,
          `${JSON.stringify(key)}: ${JSON.stringify(value[key])}${
            isLast ? '' : ','
          }\n`,
        ),
      );
    });

    callback();
  }

  _flush(callback: TransformCallback): void {
    this.push(this.prepend(this.indentation * 1, '}\n'));
    this.push('}\n');
    callback();
  }
}

const createTranslationFileWriter = (
  destinationPath: string,
  language: string,
): Writable => {
  const filePath = path.join(destinationPath, `${language}/translation.json`);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const readProxy = new ProxyReadable<Record<string, string>>();

  pipeline(
    readProxy,
    new BinTransformer({
      selector: chunk => chunk.path.split('.')[0],
      chunkTransformer: chunk => ({ [chunk.path.split('.')[1]]: chunk.value }),
    }),
    new JsonSerializeTransformer(),
    fs.createWriteStream(filePath),
    err => {
      if (err) {
        console.error(err);
      }
    },
  );

  return new Writable({
    objectMode: true,
    write: (chunk, encoding, callback) => {
      readProxy.addChunk(chunk);

      callback();
    },
    final: callback => {
      readProxy.endStream();
      callback();
    },
  });
};

type SinkFactoryType<T> = (options: T) => Writable;

type SwitchCaseSinkOptions<T> = {
  sinkFactory: SinkFactoryType<T>;
  allCaseSelectors: (chunk: Record<string, string>) => string[];
  sinkOptionFactory: (caseName: string, chunk: Record<string, string>) => T;
};

// Create a custom switch writable stream
class SwitchCaseSink<T> extends Writable {
  sinkFactory: SinkFactoryType<T>;
  outputStreams: Record<string, Writable> = {};
  allCaseSelectors: (chunk: Record<string, string>) => string[];
  sinkOptionFactory: (caseName: string, chunk: Record<string, string>) => T;

  constructor(options: SwitchCaseSinkOptions<T>) {
    super({ objectMode: true });

    this.sinkFactory = options.sinkFactory;
    this.allCaseSelectors = options.allCaseSelectors;
    this.sinkOptionFactory = options.sinkOptionFactory;
  }

  _write(chunk: Record<string, string>, encoding, callback) {
    // Create a stream for each case if it doesn't exist
    this.allCaseSelectors(chunk).forEach(caseName => {
      if (!this.outputStreams[caseName]) {
        this.outputStreams[caseName] = this.sinkFactory(
          this.sinkOptionFactory(caseName, chunk),
        );
      }
    });

    // Write the chunk to the corresponding streams
    const writes = this.allCaseSelectors(chunk).reduce((acc, caseName) => {
      return {
        [caseName]: this.outputStreams[caseName].write(chunk[caseName]),
        ...acc,
      };
    }, {});

    // test if all writes where successful
    const success = Object.values(writes).every(write => write);

    if (!success) {
      // wait for all unfinished writes to drain
      Promise.all(
        Object.entries(writes)
          .filter(([_, successValue]) => !successValue)
          .map(
            ([language, _]) =>
              new Promise<void>((resolve, reject) => {
                this.outputStreams[language].once('drain', () => resolve());
              }),
          ),
      ).then(() => callback());
    } else {
      callback();
    }
  }

  _final(callback) {
    Object.values(this.outputStreams).forEach(stream => stream.end());
  }
}

async function createTranslationFile(filePath: string): Promise<void> {
  const restructureTransform = new RestructureTransform({
    transform: (key, chunk) => {
      if (key === 'path') {
        return undefined;
      }

      return {
        path: chunk.path,
        value: chunk[key],
      };
    },
  });

  return new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream(SOURCE_PATH),
      csv(),
      new CleanupTransformer(),
      new RenamePropertyTransform({ oldName: 'Key', newName: 'path' }),
      restructureTransform,
      new SwitchCaseSink<string>({
        sinkFactory: (language: string) =>
          createTranslationFileWriter(DESTINATION_PATH, language),
        allCaseSelectors: chunk => Object.keys(chunk),
        sinkOptionFactory: (caseName, chunk) => caseName.split(' | ')[0],
      }),
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

const main = async () => {
  await createTranslationFile(SOURCE_PATH);
};

main();
