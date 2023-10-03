import { fetchImages } from './fetchImages';
import { renderMarkup } from './renderMarkup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'Simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  jsGuard: document.querySelector('.js-guard'),
};

let page = 1;
let query = '';
const perPage = 40;
const lightbox = new SimpleLightbox('.gallery a');
// const observer = new IntersectionObserver(handlerObserver);

selectors.searchForm.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(event) {
  event.preventDefault();
  page = 1;
  selectors.gallery.innerHTML = '';
  query = event.target.elements['searchQuery'].value.trim();

  if (!query) {
    // Виводимо сповіщення про помилку, якщо пошуковий запит порожній
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  // Виконуємо пошук фотографій
  searchGallery();
}
