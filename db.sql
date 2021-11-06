use urlshort;
drop table if exists slugs;
create table slugs (
  slug text not null,
  url text not null
);