import { isValue } from "./values.js";

export function DataItem(item) {
  return { date: item.date, location: item.location, value: item.value };
}

export function Dataset(item) {
  let set = { label: item.label, data: [DataItem(item)] };
  if (isValue(item.group)) set.group = item.group;
  return set;
}

export function toDataset(data) {
  let datasets = [],
    item,
    set,
    datum;

  for (let i = 0; i < data.length; i++) {
    item = data[i];
    set = datasets.find((d) => d.label === item.label);

    if (set) {
      datum = set.data.find(
        (d) => d.date === item.date && d.location === item.location
      );

      datum ? (datum.value += item.value) : set.data.push(DataItem(item));
    } else {
      datasets.push(Dataset(item));
    }
  }

  return datasets;
}
