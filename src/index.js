import { fetchImages } from './fetchImagesAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

let page = 1;
const perPage = 40;
let inputText = '';
let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// const intersectionObserver = new IntersectionObserver(handlerObserver);

// selectors.buttonLoadMore.classList.add('is-hidden');
selectors.searchForm.addEventListener('submit', onSearchSubmit);
selectors.buttonLoadMore.addEventListener('click', onLoadMore);

async function onSearchSubmit(event) {
  event.preventDefault();
  selectors.gallery.innerHTML = '';
  inputText = event.target.elements.searchQuery.value.trim();
  event.target.reset();
  if (!inputText) {
    hideLoadMoreButton();
    Notiflix.Notify.failure('Please enter your query.');
    return;
  }
  try {
    const data = await fetchImages(inputText, page);
    searchGallery(data);

    updateLoadMoreButton(data.totalHits);
    // const totalPages = Math.ceil(data.totalHits / perPage);

    // if (page >= totalPages) {
    //   hideLoadMoreButton();
    //   Notiflix.Notify.info(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    // }
  } catch (error) {
    console.log(error);
  }
}

function searchGallery({ hits, totalHits }) {
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  renderMarkup(hits);
  gallery.refresh();
  // updateLoadMoreButton(totalHits);
}

//кнопка LoadMore
async function onLoadMore() {
  page += 1;

  try {
    const { hits, totalHits } = await fetchImages(inputText, page);
    renderMarkup(hits);
    updateLoadMoreButton(totalHits);
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
                    <b>Likes:</b>  ${likes}
                     </p>
                     <p class="info-item">
                    <b>Views:</b>  ${views}
                     </p>
                     <p class="info-item">
                     <b>Comments:</b> ${comments}
                     </p>
                     <p class="info-item">
                     <b>Downloads:</b> ${downloads}
                     </p>
                </div>
             </div>
     </a>
     </div>`
    )
    .join('');

  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}

function updateLoadMoreButton(totalHits) {
  const totalPages = Math.ceil(totalHits / perPage);
  if (page > totalPages) {
    hideLoadMoreButton();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    showLoadMoreButton();
  }
}
function showLoadMoreButton() {
  selectors.buttonLoadMore.classList.remove('is-hidden');
}

function hideLoadMoreButton() {
  selectors.buttonLoadMore.classList.add('is-hidden');
}
