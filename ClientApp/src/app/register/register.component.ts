import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  register() {
    console.log(this.model);
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success('Registration successful!');
      this.bsModalRef.hide();
    }, error => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.cancelRegistration.emit(false);
  }
}
