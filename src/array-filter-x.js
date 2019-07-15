import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';

/** @type {ArrayConstructor} */
const ArrayCtr = [].constructor;
/** @type {ObjectConstructor} */
const castObject = {}.constructor;
/** @type {BooleanConstructor} */
const castBoolean = true.constructor;
const nativFilter = typeof ArrayCtr.prototype.filter === 'function' && ArrayCtr.prototype.filter;

let isWorking;

if (nativFilter) {
  let spy = 0;
  let res = attempt.call([1, 2], nativFilter, (item) => {
    spy += item;

    return false;
  });

  isWorking = res.threw === false && res.value && res.value.length === 0 && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativFilter, (item, index) => {
      spy += item;

      return index === 1;
    });

    isWorking = res.threw === false && res.value && res.value.length === 1 && res.value[0] === 'b' && spy === 'abc';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })(1, 2, 3),
      nativFilter,
      (item, index) => {
        spy += item;

        return index === 2;
      },
    );

    isWorking = res.threw === false && res.value && res.value.length === 1 && res.value[0] === 3 && spy === 6;
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      {
        0: 1,
        1: 2,
        3: 3,
        4: 4,
        length: 4,
      },
      nativFilter,
      (item) => {
        spy += item;

        return false;
      },
    );

    isWorking = res.threw === false && res.value && res.value.length === 0 && spy === 6;
  }

  if (isWorking) {
    const doc = typeof document !== 'undefined' && document;

    if (doc) {
      spy = null;
      const fragment = doc.createDocumentFragment();
      const div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativFilter, (item) => {
        spy = item;

        return item;
      });

      isWorking = res.threw === false && res.value && res.value.length === 1 && res.value[0] === div && spy === div;
    }
  }

  if (isWorking) {
    const isStrict = (function returnIsStrict() {
      /* eslint-disable-next-line babel/no-invalid-this */
      return castBoolean(this) === false;
    })();

    if (isStrict) {
      spy = null;
      res = attempt.call(
        [1],
        nativFilter,
        () => {
          /* eslint-disable-next-line babel/no-invalid-this */
          spy = typeof this === 'string';
        },
        'x',
      );

      isWorking = res.threw === false && res.value && res.value.length === 0 && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    const fn = [
      'return nativFilter.call("foo", function (_, __, context) {',
      'if (castBoolean(context) === false || typeof context !== "object") {',
      'spy.value = true;}});',
    ].join('');

    /* eslint-disable-next-line no-new-func */
    res = attempt(Function('nativFilter', 'spy', 'castBoolean', fn), nativFilter, spy);

    isWorking = res.threw === false && res.value && res.value.length === 0 && spy.value !== true;
  }
}

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
let $filter;

if (nativFilter) {
  $filter = function filter(array, callBack /* , thisArg */) {
    const args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativFilter.apply(array, args);
  };
} else {
  $filter = function filter(array, callBack /* , thisArg */) {
    const object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);
    let thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    const noThis = typeof thisArg === 'undefined';
    const result = [];
    for (let i = 0; i < length; i += 1) {
      if (i in iterable) {
        const item = iterable[i];

        if (noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) {
          result[result.length] = item;
        }
      }
    }

    return result;
  };
}

const arrayFilter = $filter;

export default arrayFilter;
