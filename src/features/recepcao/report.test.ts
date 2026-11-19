import { describe, expect, it } from "vitest";
import { parseReceptionSheet, receptionSummary } from "./report";
describe("Relatório de recepção", () => {
  it("preserva o total informado sem somá-lo novamente aos tipos", () => {
    const rows = parseReceptionSheet([["RELATORIO DA RECEPÇÃO - OUTUBRO 2026"], ["NÚMERO DE ATENDIMENTOS"], ["CONSULTAS E RETORNOS", 1230], ["EXAMES", 1343], ["TERAPIAS", 261], ["TOTAL", 2834]]);
    expect(receptionSummary(rows)).toMatchObject({ total: 2834, consultas: 1230, exames: 1343, terapias: 261 });
    expect(rows[0]?.periodo).toBe("OUTUBRO 2026");
  });
  it("mantém diferenças entre detalhamentos e total sem corrigir os dados", () => {
    const rows = parseReceptionSheet([["RELATORIO DA RECEPÇÃO - OUTUBRO 2026"], ["NÚMERO DE ATENDIMENTOS"], ["TOTAL", 2834], ["DESEMPENHO POR RECEPCIONISTA"], ["A", 2835]]);
    expect(receptionSummary(rows).recepcionistas - receptionSummary(rows).total).toBe(1);
  });
  it("rejeita quantidades inválidas", () => {
    expect(() => parseReceptionSheet([["RELATORIO DA RECEPÇÃO - OUTUBRO 2026"], ["EXAMES DETALHADOS"], ["Exame", -1]])).toThrow();
  });
});