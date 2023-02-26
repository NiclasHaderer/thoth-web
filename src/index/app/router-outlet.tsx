import React from "react"
import { Redirect, Route, Switch } from "wouter"

const SeriesList = React.lazy(() => import("./series/series-list"))
const SeriesDetails = React.lazy(() => import("./series/series-details"))
const BookList = React.lazy(() => import("./books/book-list"))
const BookDetails = React.lazy(() => import("./books/book-details"))
const AuthorList = React.lazy(() => import("./author/author-list"))
const AuthorDetails = React.lazy(() => import("./author/author-details"))
const Account = React.lazy(() => import("./account/account"))

const LazyOutlet: React.VFC<{ component: React.ReactNode }> = ({ component }) => (
  <React.Suspense fallback={<div />}>{component}</React.Suspense>
)

export const RouterOutlet: React.VFC = () => {
  return (
    <Switch>
      <Route path="/account">
        <LazyOutlet component={<Account />} />
      </Route>
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
