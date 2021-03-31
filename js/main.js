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
const modalAlert = document.querySelector ('.modal__alert'),
        modalAlertContent = document.querySelector ('.modal__alert-content_title'),
        modalAlertAbout = document.querySelector ('.modal__alert-content_about'),
        modalAlertInfo = document.querySelector ('.modal__alert-info');

modalAlert.addEventListener('click', event => {
    if (event.target.closest('.cross__alert') || event.target.classList.contains('modal__alert')) {
        document.body.style.overflow = '';
        modalAlert.classList.add('hide');
        modalAlertInfo.classList.add('hide');
    }
});

modalAlertAbout.addEventListener('click', (event) => {
    event.preventDefault();
    modalAlertInfo.classList.remove('hide');
});;
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


let allGenres = []; //массив с жанрами заполняется при рендере главной страницы

const DataBaseService = class {
    getData = async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        }
    }

    API_KEY = 'f10cd4d6067ee2ef892bdaef0bc81c2c';
    SERVER = 'https://api.themoviedb.org/3';

    getSearchResult =  async (query, page = 1) => await this.getData(`${this.SERVER}/search/movie?api_key=${this.API_KEY}&language=ru-RU&query=${query}&page=${page}`);

    getNowPlayingMovies =  (page = 1) => {
        return  this.getData(`${this.SERVER}/movie/now_playing?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getAllGenres =  () => {
        return  this.getData(`${this.SERVER}/genre/movie/list?api_key=${this.API_KEY}&language=ru-RU`)
    }

    getPopularMovies =  (page = 1) => {
        return  this.getData(`${this.SERVER}/movie/popular?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getTopRatedMovies =  (page = 1) => {
        return  this.getData(`${this.SERVER}/movie/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getPopularTVs =  (page = 1) => {
        return  this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

   getTopRatedTVs =  (page = 1) => {
        return  this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

   getOnTheAirTVs =  (page = 1) => {
        return  this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
    }

    getUpcomingMovies =  (page = 1) => {
        return  this.getData(`${this.SERVER}/movie/upcoming?api_key=${this.API_KEY}&language=ru-RU&page=${page}`)
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
    let page = response.page;
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
        notFound.innerHTML = 'По вашему запросу ничего не найдено :(';
        notFound.classList.remove('hide');
        return [null, page];
    } else if (response.results.length > 0 && response.results.length < 20) {
        viewMore.classList.add('hide');
        createCardData();
        return [filmsArray, page];
    } else {
        createCardData();
        viewMore.classList.remove('hide');
        return [filmsArray, page];
    }

}

// генерация карточки с фильмом 
function renderCard(response) {
    let page = response[1];
    if (response[0] === null) {
        contentHeader.innerHTML = `Возможно, вам понравится`;
        new DataBaseService().getUpcomingMovies().then(createDataForRender).then(renderCard);
        loading.remove();
        viewMore.classList.add('hide');
    } else {
        const createVoteElement = (vote, count) => {
            if (count > 50) {
                if (vote >= 7) {
                    return `<span class="tv-card__top-vote">${vote}</span>`;
                } else if (vote >= 5 && vote < 7) {
                    return `<span class="tv-card__middle-vote">${vote}</span>`;
                } else if (vote < 5) {
                    return `<span class="tv-card__low-vote">${vote}</span>`;
                };
            } else {
                return `<span class="tv-card__middle-vote">—</span>`;
            };
        };

        const createCardTitle = (year, genres) => {
            if (year === ' ' && genres.length == 0) {
                return ''
            } else if (year !== ' ' && genres.length == 0) {
                return year
            } else if (year === ' ' && genres.length >= 2) {
                return genres[0][0].toUpperCase() + genres[0].slice(1) + ' ,' + genres[1]
            } else if (year === ' ' && genres.length == 1) {
                return genres[0][0].toUpperCase() + genres[0].slice(1)
            } else if (year !== ' ' && genres.length) {
                return year + ', ' + genres[0]
            }
        }

        response[0].forEach(item => {
            const {yearOfRealise, genres, voteCount, vote, id, posterIMG, backdropIMG, title} = item;
            const card = document.createElement('div');
            card.className = 'tv-shows__item';
            const cardTitle = createCardTitle(yearOfRealise, genres);
            const voteElement = createVoteElement(vote, voteCount);
            card.id = id;
            card.innerHTML = `
                <a href="#" class="tv-card">
                ${voteElement}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
                <h5 class="tv-card__info">
                ${cardTitle}
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
                for (let i = 0; i < response[0].length; i++) {
                    if (response[0][i].id == elementId) {
                        genresList.innerHTML = ``;
                        modal.classList.remove("modal-hide");
                        modalTitle.textContent = response[0][i].title;
                        tvCardImgModal.src = response[0][i].posterIMG;
                        response[0][i].genres.length > 0 
                        ? response[0][i].genres.forEach(item => {
                            let newItem = item[0].toUpperCase() + item.slice(1);
                            genresList.innerHTML += `<li>${newItem}</li>`;
                        })
                        : genresList.innerHTML = '<li>Описание отсутствует</li>';

                        const realRating = response[0][i].vote !== 0 && response[0][i].voteCount > 50 ? response[0][i].vote : `${response[0][i].vote} (мало оценок)`
                        rating.textContent = response[0][i].vote !== 0 ? realRating : 'Без рейтинга';
                        description.textContent = response[0][i].overview !== '' ? response[0][i].overview : 'отсутствует';
                    }
                }
            };
            if (cardTap) {
                showModal(cardTap.id)
            };
        });
    };
    return page;
};

//вспомогательная функция, которая стирает ранее отображенные карточки при новом запросе
const deleteCardList = function (response) {
    itemList.textContent = ''; 
    return response;
}

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
    notFound.classList.add('hide');
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
    if (!searchFormInput.value) {
        searchCross.classList.add('hide'); 
    } 
}

searchCross.addEventListener ('click', () => {
    searchFormInput.value = '';
    searchCross.classList.add('hide');
});

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
let viewMorePointer = [2, 2, 2, 2, 2, 2, 2, 2]; //новый запрос начинается с 2ого пакета данных
const viewMore = document.querySelector ('.view_more');
const viewMoreButton = document.querySelector ('.view_more-button');
viewMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    tvShows.append(loading);
    if (contentHeader.innerHTML == `Результаты поиска`) {
        new DataBaseService().getSearchResult(searchRequestText, viewMorePointer[0]).then(createDataForRender).then(renderCard);
        viewMorePointer[0]++;
    } else if (contentHeader.innerHTML == `Новинки кино`) {
        new DataBaseService().getNowPlayingMovies(viewMorePointer[1]).then(createDataForRender).then(renderCard);
        viewMorePointer[1]++;
    } else if (contentHeader.innerHTML == `Список популярных фильмов`) {
        new DataBaseService().getPopularMovies(viewMorePointer[2]).then(createDataForRender).then(renderCard);
        viewMorePointer[2]++;
    } else if (contentHeader.innerHTML == `Список лучших фильмов`) {
        new DataBaseService().getTopRatedMovies(viewMorePointer[3]).then(createDataForRender).then(renderCard);
        viewMorePointer[3]++;
    } else if (contentHeader.innerHTML == `Список лучших сериалов`) {
        new DataBaseService().getTopRatedTVs(viewMorePointer[4]).then(createDataForRender).then(renderCard);
        viewMorePointer[4]++;
    } else if (contentHeader.innerHTML == `Список популярных сериалов`) {
        new DataBaseService().getPopularTVs(viewMorePointer[5]).then(createDataForRender).then(renderCard);
        viewMorePointer[5]++;
    } else if (contentHeader.innerHTML == `Сериалы в эфире`) {
        new DataBaseService().getOnTheAirTVs(viewMorePointer[6]).then(createDataForRender).then(renderCard);
        viewMorePointer[6]++;
    } else if (contentHeader.innerHTML == `Возможно, вам понравится`) {
        new DataBaseService().getUpcomingMovies(viewMorePointer[7]).then(createDataForRender).then(renderCard);
        viewMorePointer[7]++;
    };
});