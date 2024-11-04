import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  QueryConstraint,
  onSnapshot,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Define the type for the return value of useCollection
interface UseCollectionResult {
  documents: DocumentData[] | null;
  error: string | null;
  fetchCollection: (options: {
    fetchQuery?: QueryConstraint;
    fetchOrder?: QueryConstraint;
  }) => void;
}

// Update the types in the hook parameters and state
export const useCollection = (
  collectionName: string,
  _query?: QueryConstraint,
  _order?: QueryConstraint
): UseCollectionResult => {
  const [documents, setDocuments] = useState<DocumentData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  let unsub: () => void;

  const queryRef = useRef(_query).current;
  const orderRef = useRef(_order).current;

  const fetchCollection = ({
    fetchQuery,
    fetchOrder,
  }: {
    fetchQuery?: QueryConstraint;
    fetchOrder?: QueryConstraint;
  }) => {
    setDocuments(null);
    let ref: Query<DocumentData> = collection(db, collectionName);

    if (queryRef) {
      ref = query(ref, fetchQuery ?? queryRef); // Фильтрация
    }

    if (orderRef) {
      ref = query(ref, fetchOrder ?? orderRef); // Отсортируй по полю createdAt
    }

    unsub = onSnapshot(ref, (snapshot) => {
      let results: DocumentData[] = [];

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
