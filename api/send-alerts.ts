import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { attentionHeadline, getAttentionItems, type AttentionOrder } from "../src/lib/attention";

/**
 * Daily push: tells each tailor what needs their attention today.
 * Runs from a Vercel cron (see vercel.json), so Firebase stays on the free Spark plan:
 * Firestore reads and FCM sends from the Admin SDK don't need Blaze, only Cloud Functions do.
 *
 * Env vars (Vercel project settings):
 *   FIREBASE_SERVICE_ACCOUNT  the service-account JSON (Firebase console > Project settings > Service accounts)
 *   CRON_SECRET               any long random string; Vercel sends it with each cron call
 */

const STALE_TOKEN_ERRORS = ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"];

function getDb() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)) });
  }
  return getFirestore();
}

export async function GET(request: Request): Promise<Response> {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return new Response("FIREBASE_SERVICE_ACCOUNT is not set", { status: 500 });
  }

  const db = getDb();
  const devices = await db.collectionGroup("devices").get();

  // users/{userId}/devices/{token}  ->  { userId: [device docs] }
  const byUser = new Map<string, typeof devices.docs>();
  for (const device of devices.docs) {
    const userId = device.ref.parent.parent?.id;
    if (userId) byUser.set(userId, [...(byUser.get(userId) ?? []), device]);
  }

  let notified = 0;

  for (const [userId, userDevices] of byUser) {
    const user = await db.doc(`users/${userId}`).get();
    if (user.data()?.notifications === false) continue;

    const snapshot = await db.collection("orders").where("userId", "==", userId).get();
    const orders = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as AttentionOrder);

    const items = getAttentionItems(orders);
    if (!items.length) continue;

    const response = await getMessaging().sendEachForMulticast({
      tokens: userDevices.map((d) => d.id),
      // data-only: the service worker builds the notification itself (see src/sw.ts)
      data: {
        title: attentionHeadline(items.length),
        body: items
          .slice(0, 3)
          .map((i) => i.title)
          .join("\n"),
        url: "/notifications",
        tag: "daily-attention",
      },
      webpush: { headers: { Urgency: "high", TTL: "43200" } },
    });
    notified += response.successCount;

    // forget devices that were uninstalled or had their permission revoked
    await Promise.all(
      response.responses.map((result, index) =>
        result.error && STALE_TOKEN_ERRORS.includes(result.error.code) ? userDevices[index].ref.delete() : null,
      ),
    );
  }

  return Response.json({ users: byUser.size, notified });
}
