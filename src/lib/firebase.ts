import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCjtl1ORRjW8TO7eZfL-18RpcWMR7d3_OE",
  authDomain: "halloween-wedding-game.firebaseapp.com",
  projectId: "halloween-wedding-game",
  storageBucket: "halloween-wedding-game.firebasestorage.app",
  messagingSenderId: "495284358916",
  appId: "1:495284358916:web:aa8d163ef803bc73130a51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
