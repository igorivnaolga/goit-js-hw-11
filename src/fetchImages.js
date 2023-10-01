import axios from 'axios';

async function fetchImages(name, page, perPage) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=39768210-58261750239bfb23b413c7964&q=${name}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  console.log(response);
  return response;
}

export { fetchImages };
