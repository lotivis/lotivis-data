export function isValue(value) {
  return Boolean(value || value === 0);
}

export function isString(value) {
  return typeof value === "string";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isEmpty(value) {
  return value ? value.length === 0 : false;
}

export function copy(object) {
  return JSON.parse(JSON.stringify(object));
}
