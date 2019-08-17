import attempt from 'attempt-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
import all from 'array-all-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';

const nf = [].filter;
const nativeFilter = typeof nf === 'function' && methodize(nf);

const test1 = function test1() {
  let spy = 0;
  const res = attempt(function attemptee() {
    return nativeFilter([1, 2], function spyAdd1(item) {
      spy += item;

      return false;
    });
  });

  return res.threw === false && res.value && res.value.length === 0 && spy === 3;
};

const test2 = function test2() {
  let spy = '';
  const res = attempt(function attemptee() {
    return nativeFilter(toObject('abc'), function spyAdd2(item, index) {
      spy += item;

      return index === 1;
    });
  });

  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 'b' && spy === 'abc';
};

const test3 = function test3() {
  let spy = 0;
  const res = attempt(function attemptee() {
    const args = (function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    })(1, 2, 3);

    return nativeFilter(args, function spyAdd3(item, index) {
      spy += item;

      return index === 2;
    });
  });

  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 3 && spy === 6;
};

const test4 = function test4() {
  let spy = 0;
  const res = attempt(function attemptee() {
    return nativeFilter({0: 1, 1: 2, 3: 3, 4: 4, length: 4}, function spyAdd4(item) {
      spy += item;

      return false;
    });
  });

  return res.threw === false && res.value && res.value.length === 0 && spy === 6;
};

const getTest5Result = function getTest5Result(args) {
  const [res, div, spy] = args;

  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === div && spy === div;
};

const doc = typeof document !== 'undefined' && document;

const test5 = function test5() {
  if (doc) {
    let spy = null;
    const fragment = doc.createDocumentFragment();
    const div = doc.createElement('div');
    fragment.appendChild(div);
    const res = attempt(function attemptee() {
      return nativeFilter(fragment.childNodes, function spyAssign(item) {
        spy = item;

        return item;
      });
    });

    return getTest5Result([res, div, spy]);
  }

  return true;
};

const isStrict = (function returnIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return toBoolean(this) === false;
})();

const test6 = function test6() {
  if (isStrict) {
    let spy = null;

    const testThis = function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    const res = attempt(function attemptee() {
      return nativeFilter([1], testThis, 'x');
    });

    return res.threw === false && res.value && res.value.length === 0 && spy === true;
  }

  return true;
};

const test7 = function test7() {
  const spy = {};
  const fn =
    'return nativeFilter("foo", function (_, __, context) {' +
    'if (castBoolean(context) === false || typeof context !== "object") {' +
    'spy.value = true;}});';

  const res = attempt(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeFilter', 'spy', 'castBoolean', fn)(nativeFilter, spy, toBoolean);
  });

  return res.threw === false && res.value && res.value.length === 0 && spy.value !== true;
};

const isWorking = toBoolean(nativeFilter) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

const patchedFilter = function filter(array, callBack /* , thisArg */) {
  /* eslint-disable-next-line prefer-rest-params, */
  return nativeFilter(requireObjectCoercible(array), assertIsFunction(callBack), arguments[2]);
};

export const implementation = function filter(array, callBack /* , thisArg */) {
  const object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);

  const result = [];

  const predicate = function predicate() {
    /* eslint-disable-next-line prefer-rest-params */
    const i = arguments[1];

    /* eslint-disable-next-line prefer-rest-params */
    if (i in arguments[2]) {
      /* eslint-disable-next-line prefer-rest-params */
      const item = arguments[0];

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
const $filter = isWorking ? patchedFilter : implementation;

export default $filter;
