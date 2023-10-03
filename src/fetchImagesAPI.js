import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const key = '39768210-58261750239bfb23b413c7964';
const pageSize = 40;

export async function fetchImages(inputText, page) {
  const url = `${BASE_URL}/?key=${key}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageSize}`;

  return await axios.get(url);
}
