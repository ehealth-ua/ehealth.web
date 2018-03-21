import { schema } from "normalizr";

export const client = new schema.Entity("clients");

export const request = new schema.Entity("requests");

export const dictionary = new schema.Entity(
  "dictionaries",
  {},
  { idAttribute: "name" }
);

export const userRole = new schema.Entity("userRoles");
