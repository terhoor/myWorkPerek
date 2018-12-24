import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.queryParams['access']) {
      setTimeout(() => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: { 'access': null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
      });
      return of(true);
    } else {
      return of(true);
    }
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this.canActivate(route, state);
  // }
}
