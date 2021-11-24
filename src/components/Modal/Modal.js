import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.getElementById('modal-root');

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => e.code === 'Escape' && this.props.onClick();

  handleBackdropClick = e => e.currentTarget === e.target && this.props.onClick();

  render() {
    const { largeImage } = this.props;
    return createPortal(
      <div className={s.overlay} onClick={this.handleBackdropClick}>
        <div className={s.modal}>
          <img src={largeImage} alt="" />
        </div>
      </div>,
      modalRoot,
    );
  }
}
