import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ largeImage, onClick }) => {
  const handleBackdropClick = e => e.currentTarget === e.target && onClick();

  useEffect(() => {
    const handleKeyDown = e => e.code === 'Escape' && onClick();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClick]);

  return createPortal(
    <div className={s.overlay} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <img src={largeImage} alt="" />
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;

Modal.propTypes = {
  largeImage: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
