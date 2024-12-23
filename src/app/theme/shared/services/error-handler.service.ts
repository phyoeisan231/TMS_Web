import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  handleError (error: HttpErrorResponse) : any {
    if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 401) {
      return this.handleUnauthorized(error);
    }
    else if(error.status === 403) {
      return this.handleForbidden(error);
    }
  }

  handleNotFound (error: HttpErrorResponse): string {
    this.router.navigate(['/404']);
    return error.message;
  }

  handleBadRequest (error: HttpErrorResponse): string {
    if(this.router.url === '/authentication/register' || this.router.url.startsWith('/authentication/reset-password')){
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m: any) => {
         message += m + '<br>';
      })

      return message.slice(0, -4);
    }
    else{
      return error.error ? error.error : error.message;
    }
  }

  handleUnauthorized (error: HttpErrorResponse) {
    if(this.router.url === '/login') {
      // return 'Authentication failed. Wrong Username or Password';
      return error.error.errorMessage;
    }
    else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return error.error.errorMessage;
    }
  }

  handleForbidden (error: HttpErrorResponse) {
    this.router.navigate(["/forbidden"], { queryParams: { returnUrl: this.router.url }});
    return "Forbidden";
  }
}
