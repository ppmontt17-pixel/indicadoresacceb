import { describe, expect, it } from "vitest";
import { canUploadSpreadsheets, getSectorPanel } from "./sector-panels";

describe("Organização dos setores", () => {
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