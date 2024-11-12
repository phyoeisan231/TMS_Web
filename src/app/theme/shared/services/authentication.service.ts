import { UserForAuthenticationDto } from '../interfaces/UserForAuthenticationDto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthResponseDto } from '../interfaces/AuthResponseDto.model';
import { environment } from 'src/environments/environment';
import { UserForRegistrationDto } from '../interfaces/UserForRegistrationDto.model';
import { RegistrationResponseDto } from '../interfaces/RegistrationResponseDto.model';
import { ResetPasswordDto } from '../interfaces/ResetPasswordDto.model';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }
  isUserAuthenticated (): boolean {
    const token = localStorage.getItem("token");
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  sendAuthStateChangeNotification (isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }

  isUserAdmin(): boolean {
    const token = localStorage.getItem("token") || '';
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role === 'Admin';
  }

  registerUser(body: UserForRegistrationDto) {
    return this.http.post<RegistrationResponseDto>(environment.url + 'Account/RegisterUser', body, httpOptions);
  }

  upDateRegister(body:UserForRegistrationDto){
    return this.http.put<RegistrationResponseDto>(environment.url + 'Account/UpdateRegisterUser/', body, httpOptions);
  }

  loginUser (body: UserForAuthenticationDto) {
    return this.http.post<AuthResponseDto>(environment.url + 'Account/Login', body);
  }

  logout () {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

  resetPassword (body: ResetPasswordDto) {
    return this.http.post(environment.url + 'Account/ResetPassword', body, httpOptions);
  }

  getCurrentUser() {
    const token = localStorage.getItem("token") || '';
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    const user = {
      name: name,
      role: role
    };
    return user;
  }

  getRole() {
    const token = localStorage.getItem("token");
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role;
  }

  getUserRoleList() {
    return this.http.get<any>(environment.url + 'Account/GetUserRoles');
  }

  getUserList() {
    return this.http.get<any>(environment.url + 'Account/GetUsers');
  }

  deleteUser(id: any) {
    return this.http.delete<any>(environment.url + 'Account/DeleteUser/?id=' + id, httpOptions);
  }

}
