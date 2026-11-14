import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal ACCEB — Centro Médico" },
      { name: "description", content: "Acesso central aos painéis Financeiro e de Faturamento da ACCEB." },
      { property: "og:title", content: "Portal ACCEB — Centro Médico" },
      { property: "og:description", content: "Acesso central aos painéis Financeiro e de Faturamento da ACCEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/portal" });
  },
});
