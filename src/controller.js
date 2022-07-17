import * as d3 from "d3";
import { attributable } from "./attributable.js";
import { FILENAME_GENERATOR } from "./filename.js";
import { Data } from "./data.js";
import { Events } from "./events.js";

function prefix(src, pre) {
  return (src = "" + src), src.startsWith(pre || "") ? src : pre + src;
}

export function dataController(data) {
  return new DataController(data);
}

export function flatDataset(d) {
  if (Array.isArray(d)) {
    throw new Error("expecting object. found array");
  }

  if (!d || !d.data) {
    throw new Error("dataset has no data");
  }

  return d.data.map((i) => {
    return {
      label: d.label,
      group: d.group,
      location: i.location,
      date: i.date,
      value: i.value,
    };
  });
}

/**
 * Flattens the given datasets.
 * @param {*} ds
 * @returns {Array} The flat version
 */
export function flatDatasets(ds) {
  return ds.reduce((memo, d) => memo.concat(flatDataset(d)), []);
}

export class DataController {
  /**
   * Creates a new DataController with the passed data.
   *
   * @param {*} data
   * @returns
   */
  constructor(data) {
    if (!Array.isArray(data)) throw new Error("data not an array.");

    // create data model
    data = Data(data);

    let id = "dc-" + new Date().getTime(),
      disp = d3.dispatch("filter", "data"),
      attr = {
        id: id,

        // the controlled data
        data: data,

        // the controlled filtered data
        snapshot: data,

        // the applied filters
        filters: { labels: [], locations: [], dates: [], groups: [] },

        // a filename generator
        filenameGenerator: FILENAME_GENERATOR,

        // dateAccess: DEFAULT_DATE_ORDINATOR,
      };

    // expose atrributes as getter-setter functions
    attributable(this, attr);

    this.id = id;
    attr.id = id;

    this.id = function () {
      return id;
    };

    /**
     *
     * @returns
     */
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
      attr.snapshot = Data(snapshot);

      return attr.snapshot;
    }

    // listeners

    /**
     * Adds a listener with the passed name for filter changes.
     * @param {*} name The name of the listener
     * @param {*} callback The callback handler
     * @returns {this} The controller iteself
     */
    this.onFilter = function (name, callback) {
      return disp.on(prefix(name, "filter."), callback), this;
    };

    /**
     * Adds a listener with the passed name for data changes.
     * @param {*} name The name of the listener
     * @param {*} callback The callback handler
     * @returns {this} The controller iteself
     */
    this.onChange = function (name, callback) {
      return disp.on(prefix(name, "data."), callback), this;
    };

    /**
     * Removes all callbacks from the dispatcher.
     * @returns {this} The chart itself
     */
    this.removeAllListeners = function () {
      return (disp = d3.dispatch("filter", "change")), this;
    };

    // # FILTERS

    this.filtersDidChange = function (name, action, item, sender) {
      if (!sender) throw new Error("missing sender");
      calculateSnapshot();
      disp.call("filter", this, sender, name, action, item);
      return this;
    };

    /**
     * Returns either the filters object containing all filter list if no
     * argument is passed, or the filter list for the passed name.
     * @param {*} name The name of the filter list
     * @returns The filters object or a single list
     */
    this.filters = function (name) {
      if (!arguments.length) return attr.filters;
      if (!attr.filters[name]) throw new Error("invalid name: " + name);
      return attr.filters[name];
    };

    /**
     *
     * @param {*} name
     * @returns
     */
    this.hasFilters = function (name) {
      return arguments.length
        ? this.filters(name).length > 0
        : this.hasFilters("labels") ||
            this.hasFilters("groups") ||
            this.hasFilters("locations") ||
            this.hasFilters("dates");
    };

    this.clear = function (name, sender) {
      if (this.filters(name).length === 0)
        return console.log("filter already empty", name);
      attr.filters[name] = [];
      return this.filtersDidChange(name, "clear", null, sender);
    };

    this.clearAll = function (sender) {
      if (this.hasFilters()) {
        attr.filters = {
          labels: [],
          locations: [],
          dates: [],
          groups: [],
        };
        this.filtersDidChange("all", "clear", null, sender);
      }
    };

    /**
     * Returns true if the filters with the passed name contains the passed item.
     * @param {String} name The name of the filter
     * @param {String} item The item to check if it is filtered.
     * @returns {Boolean} Whether the item is filtered
     */
    this.isFilter = function (name, item) {
      return this.filters(name).indexOf(item) !== -1;
    };

    /**
     * Adds the passed item to the collection of filters with the passed name.
     * @param {*} name The name of the filter
     * @param {*} item The item to check if it is filtered
     * @param {*} sender The sender who made this action
     */
    this.addFilter = function (name, item, sender) {
      Events.call("filter-will-change", sender, name, "add", item);
      if (!this.filters(name).add(item)) return;
      Events.call("filter-did-change", sender, name, "add", item);

      this.filtersDidChange(name, "add", item, sender);
    };

    /**
     * Removes the passed item from the collection of filters with the passed name.
     * @param {*} name The name of the filter
     * @param {*} item The item to remove
     * @param {*} sender The sender who made this action
     */
    this.removeFilter = function (name, item, sender) {
      if (this.filters(name).remove(item))
        this.filtersDidChange(name, "remove", item, sender);
    };

    /**
     * Toggles the filtered state of the passed item in the collection of filters
     * with the passed name.
     * @param {*} name The name of the filter
     * @param {*} item The item to toggle
     * @param {*} sender The sender who made this action
     */
    this.toggleFilter = function (name, item, sender) {
      this.isFilter(name, item)
        ? this.removeFilter(name, item, sender)
        : this.addFilter(name, item, sender);
    };

    /**
     * Returns the data applying the filters.
     * @returns
     */
    this.filteredData = function () {
      let f = attr.filters;
      return attr.data.filter(
        (d) =>
          !(
            f.locations.indexOf(d.location) !== -1 ||
            f.dates.indexOf(d.date) !== -1 ||
            f.labels.indexOf(d.label) !== -1 ||
            f.groups.indexOf(d.group) !== -1
          )
      );
    };

    /**
     * Gets or sets the data.
     * @param {*} _data
     * @returns {data|this}
     */
    this.data = function (_data) {
      if (!arguments.length) return attr.data;
      attr.data = Data(_data);
      this.filtersDidChange();
      return this;
    };

    /**
     * Gets or sets the snapshot attribute. When getting and snapshot is null
     * will fallback on data attribute.
     * @param {*} _
     * @returns {snapshot|this}
     */
    this.snapshot = function (_) {
      return arguments.length
        ? ((attr.snapshot = _), this)
        : attr.snapshot || attr.data;
    };

    /**
     * Generates and returns a filename from the data with the passed
     * extension and prefix.
     * @param {string} ext The extension of the filename
     * @param {string} prefix An optional prefix for the filename
     * @returns The generated filename
     */
    this.filename = function (extension, prefix) {
      return this.filenameGenerator()(this, this.data(), extension, prefix);
    };

    // this.datatext = function (id = "ltv-data") {
    //   if (!document.getElementById(id)) return null;
    //   return datatext()
    //     .selector("#" + id)
    //     .dataController(this)
    //     .run();
    // };

    // initialize
    calculateSnapshot();

    // debug
    console.log("data controller", attr.id, this);
    // data_preview(this);

    return this;
  }

  /**
   * Creates and returns a new datatext with the passed selector. Also sets
   * the DataController to the receiver.
   *
   * @param {String} selector The selctor for the datatext
   * @returns {datatext} A newly created datatext
   */
  datatext(selector = "ltv-data") {
    return datatext().dataController(this).selector(selector);
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

  // sum() {
  //   return d3.sum(this.data, (d) => d.value);
  // }

  // max() {
  //   return d3.max(this.data, (item) => item.value);
  // }

  // min() {
  //   return d3.min(this.data, (item) => item.value);
  // }
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
