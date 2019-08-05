import $filter, {implementation} from '../src/array-filter-x';

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

// IE 6 - 8 have a bug where this returns false.

const canDistinguish = 0 in [void 0];
const undefinedIfNoSparseBug = canDistinguish
  ? void 0
  : {
      valueOf() {
        return 0;
      },
    };

const ifHasDenseUndefinedsIt = canDistinguish ? it : xit;

const createArrayLike = function(arr) {
  const o = {};
  arr.forEach(function(e, i) {
    o[i] = e;
  });

  o.length = arr.length;

  return o;
};

[implementation, $filter].forEach((filter, testNum) => {
  describe(`filter ${testNum}`, function() {
    let filteredArray;
    let testSubject;

    const callBack = function(o, i) {
      return i !== 3 && i !== 5;
    };

    beforeEach(function() {
      testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', 3, null, false, 0];

      delete testSubject[1];
      filteredArray = [2, undefinedIfNoSparseBug, 'hej', null, false, 0];
    });

    it('is a function', function() {
      expect.assertions(1);
      expect(typeof filter).toBe('function');
    });

    it('should throw when array is null or undefined', function() {
      expect.assertions(3);
      expect(function() {
        filter();
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        filter(void 0);
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        filter(null);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('array object', function() {
      it('should call the callBack with the proper arguments', function() {
        expect.assertions(1);
        const predicate = jest.fn();
        const arr = ['1'];
        filter(arr, predicate);
        expect(predicate).toHaveBeenCalledWith('1', 0, arr);
      });

      it('should not affect elements added to the array after it has begun', function() {
        expect.assertions(2);
        const arr = [1, 2, 3];

        let i = 0;
        filter(arr, function(a) {
          i += 1;

          if (i <= 4) {
            arr.push(a + 3);
          }

          return true;
        });

        expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6]);

        expect(i).toBe(3);
      });

      ifHasDenseUndefinedsIt('should skip unset values', function() {
        expect.assertions(1);
        const passedValues = [];
        testSubject = [1, 2, 3, 4];

        delete testSubject[1];
        filter(testSubject, function(o, i) {
          passedValues[i] = o;

          return true;
        });

        expect(passedValues).toStrictEqual(testSubject);
      });

      it('should pass the right context to the filter', function() {
        expect.assertions(1);
        const passedValues = [];
        testSubject = [1, 2, 3, 4];

        delete testSubject[1];
        filter(
          testSubject,
          function(o, i) {
            /* eslint-disable-next-line babel/no-invalid-this */
            this[i] = o;

            return true;
          },
          passedValues,
        );

        expect(passedValues).toStrictEqual(testSubject);
      });

      it('should set the right context when given none', function() {
        expect.assertions(1);

        let context = void 0;
        filter([1], function() {
          /* eslint-disable-next-line babel/no-invalid-this */
          context = this;
        });

        expect(context).toBe(
          function() {
            /* eslint-disable-next-line babel/no-invalid-this */
            return this;
          }.call(),
        );
      });

      it('should remove only the values for which the callBack returns false', function() {
        expect.assertions(1);
        const result = filter(testSubject, callBack);
        expect(result).toStrictEqual(filteredArray);
      });

      it('should leave the original array untouched', function() {
        expect.assertions(1);
        const copy = testSubject.slice();
        filter(testSubject, callBack);
        expect(testSubject).toStrictEqual(copy);
      });

      it('should not be affected by same-index mutation', function() {
        expect.assertions(1);
        const results = filter([1, 2, 3], function(value, index, array) {
          array[index] = 'a';

          return true;
        });

        expect(results).toStrictEqual([1, 2, 3]);
      });
    });

    describe('array like', function() {
      let testObject;

      beforeEach(function() {
        testObject = createArrayLike(testSubject);
      });

      it('should call the predicate with the proper arguments', function() {
        expect.assertions(1);
        const predicate = jest.fn();
        const arr = createArrayLike(['1']);
        filter(arr, predicate);
        expect(predicate).toHaveBeenCalledWith('1', 0, arr);
      });

      it('should not affect elements added to the array after it has begun', function() {
        expect.assertions(2);
        const arr = createArrayLike([1, 2, 3]);

        let i = 0;
        filter(arr, function(a) {
          i += 1;

          if (i <= 4) {
            arr[i + 2] = a + 3;
            arr.length += 1;
          }

          return true;
        });

        expect(Array.prototype.slice.call(arr)).toStrictEqual([1, 2, 3, 4, 5, 6]);

        expect(i).toBe(3);
      });

      it('should skip non-set values', function() {
        expect.assertions(1);
        const passedValues = createArrayLike([]);
        testObject = createArrayLike([1, 2, 3, 4]);

        delete testObject[1];
        filter(testObject, function(o, i) {
          passedValues[i] = o;
          passedValues.length = i + 1;

          return true;
        });

        expect(passedValues).toStrictEqual(testObject);
      });

      it('should set the right context when given none', function() {
        expect.assertions(1);

        let context = void 0;
        filter(
          createArrayLike([1]),
          function() {
            /* eslint-disable-next-line babel/no-invalid-this */
            context = this;
          },

          void 0,
        );

        expect(context).toBe(
          function() {
            /* eslint-disable-next-line babel/no-invalid-this */
            return this;
          }.call(),
        );
      });

      it('should pass the right context to the filter', function() {
        expect.assertions(1);
        const passedValues = {};
        testObject = createArrayLike([1, 2, 3, 4]);

        delete testObject[1];
        filter(
          testObject,
          function(o, i) {
            /* eslint-disable-next-line babel/no-invalid-this */
            this[i] = o;
            /* eslint-disable-next-line babel/no-invalid-this */
            this.length = i + 1;

            return true;
          },
          passedValues,
        );

        expect(passedValues).toStrictEqual(testObject);
      });

      it('should remove only the values for which the callBack returns false', function() {
        expect.assertions(1);
        const result = filter(testObject, callBack);
        expect(result).toStrictEqual(filteredArray);
      });

      it('should leave the original array untouched', function() {
        expect.assertions(1);
        const copy = createArrayLike(testSubject);
        filter(testObject, callBack);
        expect(testObject).toStrictEqual(copy);
      });
    });

    it('should have a boxed object as list argument of callBack', function() {
      expect.assertions(2);

      let actual = void 0;
      filter('foo', function(item, index, list) {
        actual = list;
      });

      expect(typeof actual).toBe('object');
      expect(Object.prototype.toString.call(actual)).toBe('[object String]');
    });

    it('should work with arguments', function() {
      expect.assertions(1);
      const argObj = (function() {
        return arguments;
      })('1');

      const callback = jest.fn();
      filter(argObj, callback);
      expect(callback).toHaveBeenCalledWith('1', 0, argObj);
    });

    it('should work with strings', function() {
      expect.assertions(1);
      const callback = jest.fn();
      const string = '1';
      filter(string, callback);
      expect(callback).toHaveBeenCalledWith('1', 0, string);
    });

    itHasDoc('should work wih DOM elements', function() {
      expect.assertions(1);
      const fragment = document.createDocumentFragment();
      const div = document.createElement('div');
      fragment.appendChild(div);
      const callback = jest.fn();
      filter(fragment.childNodes, callback);
      expect(callback).toHaveBeenCalledWith(div, 0, fragment.childNodes);
    });
  });
});
