import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import catBowls from "@/assets/cat-bowls.jpg";
import catPlates from "@/assets/cat-plates.jpg";
import catMugs from "@/assets/cat-mugs.jpg";
import catGifting from "@/assets/cat-gifting.jpg";
import catChina from "@/assets/cat-china.jpg";

export type Category = "bowls" | "plates" | "mugs" | "gifting" | "china";

export type Product = {
  slug: string;
  name: string;
  descriptor: string;
  price: number;
  image: string;
  alt: string;
  category: Category;
  bestseller?: boolean;
  newArrival?: boolean;
  materials?: string;
  care?: string;
  description?: string;
};

export const products: Product[] = [
  // Bowls
  { slug: "kura-bowl", name: "Kura Bowl", descriptor: "Hand-thrown serving bowl", price: 84, image: p1, alt: "Terracotta hand-thrown bowl on linen", category: "bowls", bestseller: true,
    description: "A generous serving bowl thrown on the wheel and finished by hand. Each piece carries the quiet imperfections of its making.",
    materials: "Local stoneware clay, lead-free matte glaze.",
    care: "Dishwasher safe. Avoid sudden temperature changes." },
  { slug: "ash-bowl", name: "Ash Bowl", descriptor: "Sage stoneware, deep well", price: 72, image: p4, alt: "Sage green stoneware bowl on linen", category: "bowls", newArrival: true,
    description: "Quiet sage tones over warm stoneware, glazed with a soft sheen.",
    materials: "Stoneware, food-safe satin glaze.",
    care: "Dishwasher safe." },
  { slug: "loam-bowl", name: "Loam Bowl", descriptor: "Petite breakfast bowl", price: 58, image: p1, alt: "Small terracotta breakfast bowl", category: "bowls" },
  { slug: "ember-bowl", name: "Ember Bowl", descriptor: "Pasta and ramen", price: 96, image: p4, alt: "Wide deep sage bowl", category: "bowls" },

  // Plates
  { slug: "linen-plate", name: "Linen Plate", descriptor: "Dinner plate, matte cream", price: 62, image: p2, alt: "Matte cream dinner plate", category: "plates", bestseller: true,
    description: "An everyday dinner plate with a softly rounded rim and matte cream glaze.",
    materials: "Stoneware, satin matte glaze.",
    care: "Dishwasher and microwave safe." },
  { slug: "marl-plate", name: "Marl Plate", descriptor: "Side plate, raw edge", price: 44, image: p2, alt: "Cream side plate", category: "plates", newArrival: true },
  { slug: "vellum-plate", name: "Vellum Plate", descriptor: "Charger, oversized", price: 110, image: p2, alt: "Oversized charger plate", category: "plates" },
  { slug: "field-plate", name: "Field Plate", descriptor: "Pasta plate, deep rim", price: 78, image: p2, alt: "Deep rim pasta plate", category: "plates" },

  // Mugs
  { slug: "morning-mug", name: "Morning Mug", descriptor: "Cream stoneware, 12oz", price: 48, image: p3, alt: "Cream ceramic mug on linen", category: "mugs", bestseller: true,
    description: "Built for slow mornings. A weighted base, hand-pulled handle, and a glaze that softens with use.",
    materials: "Stoneware, satin glaze interior.",
    care: "Dishwasher safe. Hand-wash to preserve finish." },
  { slug: "ember-mug", name: "Ember Mug", descriptor: "Terracotta, espresso", price: 36, image: p1, alt: "Small terracotta espresso mug", category: "mugs" },
  { slug: "cloud-mug", name: "Cloud Mug", descriptor: "Soft cream, tall", price: 52, image: p3, alt: "Tall cream mug", category: "mugs", newArrival: true },
  { slug: "harvest-mug", name: "Harvest Mug", descriptor: "Sage, tea", price: 48, image: p4, alt: "Sage green tea mug", category: "mugs" },

  // Gifting Sets
  { slug: "the-host", name: "The Host", descriptor: "Six-piece serving set", price: 320, image: catGifting, alt: "Curated gifting set with twine", category: "gifting", bestseller: true,
    description: "Two serving bowls, two side plates, and a pair of hand-pulled mugs, wrapped in raw linen and twine.",
    materials: "Stoneware, mixed earth tones.",
    care: "All pieces dishwasher safe." },
  { slug: "first-home", name: "First Home", descriptor: "Housewarming essentials", price: 240, image: catGifting, alt: "Housewarming gift set", category: "gifting", newArrival: true },
  { slug: "morning-ritual", name: "Morning Ritual", descriptor: "Two mugs, two bowls", price: 180, image: catGifting, alt: "Morning ritual gift set", category: "gifting" },
  { slug: "anniversary-set", name: "Anniversary", descriptor: "Heirloom pair", price: 280, image: catGifting, alt: "Anniversary heirloom set", category: "gifting" },

  // China
  { slug: "earth-china", name: "Earth Service", descriptor: "Service for 4 / 6 / 8", price: 720, image: catChina, alt: "Earth tone china set table", category: "china", bestseller: true,
    description: "A complete table in considered earth tones. Plates, bowls, side plates and tumblers, available in three sizes.",
    materials: "Stoneware. Earth, sand and clay glazes.",
    care: "All pieces dishwasher safe." },
  { slug: "linen-china", name: "Linen Service", descriptor: "Service for 4 / 6 / 8", price: 760, image: catChina, alt: "Cream linen china set", category: "china" },
  { slug: "ash-china", name: "Ash Service", descriptor: "Service for 4 / 6 / 8", price: 780, image: catChina, alt: "Ash tone china set", category: "china", newArrival: true },
];

export const categoryMeta: Record<Category, { title: string; tagline: string; image: string; href: string }> = {
  bowls:    { title: "Bowls",        tagline: "From breakfast to feast",        image: catBowls,   href: "/bowls" },
  plates:   { title: "Plates",       tagline: "The quiet anchor of the table",  image: catPlates,  href: "/plates" },
  mugs:     { title: "Mugs",         tagline: "For the slow morning",           image: catMugs,    href: "/mugs" },
  gifting:  { title: "Gifting Sets", tagline: "Considered, hand-wrapped",       image: catGifting, href: "/gifting-sets" },
  china:    { title: "China Sets",   tagline: "A complete table",               image: catChina,   href: "/china-sets" },
};

export const byCategory = (c: Category) => products.filter((p) => p.category === c);
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
