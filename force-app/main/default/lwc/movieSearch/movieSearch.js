import { LightningElement, track } from 'lwc';
import searchMovies from '@salesforce/apex/OMDBService.searchMovies';
import saveMovie from '@salesforce/apex/OMDBService.saveMovie';

export default class MovieSearch extends LightningElement {
    @track searchQuery = '';
    @track movies = [];
    @track error;

    handleSearchInput(event) {
        this.searchQuery = event.target.value;
    }

    handleSearch() {
        searchMovies({ query: this.searchQuery })
            .then((result) => {
                let movies = JSON.parse(result);
                if (movies.Response === 'True') {
                    this.movies = movies.Search;
                    this.error = null;
                } else {
                    this.error = movies.Error;
                    this.movies = [];
                }
            })
            .catch((error) => {
                this.error = error.body.message;
                this.movies = [];
            });
    }

    handleSaveMovie(event) {
        const imdbID = event.target.dataset.id;
        const movie = this.movies.find((m) => m.imdbID === imdbID);

        saveMovie({ 
            title: movie.Title, 
            year: movie.Year, 
            imdbId: movie.imdbID,
            posterUrl: movie.Poster 
        })
            .then(() => {
                alert('Movie saved successfully!');
            })
            .catch((error) => {
                alert('Failed to save movie: ' + error.body.message);
            });
    }
}
