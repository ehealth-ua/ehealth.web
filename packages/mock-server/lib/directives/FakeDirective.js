const { SchemaDirectiveVisitor } = require("graphql-tools");
const faker = require("faker");
const RandExp = require("randexp");
const invoke = require("lodash/invoke");

class FakeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const {
      locale = "en",
      method,
      args = [],
      format,
      probability = 0.5,
      randexp
    } = this.args;

    faker.locale = locale;

    field.resolve = () => {
      if (
        field.astNode.type.kind !== "NonNullType" &&
        Math.random() < probability
      ) {
        return null;
      }

      if (method) {
        return invoke(faker, method, ...args);
      }

      if (format) {
        return faker.fake(format);
      }

      if (randexp) {
        const rand = new RandExp(randexp).gen();
        return rand;
      }
    };
  }
}

module.exports = FakeDirective;
