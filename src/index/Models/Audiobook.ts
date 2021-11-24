export interface AuthorModel {
  asin: string | null;
  biography: string | null;
  id: string;
  image: string | null;
  name: string;
}

export interface BookModel {
  asin: string | null;
  author: string;
  cover: string | null;
  description: string | null;
  id: string;
  language: string | null;
  narrator: string | null;
  series: string | null;
  seriesIndex: number | null;
  title: string;
}

export interface AuthorModelWithBooks {
  asin: string | null;
  biography: string | null;
  books: BookModel[];
  id: string;
  image: string | null;
  name: string;
}

export interface TrackModel {
  accessTime: number;
  author: string;
  book: string;
  duration: number;
  id: string;
  narrator: string | null;
  series: string | null;
  seriesIndex: number | null;
  title: string;
  trackNr: number | null;
}

export interface BookModelWithTracks {
  asin: string | null;
  author: string;
  cover: string | null;
  description: string | null;
  id: string;
  language: string | null;
  narrator: string | null;
  series: string | null;
  seriesIndex: number | null;
  title: string;
  tracks: TrackModel[];
}

export interface SeriesModel {
  asin: string | null;
  author: string;
  description: string | null;
  id: string;
  title: string;
}

export interface SearchModel {
  authors: AuthorModel[];
  books: BookModel[];
  series: SeriesModel[];
}

export interface SeriesModelWithBooks {
  asin: string | null;
  author: string;
  books: BookModel[];
  description: string | null;
  id: string;
  title: string;
}
