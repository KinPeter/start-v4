import { FormControl } from '@angular/forms';
import { CustomValidators } from './validators';

describe('CustomValidators', () => {
  describe('URL', () => {
    it('should validate URLs properly', () => {
      const control = new FormControl();

      control.setValue('http://www.p-kin.com');
      expect(CustomValidators.url(control)).toBeNull();

      control.setValue('www.p-kin.com');
      expect(CustomValidators.url(control)).toBeNull();

      control.setValue('helision.com');
      expect(CustomValidators.url(control)).toBeNull();

      control.setValue('ftp://lololo.com');
      expect(CustomValidators.url(control)?.['url']).toBeTrue();

      control.setValue('file://home/user/something.txt');
      expect(CustomValidators.url(control)?.['url']).toBeTrue();

      control.setValue('justastring');
      expect(CustomValidators.url(control)?.['url']).toBeTrue();

      control.setValue(
        'https://www.google.com/search?q=random+cat&sxsrf=ALiCzsasRn5zAARFLMG6tUZH8k5Ec-FRGw:1661198097947&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjs-52Undv5AhWBh_0HHbRvDnQQ_AUoAXoECAIQAw&biw=1920&bih=973&dpr=1#imgrc=Dziptc9J_sWWAM'
      );
      expect(CustomValidators.url(control)).toBeNull();

      control.setValue(
        'https://mysyslab-my.sharepoint.com/personal/pesd_daa_com/_layouts/15/Doc.aspx?sourcedoc={cdc5444e-4d59-40ee-8a93-f5a4e54d6b18}&action=edit&wd=target%28Oing.one%7C8e4141b0-bc2d-4561-8bf5-aafccounts%7C35d94acc-6d71-40ac-9790-aef5fdc7d31f%2F%29&wdorigin=NavigationUrl'
      );
      expect(CustomValidators.url(control)).toBeNull();
    });
  });
});
