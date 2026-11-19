import { describe, expect, it } from "vitest";
import { canUploadSpreadsheets, getSectorPanel } from "./sector-panels";

describe("Organização dos setores", () => {
  it("associa o painel de faturamento ao setor de faturamento", () => {
    expect(getSectorPanel("faturamento")?.to).toBe("/faturamento");
  });
  it("associa o painel financeiro ao setor financeiro", () => {
    expect(getSectorPanel("financeiro-custos")?.to).toBe("/financeiro");
  });
  it("permite envio de planilhas somente a administradores", () => {
    expect(canUploadSpreadsheets(true)).toBe(true);
    expect(canUploadSpreadsheets(false)).toBe(false);
  });
});