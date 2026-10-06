import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { onSchedule } from "firebase-functions/v2/scheduler";
// copied from ../src/lib/attention.ts by the predeploy step in firebase.json: one set of rules for app and push
import { attentionHeadline, getAttentionItems, type AttentionOrder } from "./attention.js";

initializeApp();
const db = getFirestore();

const STALE_TOKEN_ERRORS = [
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
];

/** Every morning, tell each tailor what needs their attention today. */
export const dailyAttentionPush = onSchedule(
  { schedule: "every day 08:00", timeZone: "Africa/Lagos" },
  async () => {
    const devices = await db.collectionGroup("devices").get();

    // users/{userId}/devices/{token}  ->  { userId: [device docs] }
    const byUser = new Map<string, typeof devices.docs>();
    for (const device of devices.docs) {
      const userId = device.ref.parent.parent?.id;
      if (userId) byUser.set(userId, [...(byUser.get(userId) ?? []), device]);
    }

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

      // forget devices that were uninstalled or had their permission revoked
      await Promise.all(
        response.responses.map((result, index) =>
          result.error && STALE_TOKEN_ERRORS.includes(result.error.code) ? userDevices[index].ref.delete() : null,
        ),
      );
    }
  },
);
