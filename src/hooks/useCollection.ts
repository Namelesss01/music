import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/config";

export const useCollection = (collectionName, _query, _order) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  let unsub;

  const queryRef = useRef(_query).current;
  const orderRef = useRef(_order).current;

  const fetchCollection = ({ fetchQuery, fetchOrder }) => {
    setDocuments(null);
    let ref = collection(db, collectionName);

    if (queryRef) {
      ref = query(ref, fetchQuery ?? queryRef); // Фильтрация
    }

    if (orderRef) {
      ref = query(ref, fetchOrder ?? orderRef); // Отсортируй по полю createdAt
    }

    unsub = onSnapshot(ref, (snapshot) => {
      let results = [];

      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });

      setDocuments(results);
      setError(null);
    });
  };

  useEffect(() => {
    fetchCollection({});

    return () => {
      unsub?.();
    };
  }, [collectionName, queryRef, orderRef]);

  return { documents, error, fetchCollection };
};
