import * as d3 from "d3";
import { DataUnqualifiedError } from "./data.unqalified.error.js";

export function Data(data) {
  if (!Array.isArray(data))
    throw new DataUnqualifiedError("not an array", data);

  // extremes
  data.sum = d3.sum(data, (d) => d.value);
  data.max = d3.max(data, (d) => d.value);
  data.min = d3.min(data, (d) => d.value);

  // relations
  data.byLabel = d3.group(data, (d) => d.label);
  data.byGroup = d3.group(data, (d) => d.group || d.label);
  data.byLocation = d3.group(data, (d) => d.location);
  data.byDate = d3.group(data, (d) => d.date);

  // meta
  data.labels = Array.from(data.byLabel.keys());
  data.groups = Array.from(data.byGroup.keys());
  data.locations = Array.from(data.byLocation.keys());
  data.dates = Array.from(data.byDate.keys());

  return data;
}
