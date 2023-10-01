import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  jsGuard: document.querySelector('.js-guard'),
};

let page = 1;
let query = '';
const perPage = 40;

const observer = new IntersectionObserver(handlerObserver);

selectors.searchForm.addEventListener('submit', onSearchSubmit);
