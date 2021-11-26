import React, { useEffect, useRef, useState } from 'react';
import { MdImageNotSupported, MdPerson, MdSearch } from 'react-icons/md';
import { environment } from '../../env';
import { useOnMount } from '../../Hooks/OnMount';
import { SearchModel } from '../../Models/Audiobook';
import { ALink } from '../Common/ActiveLink';
import { ResponsiveImage } from '../Common/ResponsiveImage';

export const Search: React.VFC = () => {
  const [input, setInput] = useState('');
  const [searchResult, setSearchResult] = useState<SearchModel | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const searchOverlay = useRef<HTMLDivElement>(null);
  const inputElement = useRef<HTMLInputElement>(null);

  const timeout = useRef<number>();

  useOnMount(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setResultVisible(false);
      }
    };
    document.addEventListener('keyup', close);
    return () => document.removeEventListener('keyup', close);
  });

  useOnMount(() => {
    const close = (event: MouseEvent) => {
      if (
        !searchOverlay.current?.contains(event.target as HTMLElement) &&
        inputElement.current !== event.target
      ) {
        setResultVisible(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  });

  useEffect(() => {
    if (input === '') {
      setResultVisible(false);
      return;
    }

    setResultVisible(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      const result = await fetch(`${environment.apiURL}/search?q=${input}`).then(r => r.json()) as SearchModel;
      setSearchResult(result);
    }, 100) as unknown as number;

    return () => clearTimeout(timeout.current);
  }, [input]);

  return (
    <div className="px-3 flex-grow shadow-none relative">
      <div className="relative bg-elevate rounded-3xl ">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button type="submit" className="p-1">
            <MdSearch className="w-6 h-6"/>
          </button>
        </span>
        <input
          type="search"
          placeholder="Search ..."
          ref={inputElement}
          onKeyUp={event => setInput((event.target as HTMLInputElement).value)}
          onFocus={(event) => {
            if ((event.target as HTMLInputElement).value.trim() !== '') {
              setResultVisible(true);
            }
          }}
          onClick={(event) => {
            if ((event.target as HTMLInputElement).value.trim() !== '') {
              setResultVisible(true);
            }
          }}
          className="mt-0 block pl-10 px-0.5 py-2 w-full border-0 shadow-none bg-transparent outline-none"
        />
      </div>
      {
        searchResult && resultVisible ?
          <div ref={searchOverlay}
               className="z-10 absolute rounded-md mx-3 bottom-0 left-0 right-0 transform translate-y-full bg-background">
            <div className="elevate">
              <div className="elevate p-3 rounded-md">
                <SearchResults search={searchResult} onClose={() => setResultVisible(false)}/>
              </div>
            </div>
          </div>
          : ''
      }
    </div>
  );
};

const SearchResults: React.VFC<{ search: SearchModel, onClose: () => void }> = ({search, onClose}) => (
  <>
    <h2 className="text-unimportant uppercase py-3">Books</h2>
    <BookSearchResult books={search.books} onClose={onClose}/>
    <h2 className="text-unimportant uppercase py-3">Authors</h2>
    <AuthorSearchResult authors={search.authors} onClose={onClose}/>
    <h2 className="text-unimportant uppercase py-3">Series</h2>
    <SeriesSearchResult series={search.series} onClose={onClose}/>
  </>
);


const AuthorSearchResult: React.VFC<{ authors: SearchModel['authors'], onClose: () => void }> = ({
                                                                                                   authors,
                                                                                                   onClose
                                                                                                 }) => (
  <>
    {authors.length === 0 ?
      <div>No authors found</div> :
      authors.map((author, i) => (
        <ALink href={`/authors/${author.id}`} onClick={onClose} key={i}>
          <div className="flex items-center p-2 hover:bg-light-active rounded-md transition-colors transition focus:bg-light-active">
            {author.image ?
              <img className="rounded-full w-8 h-8" src={`${environment.apiURL}/image/${author.image}`} alt="Author"/>
              :
              <MdPerson className="rounded-full w-8 h-8"/>
            }
            <h4 className="pl-3">{author.name}</h4>
          </div>
        </ALink>
      ))
    }
  </>
);


const BookSearchResult: React.VFC<{ books: SearchModel['books'], onClose: () => void }> = ({books, onClose}) => (
  <>
    {books.length === 0 ?
      <div>No authors found</div> :
      books.map((book, i) => (
        <ALink href={`/books/${book.id}`} onClick={onClose} key={i}>
          <div className="flex items-center p-2 hover:bg-light-active rounded-md transition-colors transition focus:bg-light-active">
            {book.cover ?
              <ResponsiveImage className="w-8 h-8 rounded-md" src={`${environment.apiURL}/image/${book.cover}`}/> :
              <MdImageNotSupported className="rounded-full w-8 h-8"/>
            }
            <h4 className="pl-3">{book.title}</h4>
          </div>
        </ALink>
      ))
    }
  </>
);


const SeriesSearchResult: React.VFC<{ series: SearchModel['series'], onClose: () => void }> = ({series, onClose}) => (
  <>
    {series.length === 0 ?
      <div>No authors found</div> :
      series.map((series, i) => (
        <ALink href={`/series/${series.id}`} onClick={onClose} key={i}>
          <div className="flex items-center p-2 hover:bg-light-active rounded-md transition-colors transition focus:bg-light-active">
            <MdImageNotSupported className="w-8 h-8 rounded-md"/>
            <h4 className="pl-3">{series.title}</h4>
          </div>
        </ALink>
      ))
    }
  </>
);



