import { getMessaging } from "firebase-admin/messaging";
import { getDb } from "./_firebase.js";
import { attentionHeadline, getAttentionItems, type AttentionOrder } from "../src/lib/attention.js";

/**
 * Sends push notifications for new alerts (the same rules the app shows in its notification list).
 *
 * Meant to run often (hourly, see .github/workflows/push-alerts.yml; vercel.json also runs it once a
 * day as a fallback). Each alert is pushed at most once per day, so frequent runs mean a new alert
 * reaches the phone within the hour without anyone being pinged repeatedly. Nothing is sent overnight.
 * Firebase stays on the free Spark plan: only Cloud Functions need Blaze, not Firestore or FCM.
 *
 * Env vars (Vercel project settings):
 *   FIREBASE_SERVICE_ACCOUNT  the service-account JSON (Firebase console > Project settings > Service accounts)
 *   CRON_SECRET               any long random string; callers must send it as a Bearer token
 */

const STALE_TOKEN_ERRORS = ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"];
const LAGOS_UTC_OFFSET_HOURS = 1; // Africa/Lagos has no daylight saving
const FIRST_HOUR = 7; // local hours in which pushes may be sent: 07:00 up to (not including) 21:00
const LAST_HOUR = 21;

export async function GET(request: Request): Promise<Response> {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return new Response("FIREBASE_SERVICE_ACCOUNT is not set", { status: 500 });
  }

  const local = new Date(Date.now() + LAGOS_UTC_OFFSET_HOURS * 3_600_000);
  if (local.getUTCHours() < FIRST_HOUR || local.getUTCHours() >= LAST_HOUR) {
    return Response.json({ skipped: "quiet hours" });
  }
  const today = local.toISOString().slice(0, 10);

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
    const userRef = db.doc(`users/${userId}`);
    const sent = (await userRef.get()).data()?.pushSent as { date: string; ids: string[] } | undefined;
    const alreadySent = new Set(sent?.date === today ? sent.ids : []);

    const snapshot = await db.collection("orders").where("userId", "==", userId).get();
    const orders = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as AttentionOrder);

    const fresh = getAttentionItems(orders).filter((item) => !alreadySent.has(item.id));
    if (!fresh.length) continue;

    const response = await getMessaging().sendEachForMulticast({
      tokens: userDevices.map((d) => d.id),
      // data-only: the service worker builds the notification itself (see src/sw.ts)
      data: {
        title: attentionHeadline(fresh.length),
        body: fresh
          .slice(0, 3)
          .map((i) => i.title)
          .join("\n"),
        url: "/notifications",
        tag: "fitelle-alerts",
      },
      webpush: { headers: { Urgency: "high", TTL: "43200" } },
    });
    notified += response.successCount;

    if (response.successCount > 0) {
      await userRef.set({ pushSent: { date: today, ids: [...alreadySent, ...fresh.map((i) => i.id)] } }, { merge: true });
    }

    // forget devices that were uninstalled or had their permission revoked
    await Promise.all(
      response.responses.map((result, index) =>
        result.error && STALE_TOKEN_ERRORS.includes(result.error.code) ? userDevices[index].ref.delete() : null,
      ),
    );
  }

  return Response.json({ users: byUser.size, notified });
}
