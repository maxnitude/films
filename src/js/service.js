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
}