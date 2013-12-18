# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table dregs (
  id                        bigint not null,
  str                       varchar(255),
  regex_string              varchar(255),
  allow_unescaped           boolean,
  constraint pk_dregs primary key (id))
;

create sequence dregs_seq;




# --- !Downs

drop table if exists dregs cascade;

drop sequence if exists dregs_seq;

