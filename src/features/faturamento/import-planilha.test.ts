import { describe, expect, it } from "vitest";
import {
  buildFaturamentoInserts,
  buildGlosaInserts,
  isFaturamentoSheet,
  isGlosaSheet,
  normalizeHeader,
  normalizeMes,
} from "./import-planilha";

describe("normalizeHeader", () => {
  it("remove acentos, espaços e ignora maiúsculas", () => {
    expect(normalizeHeader("Valor Glosado")).toBe("valorglosado");
    expect(normalizeHeader("MÊS")).toBe("mes");
    expect(normalizeHeader("Nº Guia")).toBe("nguia");
  });
});

describe("normalizeMes", () => {
  it("aceita nome completo e abreviado", () => {
    expect(normalizeMes("março")).toBe("Março");
    expect(normalizeMes("JAN")).toBe("Janeiro");
    expect(normalizeMes("outubro")).toBe("Outubro");
  });
  it("rejeita mês desconhecido", () => {
    expect(normalizeMes("Foo")).toBeNull();
  });
});

describe("detecção de aba", () => {
  it("reconhece aba de faturamento", () => {
    expect(isFaturamentoSheet(["Operadora", "Mês", "Ano", "Faturado", "Pago"])).toBe(true);
  });
  it("reconhece aba de glosas", () => {
    expect(isGlosaSheet(["Operadora", "Mês", "Ano", "Valor Glosado", "Status"])).toBe(true);
  });
  it("rejeita aba sem colunas mínimas", () => {
    expect(isFaturamentoSheet(["Nome", "Telefone"])).toBe(false);
    expect(isGlosaSheet(["Nome", "Telefone"])).toBe(false);
  });
});

describe("buildFaturamentoInserts", () => {
  const cols = ["Operadora", "Mês", "Ano", "Faturado", "Pago", "Glosado", "Pendente", "Contas"];
  it("converte valores em formato brasileiro", () => {
    const [row] = buildFaturamentoInserts(
      [{ Operadora: "Unimed", Mês: "Janeiro", Ano: 2025, Faturado: "1.234,56", Pago: "1.000,00", Glosado: "100,00", Pendente: "134,56", Contas: "12" }],
      cols,
    );
    expect(row).toEqual({
      operadora: "Unimed", mes: "Janeiro", ano: 2025,
      faturado: 1234.56, pago: 1000, glosado: 100, pendente: 134.56, contas: 12,
    });
  });
  it("pula linhas sem operadora, mês ou ano válidos", () => {
    const rows = buildFaturamentoInserts(
      [
        { Operadora: "", Mês: "Janeiro", Ano: 2025, Faturado: 10 },
        { Operadora: "Unimed", Mês: "Foo", Ano: 2025, Faturado: 10 },
        { Operadora: "Unimed", Mês: "Janeiro", Ano: "", Faturado: 10 },
      ],
      cols,
    );
    expect(rows).toHaveLength(0);
  });
});

describe("buildGlosaInserts", () => {
  const cols = ["Operadora", "Mês", "Ano", "Nº Guia", "Paciente", "Valor Glosado", "Valor Recuperado", "Status"];
  it("normaliza status e valores", () => {
    const [row] = buildGlosaInserts(
      [{ Operadora: "Bradesco", Mês: "fev", Ano: "2024", "Nº Guia": "123", Paciente: "Maria", "Valor Glosado": "250,90", "Valor Recuperado": "0", Status: "pago parcial" }],
      cols,
    );
    expect(row).toMatchObject({
      operadora: "Bradesco", mes: "Fevereiro", ano: 2024,
      numero_guia: "123", paciente: "Maria",
      valor_glosado: 250.9, valor_recuperado: 0, status: "Pago Parcial",
    });
  });
  it("usa 'Em análise' quando o status é desconhecido", () => {
    const [row] = buildGlosaInserts(
      [{ Operadora: "Bradesco", Mês: "Fevereiro", Ano: 2024, "Valor Glosado": 10, Status: "qualquer coisa" }],
      cols,
    );
    expect(row?.status).toBe("Em análise");
  });
});
