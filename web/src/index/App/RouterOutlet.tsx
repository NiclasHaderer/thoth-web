import React from 'react';
import { Redirect, Route, Switch } from 'wouter';
import { AuthorDetails } from './RouterOutlet/AuthorDetails';
import { Authors } from './RouterOutlet/Authors';
import { BookDetails } from './shared/BookDetails';
import { Books } from './RouterOutlet/Books';
import { SeriesDetails } from './RouterOutlet/SeriesDetails';
import { SeriesCollection } from './RouterOutlet/SeriesCollection';


export const RouterOutlet: React.VFC = () => (
  <Switch>
    <Route path="/books" component={Books}/>
    <Route path="/books/:id" component={BookDetails}/>
    <Route path="/authors" component={Authors}/>
    <Route path="/authors/:id" component={AuthorDetails}/>
    <Route path="/series" component={SeriesCollection}/>
    <Route path="/series/:id" component={SeriesDetails}/>
    <Route path="">
      <Redirect to="/books"/>
    </Route>
  </Switch>
);

