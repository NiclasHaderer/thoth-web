export interface MetadataProviderWithID {
  itemID: string
  provider: string
}

export interface MetadataSearchAuthor {
  id: MetadataProviderWithID
  link: string
  name: string | null
}

export interface MetadataAuthor extends MetadataSearchAuthor {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  imageURL: string | null
  website: string | null
}

export interface MetadataBookSeries {
  id: MetadataProviderWithID
  index: number | null
  link: string
  title: string | null
}

export interface MetadataSearchBook {
  author: MetadataSearchAuthor | null
  coverURL: string | null
  id: MetadataProviderWithID
  language: string | null
  link: string | null
  narrator: string | null
  releaseDate: number | null
  series: MetadataBookSeries[]
  title: string | null
}

export interface MetadataBook extends MetadataSearchBook {
  description: string | null
  isbn: string | null
  providerRating: number | null
  publisher: string | null
}

export interface MetadataSeries {
  author: string | null
  books: MetadataSearchBook[] | null
  coverURL: string | null
  description: string | null
  id: MetadataProviderWithID
  link: string
  primaryWorks: number | null
  title: string | null
  totalBooks: number | null
}
