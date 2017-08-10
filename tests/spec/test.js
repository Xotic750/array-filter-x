'use strict';

var filter;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  filter = require('../../index.js');
} else {
  filter = returnExports;
}

// IE 6 - 8 have a bug where this returns false.
var canDistinguish = 0 in [void 0];
var undefinedIfNoSparseBug = canDistinguish ? void 0 : {
  valueOf: function () {
    return 0;
  }
};

var ifHasDenseUndefinedsIt = canDistinguish ? it : xit;

var createArrayLike = function (arr) {
  var o = {};
  arr.forEach(function (e, i) {
    o[i] = e;
  });

  o.length = arr.length;
  return o;
};

describe('filter', function () {
  var filteredArray;
  var testSubject;

  var callBack = function (o, i) {
    return i !== 3 && i !== 5;
  };

  beforeEach(function () {
    testSubject = [
      2,
      3,
      undefinedIfNoSparseBug,
      true,
      'hej',
      3,
      null,
      false,
      0
    ];

    delete testSubject[1];
    filteredArray = [
      2,
      undefinedIfNoSparseBug,
      'hej',
      null,
      false,
      0
    ];
  });

  it('is a function', function () {
    expect(typeof filter).toBe('function');
  });

  it('should throw when array is null or undefined', function () {
    expect(function () {
      filter();
    }).toThrow();

    expect(function () {
      filter(void 0);
    }).toThrow();

    expect(function () {
      filter(null);
    }).toThrow();
  });

  describe('Array object', function () {
    it('should call the callBack with the proper arguments', function () {
      var predicate = jasmine.createSpy('predicate');
      var arr = ['1'];
      filter(arr, predicate);
      expect(predicate).toHaveBeenCalledWith('1', 0, arr);
    });

    it('should not affect elements added to the array after it has begun', function () {
      var arr = [
        1,
        2,
        3
      ];

      var i = 0;
      filter(arr, function (a) {
        i += 1;
        if (i <= 4) {
          arr.push(a + 3);
        }

        return true;
      });

      expect(arr).toEqual([
        1,
        2,
        3,
        4,
        5,
        6
      ]);

      expect(i).toBe(3);
    });

    ifHasDenseUndefinedsIt('should skip unset values', function () {
      var passedValues = [];
      testSubject = [
        1,
        2,
        3,
        4
      ];

      delete testSubject[1];
      filter(testSubject, function (o, i) {
        passedValues[i] = o;
        return true;
      });

      expect(passedValues).toEqual(testSubject);
    });

    it('should pass the right context to the filter', function () {
      var passedValues = [];
      testSubject = [
        1,
        2,
        3,
        4
      ];

      delete testSubject[1];
      filter(testSubject, function (o, i) {
        // eslint-disable-next-line no-invalid-this
        this[i] = o;
        return true;
      }, passedValues);

      expect(passedValues).toEqual(testSubject);
    });

    it('should set the right context when given none', function () {
      var context;
      filter([1], function () {
        // eslint-disable-next-line no-invalid-this
        context = this;
      });

      expect(context).toBe(function () {
        // eslint-disable-next-line no-invalid-this
        return this;
      }.call());
    });

    it('should remove only the values for which the callBack returns false', function () {
      var result = filter(testSubject, callBack);
      expect(result).toEqual(filteredArray);
    });

    it('should leave the original array untouched', function () {
      var copy = testSubject.slice();
      filter(testSubject, callBack);
      expect(testSubject).toEqual(copy);
    });

    it('should not be affected by same-index mutation', function () {
      var results = filter([
        1,
        2,
        3
      ], function (value, index, array) {
        array[index] = 'a';
        return true;
      });

      expect(results).toEqual([
        1,
        2,
        3
      ]);
    });
  });

  describe('Array like', function () {
    var testObject;

    beforeEach(function () {
      testObject = createArrayLike(testSubject);
    });

    it('should call the predicate with the proper arguments', function () {
      var predicate = jasmine.createSpy('predicate');
      var arr = createArrayLike(['1']);
      filter(arr, predicate);
      expect(predicate).toHaveBeenCalledWith('1', 0, arr);
    });

    it('should not affect elements added to the array after it has begun', function () {
      var arr = createArrayLike([
        1,
        2,
        3
      ]);

      var i = 0;
      filter(arr, function (a) {
        i += 1;
        if (i <= 4) {
          arr[i + 2] = a + 3;
          arr.length += 1;
        }

        return true;
      });

      expect(Array.prototype.slice.call(arr)).toEqual([
        1,
        2,
        3,
        4,
        5,
        6
      ]);

      expect(i).toBe(3);
    });

    it('should skip non-set values', function () {
      var passedValues = createArrayLike([]);
      testObject = createArrayLike([
        1,
        2,
        3,
        4
      ]);

      delete testObject[1];
      filter(testObject, function (o, i) {
        passedValues[i] = o;
        passedValues.length = i + 1;
        return true;
      });

      expect(passedValues).toEqual(testObject);
    });

    it('should set the right context when given none', function () {
      var context;
      filter(createArrayLike([1]), function () {
        // eslint-disable-next-line no-invalid-this
        context = this;
      }, void 0);

      expect(context).toBe(function () {
        // eslint-disable-next-line no-invalid-this
        return this;
      }.call());
    });

    it('should pass the right context to the filter', function () {
      var passedValues = {};
      testObject = createArrayLike([
        1,
        2,
        3,
        4
      ]);

      delete testObject[1];
      filter(testObject, function (o, i) {
        // eslint-disable-next-line no-invalid-this
        this[i] = o;
        // eslint-disable-next-line no-invalid-this
        this.length = i + 1;
        return true;
      }, passedValues);

      expect(passedValues).toEqual(testObject);
    });

    it('should remove only the values for which the callBack returns false', function () {
      var result = filter(testObject, callBack);
      expect(result).toEqual(filteredArray);
    });

    it('should leave the original array untouched', function () {
      var copy = createArrayLike(testSubject);
      filter(testObject, callBack);
      expect(testObject).toEqual(copy);
    });
  });

  it('should have a boxed object as list argument of callBack', function () {
    var actual;
    filter('foo', function (item, index, list) {
      actual = list;
    });

    expect(typeof actual).toBe('object');
    expect(Object.prototype.toString.call(actual)).toBe('[object String]');
  });
});
