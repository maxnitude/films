'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const menuButton = document.querySelector('.menu__button');
const hamburger = document.querySelector('.menu__hamburger');
const dropdownMenu = document.querySelector('.menu__list');
const itemList = document.querySelector('.tv-shows__list');
const contentHeader = document.querySelector('.tv-shows__heading-info');
const tvShows = document.querySelector('.tv-shows');
//прелоадер
const loading = document.createElement ('div');
loading.className = 'preloader-loading';
//модальное окно
const modal = document.querySelector('.modal'),
        tvCardImgModal = document.querySelector('.modal__poster-image'),
        modalTitle = document.querySelector('.modal__title'),
        genresList = document.querySelector('.genres-list'),
        rating  = document.querySelector('.rating'),
        description = document.querySelector('.description');

modal.addEventListener('click', event => {
        if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
            document.body.style.overflow = '';
            modal.classList.add('modal-hide');
        }
    });
    
document.addEventListener('keydown', event => {
        if (event.key == 'Escape') {
            document.body.style.overflow = '';
            modal.classList.add('modal-hide');
        }
    });;


let allGenres = []; //массив с жанрами заполняется при рендере главной страницы

const DataBaseService = class {
    getData = async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        }
    }

    API_KEY = 'f10cd4d6067ee2ef892bdaef0bc81c2c';
    SERVER = 'https://api.themoviedb.org/3';

    getSearchResult = (query, page = 1) => {
        return this.getData(`${this.SERVER}/search/movie?api_key=${this.API_KEY}&language=ru-RU&query=${query}&page=${page}`)
    }

    getNowPlayingMovies = (page = 1) => {
        return this.getData(`${this.SERVER}/movie/now_playing?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getAllGenres = () => {
        return this.getData(`${this.SERVER}/genre/movie/list?api_key=${this.API_KEY}&language=ru-RU`)
    }

    getPopularMovies = (page = 2) => {
        return this.getData(`${this.SERVER}/movie/popular?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getTopRatedMovies = (page = 1) => {
        return this.getData(`${this.SERVER}/movie/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getPopularTVs = (page = 1) => {
        return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getTopRatedTVs = (page = 1) => {
        return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getOnTheAirTVs = (page = 1) => {
        return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getUpcomingMovies = (page = 1) => {
        return this.getData(`${this.SERVER}/movie/upcoming?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }
};

new DataBaseService().getAllGenres().then((response) => {
    allGenres.push(...response.genres);
}).then( 
    new DataBaseService().getNowPlayingMovies()
    .then(createDataForRender).then(renderCard)
)

function createDataForRender(response) {
    let items = response.results;
    let filmsArray = [];

    function createCardData() {
        items.forEach(item => {
            let {
                backdrop_path: backdrop,
                poster_path: poster,
                genre_ids: itemGenres,
                name: tvTitle,
                title: movieTitle,
                first_air_date: tvDate,
                release_date: movieDate,
                overview: overview,
                vote_average: vote,
                vote_count: voteCount,
                original_name: tvName,
                original_title: movieName,
                popularity: popularity,
                id: id
            } = item;

            let genres = [];
            for (let i = 0; i < allGenres.length; i++) {
                for (let j = 0; j < itemGenres.length; j++) {
                    if (allGenres[i].id == itemGenres[j]) {
                        genres.push(allGenres[i].name);
                    }
                }
            }

            const title = tvTitle || movieTitle || null;
            const originalTitle = tvName || movieName || null;
            const date = tvDate || movieDate || ' - ';
            const yearOfRealise = date.split('-')[0];
            let posterIMG = poster ? IMG_URL + poster : null;
            let backdropIMG = backdrop ? IMG_URL + backdrop : './img/no-poster.jpg';
            if (posterIMG === null) {
                posterIMG = backdropIMG;
            };

            const film = {
                genres,
                title,
                yearOfRealise,
                overview,
                vote,
                voteCount,
                originalTitle,
                popularity,
                id,
                posterIMG,
                backdropIMG
            }
            filmsArray.push(film);
        })
    };

    if (response.results.length == 0) {
        const notFound = document.querySelector('.not-found');
        notFound.innerHTML = 'По вашему запросу ничего не найдено :(';
        notFound.classList.remove('hide');
        return null;
    } else if (response.results.length > 0 && response.results.length < 20) {
        viewMore.classList.add('hide');
        createCardData();
        return filmsArray;
    } else {
        createCardData();
        viewMore.classList.remove('hide');
        return filmsArray;
    }
}

// генерация карточки с фильмом 
function renderCard(response) {
    if (response === null) {
        contentHeader.innerHTML = `Ожидаемые фильмы и новинки проката`;
        new DataBaseService().getUpcomingMovies().then(createDataForRender).then(renderCard);
        loading.remove();
        viewMore.classList.add('hide');
    } else {
        response.forEach(item => {
            const card = document.createElement('div');
            card.className = 'tv-shows__item';
            let createVoteElement = () => {
                if (item.voteCount > 50) {
                    if (item.vote >= 7) {
                        return `<span class="tv-card__top-vote">${item.vote}</span>`;
                    } else if (item.vote >= 5 && item.vote < 7) {
                        return `<span class="tv-card__middle-vote">${item.vote}</span>`;
                    } else if (item.vote < 5) {
                        return `<span class="tv-card__low-vote">${item.vote}</span>`;
                    };
                } else {
                    return `<span class="tv-card__middle-vote">—</span>`;
                };
            };
            const voteElement = createVoteElement();
            card.id = item.id;
            card.innerHTML = `
                <a href="#" class="tv-card">
                ${voteElement}
                <img class="tv-card__img"
                    src="${item.posterIMG}"
                    data-backdrop="${item.backdropIMG}"
                    alt="${item.title}">
                <h4 class="tv-card__head">${item.title}</h4>
                <h5 class="tv-card__info">
                    ${item.yearOfRealise !== ' ' ? item.yearOfRealise : item.genres[1][0].toUpperCase() + item.genres[1].slice(1)}${item.genres[0] ? ', ' + item.genres[0] : ''}
                </h5>
                </a>
                `;
            itemList.append(card);
        });
        loading.remove();


        //открытие модального окна с фильмом
        itemList.addEventListener('click', event => {
            event.preventDefault();
            const cardTap = event.target.closest('.tv-shows__item');

            function showModal(elementId) {
                for (let i = 0; i < response.length; i++) {
                    if (response[i].id == elementId) {
                        genresList.innerHTML = ``;
                        modal.classList.remove("modal-hide");
                        modalTitle.textContent = response[i].title;
                        tvCardImgModal.src = response[i].posterIMG;
                        response[i].genres.forEach(item => {
                            let newItem = item[0].toUpperCase() + item.slice(1);
                            genresList.innerHTML += `<li>${newItem}</li>`;
                        });
                        rating.textContent = response[i].vote !== 0 ? response[i].vote : 'Без рейтинга';
                        description.textContent = response[i].overview;

                        //console.log(response[i])
                    }
                }
            };
            if (cardTap) {
                showModal(cardTap.id)
            };
        });
    }
};


//вспомогательная функция, которая стирает ранее отображенные карточки при новом запросе
const deleteCardList = function (response) {
    itemList.textContent = ''; //очистка карточек
    return response;
}

const modalAlert = document.querySelector ('.modal__alert'),
        modalAlertContent = document.querySelector ('.modal__alert-content_title'),
        modalAlertAbout = document.querySelector ('.modal__alert-content_about'),
        modalAlertInfo = document.querySelector ('.modal__alert-info');

modalAlert.addEventListener('click', event => {
    if (event.target.closest('.cross__alert') || event.target.classList.contains('modalAlert')) {
        document.body.style.overflow = '';
        modalAlert.classList.add('hide');
        modalAlertInfo.classList.add('hide');
    }
});

modalAlertAbout.addEventListener('click', (event) => {
    event.preventDefault();
    modalAlertInfo.classList.remove('hide');
});;

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
    topTVs = document.querySelector ('.top-rated-tvs');

const menuButtonChanges = () => {
    hamburger.classList.remove('open');
    dropdownMenu.classList.add('hidden');
};

topMovies.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    new DataBaseService().getTopRatedMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Список лучших фильмов`;
    menuButtonChanges();
});

popMovies.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    viewMorePointer = 3;
    new DataBaseService().getPopularMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Список популярных фильмов`;
    menuButtonChanges();
});

latestMovies.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    new DataBaseService().getNowPlayingMovies().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Новинки кино`;
    menuButtonChanges();
});

topTVs.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    new DataBaseService().getTopRatedTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Список лучших сериалов`;
    menuButtonChanges();
});

popTVs.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    new DataBaseService().getPopularTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Список популярных сериалов`;
    menuButtonChanges();
});

latestTVs.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    new DataBaseService().getOnTheAirTVs().then(createDataForRender).then(deleteCardList).then(renderCard);
    contentHeader.innerHTML =`Сериалы в эфире`;
    menuButtonChanges();
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
    } else if (contentHeader.innerHTML == `Ожидаемые фильмы и новинки проката`) {
        new DataBaseService().getUpcomingMovies(viewMorePointer).then(createDataForRender).then(renderCard);
        viewMorePointer++;
    };
});


//слайдер
let sliderIndex = 1,
    slides = document.querySelectorAll('.slider-item'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    dotsWrap = document.querySelector('.slider-dots'),
    dots = document.querySelectorAll('.dot');

showSlides(sliderIndex);

function showSlides(n) {
    if (n > slides.length) {
        sliderIndex = 1;
    }
    if (n < 1) {
        sliderIndex = slides.length;
    }  
    slides.forEach((item) => item.style.display = 'none');
    dots.forEach((item) => item.classList.remove('dot-active'));
    slides[sliderIndex - 1].style.display = 'flex';
    dots[sliderIndex - 1].classList.add('dot-active');
} 
    
function plusSlides(n) {
    showSlides(sliderIndex += n);
}

function currentSlide (n) {
    showSlides(sliderIndex = n);
}

prev.addEventListener ('click', function() {
    plusSlides(-1);
});

next.addEventListener ('click', function() {
     plusSlides(1);
});

dotsWrap.addEventListener('click', function(event) {
    for (let i = 0; i < dots.length + 1; i++) {
        if(event.target.classList.contains('dot') && event.target == dots[i-1]) {
            currentSlide(i);
        }
    }
});;
