import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Ваши настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB84A9Zf6d6Y7eLN4uB92CFWmEwwr3HFYI",
  authDomain: "musicplay-bda81.firebaseapp.com",
  projectId: "musicplay-bda81",
  storageBucket: "musicplay-bda81.appspot.com",
  messagingSenderId: "861393610584",
  appId: "1:861393610584:web:edf68c7b5695bd2b4da72d",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig); // инициализация проекта Firebase
const db = getFirestore(app); // подключение к Firestore
const auth = getAuth(app); // инициализация аутентификации
const storage = getStorage(app); // инициализация хранилища

export { db, auth, storage }; // экспортируем необходимые компоненты
