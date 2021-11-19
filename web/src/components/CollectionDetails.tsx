import { sanitize } from 'dompurify';
import React from 'react';
import { ALink } from '../utils/active-link';
import { Book } from './Book';
import { HTML } from './BookDetails';

export const CollectionDetails: React.VFC = () => (
  <>
    <div className="flex pb-6">
      <img className="min-w-80 max-w-80 rounded-md" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="Cover"/>
      <div className="flex-grow pl-10 ">
        <h2 className="text-2xl pb-3">SOME TITLE</h2>
        <h3 className="text-xl pb-3">2000 - 2019</h3>
        <div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
            <ALink href={'/authors/asdf'}>
              <h3 className="text-xl hover:underline">Author</h3>
            </ALink>
          </div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrators</h3>
            <ALink href={'/authors/asdf'}>
              <h3 className="text-xl hover:underline">Narrator 1</h3>
            </ALink>
            <span className="px-1">,</span>
            <ALink href={'/authors/asdf'}>
              <h3 className="text-xl hover:underline">Narrator 2</h3>
            </ALink>
          </div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Books</h3>
            <h3 className="text-xl">7</h3>
          </div>
        </div>
      </div>
    </div>
    <div className="prose w-full max-w-full text-current pb-6" dangerouslySetInnerHTML={{__html: sanitize(HTML)}}/>

    {new Array(7).fill(null).map((v, k) =>
      <Book id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
            author={{name: 'J.K. Rowling', id: 'asdf'}}
            title="Harry Potter and the Chamber of Secretsand the Chamber of Secrets"/>)}
  </>
);
