import { describe, expect, test } from "vitest"

describe("Test runner", () => {
	test("Tests OK", () => {
		expect(true).toStrictEqual(true)
	})
	test.fails("Test NOK", () => {
		expect(true).toStrictEqual(false)
	})
})
