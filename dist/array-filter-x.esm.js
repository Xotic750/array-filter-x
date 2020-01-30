function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import attempt from 'attempt-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
import all from 'array-all-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';
var nf = [].filter;
var nativeFilter = typeof nf === 'function' && methodize(nf);

var test1 = function test1() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeFilter([1, 2], function spyAdd1(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 3;
};

var test2 = function test2() {
  var spy = '';
  var res = attempt(function attemptee() {
    return nativeFilter(toObject('abc'), function spyAdd2(item, index) {
      spy += item;
      return index === 1;
    });
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 'b' && spy === 'abc';
};

var test3 = function test3() {
  var spy = 0;
  var res = attempt(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeFilter(args, function spyAdd3(item, index) {
      spy += item;
      return index === 2;
    });
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 3 && spy === 6;
};

var test4 = function test4() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeFilter({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function spyAdd4(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 6;
};

var getTest5Result = function getTest5Result(args) {
  var _args = _slicedToArray(args, 3),
      res = _args[0],
      div = _args[1],
      spy = _args[2];

  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === div && spy === div;
};

var doc = typeof document !== 'undefined' && document;

var test5 = function test5() {
  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt(function attemptee() {
      return nativeFilter(fragment.childNodes, function spyAssign(item) {
        spy = item;
        return item;
      });
    });
    return getTest5Result([res, div, spy]);
  }

  return true;
};

var isStrict = function returnIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return toBoolean(this) === false;
}();

var test6 = function test6() {
  if (isStrict) {
    var spy = null;

    var testThis = function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    var res = attempt(function attemptee() {
      return nativeFilter([1], testThis, 'x');
    });
    return res.threw === false && res.value && res.value.length === 0 && spy === true;
  }

  return true;
};

var test7 = function test7() {
  var spy = {};
  var fn = 'return nativeFilter("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  var res = attempt(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeFilter', 'spy', 'castBoolean', fn)(nativeFilter, spy, toBoolean);
  });
  return res.threw === false && res.value && res.value.length === 0 && spy.value !== true;
};

var isWorking = toBoolean(nativeFilter) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

var patchedFilter = function filter(array, callBack
/* , thisArg */
) {
  /* eslint-disable-next-line prefer-rest-params, */
  return nativeFilter(requireObjectCoercible(array), assertIsFunction(callBack), arguments[2]);
};

export var implementation = function filter(array, callBack
/* , thisArg */
) {
  var object = toObject(array); // If no callback function or if callback is not a callable function

  assertIsFunction(callBack);
  var result = [];

  var predicate = function predicate() {
    /* eslint-disable-next-line prefer-rest-params */
    var i = arguments[1];
    /* eslint-disable-next-line prefer-rest-params */

    if (i in arguments[2]) {
      /* eslint-disable-next-line prefer-rest-params */
      var item = arguments[0];
      /* eslint-disable-next-line babel/no-invalid-this */

      if (call(callBack, this, [item, i, object])) {
        result[result.length] = item;
      }
    }
  };
  /* eslint-disable-next-line prefer-rest-params */


  all(object, predicate, arguments[2]);
  return result;
};
/**
 * This method creates a new array with all elements that pass the test
 * implemented by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function is a predicate, to test each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {Array} A new array with the elements that pass the test.
 */

var $filter = isWorking ? patchedFilter : implementation;
export default $filter;

//# sourceMappingURL=array-filter-x.esm.js.map