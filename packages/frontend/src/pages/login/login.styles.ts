import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  form: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    width: '360px',
  },
  formItem: {
    marginTop: theme.spacing(2),
  },
}));
