import { fetchImages } from './fetchImagesAPI';
// import { renderMarkup } from './renderMarkup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

let page = 1;
let inputText = '';
let totalHitsImages;
let gallery = new SimpleLightbox('.gallery a');

// const intersectionObserver = new IntersectionObserver(handlerObserver);

selectors.buttonLoadMore.classList.add('is-hidden');
selectors.searchForm.addEventListener('submit', onSearchSubmit);
selectors.buttonLoadMore.addEventListener('click', onLoadMore);

async function onSearchSubmit(event) {
  event.preventDefault();
  selectors.gallery.innerHTML = '';
  inputText = event.target.elements.searchQuery.value.trim();
  event.target.reset();
  if (!inputText) {
    return Notiflix.Notify.failure('Please enter your query.');
  }
  try {
    const data = await fetchImages(inputText, page);
    searchGallery(data);
  } catch (error) {
    console.log(error);
  }
}

function searchGallery({ hits, totalHits }) {
  if (hits.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  totalHitsImages = totalHits;
  selectors.buttonLoadMore.classList.remove('is-hidden');
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  renderMarkup(hits);
  gallery.refresh();
}
//кнопка LoadMore
async function onLoadMore() {
  page += 1;
  isAllImages();
  try {
    const { hits, totalHits } = await fetchImages(inputText, page);
    renderMarkup(hits);
  } catch (error) {
    console.log(error);
  }
}
function renderMarkup(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="gallery-item">
    <a class="link" href="${largeImageURL}">
            <div class="photo-card">
                 <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                 <div class="info">
                     <p class="info-item">
                     <b>Likes: ${likes}</b>
                     </p>
                     <p class="info-item">
                     <b>Views: ${views}</b>
                     </p>
                     <p class="info-item">
                     <b>Comments: ${comments}</b>
                     </p>
                     <p class="info-item">
                     <b>Downloads: ${downloads}</b>
                     </p>
                </div>
             </div>
     </a>
     </div>`
    )
    .join('');

  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}

function isAllImages() {
  if (page * 40 >= totalHitsImages) {
    selectors.buttonLoadMore.classList.add('is-hidden');
    Notify.success(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
