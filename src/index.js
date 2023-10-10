import { fetchImages } from './fetchImagesAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScrollbar from 'only-scrollbar';

const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // buttonLoadMore: document.querySelector('.load-more'),
  jsGuard: document.querySelector('.js-guard'),
};

let page = 1;

// const perPage = 40;
let inputText = '';
let options = {
  root: null,
  rootMargin: '700px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(onLoadMore, options);
const scroll = new OnlyScrollbar(
  document.querySelector('.container', {
    damping: 0.7,
    eventContainer: window,
    mode: 'free',
  })
);

// selectors.buttonLoadMore.classList.add('is-hidden');
selectors.searchForm.addEventListener('submit', onSearchSubmit);
// selectors.buttonLoadMore.addEventListener('click', onLoadMore);

async function onSearchSubmit(event) {
  event.preventDefault();
  page = 1;
  selectors.gallery.innerHTML = '';
  inputText = event.target.elements.searchQuery.value.trim();
  event.target.reset();
  if (!inputText) {
    // hideLoadMoreButton();
    Notiflix.Notify.failure('Please enter your query.');
    return;
  }
  try {
    const data = await fetchImages(inputText, page);

    searchGallery(data);

    // updateLoadMoreButton(data.totalHits);
    const totalPages = Math.ceil(data.totalHits / 40);

    if (page === totalPages) {
      // hideLoadMoreButton();
      observer.unobserve(selectors.jsGuard);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function searchGallery({ hits, totalHits }) {
  if (hits.length === 0) {
    // hideLoadMoreButton();

    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  renderMarkup(hits);
  observer.observe(selectors.jsGuard);
  // showLoadMoreButton();
  // gallery.refresh();
}

//кнопка LoadMore
// async function onLoadMore() {
//   page += 1;

//   try {
//     const { hits, totalHits } = await fetchImages(inputText, page);

//     renderMarkup(hits);
//     // gallery.refresh();

//     const totalPages = Math.ceil(totalHits / 40);
//     if (page === totalPages) {
//       hideLoadMoreButton();
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function onLoadMore(entries, observer) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       try {
//         page += 1;
//         const { hits, totalHits } = fetchImages(inputText, page);
//         renderMarkup(hits);
//         // gallery.refresh();

//         const totalPages = Math.ceil(totalHits / 40);
//         if (page === totalPages) {
//           // hideLoadMoreButton();
//           observer.unobserve(selectors.jsGuard);
//           Notiflix.Notify.info(
//             "We're sorry, but you've reached the end of search results."
//           );
//           return;
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   });
// }

async function onLoadMore(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        page += 1;
        const { hits, totalHits } = await fetchImages(inputText, page);
        renderMarkup(hits);

        const totalPages = Math.ceil(totalHits / 40);
        if (page === totalPages) {
          observer.unobserve(selectors.jsGuard);
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
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

  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// function updateLoadMoreButton(totalHits) {
//   const totalPages = Math.ceil(totalHits / perPage);
//   console.log(totalPages);
//   console.log(page);
//   if (page === totalPages) {
//     hideLoadMoreButton();
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//   } else {
//     showLoadMoreButton();
//   }
// }
// function showLoadMoreButton() {
//   selectors.buttonLoadMore.classList.remove('is-hidden');
// }

// function hideLoadMoreButton() {
//   selectors.buttonLoadMore.classList.add('is-hidden');
// }
