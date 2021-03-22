'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const menuButton = document.querySelector('.menu__button');
const itemList = document.querySelector('.tv-shows__list');
const contentHeader = document.querySelector('.tv-shows__heading-info');
const notFound = document.querySelector('.not-found');
const tvShows = document.querySelector('.tv-shows');
//прелоадер
const loading = document.createElement ('div');
loading.className = 'preloader-loading';
//модальное окно
@@include('../components/modal/modal.js');


let allGenres = []; //массив с жанрами заполняется при рендере главной страницы

@@include('service.js');

new DataBaseService().getAllGenres().then((response) => {
    allGenres.push(...response.genres);
}).then( 
    new DataBaseService().getNowPlayingMovies()
    .then(createDataForRender).then(renderCard)
)

@@include('render.js');

//вспомогательная функция, которая стирает ранее отображенные карточки при новом запросе
const deleteCardList = function (response) {
    itemList.textContent = ''; //очистка карточек
    return response;
}

@@include('../components/modal-alert/modal-alert.js');

//открытие-закрытие меню
menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    hamburger.classList.toggle('open');
    dropdownMenu.classList.toggle('menu__list__hidden');
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.closest('.menu')) {
        hamburger.classList.remove('open');
        dropdownMenu.classList.add('menu__list__hidden');
    }
});

//работа поиска
const searchForm = document.querySelector ('.search__form');
const searchFormInput = document.querySelector ('.search__form-input');
let searchRequestText;
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value;
    searchRequestText = value;
    if (value === '' || value.trim() == 0) {
        modalAlert.classList.remove('hide');
        modalAlertContent.textContent = 'Вы ввели пустой поисковый запрос. Попробуйте повторить попытку. '
    } else if (value.length > 25) {
        modalAlert.classList.remove('hide');
        modalAlertContent.textContent = 'Ваш поисковый запрос превышает допустимое количество символов. Попробуйте повторить попытку. '
    } else {
        searchFormInput.value = ''; 
        searchCross.classList.add('hide');
        tvShows.append(loading);
        viewMorePointer = 2;
        new DataBaseService().getSearchResult(value, 1).then(createDataForRender).then(deleteCardList).then(renderCard);
        contentHeader.innerHTML =`Результаты поиска`;
    }
});

//появление в поисковой строке крестика для удаления содержимого
const searchCross = document.querySelector ('.search__cross');
searchFormInput.oninput = function () {
    searchCross.classList.remove('hide');
    searchCross.addEventListener ('click', () => {
    searchFormInput.value = '';
    searchCross.classList.add('hide');
    });
}

//отработка пунктов меню
const latestMovies = document.querySelector ('.latest-movies'),
    popMovies = document.querySelector ('.popular-movies'),
    topMovies = document.querySelector ('.top-rated-movies'),
    latestTVs = document.querySelector ('.latest-tvs'),
    popTVs = document.querySelector ('.popular-tvs'),
    topTVs = document.querySelector ('.top-rated-tvs'),
    hamburger = document.querySelector('.menu__hamburger'),
    dropdownMenu = document.querySelector('.menu__list');

const menuButtonChanges = () => {
    hamburger.classList.remove('open');
    dropdownMenu.classList.add('menu__list__hidden');
};

function domChanges (event, name) {
    event.preventDefault();
    tvShows.append(loading);
    notFound.classList.add('hide');
    contentHeader.innerHTML = name;
    menuButtonChanges();
}

topMovies.addEventListener('click', (event) => {
    domChanges(event, `Список лучших фильмов`);
    new DataBaseService().getTopRatedMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
});

popMovies.addEventListener('click', (event) => {
    domChanges(event, `Список популярных фильмов`);
    new DataBaseService().getPopularMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
});

latestMovies.addEventListener('click', (event) => {
    domChanges(event, `Новинки кино`);
    new DataBaseService().getNowPlayingMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
});

topTVs.addEventListener('click', (event) => {
    domChanges(event, `Список лучших сериалов`);
    new DataBaseService().getTopRatedTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
});

popTVs.addEventListener('click', (event) => {
    domChanges(event, `Список популярных сериалов`);
    new DataBaseService().getPopularTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
});

latestTVs.addEventListener('click', (event) => {
    domChanges(event, `Сериалы в эфире`);
    new DataBaseService().getOnTheAirTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
});

//работа кнопки "загрузить еще"
let viewMorePointer = 2; //новый запрос начинается с 2ого пакета данных
const viewMore = document.querySelector ('.view_more');
const viewMoreButton = document.querySelector ('.view_more-button');
viewMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    viewMore.append(loading);
    if (contentHeader.innerHTML == `Результаты поиска`) {
        new DataBaseService().getSearchResult(searchRequestText, viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Новинки кино`) {
        new DataBaseService().getNowPlayingMovies(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Список популярных фильмов`) {
        new DataBaseService().getPopularMovies(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Список лучших фильмов`) {
        new DataBaseService().getTopRatedMovies(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Список лучших сериалов`) {
        new DataBaseService().getTopRatedTVs(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Список популярных сериалов`) {
        new DataBaseService().getPopularTVs(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Сериалы в эфире`) {
        new DataBaseService().getOnTheAirTVs(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    } else if (contentHeader.innerHTML == `Возможно, вам понравится`) {
        new DataBaseService().getUpcomingMovies(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    };
});


//слайдер
@@include('../components/slider/slider.js');
