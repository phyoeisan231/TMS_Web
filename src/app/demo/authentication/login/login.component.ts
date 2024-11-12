// angular import
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthResponseDto } from 'src/app/theme/shared/interfaces/AuthResponseDto.model';
import { AuthenticationService } from 'src/app/theme/shared/services/authentication.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,NgxSpinnerModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm: any;
  errorMessage: string = '';
  showErrorMsg: boolean;
  returnUrl: string;
  constructor(
     private service: AuthenticationService,
     private router: Router,
     private route: ActivatedRoute,
     private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showErrorMsg=false;
    localStorage.clear();
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

    onFormSubmit() {
    this.spinner.show();
    this.showErrorMsg = false;
    const formValues = this.loginForm.value;
    console.log(formValues)
    this.service.loginUser(formValues)
    .subscribe({
      next: (res:AuthResponseDto) => {
       localStorage.setItem("token", res.token);
       const name = this.service.getCurrentUser().name;
       const role = this.service.getCurrentUser().role;
       localStorage.setItem("currentUser", name);
       localStorage.setItem("currentRole", role);
       this.service.sendAuthStateChangeNotification(res.isAuthSuccessful);
       this.router.navigate([this.returnUrl]);
      this.spinner.hide();
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showErrorMsg = true;
      Swal.fire('', err.message, 'error');
      this.spinner.hide();
    }});
   }

  validateControl(controlName: string) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  hasError (controlName: string, errorName: string) {
    return this.loginForm.get(controlName).hasError(errorName)
  }
  sumbitBtnLogin(){
    this.router.navigate(["/dashboard/default"]);
  }
}
