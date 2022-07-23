import * as d3 from "d3-time-format";

const MAX_FILENAME_LENGTH_OS = 255;

const MAX_FILENAME_LENGTH = 120;

const separator = " ";

const formatTime = d3.timeFormat("%Y-%m-%d" + separator + "%H-%M-%S");

/**
 * Removes invalid characters of filenames.
 * @param {string} filename The filename to make safe
 * @returns {string} A safe-to-use filename
 */
function safe(name) {
  return name.split(` `).join(`-`).split(`/`).join(`-`).split(`:`).join(`-`);
}

/**
 * The default filename creator.
 * @param {*} dc The data controller
 * @param {*} data The data
 * @param {*} extension An optional extension
 * @param {*} suf An optional suffix
 * @returns
 */
export const FILENAME_GENERATOR = function (dc, data, extension, suf) {
  let trimmed = data.labels
    .map(safe)
    .join(separator)
    .substring(0, MAX_FILENAME_LENGTH);

  let labelsCount = data.labels.length;
  let groupsCount = data.groups.length;
  let dateString = formatTime(new Date());

  let downloadFilePrefix = window.lotivis.config.downloadFilePrefix || "ltv";

  let name = [
    downloadFilePrefix,
    trimmed,
    labelsCount ? labelsCount + "L" : null,
    groupsCount ? groupsCount + "S" : null,
    dateString,
    // Math.random().toString(36).substring(2, 8), // random
    suf,
  ].join(separator);

  if (extension) name = name + prefix(extension, ".");

  return name;
};
