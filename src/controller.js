import * as d3 from "d3-array";
import { dispatch as d3Dispatch } from "d3-dispatch";
import { FILENAME_GENERATOR } from "./filename.js";
import { Events } from "./events.js";

function prefix(src, pre) {
  return (src = "" + src), src.startsWith(pre || "") ? src : pre + src;
}

function exposeData(data) {
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

export function dataController(data) {
  return new DataController(data);
}

export class DataController {
  constructor(data = []) {
    if (!Array.isArray(data)) {
      throw new Error("data not an array.");
    }

    // private

    let attr = {
      id: "dc-" + new Date().getTime(),

      // the controlled data
      data: data,

      internalData: exposeData(JSON.parse(JSON.stringify(data))),

      // the controlled filtered data
      snapshot: [],

      internalSnapshot: [],

      // the applied filters
      filters: { labels: [], locations: [], dates: [], groups: [] },

      disp: d3Dispatch(
        "filter",
        "data",
        "filter-will-change",
        "filter-did-change",
        "data-will-change",
        "data-did-change"
      ),
    };

    function calculateSnapshot() {
      let f = attr.filters;
      let snapshot = d3.filter(attr.data, (d) => {
        return !(
          f.locations.indexOf(d.location) !== -1 ||
          f.dates.indexOf(d.date) !== -1 ||
          f.labels.indexOf(d.label) !== -1 ||
          f.groups.indexOf(d.group) !== -1
        );
      });
      attr.snapshot = exposeData(snapshot);

      return attr.snapshot;
    }

    // public

    this.id = function () {
      return attr.id;
    };

    this.snapshot = function (_) {
      return attr.snapshot;
    };

    this.data = function (_data) {
      if (!arguments.length) return attr.data;
      attr.data = exposeData(_data);
      this.filtersDidChange();
      return this;
    };

    // listeners

    this.onFilter = function (name, callback) {
      return attr.disp.on(prefix(name, "filter."), callback), this;
    };

    this.addFilterWillChangeListener = function (name, callback) {
      return attr.disp.on(prefix(name, "filter-will-change"), callback), this;
    };

    this.onChange = function (name, callback) {
      return attr.disp.on(prefix(name, "data."), callback), this;
    };

    this.removeAllListeners = function () {
      return (attr.disp = d3Dispatch("filter", "change")), this;
    };

    this.filtersDidChange = function (name, action, item, sender) {
      if (!sender) throw new Error("missing sender");
      calculateSnapshot();
      attr.disp.call("filter", this, sender, name, action, item);
      return this;
    };

    this.filters = function (name) {
      if (!arguments.length) return attr.filters;
      if (!attr.filters[name]) throw new Error("invalid name: " + name);
      return attr.filters[name];
    };

    this.hasFilters = function (name) {
      return arguments.length
        ? this.filters(name).length > 0
        : this.filters("labels").length > 0 ||
            this.filters("dates").length > 0 ||
            this.filters("labels").length > 0 ||
            this.filters("groups").length > 0;
    };

    this.clearFilters = function (sender, name = null) {
      if (!sender) {
        return;
      }
      if (name) {
        if (this.filters(name).length === 0)
          return console.log("filter already empty", name);
        attr.filters[name] = [];
        return this.filtersDidChange(name, "clear", null, sender);
      } else {
        if (this.hasFilters()) {
          attr.filters = {
            labels: [],
            locations: [],
            dates: [],
            groups: [],
          };
          this.filtersDidChange("all", "clear", null, sender);
        }
      }
    };

    this.isFilter = function (name, item) {
      return this.filters(name).indexOf(item) !== -1;
    };

    this.addFilter = function (name, item, sender) {
      Events.call("filter-will-change", sender, name, "add", item);
      if (!this.filters(name).add(item)) return;
      Events.call("filter-did-change", sender, name, "add", item);

      this.filtersDidChange(name, "add", item, sender);
    };

    this.removeFilter = function (name, item, sender) {
      if (this.filters(name).remove(item))
        this.filtersDidChange(name, "remove", item, sender);
    };

    this.toggleFilter = function (name, item, sender) {
      return this.isFilter(name, item)
        ? this.removeFilter(name, item, sender)
        : this.addFilter(name, item, sender);
    };

    this.filename = function (extension, prefix) {
      return FILENAME_GENERATOR(this, this.data(), extension, prefix);
    };

    // initialize
    calculateSnapshot();

    return this;
  }

  /** Returns entries with valid value. */
  filterValid() {
    return this.data().filter((d) => d.value);
  }

  byLabel() {
    return d3.group(this.data(), (d) => d.label);
  }

  byGroup() {
    return d3.group(this.data(), (d) => d.group || d.label);
  }

  byLocation() {
    return d3.group(this.data(), (d) => d.location);
  }

  byDate() {
    return d3.group(this.data(), (d) => d.date);
  }

  labels() {
    return Array.from(this.byLabel().keys());
  }

  groups() {
    return Array.from(this.byGroup().keys());
  }

  locations() {
    return Array.from(this.byLocation().keys());
  }

  dates() {
    return Array.from(this.byDate().keys());
  }

  dataGroup(s) {
    return this.data().filter((d) => d.group === s);
  }

  dataLabel(l) {
    return this.data().filter((d) => d.label === l);
  }

  dataLocation(l) {
    return this.data().filter((d) => d.location === l);
  }

  dataDate(d) {
    return this.data().filter((d) => d.date === d);
  }

  sumOfGroup(s) {
    return d3.sum(this.dataGroup(s), (d) => d.value);
  }

  sumOfLabel(l) {
    return d3.sum(this.dataLabel(l), (d) => d.value);
  }

  sumOfLocation(l) {
    return d3.sum(this.dataLocation(l), (d) => d.value);
  }

  sumOfDate(d) {
    return d3.sum(this.dataDate(s), (d) => d.value);
  }
}

/**
 * Adds the item if it not already exists in the array.
 *
 * @param {*} item The item to add
 * @returns Whether the item was added
 */
Array.prototype.add = function (item) {
  return this.indexOf(item) === -1 ? this.push(item) : false;
};

/**
 * Removes the item.
 *
 * @param {*} item The item to remove
 * @returns Whether the given item was removed
 */
Array.prototype.remove = function (item) {
  let i = this.indexOf(item);
  return i !== -1 ? this.splice(i, 1) : false;
};
