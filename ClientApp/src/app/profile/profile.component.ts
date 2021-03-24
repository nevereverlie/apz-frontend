import { Component, OnInit } from '@angular/core';

import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UsersService } from '../_services/users.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
  userId: number;
  userEmail: string;
  lastname: string;
  firstname: string;
  hospitalId: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  user: User = {
    userId: 0,
    userEmail: "",
    lastname: "",
    firstname: "",
    hospitalId: 0
  };

  faEdit = faEdit;

  closeResult: any;
  updateMode: boolean = false;
  updating: boolean = false;
  editMode: boolean = false;

  jwtHelper = new JwtHelperService();

  constructor(private alertify: AlertifyService,
              public authService: AuthService,
              private usersService: UsersService,
              private modalService: NgbModal) { }

  ngOnInit() {
    console.log(this.authService.decodedToken);
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token') as string);

    this.getUser(+decodedToken.nameid);
  }

  private getUser(userId: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.usersService.getUserById(userId).subscribe(
        (responseUser: User) => {
          resolve(this.user = responseUser);
        },
        (error: { error: string; }) => {
          reject(this.alertify.error(error.error));
        }
      );
    });
  }

  updateProfile(user: User) {
    this.usersService.updateProfile(user).subscribe(
      () => {
        this.alertify.success('Профіль оновлено');
        this.changeEditMode(false);
      },
      (error: any) => {
        this.alertify.error(error.message);
      }
    );
  }

  changeEditMode(editMode: boolean) {
    this.editMode = editMode;
  }
  changeUpdateMode() {
    this.updateMode = !this.updateMode;
  }
}
