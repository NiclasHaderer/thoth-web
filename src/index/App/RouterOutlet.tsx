import React from 'react';
import { Redirect, Route, Switch } from 'wouter';
import { AuthorDetails } from './RouterOutlet/AuthorDetails';
import { Authors } from './RouterOutlet/Authors';
import { BookDetails } from './shared/BookDetails';
import { Books } from './RouterOutlet/Books';
import { CollectionDetails } from './RouterOutlet/CollectionDetails';
import { Collections } from './RouterOutlet/Collections';


export const RouterOutlet: React.VFC = () => (
  <Switch>
    <Route path="/books" component={Books}/>
    <Route path="/books/:id" component={BookDetails}/>
    <Route path="/authors" component={Authors}/>
    <Route path="/authors/:id" component={AuthorDetails}/>
    <Route path="/collections" component={Collections}/>
    <Route path="/collections/:id" component={CollectionDetails}/>
    <Route path="">
      <Redirect to="/books"/>
    </Route>
  </Switch>
);

