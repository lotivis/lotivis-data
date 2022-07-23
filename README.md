# lotivis-data [![Node.js CI](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml)

Data controller for lotivis.js.

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

Returns the controllers id.

### dataController.**[data](./src/controller.js)**(_)

Gets or sets the controllers data.

### dataController.**[snapshot](./src/controller.js)**()

Returns the current snapshot from the filtered data.

Call with specifying a `name` will return the corresponding array.

### dataController.**[onFilter](./src/controller.js)**(name, callback)

Adds a listener with the passed name for filter changes.

### dataController.**[addFilterWillChangeListener](./src/controller.js)**(name, callback)

Adds a listener with the passed name for `filter-will-change` events.

### dataController.**[onChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for filter changes.

### dataController.**[removeAllListeners](./src/controller.js)**()

Removes all callbacks.

### dataController.**[filtersDidChange](./src/controller.js)**()

Calls all listeners for `"filter"`.

### dataController.**[filters](./src/controller.js)**(name)

Gets the controllers filters. Calling without specifying a `name` will return the following presented filters object.
```js
// available filters
{
    labels: [],
    locations: [],
    dates: [],
    groups: []
}
```

### dataController.**[hasFilters](./src/controller.js)**(name?)

Returns a Boolean value indicating whether the controller contains any filters.

```js
var anyFilters = dataController.hasFilters();

var dateFilters = dataController.hasFilters("dates");
```

### dataController.**[clearFilters](./src/controller.js)**(sender, name?)

Clears the filters of the controller.

```js
// clear all filters
dataController.clearFilters(someChart);

// clear date filters
dataController.clearFilters(someChart, "dates");
```

### dataController.**[isFilter](./src/controller.js)**(name, item)

Returns a Boolean value indicating whether the specified item is included in the specified filters list.

### dataController.**[addFilter](./src/controller.js)**(name, item, sender)

Adds the specified `item` to the specified filters list. 

### dataController.**[removeFilter](./src/controller.js)**(name, item, sender)

Removes the specified `item` from the collection of filters with the specified `name`.

### dataController.**[toggleFilter](./src/controller.js)**(name, item, sender)

Toggles the filtered state of the passed item in the collection of filters with the passed name.

### dataController.**[filename](./src/controller.js)**(extension, prefix)

Generates and returns a filename from the data with the passed `extension` and `prefix`.

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