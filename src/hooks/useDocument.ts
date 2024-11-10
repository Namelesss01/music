import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

type DocumentData = {
  [key: string]: any; // Adjust this type based on the expected document structure
};

export const useDocument = (collectionName: string, id: string | null) => {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const ref = doc(db, collectionName, id);

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("Ну, нет такого документа, ёпта");
        }
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => unsub();
  }, [collectionName, id]);

  return { document, error };
};
