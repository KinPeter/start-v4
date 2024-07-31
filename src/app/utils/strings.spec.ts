import { capitalize } from './strings';

describe('String utils', () => {
  describe('capitalize', () => {
    it('should capitalize strings', () => {
      expect(capitalize('monday')).toEqual('Monday');
      expect(capitalize('clear sky')).toEqual('Clear sky');
      expect(capitalize('ALL GOOD, MAN')).toEqual('All good, man');
      expect(capitalize('ütvefúrógép')).toEqual('Ütvefúrógép');
      expect(capitalize('ÁROK mentén LÓ')).toEqual('Árok mentén ló');
    });
  });
});
