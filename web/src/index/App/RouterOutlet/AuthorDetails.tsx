import { sanitize } from 'dompurify';
import React from 'react';
import { Book } from './shared/Book';
import { HTML } from '../shared/BookDetails';

export const AuthorDetails: React.VFC = () => (
  <>
    <div className="flex flex-col pb-6 items-center">
      <img className="min-w-80 max-w-80 rounded-full" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="Cover"/>
      <h2 className="text-2xl py-3">J.K. Rowling</h2>
    </div>
    <div className="prose w-full max-w-full text-current pb-6" dangerouslySetInnerHTML={{__html: sanitize(HTML)}}/>

    {new Array(20).fill(null).map((v, k) =>
      <Book id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
            author={{name: 'J.K. Rowling', id: 'asdf'}}
            title="Harry Potter and the Chamber of Secretsand the Chamber of Secrets"/>)}
  </>
);
