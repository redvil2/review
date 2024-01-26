import React, { useEffect, useRef, useState } from 'react';

import { VideoPlayerWrapper } from './animationvideoplayer.style';

type TimecodeEvent = {
  timecode: number;
  callback: () => void;
};

interface AnimationVideoPlayerProps {
  source: string;
  timecodeEvents: TimecodeEvent[];
}

export const AnimationVideoPlayer: React.FC<AnimationVideoPlayerProps> = ({
  source,
  timecodeEvents,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastTriggeredTimecode, setLastTriggeredTimecode] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const handleTimeUpdate = () => {
      const currentTime = videoRef.current?.currentTime;
      timecodeEvents.forEach(({ timecode, callback }) => {
        if (
          currentTime !== undefined &&
          currentTime >= timecode &&
          lastTriggeredTimecode !== timecode
        ) {
          callback();
          setLastTriggeredTimecode(timecode);
        }
      });
    };

    videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [timecodeEvents, lastTriggeredTimecode]);

  return (
    <VideoPlayerWrapper>
      <video ref={videoRef} preload="auto" src={source} autoPlay muted />
    </VideoPlayerWrapper>
  );
};
