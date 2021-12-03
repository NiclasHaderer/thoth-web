export interface AudibleSearchAuthor {
  asin: string;
  link: string;
  name: string | null;
}

export interface AudibleAuthor extends AudibleSearchAuthor {
  biography: string | null;
  image: string | null;
}

export interface AudibleSearchSeries {
  asin: string;
  index: number | null;
  link: string;
  name: string;
}

export interface AudibleBook {
  asin: string;
  author: AudibleSearchAuthor | null;
  description: string | null;
  image: string | null;
  link: string | null;
  series: AudibleSearchSeries | null;
  title: string | null;
}

export interface AudibleSearchResult {
  asin: string;
  author: AudibleSearchAuthor | null;
  image: string | null;
  language: string | null;
  link: string | null;
  narrator: AudibleSearchAuthor | null;
  releaseDate: Date | null;
  series: AudibleSearchSeries | null;
  title: string | null;
}

export interface AudibleSearchAuthorImpl extends AudibleSearchAuthor {
  asin: string;
  link: string;
  name: string | null;
}

export interface AudibleSearchSeriesImpl extends AudibleSearchSeries {
  asin: string;
  index: number | null;
  link: string;
  name: string;
}

export interface AudibleSearchResultImpl extends AudibleSearchResult {
  asin: string;
  author: AudibleSearchAuthorImpl | null;
  image: string | null;
  language: string | null;
  link: string | null;
  narrator: AudibleSearchAuthorImpl | null;
  releaseDate: Date | null;
  series: AudibleSearchSeriesImpl | null;
  title: string | null;
}

export interface AudibleSeries {
  amount: number | null;
  asin: string;
  books: AudibleSearchResult[];
  description: string | null;
  link: string;
  name: string | null;
}
