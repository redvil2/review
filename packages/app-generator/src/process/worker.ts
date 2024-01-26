import { produceShare } from '../generator/produceShare';

process.on('message', async (message: any) => {
  if (!message.request) {
    return;
  }

  await produceShare({
    ...message.request,
    onCreation: i => {
      process.send?.({
        generatedSerialNumber: i,
      });
    },
  });

  process.exit();
});
