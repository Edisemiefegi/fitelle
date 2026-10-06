// One-off: stamps orders and customers created before ownership was recorded with your user id,
// so customer tracking pages show your brand and push notifications include those orders.
//
//   FIREBASE_SERVICE_ACCOUNT='<json>' node scripts/backfill-owner.mjs <your-user-uid>            (dry run)
//   FIREBASE_SERVICE_ACCOUNT='<json>' node scripts/backfill-owner.mjs <your-user-uid> --apply    (writes)
//
// Your uid: Firebase console > Authentication > Users. Only run this if every existing order and
// customer belongs to that one account.
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const [uid, flag] = process.argv.slice(2);
if (!uid || !process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Usage: FIREBASE_SERVICE_ACCOUNT='<json>' node scripts/backfill-owner.mjs <uid> [--apply]");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = getFirestore();

for (const name of ["orders", "customers"]) {
  const snapshot = await db.collection(name).get();
  const unowned = snapshot.docs.filter((d) => !d.data().userId);
  console.log(`${name}: ${unowned.length} of ${snapshot.size} have no owner`);

  if (flag === "--apply") {
    for (let i = 0; i < unowned.length; i += 400) {
      const batch = db.batch();
      unowned.slice(i, i + 400).forEach((d) => batch.update(d.ref, { userId: uid }));
      await batch.commit();
    }
    console.log(`  stamped ${unowned.length} ${name}`);
  }
}
if (flag !== "--apply") console.log("Dry run only. Add --apply to write.");
