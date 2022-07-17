import * as d3 from "d3";
import { DataController } from "./controller.js";
import { flatDatasets } from "./json.flat.js";
import { DataUnqualifiedError } from "./data.unqalified.error.js";

export function jsonParse(d) {
  return parseDatasets(Array.isArray(d) ? d : [d]);
}

export function jsonParseHierarchical(d) {
  return parseDatasets(Array.isArray(d) ? d : [d]);
}

export function jsonParseDatasets(d) {
  return parseDatasets(Array.isArray(d) ? d : [d]);
}

export function parseDataset(d) {
  return parseDatasets(Array.isArray(d) ? d : [d]);
}

export function parseDatasets(d) {
  return new DataController(flatDatasets(d));
}

export function json(path) {
  return d3.json(path).then((json) => {
    if (!Array.isArray(json)) throw new DataUnqualifiedError();
    return new DataController(flatDatasets(json));
  });
}

export function jsonDatasets(path) {
  return json(path);
}

export function jsonFlat(path) {
  return d3.json(path).then((json) => {
    if (!Array.isArray(json)) throw new DataUnqualifiedError();
    return new DataController(json);
  });
}
