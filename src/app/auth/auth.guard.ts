import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthStore
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): true | UrlTree {
    if (this.auth.isAuth()) {
      return true;
    } else {
      const queryParams =
        route.queryParams && Object.keys(route.queryParams).length > 0
          ? { queryParams: route.queryParams }
          : undefined;
      return this.router.createUrlTree(['/auth'], queryParams);
    }
  }
}
