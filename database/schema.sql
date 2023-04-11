set client_min_messages to warning;

drop schema "public" cascade;

create schema "public";

 CREATE TABLE "public"."locations" (
	"locationId" serial NOT NULL,
	"placeId" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"category" TEXT NOT NULL,
	CONSTRAINT "locations_pk" PRIMARY KEY ("locationId")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."myListItems" (
	"myListItemsId" serial NOT NULL,
	"userId" integer NOT NULL,
	"locationId" integer NOT NULL,
	CONSTRAINT "myListItems_pk" PRIMARY KEY ("myListItemsId")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."routes" (
	"routeId" serial NOT NULL,
	"userId" integer NOT NULL,
	"routeName" TEXT NOT NULL,
	CONSTRAINT "routes_pk" PRIMARY KEY ("routeId")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."routeLocations" (
	"routeId" integer NOT NULL,
	"myListItemsId" integer NOT NULL
) WITH (
  OIDS=FALSE
);


ALTER TABLE "myListItems" ADD CONSTRAINT "myListItems_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "myListItems" ADD CONSTRAINT "myListItems_fk1" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId");

ALTER TABLE "routes" ADD CONSTRAINT "routes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "routeLocations" ADD CONSTRAINT "routeLocations_fk0" FOREIGN KEY ("routeId") REFERENCES "routes"("routeId");
ALTER TABLE "routeLocations" ADD CONSTRAINT "routeLocations_fk1" FOREIGN KEY ("myListItemsId") REFERENCES "myListItems"("myListItemsId");
