import axios from "axios";

const URL = 'https://pixabay.com/api/';
const KEY = '27011698-625c436f56f84acec03c07eda';

export default class FetchImages {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImages() {
        return axios.get(URL, {
            params: {
                key: KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                page: this.page,
                per_page: '40',
            }
        })
            .then(response => {
                this.incrementPage()
                return response.data
            })
    }
   
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}