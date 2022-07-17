import { isFunction } from "./values.js";

/**
 *
 * @param {*} src
 * @param {*} attr
 * @returns
 */
export function attributable(src, attr) {
    // Iterate attr keys and create access function for each
    Object.keys(attr).forEach((key) => {
        // do not override existing functions
        if (src[key] && isFunction(src[key])) return;
        src[key] = function (_) {
            return arguments.length ? ((attr[key] = _), src) : attr[key];
        };
    });

    /**
     * Return the property for the given name if it exists, else
     * the given fallback value.
     *
     * @param {string} name The name of the requested property
     * @param {any} fb The fallback value
     *
     * @returns The property for the given name or the fallback.
     */
    attr.get = function (name, fb) {
        return attr.hasOwnProperty(name) ? attr[name] || fb : fb;
    };

    return src;
}
