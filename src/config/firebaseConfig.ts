import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyC3APUpAHVZvWoGKodJUvsCI9OQbnXcDic',
  authDomain: 'cs-wedding-2fa63.firebaseapp.com',
  projectId: 'cs-wedding-2fa63',
  storageBucket: 'cs-wedding-2fa63.appspot.com',
  messagingSenderId: '834793339869',
  appId: '1:834793339869:web:46a41fc60f0ab8b07e9434',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
