# lotivis-data [![Node.js CI](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml)

## Installing

If you use npm, `npm install lotivis-data`. You can also download the [latest realease on GitHub](https://github.com/lukasdanckwerth/lotivis-data/releases/latest). For using in browsers, you can load the UMD bundle from an npm-based CDN such as jsDelivr.

```html
<script src="https://cdn.jsdelivr.net/..."></script>
<script>

let dataController = lotivis.dataController();

</script>

```

## API Reference

### dataController.**[id](./src/controller.js)**()

Returns the id of the controller.

### dataController.**[data](./src/controller.js)**(_)

Gets or sets the controllers data.

### dataController.**[snapshot](./src/controller.js)**()

Returns the current snapshot from the filtered data.

### dataController.**[filters](./src/controller.js)**(_)

Gets or sets the controllers filters.

### dataController.**[onFilter](./src/controller.js)**(name, callback)

Adds a listener with the passed name for filter changes.

### dataController.**[onChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for filter changes.

### dataController.**[removeAllListeners](./src/controller.js)**()

Removes all callbacks.

### Events.**[disp](./src/events.js)**()

The static dispatch object.

### Events.**[on](./src/events.js)**(type, callback)

 Adds the given `callback` for the given `type`. 

### Events.**[call](./src/events.js)**(type, sender, ...params)

Calls the `callback` for the given `type` with the given `sender` and `params`.

## Development

```bash
# build module
yarn build

# develop module
yarn build:watch
```