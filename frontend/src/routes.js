import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';
import Transactions from './containers/Transactions';
import DonatePage from './containers/DonatePage';
import Leaderboard from './containers/Leaderboard';
import OnBoarding from './containers/OnBoarding';
import HomePage from './containers/HomePage';

export default (
  <Route>
    <Route path="/" component={HomePage} />
    <Route path="/subscriptions/:token" component={Subscriptions} />
    <Route path="/subscriptions" component={Subscriptions} />
    <Route path="/leaderboard" component={Leaderboard} />
    <Route path="/opensource/apply/:token" component={OnBoarding} />
    <Route path="/opensource/apply" component={OnBoarding} />
    {/* Leaving github/apply routes for existing links */}
    <Route path="/github/apply/:token" component={OnBoarding} />
    <Route path="/github/apply" component={OnBoarding} />
    <Route path="/:slug" component={PublicGroup} />
    <Route path="/:slug/expenses/new" component={Transactions} />
    <Route path="/:slug/:type(donations|expenses)" component={Transactions} />
    <Route path="/:slug/donate/:amount" component={DonatePage} />
    <Route path="/:slug/donate/:amount/:interval" component={DonatePage} />
  </Route>
);
