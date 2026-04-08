import { createClient } from "./client";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX ?? "";

function t(table: string): string {
  // If the table already starts with the prefix, don't double-prefix
  if (TABLE_PREFIX && table.startsWith(TABLE_PREFIX)) return table;
  return `${TABLE_PREFIX}${table}`;
}

// Generic CRUD helper for Supabase tables
export async function getRows<T>(table: string, options?: {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  filter?: Record<string, string>;
}): Promise<T[]> {
  const supabase = createClient();
  let query = supabase.from(t(table)).select("*");

  if (options?.filter) {
    for (const [key, value] of Object.entries(options.filter)) {
      query = query.eq(key, value);
    }
  }
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Failed to fetch ${t(table)}:`, error);
    return [];
  }
  return (data || []) as T[];
}

export async function insertRow<T>(table: string, row: Partial<T>): Promise<T | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from(t(table)).insert(row).select().single();
  if (error) {
    console.error(`Failed to insert into ${t(table)}:`, error);
    return null;
  }
  return data as T;
}

export async function updateRow<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from(t(table)).update(updates).eq("id", id).select().single();
  if (error) {
    console.error(`Failed to update ${t(table)}:`, error);
    return null;
  }
  return data as T;
}

export async function deleteRow(table: string, id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from(t(table)).delete().eq("id", id);
  if (error) {
    console.error(`Failed to delete from ${t(table)}:`, error);
    return false;
  }
  return true;
}

export { t as tableName, TABLE_PREFIX };
