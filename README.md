# lotivis-data

## Functions

### DataController

|Function|Description|
|-|-|
|`id()`| Returns the id of the controller. |
|`data(_)`| Gets or sets the controllers data. |
|`snapshot()`| Returns the current snapshot from the filtered data. |
|`filters(_)`| Gets or sets the controllers filters. |

### `Events`

|Function|Description|
|-|-|
|`Events.disp`| The static dispatch object. |
|`Events.on(type, callback)`| Adds the given `callback` for the given `type`. |
|`Events.call(type, sender, ...params)`| Calls the `callback` for the given `type` with the given `sender` and `params`. |
