export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  language: string;
  medium_cover_image: string;
  large_cover_image: string;
}

export interface MovieListResponse {
  status: string;
  data: {
    movie_count: number;
    limit: number;
    page_number: number;
    movies: Movie[];
  };
}
