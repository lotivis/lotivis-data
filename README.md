# lotivis-data [![Node.js CI](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/lotivis-data/actions/workflows/node.js.yml)

Data controller for lotivis.js.

```js
let data = [
  { label: "label-1", location: "paris", date: "1999-01-01", value: 1 },
  { label: "label-1", location: "paris", date: "1999-01-02", value: 2 },
  { label: "label-1", location: "berlin", date: "1999-01-03", value: 3 },
];

let dataController = lotivis.dataController(data);

// append data controller to charts ...
```

## Installing

If you use npm, `npm install lotivis-data`. You can also download the [latest realease on GitHub](https://github.com/lukasdanckwerth/lotivis-data/releases/latest). For using in browsers, you can load the UMD bundle from an npm-based CDN such as jsDelivr.

```html
<script src="https://cdn.jsdelivr.net/..."></script>
<script>

let dataController = lotivis.dataController();

</script>

```

## API Reference

#### dataController.**[id](./src/controller.js)**()

Returns the controllers id.

#### dataController.**[data](./src/controller.js)**(_)

Gets or sets the controllers data.

#### dataController.**[snapshot](./src/controller.js)**()

Returns the current snapshot from the filtered data.

Call with specifying a `name` will return the corresponding array.

#### dataController.**[onFilterWillChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for `filter-will-change` events.

#### dataController.**[onFilterDidChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for `filter-did-change` events.

#### dataController.**[onDataWillChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for `data-will-change` events.

#### dataController.**[onDataDidChange](./src/controller.js)**(name, callback)

Adds a listener with the passed name for `data-did-change` events.

#### dataController.**[removeAllListeners](./src/controller.js)**()

Removes all callbacks.

#### dataController.**[filters](./src/controller.js)**(name)

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

#### dataController.**[hasFilters](./src/controller.js)**(name?)

Returns a Boolean value indicating whether the controller contains any filters.

```js
var anyFilters = dataController.hasFilters();

var dateFilters = dataController.hasFilters("dates");
```

#### dataController.**[clearFilters](./src/controller.js)**(sender, name?)

Clears the filters of the controller.

```js
// clear all filters
dataController.clearFilters(someChart);

// clear date filters
dataController.clearFilters(someChart, "dates");
```

#### dataController.**[isFilter](./src/controller.js)**(name, item)

Returns a Boolean value indicating whether the specified item is included in the specified filters list.

#### dataController.**[addFilter](./src/controller.js)**(name, item, sender)

Adds the specified `item` to the specified filters list. 

#### dataController.**[removeFilter](./src/controller.js)**(name, item, sender)

Removes the specified `item` from the collection of filters with the specified `name`.

#### dataController.**[toggleFilter](./src/controller.js)**(name, item, sender)

Toggles the filtered state of the passed item in the collection of filters with the passed name.

#### dataController.**[filename](./src/controller.js)**(extension, prefix)

Generates and returns a filename from the data with the passed `extension` and `prefix`.

### Data

#### data.**[sum](./src/controller.js)**

Holds the sum of all values.

#### data.**[max](./src/controller.js)**

Holds the maximum value.

#### data.**[min](./src/controller.js)**

Holds the minimum value.

#### data.**[labels](./src/controller.js)**

Holds an array of all labels found in the data.

#### data.**[locations](./src/controller.js)**

Holds an array of all locations found in the data.

#### data.**[dates](./src/controller.js)**

Holds an array of all dates found in the data.

#### data.**[groups](./src/controller.js)**

Holds an array of all groups found in the data.

#### data.**[byLabel](./src/controller.js)**

Holds an [InternMap](https://github.com/mbostock/internmap) mapping label to data.

#### data.**[byLocation](./src/controller.js)**

Holds an [InternMap](https://github.com/mbostock/internmap) mapping location to data.

#### data.**[byDate](./src/controller.js)**

Holds an [InternMap](https://github.com/mbostock/internmap) mapping date to data.

#### data.**[byGroup](./src/controller.js)**

Holds an [InternMap](https://github.com/mbostock/internmap) mapping group to data.

#### data.**[filterValid](./src/controller.js)**()

Returns an array containing only data with valid values.

#### data.**[dataByLabel](./src/controller.js)**(label)

Returns an array containing only data for the specified `label`.

#### data.**[dataByLocation](./src/controller.js)**(location)

Returns an array containing only data for the specified `location`.

#### data.**[dataByDate](./src/controller.js)**(date)

Returns an array containing only data for the specified `date`.

#### data.**[dataByGroup](./src/controller.js)**(group)

Returns an array containing only data for the specified `group`.

#### data.**[sumOfLabel](./src/controller.js)**(label)

Returns the sum of data for the specified `label`.

#### data.**[sumOfLocation](./src/controller.js)**(location)

Returns the sum of data for the specified `location`.

#### data.**[sumOfDate](./src/controller.js)**(date)

Returns the sum of data for the specified `date`.

#### data.**[sumOfGroup](./src/controller.js)**(group)

Returns the sum of data for the specified `group`.

### Events

#### Events.**[disp](./src/events.js)**()

The static dispatch object.

#### Events.**[on](./src/events.js)**(type, callback)

 Adds the given `callback` for the given `type`. 

#### Events.**[call](./src/events.js)**(type, sender, ...params)

Calls the `callback` for the given `type` with the given `sender` and `params`.

## Development

```bash
# build module
yarn build

# develop module
yarn build:watch
```