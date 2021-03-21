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
}