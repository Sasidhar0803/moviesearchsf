public with sharing class OMDBService {
    private static final String OMDB_API_KEY = '1c939cf6'; // Replace with your OMDB API Key
    private static final String OMDB_API_URL = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY;

    @AuraEnabled(cacheable=true)
    public static String searchMovies(String query) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(OMDB_API_URL + '&s=' + EncodingUtil.urlEncode(query, 'UTF-8'));
        request.setMethod('GET');
        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            return response.getBody();
        } else {
            throw new AuraHandledException('Failed to fetch movies.');
        }
    }

    @AuraEnabled
    public static void saveMovie(String title, String year, String imdbId, String posterUrl) {
        Movie__c movie = new Movie__c();
        movie.Title__c = title;
        movie.Year__c = year;
        movie.IMDbID__c = imdbId;
        movie.PosterURL__c = posterUrl;

        insert movie;
    }
}