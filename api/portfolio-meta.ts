import { getDb } from "./_firebase.js";

/**
 * Link previews for shared portfolio links (WhatsApp, Telegram, Facebook...).
 * The app is a single-page app, so crawlers that don't run JavaScript would only see an empty page.
 * vercel.json sends those crawlers here instead; real visitors still get the normal app.
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

interface Image {
  fileId: string;
  url: string;
}
const coverOf = (work: { images?: Image[]; coverImageId?: string | null }) =>
  work.images?.find((i) => i.fileId === work.coverImageId)?.url ?? work.images?.[0]?.url ?? "";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const workId = url.searchParams.get("workId");
  const origin = `${url.protocol}//${request.headers.get("host") ?? url.host}`;

  const html = (title: string, description: string, image: string, path: string) =>
    new Response(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(origin + path)}">
${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n<meta name="twitter:card" content="summary_large_image">` : ""}
</head><body></body></html>`,
      { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" } },
    );

  if (!process.env.FIREBASE_SERVICE_ACCOUNT || !slug) return html("Fitelle", "Orders, customers and portfolio for fashion designers.", "", "/");

  const db = getDb();
  const match = await db.collection("portfolios").where("slug", "==", slug).limit(1).get();
  if (match.empty) return html("Fitelle", "This portfolio isn't available.", "", `/portfolio/${slug}`);

  const portfolio = match.docs[0];
  const brand = portfolio.get("brandName") as string;

  if (workId) {
    const work = (await portfolio.ref.collection("works").doc(workId).get()).data();
    if (work?.status === "published") {
      const summary = (work.description as string) || `${work.category} by ${brand}`;
      return html(`${work.title} · ${brand}`, summary, coverOf(work), `/portfolio/${slug}/${workId}`);
    }
  }

  // The portfolio itself: preview with the hero piece (or the latest published one).
  const published = await portfolio.ref.collection("works").where("status", "==", "published").get();
  const works = published.docs.map((d) => ({ id: d.id, ...d.data() }) as { id: string; images?: Image[]; coverImageId?: string | null });
  const hero = works.find((w) => w.id === portfolio.get("heroWorkId")) ?? works[0];
  const description = (portfolio.get("introduction") as string) || (portfolio.get("tagline") as string) || `Portfolio of ${brand}`;
  return html(brand, description, hero ? coverOf(hero) : (portfolio.get("image")?.url ?? ""), `/portfolio/${slug}`);
}
