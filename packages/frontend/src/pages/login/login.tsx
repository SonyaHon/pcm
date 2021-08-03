import React, { useCallback } from 'react';
import { Formik, Form } from 'formik';
import {
  Box, Button, TextField, Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LayoutCentered } from '../../layout/centered';
import { useAppDispatch } from '../../hooks';
import { useStyles } from './login.styles';
import { loginUser } from '../../store/user.slice';

interface FormValues {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const styles = useStyles();
  const { t } = useTranslation();

  const onFormSubmit = useCallback(
    async (values: FormValues) => {
      await dispatch(loginUser(values.username, values.password));
    }, [dispatch],
  );

  const onFormValidate = useCallback((values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.username) {
      errors.username = 'Field is required';
    }
    if (!values.password) {
      errors.password = 'Field is required';
    }

    return errors;
  }, []);

  return (
    <LayoutCentered>
      <Box className={styles.form}>
        <Typography variant="h5">{t('login_form.please_login')}</Typography>
        <Formik initialValues={{ username: '', password: '' } as FormValues} onSubmit={onFormSubmit} validate={onFormValidate}>
          {({
            isSubmitting,
            handleChange,
            handleBlur,
            values,
            errors,
          }) => (
            <Form>
              <Box display="flex" flexDirection="column">
                <TextField
                  className={styles.formItem}
                  id="login-username"
                  label={t('login_form.username')}
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  error={!!errors.username}
                />
                <TextField
                  className={styles.formItem}
                  id="login-password"
                  label={t('login_form.password')}
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  error={!!errors.password}
                />
                <Button type="submit" disabled={isSubmitting} className={styles.formItem}>{t('login_form.login')}</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </LayoutCentered>
  );
};
