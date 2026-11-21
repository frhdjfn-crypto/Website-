begin;

create table if not exists public.categories (
  name text primary key
);

alter table public.categories enable row level security;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
drop policy if exists categories_public_select on public.categories;
create policy categories_public_select on public.categories
  for select to anon, authenticated using (true);
drop policy if exists categories_admin_insert on public.categories;
create policy categories_admin_insert on public.categories
  for insert to authenticated with check (public.is_admin());
drop policy if exists categories_admin_update on public.categories;
create policy categories_admin_update on public.categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists categories_admin_delete on public.categories;
create policy categories_admin_delete on public.categories
  for delete to authenticated using (public.is_admin());

insert into public.categories(name)
select distinct btrim(category)
from public.books
where nullif(btrim(category), '') is not null
on conflict (name) do nothing;

create or replace function public.rename_category(p_old text, p_new text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  if nullif(btrim(p_new), '') is null then raise exception 'category name required'; end if;
  if p_old = btrim(p_new) then return; end if;
  update public.books set category = btrim(p_new) where category = p_old;
  delete from public.categories where name = p_old;
  insert into public.categories(name) values (btrim(p_new)) on conflict (name) do nothing;
end;
$$;
revoke all on function public.rename_category(text, text) from public;
grant execute on function public.rename_category(text, text) to authenticated;

commit;
