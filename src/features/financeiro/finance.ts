import { FINANCE_ACCOUNTS, MONTHS, type FinanceAccount, type MonthKey } from "./finance-accounts";

export const money = (value: number, compact = false) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);

const parents = new Map<FinanceAccount, FinanceAccount>();
let parent: FinanceAccount | undefined;
for (const account of FINANCE_ACCOUNTS) {
  if (account.level === 1) parent = account;
  else if (parent?.category === account.category) parents.set(account, parent);
}

// Select non-overlapping rows: a displayed subtotal replaces its children.
export function totalAccounts(accounts: FinanceAccount[], months: MonthKey[]) {
  const included = new Set(accounts);
  let cents = 0;
  for (const account of accounts) {
    const parentAccount = parents.get(account);
    if (parentAccount && included.has(parentAccount)) continue;
    for (const month of months) {
      const value = account.values[month];
      if (value !== null) cents += Math.round(value * 100);
    }
  }
  return cents / 100;
}

export const FINANCE_TOTALS = Object.fromEntries(MONTHS.map((month) => [month, {
  receita: totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "receita"), [month]),
  custo: totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "custo"), [month]),
  despesa: totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "despesa"), [month]),
  imposto: totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "imposto"), [month]),
  aporte: totalAccounts(FINANCE_ACCOUNTS.filter((a) => a.category === "aporte"), [month]),
  pendencias: FINANCE_ACCOUNTS.filter((a) => a.values[month] === null).length,
}])) as Record<MonthKey, { receita: number; custo: number; despesa: number; imposto: number; aporte: number; pendencias: number }>;