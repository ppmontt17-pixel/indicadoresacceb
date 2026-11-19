import { describe, expect, it } from "vitest";
import { canUploadSpreadsheets, getSectorPanel, getSectorDestination } from "./sector-panels";

describe("Organização dos setores", () => {
  it("abre diretamente os painéis ao selecionar um setor", () => {
    expect(getSectorDestination("recepcao")).toEqual({ to: "/recepcao" });
    expect(getSectorDestination("faturamento")).toEqual({ to: "/faturamento" });
    expect(getSectorDestination("financeiro-custos")).toEqual({ to: "/financeiro" });
  });
  it("mantém o acesso ao setor que ainda não tem painel", () => {
    expect(getSectorDestination("compras")).toEqual({ to: "/setor/$slug", params: { slug: "compras" } });
  });
  it("associa recepção ao seu painel", () => {
    expect(getSectorPanel("recepcao")?.to).toBe("/recepcao");
  });
  it("associa o painel de faturamento ao setor de faturamento", () => {
    expect(getSectorPanel("faturamento")?.to).toBe("/faturamento");
  });
  it("associa o painel financeiro ao setor financeiro", () => {
    expect(getSectorPanel("financeiro-custos")?.to).toBe("/financeiro");
  });
  it("não permite envio de planilhas pelo site, inclusive para administradores", () => {
    expect(canUploadSpreadsheets(true)).toBe(false);
    expect(canUploadSpreadsheets(false)).toBe(false);
  });
});