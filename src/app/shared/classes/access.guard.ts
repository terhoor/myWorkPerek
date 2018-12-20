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
            queryParamsHandling: 'merge'
          });
      });
      return of(true);
    } else {
      this.router.navigate(['/info'], {queryParams: {access: null}, queryParamsHandling: 'merge'
      });
      return of(false);
    }
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this.canActivate(route, state);
  // }
}
