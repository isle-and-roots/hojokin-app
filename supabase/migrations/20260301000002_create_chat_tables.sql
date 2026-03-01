-- chat_sessions テーブル
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '新しい会話',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- chat_messages テーブル
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- インデックス
create index if not exists chat_sessions_user_id_idx on public.chat_sessions(user_id);
create index if not exists chat_messages_session_id_idx on public.chat_messages(session_id);
create index if not exists chat_messages_user_id_created_at_idx on public.chat_messages(user_id, created_at);

-- RLS 有効化
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- chat_sessions RLS ポリシー
create policy "ユーザーは自分のセッションのみ閲覧可能" on public.chat_sessions
  for select using (user_id = auth.uid());

create policy "ユーザーは自分のセッションのみ作成可能" on public.chat_sessions
  for insert with check (user_id = auth.uid());

create policy "ユーザーは自分のセッションのみ更新可能" on public.chat_sessions
  for update using (user_id = auth.uid());

create policy "ユーザーは自分のセッションのみ削除可能" on public.chat_sessions
  for delete using (user_id = auth.uid());

-- chat_messages RLS ポリシー
create policy "ユーザーは自分のメッセージのみ閲覧可能" on public.chat_messages
  for select using (user_id = auth.uid());

create policy "ユーザーは自分のメッセージのみ作成可能" on public.chat_messages
  for insert with check (user_id = auth.uid());

-- updated_at 自動更新トリガー
create or replace function public.update_chat_sessions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute function public.update_chat_sessions_updated_at();
