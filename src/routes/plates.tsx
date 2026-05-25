import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/plates")({
  head: () => ({
    meta: [
      { title: "Plates | Klynn Ceramics" },
      { name: "description", content: "Stoneware plates with softly rounded rims and matte glazes." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="plates"
      title="Plates"
      intro="The quiet anchor of every table. Softly rounded rims, matte glazes, weight that feels right in the hand."
    />
  ),
});
