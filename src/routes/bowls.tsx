import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/bowls")({
  head: () => ({
    meta: [
      { title: "Bowls — Terra Studio" },
      { name: "description", content: "Hand-thrown stoneware bowls — for breakfast, for feasts, for everyday." },
      { property: "og:title", content: "Bowls — Terra Studio" },
    ],
  }),
  component: () => (
    <CategoryPage
      category="bowls"
      title="Bowls"
      intro="From the breakfast bowl that holds your morning to the deep serving piece at the centre of a long lunch — each one shaped on the wheel, glazed by hand."
    />
  ),
});
