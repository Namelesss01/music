import {
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useFirestore = (collectionName: string) => {
  const ref = collection(db, collectionName);

  const addDocument = async (docData: Record<string, any>) => {
    try {
      const createdAt = Timestamp.fromDate(new Date());
      await addDoc(ref, { ...docData, createdAt });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.log("Не смог удалить документ:", err.message);
    }
  };

  const updateDocument = async (id: string, updates: Record<string, any>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updates);

      return updates;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return { addDocument, deleteDocument, updateDocument };
};
