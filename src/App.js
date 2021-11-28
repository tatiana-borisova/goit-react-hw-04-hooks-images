import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import fetchAPI from './services/fetchApi';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Modal from './components/Modal';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const Status = {
  IDLE: 'idle', //both are false
  RESOLVED: 'resolved', //loader is false, button is true
  PENDING: 'pending', //loader is true, button is false
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [largeImage, setLargeImage] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStatus(Status.PENDING);

    const errors = {
      noImages: `No images found for "${searchQuery}". Try again.`,
      noMore: `No more images for "${searchQuery}".`,
    };

    const onFetchImages = async page => {
      try {
        const { hits } = await fetchAPI(searchQuery, page);

        if (hits.length === 0) {
          throw new Error(errors.noImages);
        }

        if (hits.length < 12) {
          setResult(prevState => [...prevState, ...hits]);
          throw new Error(errors.noMore);
        }
        setStatus(Status.RESOLVED);
        setResult(prevState => [...prevState, ...hits]);
        window.scrollBy({ top: 1000, behavior: 'smooth' });
      } catch (error) {
        if (error.message === errors.noMore) {
          toast.info(error.message);
        } else {
          toast.error(error.message);
        }
        setStatus(Status.IDLE);
      }
    };

    onFetchImages(page);
  }, [page, searchQuery]);

  const onLoadMoreClick = () => {
    setPage(prevState => prevState + 1);
  };

  const handleFormSubmit = newSearchQuery => {
    if (newSearchQuery !== searchQuery) {
      setResult([]);
      setPage(1);
      setSearchQuery(newSearchQuery);
    }
  };

  const toggleModal = newLargeImage => {
    setLargeImage(newLargeImage);
    setShowModal(prevState => !prevState);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery result={result} onClick={toggleModal} />
      {status === Status.RESOLVED && <Button onClick={onLoadMoreClick} />}
      {status === Status.PENDING && (
        <Loader type="ThreeDots" color="#995471" width={100} style={{ textAlign: 'center' }} />
      )}
      {showModal && <Modal largeImage={largeImage} onClick={toggleModal} />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
