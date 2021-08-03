import React from 'react';
import './i18n';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import { App } from './app';
import { store } from './store';
import { fetchUser } from './store/user.slice';

store.dispatch(fetchUser());

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
