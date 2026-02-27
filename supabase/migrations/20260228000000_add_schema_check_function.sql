-- Schema check RPC function
-- information_schema.columns を安全に公開し、pre-deploy チェックスクリプトから利用する
CREATE OR REPLACE FUNCTION public.get_table_columns(p_schema text DEFAULT 'public')
RETURNS TABLE(table_name text, column_name text)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT c.table_name::text, c.column_name::text
  FROM information_schema.columns c
  WHERE c.table_schema = p_schema
  ORDER BY c.table_name, c.ordinal_position;
$$;
