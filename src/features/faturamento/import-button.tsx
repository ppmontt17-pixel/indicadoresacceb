import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { accessQuery } from "@/lib/access";
import { canUploadSpreadsheets } from "@/lib/sector-panels";
import {
  buildFaturamentoInserts,
  buildGlosaInserts,
  isFaturamentoSheet,
  isGlosaSheet,
  type FaturamentoInsert,
  type GlosaInsert,
  type SheetData,
} from "./import-planilha";
import type { Row } from "@/lib/report-stats";

const CHUNK = 500;

async function insertFaturamento(rows: FaturamentoInsert[]) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase.from("faturamento").insert(rows.slice(i, i + CHUNK));
    if (error) throw error;
  }
}

async function insertGlosas(rows: GlosaInsert[]) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase.from("glosas").insert(rows.slice(i, i + CHUNK));
    if (error) throw error;
  }
}

export function FaturamentoImportButton() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const { data: access } = useSuspenseQuery(accessQuery);
  const canUpload = canUploadSpreadsheets(access.isAdmin);

  async function onFile(file: File) {
    if (!canUpload) return;
    setBusy(true);
    try {
      const wb = XLSX.read(await file.arrayBuffer());
      const sheets: SheetData[] = wb.SheetNames.flatMap((name) => {
        const sheet = wb.Sheets[name];
        if (!sheet) return [];
        return [{ name, rows: XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" }) }];
      }).filter((s) => s.rows.length > 0);

      let fatCount = 0;
      let glosaCount = 0;
      const ignoradas: string[] = [];

      for (const sheet of sheets) {
        const columns = Object.keys(sheet.rows[0] ?? {});
        if (isFaturamentoSheet(columns)) {
          const inserts = buildFaturamentoInserts(sheet.rows, columns);
          if (inserts.length) {
            await insertFaturamento(inserts);
            fatCount += inserts.length;
          } else {
            ignoradas.push(sheet.name);
          }
        } else if (isGlosaSheet(columns)) {
          const inserts = buildGlosaInserts(sheet.rows, columns);
          if (inserts.length) {
            await insertGlosas(inserts);
            glosaCount += inserts.length;
          } else {
            ignoradas.push(sheet.name);
          }
        } else {
          ignoradas.push(sheet.name);
        }
      }

      if (!fatCount && !glosaCount) {
        throw new Error(
          "Nenhuma aba reconhecida. Use colunas como Operadora, Mês, Ano, Faturado (faturamento) ou Valor Glosado, Status (glosas).",
        );
      }

      const partes = [
        fatCount ? `${fatCount} linha(s) de faturamento` : null,
        glosaCount ? `${glosaCount} linha(s) de glosas` : null,
      ].filter(Boolean);
      toast.success(`Importado: ${partes.join(" e ")}.`);
      if (ignoradas.length) {
        toast.warning(`Abas ignoradas (sem colunas reconhecidas): ${ignoradas.join(", ")}`);
      }
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["faturamento"] }),
        qc.invalidateQueries({ queryKey: ["glosas"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível importar essa planilha.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!canUpload) return null;

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={busy}>
        <Upload className="h-4 w-4" /> {busy ? "Importando..." : "Enviar planilha"}
      </Button>
    </>
  );
}
