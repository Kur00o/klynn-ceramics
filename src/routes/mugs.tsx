import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/mugs")({
  head: () => ({
    meta: [
      { title: "Mugs | Klynn Ceramics" },
      { name: "description", content: "Hand-pulled stoneware mugs for slow mornings." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="mugs"
      title="Mugs"
      intro="Built for slow mornings. Weighted bases, hand-pulled handles, glazes that soften with use."
    />
  ),
});
