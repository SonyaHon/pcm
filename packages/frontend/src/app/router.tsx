import React from 'react';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import { LoginPage } from '../pages/login';
import { useAppSelector } from '../hooks';
import { selectUserLoggedIn } from '../store/user.slice';
import { VideosPage } from '../pages/videos';

export const AppRouter: React.FC = () => {
  const userLoggedIn = useAppSelector(selectUserLoggedIn);

  return (
    <BrowserRouter>
      {userLoggedIn ? (
        <Switch>
          <Route path="/videos">
            <VideosPage />
          </Route>
          <Route path="/">
            <Redirect to="/videos" />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="*">
            <LoginPage />
          </Route>
        </Switch>
      )}
    </BrowserRouter>
  );
};
