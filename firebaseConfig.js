// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlHs7WBphYukJwTAPw0cTNkPGY6txvsCU",
  authDomain: "todolist-bc7a6.firebaseapp.com",
  projectId: "todolist-bc7a6",
  storageBucket: "todolist-bc7a6.appspot.com",
  messagingSenderId: "866040000698",
  appId: "1:866040000698:web:4e0fb1603b0d42d3f25283"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;