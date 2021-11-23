import { sanitize } from 'dompurify';
import React, { useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { environment } from '../../../env';
import { userState } from '../../state/state';
import { Track } from '../RouterOutlet/Track';
import { ALink } from './active-link';

export const HTML = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. <b>Lorem ipsum dolor sit amet, consectetur adipiscing elit</b>. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. <b>Lorem ipsum dolor sit amet, consectetur adipiscing elit</b>. Curabitur sodales ligula in libero. </p>

<p>Sed dignissim lacinia nunc. <b>Praesent mauris</b>. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. <i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. <b>Curabitur tortor</b>. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. <i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. </p>

<p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. <b>Maecenas mattis</b>. Nam nec ante. <b>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa</b>. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. </p>

<p>Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. </p>
`;


export const BookDetails = () => {
  const [, id] = useRoute('/books/:id');
  const getBookWithTracks = userState(s => s.getBookWithTracks);
  const book = userState(s => s.books[id?.id!]);

  useEffect(() => getBookWithTracks(id?.id!), [id?.id, getBookWithTracks]);
  if (!book) return <></>;

  return (
    <>
      <div className="flex pb-6">
        {book.cover ?
          <img className="min-w-80 max-w-80 rounded-md" src={`${environment.apiURL}/image/${book.cover}`}
               alt="Cover"/> :
          <MdImageNotSupported
            className="min-w-80 max-w-80 rounded-md"/>
        }
        <div className="flex-grow pl-10 ">
          <h2 className="text-2xl pb-3">{book.title}</h2>
          <h3 className="text-xl pb-3">___</h3>
          <div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={`/authors/${book.author}`}>
                <h3 className="text-xl hover:underline">{book.author}</h3>
              </ALink>
            </div>
            {book.narrator ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrator</h3>
                <ALink href={`/authors/${book.narrator}`}>
                  <h3 className="text-xl hover:underline">{book.narrator}</h3>
                </ALink>
              </div>
              : ''}
            {book.series ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series</h3>
                <ALink href={`/series/${book.series}`}>
                  <h3 className="text-xl hover:underline">{book.series}</h3>
                </ALink>
              </div>
              : ''}
            {book.seriesIndex ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series Index</h3>
                <h3 className="text-xl hover:underline">{book.language}</h3>
              </div>
              : ''}
            {book.language ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Language</h3>
                <h3 className="text-xl">{book.language}</h3>
              </div>
              : ''}
          </div>
        </div>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(book.description || '')}}/>

      <div>
        {
          ('tracks' in book ? book.tracks : []).map((track, k) => <Track cover={book.cover} {...track} key={k}/>)
        }
      </div>
    </>
  );
};
