import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ src, alt, onClick, largeImage }) => {
  return <img className={s.image} src={src} alt={alt} onClick={() => onClick(largeImage)} />;
};

export default ImageGalleryItem;
