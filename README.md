<a
  href="https://travis-ci.org/Xotic750/array-filter-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/array-filter-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/array-filter-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-filter-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/array-filter-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-filter-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/array-filter-x"
  title="npm version">
<img src="https://badge.fury.io/js/array-filter-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/array-filter-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/array-filter-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/array-filter-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/array-filter-x?branch=master"
  alt="bettercodehub score" height="18">
</a>

<a name="module_array-filter-x"></a>

## array-filter-x

Creates an array with all elements that pass the test by the provided function.

<a name="exp_module_array-filter-x--module.exports"></a>

### `module.exports` ⇒ <code>array</code> ⏏

This method creates a new array with all elements that pass the test
implemented by the provided function.

**Kind**: Exported member  
**Returns**: <code>array</code> - A new array with the elements that pass the test.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.
- <code>TypeError</code> If callBack is not a function.

| Param     | Type                  | Description                                    |
| --------- | --------------------- | ---------------------------------------------- |
| array     | <code>array</code>    | The array to iterate over.                     |
| callBack  | <code>function</code> | Function is a predicate, to test each element. |
| [thisArg] | <code>\*</code>       | Value to use as this when executing callback.  |

**Example**

```js
import filter from 'array-filter-x';

function isBigEnough(value) {
  return value >= 10;
}

console.log(filter([12, 5, 8, 130, 44], isBigEnough)); // filtered is [12, 130, 44]
```
