import {initializeApp} from 'firebase/app'

const config = {
    apiKey: process.env.REACT_APP_APIKEY || "AIzaSyAx1rN_KoTMfqI8O5dU1INfhmUtnRH6XcU",
    authDomain: process.env.REACT_APP_AUTHDOMAIN || "hamropatro-android-test.firebaseapp.com",
    databaseURL: process.env.REACT_APP_DATABASEURL || "https://hamropatro-android-test.firebaseio.com",
    projectId: process.env.REACT_APP_PROJECTID || "hamropatro-android-test",
    storageBucket: process.env.REACT_APP_STORAGEBUCKET || "hamropatro-android-test.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID || "27021292206",
};

export const app = initializeApp(config);