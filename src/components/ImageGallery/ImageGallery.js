import React from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem';
import s from './ImageGallery.module.css';

const ImageGallery = ({ result, onClick }) => {
  return (
    <ul className={s.gallery}>
      {result.map(image => (
        <li key={image.id} className={s.item}>
          <ImageGalleryItem
            src={image.webformatURL}
            alt={image.tags}
            largeImage={image.largeImageURL}
            onClick={onClick}
          />
        </li>
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  onClick: PropTypes.func.isRequired,
  result: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    }),
  ),
};

export default ImageGallery;
