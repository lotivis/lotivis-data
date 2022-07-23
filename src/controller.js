import * as d3 from "d3-array";
import { dispatch as d3Dispatch } from "d3-dispatch";
import { FILENAME_GENERATOR } from "./filename.js";

function prefix(src, pre) {
  return (src = "" + src), src.startsWith(pre || "") ? src : pre + src;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function exposeData(data) {
  data.sum = d3.sum(data, (d) => d.value);
  data.max = d3.max(data, (d) => d.value);
  data.min = d3.min(data, (d) => d.value);

  // relations
  data.byLabel = d3.group(data, (d) => d.label);
  data.byLocation = d3.group(data, (d) => d.location);
  data.byDate = d3.group(data, (d) => d.date);
  data.byGroup = d3.group(data, (d) => d.group || d.label);

  // meta
  data.labels = Array.from(data.byLabel.keys());
  data.groups = Array.from(data.byGroup.keys());
  data.locations = Array.from(data.byLocation.keys());
  data.dates = Array.from(data.byDate.keys());

  data.filterValid = () => data.filter((d) => d.value);

  data.dataByLabel = (label) => data.filter((d) => d.label === label);
  data.dataByLocation = (loc) => data.filter((d) => d.location === loc);
  data.dataByDate = (date) => data.filter((d) => d.date === date);
  data.dataByGroup = (group) => data.filter((d) => d.group === group);

  data.sumOfLabel = (label) => d3.sum(data.dataByLabel(label), (d) => d.value);
  data.sumOfLocation = (l) => d3.sum(data.dataByLocation(l), (d) => d.value);
  data.sumOfDate = (date) => d3.sum(data.dataByDate(date), (d) => d.value);
  data.sumOfGroup = (group) => d3.sum(data.dataByGroup(group), (d) => d.value);

  return data;
}

export function dataController(data) {
  return new DataController(data);
}

export class DataController {
  constructor(data = []) {
    if (!Array.isArray(data)) throw new Error("data not an array.");

    // private

    let attr = {
      id: "dc-" + new Date().getTime(),

      data: data,

      internalData: exposeData(clone(data)),

      snapshot: [],

      internalSnapshot: [],

      filters: { labels: [], locations: [], dates: [], groups: [] },

      disp: d3Dispatch(
        "filter-will-change",
        "filter-did-change",
        "data-will-change",
        "data-did-change"
      ),
    };

    function calculateSnapshot() {
      let f = attr.filters;
      attr.snapshot = d3.filter(attr.data, (d) => {
        return !(
          f.locations.indexOf(d.location) !== -1 ||
          f.dates.indexOf(d.date) !== -1 ||
          f.labels.indexOf(d.label) !== -1 ||
          f.groups.indexOf(d.group) !== -1
        );
      });
      attr.internalSnapshot = exposeData(clone(attr.snapshot));
    }

    calculateSnapshot();

    // public

    this.id = function () {
      return attr.id;
    };

    this.data = function (_data, sender = null) {
      if (!arguments.length) return attr.internalData;
      attr.disp.call("data-will-change", this, sender);
      attr.data = _data;
      attr.internalData = exposeData(clone(_data));
      calculateSnapshot();
      attr.disp.call("data-did-change", this, sender);
      return this;
    };

    this.snapshot = function (_) {
      return attr.internalSnapshot;
    };

    // listeners

    this.onFilterWillChange = function (name, callback) {
      return attr.disp.on(prefix(name, "filter-will-change"), callback), this;
    };

    this.onFilterDidChange = function (name, callback) {
      return attr.disp.on(prefix(name, "filter-did-change"), callback), this;
    };

    this.onDataWillChange = function (name, callback) {
      return attr.disp.on(prefix(name, "data-will-change"), callback), this;
    };

    this.onDataDidChange = function (name, callback) {
      return attr.disp.on(prefix(name, "data-did-change"), callback), this;
    };

    this.removeAllListeners = function () {
      return (attr.disp = d3Dispatch("filter", "change")), this;
    };

    this.filters = function (name) {
      if (!arguments.length) return attr.filters;
      if (!attr.filters[name]) throw new Error("invalid filter name: " + name);
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
      if (sender && name) {
        if (!this.hasFilters(name)) return;
        attr.disp.call("filter-will-change", this, sender, name, "clear");
        attr.filters[name] = [];
        calculateSnapshot();
        attr.disp.call("filter-did-change", this, sender, name, "clear");
      } else if (sender) {
        if (!this.hasFilters()) return;
        attr.disp.call("filter-will-change", this, sender, "all", "clear");
        attr.filters = { labels: [], locations: [], dates: [], groups: [] };
        attr.snapshot = attr.data;
        attr.internalSnapshot = attr.internalData;
        attr.disp.call("filter-did-change", this, sender, "all", "clear");
      }
    };

    this.isFilter = function (name, item) {
      return this.filters(name).indexOf(item) !== -1;
    };

    this.addFilter = function (name, item, sender) {
      if (!sender) throw new Error("missing sender");
      if (this.isFilter(name, item)) return;
      attr.disp.call("filter-will-change", this, sender, name, "add", item);
      this.filters(name).add(item);
      calculateSnapshot();
      attr.disp.call("filter-did-change", this, sender, name, "add", item);
    };

    this.removeFilter = function (name, item, sender) {
      if (!sender) throw new Error("missing sender");
      if (!this.isFilter(name, item)) return;
      attr.disp.call("filter-will-change", this, sender, name, "remove", item);
      this.filters(name).remove(item);
      calculateSnapshot();
      attr.disp.call("filter-did-change", this, sender, name, "remove", item);
    };

    this.toggleFilter = function (name, item, sender) {
      return this.isFilter(name, item)
        ? this.removeFilter(name, item, sender)
        : this.addFilter(name, item, sender);
    };

    this.filename = function (extension, prefix) {
      return FILENAME_GENERATOR(this, this.data(), extension, prefix);
    };

    return this;
  }
}

Array.prototype.add = function (item) {
  return this.indexOf(item) === -1 ? this.push(item) : false;
};

Array.prototype.remove = function (item) {
  let i = this.indexOf(item);
  return i !== -1 ? this.splice(i, 1) : false;
};
