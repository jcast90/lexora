"use client";

import { useEffect, useState } from "react";
import { getRows } from "@/lib/supabase/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "lexora_";
const TABLE_NAME = `${TABLE_PREFIX}intake_submissions`;

type Row = Record<string, unknown>;

export default function IntakeSubmissionsPage() {
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
        <h1 className="text-2xl font-semibold text-white">Intake Submissions</h1>
        <Badge variant="outline" className="text-white/60 border-white/20">
          {loading ? "Loading..." : `${rows.length} records`}
        </Badge>
      </div>

      <Card className="border-white/[0.06] bg-brand-surface-light text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white/60">Intake Submissions List</CardTitle>
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
          <TableHead>Client Name</TableHead>
          <TableHead>Contact Email</TableHead>
          <TableHead>Template Used</TableHead>
          <TableHead>Submission Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={String(row.id ?? i)} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell>{String(row.client_name ?? "")}</TableCell>
                <TableCell>{String(row.contact_email ?? "")}</TableCell>
                <TableCell>{String(row.template_used ?? "")}</TableCell>
                <TableCell>{String(row.submission_date ?? "")}</TableCell>
                <TableCell>{String(row.status ?? "")}</TableCell>
                <TableCell>{String(row.submitted_at ?? "")}</TableCell>
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
