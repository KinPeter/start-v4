import { omit } from './objects';

describe('Object utils', () => {
  describe('omit', () => {
    it('should remove a field from an object', () => {
      const obj1 = { a: 1, b: 2, c: 4 };
      const omitted1 = omit(obj1, ['a']);
      expect('a' in omitted1).toBeFalse();
      expect(omitted1.a).toBeUndefined();
      expect(omitted1.b).toEqual(2);
      expect(omitted1.c).toEqual(4);
      expect(Object.entries(omitted1)).toHaveSize(2);

      const obj2 = { a: 1, b: 2, c: 4 };
      const omitted2 = omit(obj2, ['c']);
      expect('c' in omitted2).toBeFalse();
      expect(omitted2.c).toBeUndefined();
      expect(omitted2.b).toEqual(2);
      expect(omitted2.a).toEqual(1);
      expect(Object.entries(omitted2)).toHaveSize(2);
    });

    it('should remove multiple fields from an object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 'asd', e: false };
      const omitted = omit(obj, ['b', 'e']);
      expect('b' in omitted).toBeFalse();
      expect('e' in omitted).toBeFalse();
      expect(Object.entries(omitted)).toHaveSize(3);
      expect(omitted.a).toEqual(1);
      expect(omitted.c).toEqual(3);
      expect(omitted.d).toEqual('asd');
    });
  });
});
