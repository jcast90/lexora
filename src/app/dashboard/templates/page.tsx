"use client";

import { useEffect, useState } from "react";
import { getRows } from "@/lib/supabase/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "lexora_";
const TABLE_NAME = `${TABLE_PREFIX}templates`;

type Row = Record<string, unknown>;

export default function TemplatesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRows<Row>(TABLE_NAME, { orderBy: "created_at", ascending: false, limit: 100 })
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Templates</h1>
        <Badge variant="outline" className="text-white/60 border-white/20">
          {loading ? "Loading..." : `${rows.length} records`}
        </Badge>
      </div>

      <Card className="border-white/[0.06] bg-brand-surface-light text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white/60">Templates List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-white/40">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-white/40">No records found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
          <TableHead>Template Name</TableHead>
          <TableHead>Practice Area</TableHead>
          <TableHead>Questions Count</TableHead>
          <TableHead>Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={String(row.id ?? i)} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell>{String(row.template_name ?? "")}</TableCell>
                <TableCell>{String(row.practice_area ?? "")}</TableCell>
                <TableCell>{String(row.questions_count ?? "")}</TableCell>
                <TableCell>{String(row.last_modified ?? "")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
