import React from "react"
import { Redirect, Route, Switch } from "wouter"

import { AuthorDetails } from "./Author/AuthorDetails"
import { AuthorList } from "./Author/AuthorList"
import { BookDetails } from "./Books/BookDetails"
import { BookList } from "./Books/BookList"
import { SeriesDetails } from "./Series/SeriesDetails"
import { SeriesList } from "./Series/SeriesList"
import { useClearUnimportantState } from "../Hooks/ClearUnimportantState"

export const RouterOutlet: React.VFC = () => {
  useClearUnimportantState()

  return (
    <Switch>
      <Route path="/books" component={BookList} />
      <Route path="/books/:id" component={BookDetails} />
      <Route path="/authors" component={AuthorList} />
      <Route path="/authors/:id" component={AuthorDetails} />
      <Route path="/series" component={SeriesList} />
      <Route path="/series/:id" component={SeriesDetails} />
      <Route path="">
        <Redirect to="/books" />
      </Route>
    </Switch>
  )
}
