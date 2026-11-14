import { describe, expect, it } from "vitest";
import { analyzeColumns, groupSum, toNumber } from "./report-stats";

describe("report stats", () => {
  it("reads Brazilian money values", () => {
    expect(toNumber("R$ 1.234,56")).toBe(1234.56);
  });
  it("detects numeric columns", () => {
    const rows = [{ c: "A", v: "10" }, { c: "B", v: 5 }];
    expect(analyzeColumns(["c", "v"], rows)).toEqual({ numeric: ["v"], text: ["c"] });
  });
  it("sums by group", () => {
    const rows = [{ c: "A", v: 1 }, { c: "A", v: 2 }, { c: "B", v: 1 }];
    expect(groupSum(rows, "c", "v")).toEqual([{ name: "A", value: 3 }, { name: "B", value: 1 }]);
  });
});
