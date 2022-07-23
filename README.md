# lotivis-data [![Node.js CI](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml)

## Installing

If you use npm, `npm install lotivis-data`. You can also download the [latest realease on GitHub](https://github.com/lukasdanckwerth/lotivis-data/releases/latest). For using in browsers, you can load the UMD bundle from an npm-based CDN such as jsDelivr.

```html
<script src="https://cdn.jsdelivr.net/..."></script>
<script>

// ...

</script>

```

## API Reference

### lotivis.**[id](./src/parse.js)**()

### DataController

|Function|Description|
|-|-|
|`id()`| Returns the id of the controller. |
|`data(_)`| Gets or sets the controllers data. |
|`snapshot()`| Returns the current snapshot from the filtered data. |
|`filters(_)`| Gets or sets the controllers filters. |

#### Listen to events

|Function|Description|
|-|-|
|`onFilter(name, callback)`| Adds a listener with the passed name for filter changes. |
|`onChange(name, callback)`| Adds a listener with the passed name for data changes. |
|`removeAllListeners()`| ARemoves all callbacks. |

### `Events`

|Function|Description|
|-|-|
|`Events.disp`| The static dispatch object. |
|`Events.on(type, callback)`| Adds the given `callback` for the given `type`. |
|`Events.call(type, sender, ...params)`| Calls the `callback` for the given `type` with the given `sender` and `params`. |

## Development

```bash
# build module
yarn build

# develop module
yarn build:watch
```