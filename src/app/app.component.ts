// angular import
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './theme/shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthenticationService){
  }
  ngOnInit() {
    if(this.authService.isUserAuthenticated())
      this.authService.sendAuthStateChangeNotification(true);  }
  // public props
  title = 'rgl_gate';
}
