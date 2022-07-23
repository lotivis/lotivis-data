import { default as assert } from "assert";
import { dataController } from "../src/index.js";

let data = [
  { label: "label-1", location: "paris", date: "1999-01-01", value: 1 },
  { label: "label-1", location: "paris", date: "1999-01-02", value: 2 },
  { label: "label-1", location: "berlin", date: "1999-01-03", value: 3 },
];

it("dataController(_) can create valid empty data controller", () => {
  let dc = dataController();
  assert.ok(Array.isArray(dc.data()));
  assert.strictEqual(dc.data().length, 0);
});

it("dataController(_) can create data controller with data", () => {
  let dc = dataController(data);
  assert.ok(Array.isArray(dc.data()));
  assert.strictEqual(dc.data().length, 3);
});
