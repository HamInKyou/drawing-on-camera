import { FC } from 'react';
import styles from './style.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

interface Props {
  capturedImage: string;
  resetCapture: () => void;
}

const Result: FC<Props> = ({ capturedImage, resetCapture }) => {
  return (
    <div className={cx('container')}>
      <img src={capturedImage} alt="Captured" />
      <button onClick={resetCapture} className={cx('button')}>
        다시 촬영하기
      </button>
    </div>
  );
};

export default Result;
