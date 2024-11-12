// angular import
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// project import
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';
import { AppComponent } from './app.component';
import { MasterModule } from './master/master.module';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';
import { JwtModule } from '@auth0/angular-jwt';
let allowedDomains: (string | RegExp)[] = [];
// Function to initialize the app by loading config.json
export function appInitializer(configService: ConfigService) {
  return () =>
    configService.getConfig().toPromise().then((data: any) => {
      environment.url = data.url; // Set the API URL in the environment
      allowedDomains.push(data.domain);
    });
}

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule,MasterModule, BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: allowedDomains,
        disallowedRoutes: []
      }
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [ConfigService],
    },
  ],
})
export class AppModule {}
