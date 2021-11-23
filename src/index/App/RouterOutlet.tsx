import React from 'react';
import { Redirect, Route, Switch } from 'wouter';
import { AuthorDetails } from './RouterOutlet/AuthorDetails';
import { AuthorList } from './RouterOutlet/AuthorList';
import { BookDetails } from './shared/BookDetails';
import { BookList } from './RouterOutlet/BookList';
import { SeriesDetails } from './RouterOutlet/SeriesDetails';
import { SeriesList } from './RouterOutlet/SeriesList';


export const RouterOutlet: React.VFC = () => (
  <Switch>
    <Route path="/books" component={BookList}/>
    <Route path="/books/:id" component={BookDetails}/>
    <Route path="/authors" component={AuthorList}/>
    <Route path="/authors/:id" component={AuthorDetails}/>
    <Route path="/series" component={SeriesList}/>
    <Route path="/series/:id" component={SeriesDetails}/>
    <Route path="">
      <Redirect to="/books"/>
    </Route>
  </Switch>
);

