import { metersToKms, secondsToHours } from './activities.utils';

describe('Cycling Utils', () => {
  describe('metersToKms', () => {
    it('should properly convert meters to kilometers, rounding to 1 decimal', () => {
      expect(metersToKms(1000)).toEqual(1);
      expect(metersToKms(20000)).toEqual(20);
      expect(metersToKms(1234534)).toEqual(1234.5);
      expect(metersToKms(2999.967)).toEqual(3);
      expect(metersToKms(3012.967)).toEqual(3);
      expect(metersToKms(3212.967)).toEqual(3.2);
    });
  });

  describe('secondsToHours', () => {
    it('should properly convert seconds to hours, rounding to 1 decimal', () => {
      expect(secondsToHours(60 * 60)).toEqual(1);
      expect(secondsToHours(60 * 60 * 2 + 60 * 30)).toEqual(2.5);
      expect(secondsToHours(60 * 60 * 2 + 60 * 15)).toEqual(2.3);
      expect(secondsToHours(60 * 60 * 42 + 60 * 40 + 34)).toEqual(42.7);
    });
  });
});
