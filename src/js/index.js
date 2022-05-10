// import Styles
import '../css/styles.css';
// SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import API
import FetchImages from './fetchPhoto';


const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more')

const fetchPhoto = new FetchImages()
    
form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onClick)

function onSearch(e) {
    e.preventDefault();

    fetchPhoto.query = e.currentTarget.elements.searchQuery.value;

    if (fetchPhoto.query === '') {
        return Notify.warning('Please enter your request')
    }

    clearMarkup();
    fetchPhoto.resetPage();

    fetchPhoto.fetchImages()
        .then(markupPhotoList)
        .then(renderGallery)
        .catch(onError)
}

function onClick() {
    fetchPhoto.fetchImages()
        .then(markupPhotoList)
        .then(renderGallery)
}

function markupPhotoList(object) {
    if (object.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
        Notify.success(`Hooray! We found ${object.totalHits} images.`);
    }

    return object.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
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
    ).join('');
}

function renderGallery(markup) {
    galleryList.insertAdjacentHTML("beforeend", markup);
    new SimpleLightbox('.gallery a', { loop: true, enableKeyboard: true, docClose: true });
}

function clearMarkup() {
    galleryList.innerHTML = '';
}

function onError() {
    Notify.failure('Oops, that went wrong. Please try again later');
}


// После первого запроса при каждом новом поиске выводить уведомление в котором будет написано сколько всего нашли изображений (свойство totalHits).
// Notify.success(`Hooray! We found ${totalHits} images.`);

// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло.
// Notify.failure('Sorry, there are no images matching your search query. Please try again.');

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