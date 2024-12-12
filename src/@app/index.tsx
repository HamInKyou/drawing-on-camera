import './normalize.scss';
import styles from './style.module.scss';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useCamera } from '../@hooks/useCamera.ts';
import { Nullable } from '../@model/common.ts';
import { useCountdown } from '../@hooks/useCountdown.ts';
import Result from '../@components/Result';
import Camera from '../@components/Camera';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

function App() {
  const { stream, startCamera } = useCamera();
  const { isCountingDown, countdown, startCountdown } = useCountdown();
  const [capturedImage, setCapturedImage] = useState<Nullable<string>>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const overlayCanvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        startCountdown(capturePhoto);
      }
    };

    startCamera();
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const getMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { x, y } = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      overlayCanvasRef.current = canvas;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !overlayCanvasRef.current) return;
    const ctx = overlayCanvasRef.current.getContext('2d');
    if (ctx) {
      const { x, y } = getMousePos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = overlayCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const capturePhoto = () => {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    const overlay = overlayCanvasRef.current;

    if (video && canvas && overlay) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Draw the video frame
        context.drawImage(video, 0, 0);

        // Draw the overlay canvas content
        context.drawImage(
          overlay,
          0,
          0,
          overlay.width,
          overlay.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  const resetCapture = async () => {
    setCapturedImage(null);
    clearCanvas();
    await startCamera();
  };

  if (capturedImage) {
    return <Result capturedImage={capturedImage} resetCapture={resetCapture} />;
  }

  return (
    <main className={cx('main')}>
      <Camera
        stream={stream}
        onPhotoCapture={capturePhoto}
        countdown={countdown}
        onStartDrawing={startDrawing}
        onDraw={draw}
        onStopDrawing={stopDrawing}
      />

      {isCountingDown && (
        <div className={cx('countdown-container')}>
          <span>{countdown}</span>
        </div>
      )}
    </main>
  );
}

export default App;
