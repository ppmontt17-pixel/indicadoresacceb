import { test, expect } from "vitest";
import { FINANCE_ACCOUNTS, MONTHS } from "./finance-accounts";
import { FINANCE_SHEETS } from "./finance-sheets";
import { FINANCE_TOTALS, totalAccounts } from "./finance";

test("DRE costs count subtotals once, excluding their child breakdowns", () => {
  const expected = [426396.41, 396478.56, 394381.91, 393431.18, 403814.67];
  MONTHS.forEach((month, i) => {
    expect(FINANCE_TOTALS[month].custo).toBe(expected[i]);
    expect(totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "custo"), [month])).toBe(expected[i]);
  });
});

test("DRE expenses include each group once, including maintenance", () => {
  const expected = [768994.02, 810660.35, 812754.6, 849270, 852121.45];
  MONTHS.forEach((month, i) => expect(FINANCE_TOTALS[month].despesa).toBe(expected[i]));
});

test("Filtered child accounts are counted when their subtotal is not displayed", () => {
  const child = FINANCE_ACCOUNTS.find((a) => a.name === "Repasse dos médicos - remoção");
  if (!child) throw new Error("Missing source account");
  expect(totalAccounts([child], ["Maio"])).toBe(52700);
});

test("Aporte remains outside revenue and operational outflows", () => {
  expect(FINANCE_TOTALS.Maio.receita).toBe(1287693.08);
  expect(FINANCE_TOTALS.Maio.aporte).toBe(184445);
  expect(Math.abs(FINANCE_TOTALS.Maio.receita - FINANCE_TOTALS.Maio.custo - FINANCE_TOTALS.Maio.despesa - FINANCE_TOTALS.Maio.imposto - 69764.6) < 0.005).toBe(true);
});

test("Updated DRE combines Desconto Padrão into a single September amount", () => {
  const accounts = FINANCE_ACCOUNTS.filter((a) => a.name === "Marketing - Jacy Duarte - Desconto Padrão");
  expect(accounts.length).toBe(1);
  expect(accounts[0]?.values.Setembro).toBe(2400);
});

test("Updated DRE confirms formerly pending maintenance entries as zero", () => {
  const checks = [
    ["Manutenção preventiva - RM Dias", "Setembro"],
    ["Manutenção Predial e Serviços Tercerizados - Astral Imunizações - Costa e Silva", "Agosto"],
    ["Manutenção Predial e Serviços Tercerizados - Atox Controle Ambiental", "Agosto"],
  ] as const;
  for (const [name, month] of checks) {
    expect(FINANCE_ACCOUNTS.find((a) => a.name === name)?.values[month]).toBe(0);
  }
});

test("Analytical import preserves both September Desconto Padrão payments", () => {
  const entries = FINANCE_SHEETS.find((s) => s.id === "marketing")?.months.Setembro
    .filter((t) => t.empresa === "JACY DUARTE - DESCONTO PADRÃO");
  expect(entries?.map((t) => t.valor)).toEqual([1200, 1200]);
});