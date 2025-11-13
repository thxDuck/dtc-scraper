import assert from "node:assert";
import test, { describe } from "node:test";

describe("Test runner", () => {
  test("Vérification d'une égalité", () => {
    assert.strictEqual(true, true);
  });
});
