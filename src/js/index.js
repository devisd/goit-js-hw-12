// import Styles
import "../css/styles.css";
// SimpleLightbox
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// Notiflix
import { Notify } from "notiflix/build/notiflix-notify-aio";
// import API
import FetchImages from "./fetchPhoto";

const refs = {
  form: document.querySelector("#search-form"),
  galleryList: document.querySelector(".gallery"),
  loadMoreBtn: document.querySelector(".load-more"),
  fetchPhoto: new FetchImages(),
  gallery: new SimpleLightbox(".gallery a", { loop: true, enableKeyboard: true, docClose: true, }),
};

refs.loadMoreBtn.setAttribute("disabled", true);

refs.form.addEventListener("submit", onSearch);
refs.loadMoreBtn.addEventListener("click", onClick);

function onSearch(e) {
  e.preventDefault();

  refs.loadMoreBtn.removeAttribute("disabled");
  refs.fetchPhoto.query = e.currentTarget.elements.searchQuery.value;
  
  if (refs.fetchPhoto.query === "") {
      refs.loadMoreBtn.setAttribute("disabled", true);
      return Notify.warning("Please enter your request");
    }
    
    clearMarkup();
    refs.fetchPhoto.resetPage();
    
  try {
    refs.fetchPhoto.fetchImages()
      .then((object) => {
        totalHitsCheck(object);
        return markupPhotoList(object);
      })
      .then(renderGallery);
  } catch {
    onError();
  }
}

function onClick() {
  onFetch();
}

function onFetch() {
  refs.fetchPhoto.fetchImages()
    .then(markupPhotoList)
    .then(renderGallery);
}

function totalHitsCheck(object) {
  return object.total === 0
    ? Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    : Notify.success(`Hooray! We found ${object.totalHits} images.`);
}

function markupPhotoList(object) {
  return object.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads, }) =>
        `<a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>${downloads}
                    </p>
                </div>
            </div>
        </a>`
    ).join("");
}

function renderGallery(markup) {
  refs.galleryList.insertAdjacentHTML("beforeend", markup);
  refs.gallery.refresh();
}

function clearMarkup() {
  refs.galleryList.innerHTML = "";
}

function onError() {
  Notify.failure("Oops, that went wrong. Please try again later");
}

// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление
// Notify.info('We're sorry, but you've reached the end of search results.');

// ==========================================================================================================

// Прокрутка страницы
// Сделать плавную прокрутку страницы после запроса и отрисовки каждой следующей группы изображений. Вот тебе код подсказка, а разберись в нём самостоятельно.

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// ==========================================================================================================

// Бесконечный скролл
// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.
