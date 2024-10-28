import {
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useFirestore = (collectionName: any) => {
  let ref = collection(db, collectionName) as any;

  const addDocument = async (doc: any) => {
    try {
      const createdAt = Timestamp.fromDate(new Date());
      await addDoc(ref, { ...doc, createdAt });
    } catch (err:any) {
      console.log(err.message);
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.log("Не смог удалить документ:", err.message);
    }
  };

  const updateDocument = async (id: number, updates: any) => {
    try {
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, updates);

      return updates;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return { addDocument, deleteDocument, updateDocument };
};
