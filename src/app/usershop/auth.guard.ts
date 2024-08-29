import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const isAuthenticated = !!sessionStorage.getItem('token'); // Check for the token

    if (isAuthenticated) {
      return true; // Allow access
    } else {
      this.router.navigate(['/auth/signin']); // Redirect to the login page
      return false;
    }
  }
}
