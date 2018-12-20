import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private router: Router
    ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.queryParams['access']) {
      return of(true);
    } else {
      this.router.navigate(['/info'], {
        queryParams: {
          access: false
        }
      });
      return of(false);
    }
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this.canActivate(route, state);
  // }
}
