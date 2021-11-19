import React from 'react';
import { Redirect, Route, Switch } from 'wouter';
import { AuthorDetails } from './AuthorDetails';
import { Authors } from './Authors';
import { BookDetails } from './BookDetails';
import { Books } from './Books';
import { CollectionDetails } from './CollectionDetails';
import { Collections } from './Collections';


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

