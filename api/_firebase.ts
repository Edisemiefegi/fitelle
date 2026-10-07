import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/** Firestore through the Admin SDK (server only; needs the FIREBASE_SERVICE_ACCOUNT env var). */
export function getDb() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)) });
  }
  return getFirestore();
}
