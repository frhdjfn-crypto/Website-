begin;

create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
grant select, insert, update, delete on public.admins to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = (select auth.jwt() ->> 'email')
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
drop policy if exists admins_read_self_or_admin on public.admins;
create policy admins_read_self_or_admin on public.admins
  for select to authenticated
  using (email = (auth.jwt() ->> 'email') or public.is_admin());

create table if not exists public.books (
  id bigint generated always as identity primary key,
  title text not null,
  author text not null,
  category text not null,
  rating numeric default 0,
  year int,
  pages int,
  language text default 'العربية',
  description text,
  download_url text,
  image_url text,
  file_size text,
  format text default 'PDF',
  download_count int default 0,
  comments jsonb default '[]'::jsonb,
  added_date timestamptz default now()
);
alter table public.books enable row level security;
grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
drop policy if exists books_public_select on public.books;
create policy books_public_select on public.books for select to anon, authenticated using (true);
drop policy if exists books_admin_insert on public.books;
create policy books_admin_insert on public.books for insert to authenticated with check (public.is_admin());
drop policy if exists books_admin_update on public.books;
create policy books_admin_update on public.books for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists books_admin_delete on public.books;
create policy books_admin_delete on public.books for delete to authenticated using (public.is_admin());

create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  book_id bigint not null references public.books(id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.downloads enable row level security;
grant insert on public.downloads to anon, authenticated;
grant select on public.downloads to authenticated;
drop policy if exists downloads_insert_public on public.downloads;
create policy downloads_insert_public on public.downloads for insert to anon, authenticated with check (true);
drop policy if exists downloads_select_own on public.downloads;
create policy downloads_select_own on public.downloads for select to authenticated using (user_id = auth.uid());
drop policy if exists downloads_select_admin on public.downloads;
create policy downloads_select_admin on public.downloads for select to authenticated using (public.is_admin());

create table if not exists public.user_library (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id bigint not null references public.books(id) on delete cascade,
  primary key (user_id, book_id)
);
alter table public.user_library enable row level security;
-- Migrate the prior table shape without discarding its user/book associations.
alter table public.user_library alter column book_id type bigint using book_id::bigint;
alter table public.user_library drop column if exists id;
alter table public.user_library drop column if exists added_at;
alter table public.user_library drop column if exists notes;
-- The book_id foreign key is added by the seed script after existing book IDs are restored.
-- Ensure the table has the requested composite primary key, regardless of its prior shape.
do $$
declare pk_name text;
begin
  select c.conname into pk_name
  from pg_constraint c
  where c.conrelid = 'public.user_library'::regclass and c.contype = 'p';
  if pk_name is not null then
    execute format('alter table public.user_library drop constraint %I', pk_name);
  end if;
end $$;
alter table public.user_library add constraint user_library_pkey primary key (user_id, book_id);
grant select, insert, delete on public.user_library to authenticated;
drop policy if exists "Users can add books to their library" on public.user_library;
drop policy if exists "Users can remove books from their library" on public.user_library;
drop policy if exists "Users can view their own library" on public.user_library;
drop policy if exists user_library_select_own on public.user_library;
drop policy if exists user_library_insert_own on public.user_library;
drop policy if exists user_library_delete_own on public.user_library;
create policy user_library_select_own on public.user_library for select to authenticated using (user_id = auth.uid());
create policy user_library_insert_own on public.user_library for insert to authenticated with check (user_id = auth.uid());
create policy user_library_delete_own on public.user_library for delete to authenticated using (user_id = auth.uid());

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  site_name text,
  hero_title text,
  hero_subtitle text,
  footer_text text,
  contact_email text,
  contact_phone text,
  show_random boolean default true,
  show_newest boolean default true,
  show_most_downloaded boolean default true,
  show_most_rated boolean default true
);
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
drop policy if exists site_settings_public_select on public.site_settings;
create policy site_settings_public_select on public.site_settings for select to anon, authenticated using (true);
drop policy if exists site_settings_admin_insert on public.site_settings;
create policy site_settings_admin_insert on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists site_settings_admin_delete on public.site_settings;
create policy site_settings_admin_delete on public.site_settings for delete to authenticated using (public.is_admin());

create or replace function public.increment_download(p_book_id bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.books
  set download_count = coalesce(download_count, 0) + 1
  where id = p_book_id;
$$;
revoke all on function public.increment_download(bigint) from public;
grant execute on function public.increment_download(bigint) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('books', 'books', true)
on conflict (id) do update set public = true;
drop policy if exists books_bucket_public_read on storage.objects;
create policy books_bucket_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'books');
drop policy if exists books_bucket_admin_insert on storage.objects;
create policy books_bucket_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'books' and public.is_admin());
drop policy if exists books_bucket_admin_update on storage.objects;
create policy books_bucket_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'books' and public.is_admin()) with check (bucket_id = 'books' and public.is_admin());
drop policy if exists books_bucket_admin_delete on storage.objects;
create policy books_bucket_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'books' and public.is_admin());

commit;
