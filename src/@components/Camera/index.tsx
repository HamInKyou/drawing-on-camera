import styles from './style.module.scss';
import { FC, MouseEvent, useEffect, useRef } from 'react';
import { Nullable } from '../../@model/common.ts';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

interface Props {
  stream: Nullable<MediaStream>;
  onPhotoCapture: () => void;
  countdown: number;
  onStartDrawing: (e: MouseEvent<HTMLCanvasElement>) => void;
  onDraw: (e: MouseEvent<HTMLCanvasElement>) => void;
  onStopDrawing: () => void;
}

const Camera: FC<Props> = ({
  stream,
  onStartDrawing,
  onDraw,
  onStopDrawing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!videoRef.current || !overlayCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;

    const updateCanvasSize = () => {
      const containerWidth = video.clientWidth;
      const containerHeight = video.clientHeight;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    video.addEventListener('loadedmetadata', updateCanvasSize);
    window.addEventListener('resize', updateCanvasSize);

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(video);

    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasSize);
      window.removeEventListener('resize', updateCanvasSize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cx('container')}>
      <video ref={videoRef} autoPlay playsInline className={cx('video')} />
      <canvas
        ref={overlayCanvasRef}
        className={cx('canvas')}
        onMouseDown={onStartDrawing}
        onMouseMove={onDraw}
        onMouseUp={onStopDrawing}
        onMouseLeave={onStopDrawing}
      />
    </div>
  );
};

export default Camera;
