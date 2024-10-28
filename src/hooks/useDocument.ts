import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(!id) return;
    const ref = doc(db, collectionName, id);

    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        setDocument({ ...snapshot.data(), id: snapshot.id });
        setError(null);
      } else {
        setError("Ну, нет такого документа, ёпта");
      }
    });

    return () => {
      unsub();
    };
  }, [collectionName, id]);

  return { document, error };
};
