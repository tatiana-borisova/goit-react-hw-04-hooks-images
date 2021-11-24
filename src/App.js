import React, { Component } from 'react';
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
  IDLE: 'idle', //обa false
  RESOLVED: 'resolved', //loader false, button true
  PENDING: 'pending', //loader true, button false
};

class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    result: [],
    showModal: false,
    status: Status.IDLE,
    largeImage: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchQuery } = this.state;

    if (searchQuery !== prevState.searchQuery) {
      this.setState({
        result: [],
        status: Status.PENDING,
      });

      this.onFetchImages(
        1,
        this.onErrorNoImages(searchQuery),
        this.onErrorNoMoreImages(searchQuery),
      );
    }
  }

  onLoadMoreClick = async () => {
    const { page, searchQuery } = this.state;
    this.setState({
      status: Status.PENDING,
    });

    this.onFetchImages(
      page,
      this.onErrorNoMoreImages(searchQuery),
      this.onErrorNoMoreImages(searchQuery),
    );
  };

  onFetchImages = async (pageQuery, emptyResultErrorMessage, shortResultErrorMessage) => {
    const { searchQuery } = this.state;

    try {
      const { hits } = await fetchAPI(searchQuery, pageQuery);

      if (hits.length === 0) {
        throw new Error(emptyResultErrorMessage);
      }

      if (hits.length < 12) {
        this.setState(prevState => ({
          result: [...prevState.result, ...hits],
        }));
        throw new Error(shortResultErrorMessage);
      }

      this.setState(prevState => ({
        status: Status.RESOLVED,
        result: [...prevState.result, ...hits],
        page: pageQuery + 1,
      }));
      window.scrollBy({ top: 1000, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.message);
      this.setState({ status: Status.IDLE });
    }
  };

  onErrorNoImages(query) {
    return `No images found for "${query}". Try again.`;
  }
  onErrorNoMoreImages(query) {
    return `No more images found for "${query}".`;
  }

  handleFormSubmit = searchQuery => {
    this.setState({ searchQuery });
  };

  toggleModal = largeImage => {
    this.setState(prevState => ({
      largeImage,
      showModal: !prevState.showModal,
    }));
  };

  render() {
    const { result, status, showModal, largeImage } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery result={result} onClick={this.toggleModal} />
        {status === Status.RESOLVED && <Button onClick={this.onLoadMoreClick} />}
        {status === Status.PENDING && (
          <Loader type="ThreeDots" color="#995471" width={100} style={{ textAlign: 'center' }} />
        )}
        {showModal && <Modal largeImage={largeImage} onClick={this.toggleModal} />}
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }
}

export default App;
