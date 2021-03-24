import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  model: any = {};
  registerMode = false;
  loginMode = false;
  bsModalRef!: BsModalRef;

  constructor(public translateService: TranslateService,
              public authService: AuthService,
              private alertify: AlertifyService,
              private router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModalWithRegisterComponent() {
    this.bsModalRef = this.modalService.show(RegisterComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  openModalWithLoginComponent() {
    this.bsModalRef = this.modalService.show(LoginComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  logout() {
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
    this.router.navigate(['']);
  }

  registerToggle() {
    this.registerMode = true;
  }

  loginToggle() {
    this.loginMode = true;
  }

  cancelRegistrationMode() {
    this.registerMode = false;
  }

  cancelLoginMode() {
    this.loginMode = false;
  }
}
