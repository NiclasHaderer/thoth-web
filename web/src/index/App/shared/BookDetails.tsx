import { sanitize } from 'dompurify';
import React from 'react';
import { ALink } from './active-link';
import { Author } from '../RouterOutlet/shared/Author';

export const HTML = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. <b>Lorem ipsum dolor sit amet, consectetur adipiscing elit</b>. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. <b>Lorem ipsum dolor sit amet, consectetur adipiscing elit</b>. Curabitur sodales ligula in libero. </p>

<p>Sed dignissim lacinia nunc. <b>Praesent mauris</b>. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. <i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. <b>Curabitur tortor</b>. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. <i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. </p>

<p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. <b>Maecenas mattis</b>. Nam nec ante. <b>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa</b>. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. </p>

<p>Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. </p>
`;


export const BookDetails = () => (
  <>
    <div className="flex pb-6">
      <img className="min-w-80 max-w-80 rounded-md" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="Cover"/>
      <div className="flex-grow pl-10 ">
        <h2 className="text-2xl pb-3">SOME TITLE</h2>
        <h3 className="text-xl pb-3">2019</h3>
        <div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
            <ALink href={`/authors/asdf`}>
              <h3 className="text-xl hover:underline">J.K. Rowling</h3>
            </ALink>
          </div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrator</h3>
            <ALink href={`/authors/asdf`}>
              <h3 className="text-xl hover:underline">Stephen Fry</h3>
            </ALink>
          </div>
          <div className="flex pb-3">
            <h3 className="uppercase text-unimportant pr-3 min-w-40">Series</h3>
            <ALink href={`/series/asdf`}>
              <h3 className="text-xl hover:underline">Harry Potter</h3>
            </ALink>
          </div>
        </div>
      </div>
    </div>
    <div className="prose w-full max-w-full text-current pb-6" dangerouslySetInnerHTML={{__html: sanitize(HTML)}}/>

    {new Array(2).fill(null).map((v, k) =>
      <Author id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
              name={'J.K. Rowling'}/>)}
  </>
);
