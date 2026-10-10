import assert from "node:assert/strict"
import { test } from "node:test"
import { changedFields } from "./changed-fields"

type Update = {
  title?: string
  isbn?: string | null
  releaseDate?: number | null
  genres?: string[] | null
}

const initial: Update = { title: "Dune", isbn: "123", releaseDate: null, genres: ["scifi"] }

const cases: [name: string, current: Update, expected: Update][] = [
  ["omits fields that were not edited", { ...initial, genres: ["scifi"] }, {}],
  [
    "sends only the edited fields",
    { ...initial, title: "Dune Messiah", genres: ["scifi", "classic"] },
    { title: "Dune Messiah", genres: ["scifi", "classic"] },
  ],
  ["sends null for a cleared text input", { ...initial, isbn: "" }, { isbn: null }],
  ["sends null for a field set to undefined", { ...initial, isbn: undefined }, { isbn: null }],
  ["omits a field that was empty and still is", { ...initial, releaseDate: undefined }, {}],
  ["sends an emptied list as an empty list", { ...initial, genres: [] }, { genres: [] }],
]

for (const [name, current, expected] of cases) {
  void test(name, () => assert.deepEqual(changedFields(initial, current), expected))
}

void test("omits a null field left as an empty text input", () =>
  assert.deepEqual(changedFields({ ...initial, isbn: null }, { ...initial, isbn: "" }), {}))
