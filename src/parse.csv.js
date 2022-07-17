import * as d3 from "d3";
import { DataController } from "./controller.js";

export const DEFAULT_COLUMNS = ["label", "location", "date", "value", "group"];

export const DEFAULT_ROW = (d, i) => {
  label: d[0];
  location: d[1];
  date: d[2];
  value: d[3];
  group: d[4];
};

export function csvParse(text) {
  return new DataController(d3.csvParse(text, d3.autoType));
}

export function csvParseRows(csv, row = DEFAULT_ROW) {
  return new DataController(d3.csvParseRows(csv, row));
}

/** Renders given data to CSV with headlines. */
export function csvFormat(data, columns = DEFAULT_COLUMNS) {
  console.log("dv.data", data);
  return d3.csvFormat(data.data ? data.data() : data, columns);
}

/** Renders given data to CSV with headlines. */
export function csvFormatRows(data, columns = DEFAULT_COLUMNS) {
  return d3.csvFormatBody(data.data ? data.data() : data, columns);
}

export async function csv(path) {
  return fetch(path)
    .then((res) => res.text())
    .then((csv) => csvParse(csv));
}

export async function csvRows(path, row = DEFAULT_ROW) {
  return fetch(path)
    .then((res) => res.text())
    .then((csv) => csvParseRows(csv, row));
}
