import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() cancelLogin = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(() => {
      this.alertify.success('Logged in!');
      this.bsModalRef.hide();
    }, error => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.cancelLogin.emit(false);
  }
}
