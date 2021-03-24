import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { JwtModule } from '@auth0/angular-jwt';
import { BsModalService, ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { faEdit, faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock, fas, faTimes, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministrationComponent } from './administration/administration.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

const appRoutes: Routes = [
  { path: '', component: HomeComponent }
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [	
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
      AdministrationComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      },
      defaultLanguage: "en"
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/auth']
      }
    }),
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    AuthService,
    AlertifyService,
    BsModalRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faLock, faUnlock, faTimes, faUser);
  }
 }
