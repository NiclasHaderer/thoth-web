import React from "react"
import { Redirect, Route, Switch } from "wouter"

const SeriesList = React.lazy(() => import("./Series/SeriesList"))
const SeriesDetails = React.lazy(() => import("./Series/SeriesDetails"))
const BookList = React.lazy(() => import("./Books/BookList"))
const BookDetails = React.lazy(() => import("./Books/BookDetails"))
const AuthorList = React.lazy(() => import("./Author/AuthorList"))
const AuthorDetails = React.lazy(() => import("./Author/AuthorDetails"))

const LazyOutlet: React.VFC<{ component: React.ReactNode }> = ({ component }) => (
  <React.Suspense fallback={<div />}>{component}</React.Suspense>
)

export const RouterOutlet: React.VFC = () => {
  return (
    <Switch>
      <Route path="/books">
        <LazyOutlet component={<BookList />} />
      </Route>
      <Route path="/books/:id">
        <LazyOutlet component={<BookDetails />} />
      </Route>
      <Route path="/authors">
        <LazyOutlet component={<AuthorList />} />
      </Route>
      <Route path="/authors/:id">
        <LazyOutlet component={<AuthorDetails />} />
      </Route>
      <Route path="/series">
        <LazyOutlet component={<SeriesList />} />
      </Route>
      <Route path="/series/:id">
        <LazyOutlet component={<SeriesDetails />} />
      </Route>
      <Route path="">
        <Redirect to="/books" />
      </Route>
    </Switch>
  )
}
