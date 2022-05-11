export { };

declare global {
    interface Window {
        __RUNTIME_CONFIG__: {
            REACT_APP_URL: string;
            REACT_APP_WSS: string;
            REACT_APP_APIKEY: string;
            REACT_APP_AUTHDOMAIN: string;
            REACT_APP_DATABASEURL: string;
            REACT_APP_PROJECTID: string;
            REACT_APP_STORAGEBUCKET: string;
            REACT_APP_MESSAGINGSENDERID: string;
            REACT_APP_APP_ID: string;
            REACT_APP_WEB_API: string;
            REACT_APP_LOGIN_URL: string;
            REACT_APP_HOST_URL: string;
        };
    }
}