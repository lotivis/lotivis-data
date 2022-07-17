import * as d3 from "d3";

/**
 * Events dispatch center.
 *
 * List of valid actions:
 *
 * - "filter"
 * - "data"
 * - "map-selection-will-change"
 * - "map-selection-did-change"
 */
export class Events {
  /**
   * Global dispatch object.
   */
  static disp = d3.dispatch(
    "filter",
    "data",
    "filter-will-change",
    "filter-did-change",
    "data-will-change",
    "data-did-change",
    "map-selection-will-change",
    "map-selection-did-change"
  );

  /**
   *
   * @param {String}  A specified event type.
   * @param {*} callback
   */
  static on(type, callback) {
    console.log("Events on", type);
    this.disp.on(type, callback);
  }

  /**
   * Invokes each registered callback for the specified type, passing the
   * callback the specified arguments, with `that` as the `this` context.
   *
   * @param type A specified event type.
   * @param sender The `this` context for the callback.
   * @param args Additional arguments to be passed to the callback.
   * @throws "unknown type" on unknown event type.
   */
  static call(type, sender, ...params) {
    console.log("Events call", type);
    this.disp.call(type, sender, ...params);
  }
}
