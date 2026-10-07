/**
 * DEMO DATA: a complete sample tailor site at /portfolio/demo, for testing the public pages without a database.
 * To remove: delete this folder and the two "DEMO" lines in src/composables/usePublicPortfolio.ts.
 */
import type { MediaFile } from "@/types/index";
import type { Portfolio, PortfolioCategory, PortfolioWork } from "@/types/portfolio";

export const DEMO_SLUG = "demo";

const photo = (seed: string): MediaFile => ({
  fileId: `demo-${seed}`,
  url: `https://picsum.photos/seed/${seed}/900/1125`,
  uploadedAt: "2026-09-01T09:00:00.000Z",
});

function work(
  n: number,
  title: string,
  category: PortfolioCategory,
  fabric: string,
  occasion: string,
  description: string,
  tags: string[],
  photos = 2,
): PortfolioWork {
  const images = Array.from({ length: photos }, (_, i) => photo(`didi-${n}-${i}`));
  const at = new Date(Date.UTC(2026, 8, 30 - n)).toISOString();
  return {
    id: `demo-work-${n}`,
    title,
    category,
    description,
    fabric,
    occasion,
    tags,
    images,
    coverImageId: images[0].fileId,
    status: "published",
    publishedAt: at,
    createdAt: at,
    updatedAt: at,
  };
}

export const demoWorks: PortfolioWork[] = [
  work(1, "Emerald silk corset gown", "Bridal", "Silk organza", "Traditional wedding", "A structured corset bodice with a flowing mermaid skirt, hand-finished beading along the neckline.", ["corset", "beaded", "mermaid"], 3),
  work(2, "Gold lace aso-ebi set", "Aso-Ebi", "French lace", "Owambe", "Matching peplum blouse and wrapper in rich gold lace, made for a bridal party of twelve.", ["lace", "peplum", "group order"]),
  work(3, "Royal blue agbada", "Agbada", "Aso-oke", "Chieftaincy ceremony", "Three-piece agbada with hand-embroidered neck and cuffs, tailored for ease of movement.", ["embroidered", "three-piece"], 3),
  work(4, "Sunset ankara jumpsuit", "Casual", "Ankara wax print", "Weekend brunch", "A relaxed wide-leg jumpsuit with a cinched waist and bold, mirrored print placement.", ["ankara", "jumpsuit"]),
  work(5, "Ivory off-shoulder wedding dress", "Bridal", "Duchess satin", "White wedding", "Clean lines, a sculpted off-shoulder neckline and a chapel-length train.", ["train", "off-shoulder"], 3),
  work(6, "Burgundy velvet evening gown", "Evening Wear", "Stretch velvet", "Gala dinner", "Floor-length velvet with a high slit and an open back, lined for a perfect drape.", ["velvet", "slit"]),
  work(7, "Teal senator set", "Native Wear", "Premium cashmere", "Sunday service", "A sharp senator top and trousers with contrast piping, fully lined.", ["senator", "men"]),
  work(8, "Charcoal two-piece suit", "Corporate", "Italian wool blend", "Boardroom", "Single-breasted jacket and tapered trousers cut from a measured pattern.", ["suit", "tailored"]),
  work(9, "Blush pink aso-ebi gown", "Aso-Ebi", "Soft tulle & lace", "Engagement", "Tiered tulle skirt over a lace bodice, finished with covered buttons down the back.", ["tulle", "buttons"]),
  work(10, "Black cocktail midi dress", "Evening Wear", "Crepe", "Cocktail party", "A flattering midi with a draped neckline, made in a weekend rush order.", ["midi", "crepe"]),
];

export const demoPortfolio: Portfolio = {
  id: "demo-user",
  slug: DEMO_SLUG,
  brandName: "Didi Stitches",
  tagline: "Made for your moment.",
  introduction: "Bespoke bridal, aso-ebi and native wear, cut and finished by hand in Abuja.",
  about:
    "Didi Stitches started on a single sewing machine in 2014 and has since dressed hundreds of brides, families and executives across Nigeria.\n\nEvery piece begins with a conversation and a set of measurements, and ends with a fitting until it feels like it was always yours.",
  designerBio: "Adedoyin “Didi” Bakare trained in Lagos and Milan. She still cuts every pattern herself.",
  image: photo("didi-portrait"),
  heroWorkId: "demo-work-1",
  services: [
    { title: "Bespoke Tailoring", description: "Custom garments created around your measurements, personal style and the occasion." },
    { title: "Bridal", description: "Personalised bridal pieces with careful attention to silhouette, detail and fit." },
    { title: "Aso-Ebi & Group Orders", description: "Matching outfits for families and bridal parties, delivered on schedule." },
    { title: "Alterations", description: "Refining an existing garment for a better fit, finish and feel." },
  ],
  contact: {
    location: "Wuse 2, Abuja, Nigeria",
    phone: "08012345678",
    email: "hello@didistitches.com",
    instagram: "@didistitches",
    tiktok: "@didistitches",
    facebook: "didistitches",
    whatsapp: true,
  },
  createdAt: "2026-09-01T09:00:00.000Z",
  updatedAt: "2026-09-30T09:00:00.000Z",
};
