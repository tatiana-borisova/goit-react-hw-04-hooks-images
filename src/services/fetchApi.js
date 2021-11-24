const API_KEY = '23600792-c35e54b22aba5a82a8a51cd77';
const BASE_URL = 'https://pixabay.com/api';

const fetchAPI = async (query, page) => {
  const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`;
  const response = await fetch(url);

  return await response.json();
};

export default fetchAPI;
