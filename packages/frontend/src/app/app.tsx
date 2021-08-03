import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { AppRouter } from './router';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <>
      <CssBaseline />
      <AppRouter />
    </>
  </ThemeProvider>
);
