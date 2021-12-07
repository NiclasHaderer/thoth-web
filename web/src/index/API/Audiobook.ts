export interface AuthorModel {
  asin: string | null;
  biography: string | null;
  id: string;
  image: string | null;
  name: string;
}

export interface NamedId {
  id: string;
  name: string;
}

export interface TitledId {
  id: string;
  title: string;
}

export interface BookModel {
  asin: string | null;
  author: NamedId;
  cover: string | null;
  description: string | null;
  id: string;
  language: string | null;
  narrator: string | null;
  series: TitledId | null;
  seriesIndex: number | null;
  title: string;
  year: number | null;
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
  author: NamedId;
  book: TitledId;
  cover: string | null;
  duration: number;
  id: string;
  narrator: string | null;
  series: TitledId | null;
  seriesIndex: number | null;
  title: string;
  trackNr: number | null;
}

export interface BookModelWithTracks {
  asin: string | null;
  author: NamedId;
  cover: string | null;
  description: string | null;
  id: string;
  language: string | null;
  narrator: string | null;
  series: TitledId | null;
  seriesIndex: number | null;
  title: string;
  tracks: TrackModel[];
  year: number | null;
}

export interface SeriesModel {
  amount: number;
  asin: string | null;
  author: NamedId;
  description: string | null;
  id: string;
  title: string;
}

export interface SearchModel {
  authors: AuthorModel[];
  books: BookModel[];
  series: SeriesModel[];
}

export interface PatchAuthor {
  asin: string | null;
  biography: string | null;
  image: string | null;
  name: string | null;
}

export interface PatchSeries {
  asin: string | null;
  description: string | null;
  title: string | null;
}

export interface PatchBook {
  asin: string | null;
  author: string | null;
  cover: string | null;
  description: string | null;
  language: string | null;
  narrator: string | null;
  series: string | null;
  seriesIndex: number | null;
  title: string | null;
}

export interface YearRange {
  end: number;
  start: number;
}

export interface SeriesModelWithBooks {
  amount: number;
  asin: string | null;
  author: NamedId;
  books: BookModel[];
  description: string | null;
  id: string;
  narrators: string[];
  title: string;
  yearRange: YearRange | null;
}
