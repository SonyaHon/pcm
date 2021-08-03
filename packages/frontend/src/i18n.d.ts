import 'react-i18next';
import ns1 from './translations/en.json';

declare module 'react-i18next' {
    interface Resources {
        translation: typeof ns1;
    }
}

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof ns1;
        };
    };
};
