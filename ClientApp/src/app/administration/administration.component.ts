import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faUnlock } from '@fortawesome/free-solid-svg-icons/faUnlock';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { User } from '../profile/profile.component';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UsersService } from '../_services/users.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Medication, MedicationsService } from '../_services/medications.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationComponent implements OnInit {
  users!: User[];
  usersForUpdate: any;
  medications!: Medication[];
  medicationsForUpdate: any;
  medicationForCreation: Medication = {
    medicationId: 0,
    medicineId: 0,
    medicationAmount: 10,
    medicationType: "Type",
    medicationTime: new Date('1968-11-16T00:00:00')
  };

  faLock = faLock;
  faUnlock = faUnlock;
  faTimes = faTimes;
  faUser = faUserCircle;

  closeResult: any;
  updateMode: boolean = false;
  updating: boolean = false;
  editMode: boolean = false;


  constructor(
    private alertify: AlertifyService,
    public authService: AuthService,
    private usersService: UsersService,
    private medicationsService: MedicationsService,
    private modalService: NgbModal) {}

  ngOnInit() {
    this.getUsers();
    this.getUsersForUpdate();
    this.getMedications();
    this.getMedicationsForUpdate();
  }

  private getUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.usersService.getUsers().subscribe((users: User[]) => {
        resolve(this.users = users);
      }, (error: any) => {
        reject(console.log(error));
      });
    });
  }
  private getUsersForUpdate(): any {
    this.usersService.getUsers().subscribe((users: any) => {
      this.usersForUpdate = users;
    }, (error: any) => {
      console.log(error);
    });
  }

  updateUsers() {
    let isChanging = true;
    console.log(this.users);
    console.log(this.usersForUpdate);
    const { inputsLength, firstnameInputs, lastnameInputs,
            emailInputs, hospitalIdInputs } = this.getUserInputs();

    isChanging = this.anyUserChanges(inputsLength, firstnameInputs, isChanging, lastnameInputs,
                                    emailInputs, hospitalIdInputs);
      try {
      if (isChanging) {
        let isErrorResponse = false;
        this.updating = true;
        for (let i = 0; i < this.users.length; i++) {
          if (this.isMismatch(i)) {
            const updatedUser = this.usersForUpdate[i];
            const form = new FormData();
            console.log(updatedUser);
            this.makeUserFormData(form, updatedUser);
            this.usersService.updateUser(form).subscribe(() => { }, (error: any) => {
              console.log(error);
              isErrorResponse = true;
            });
          }
        }
        if (!isErrorResponse) {
          setTimeout(() => {
            this.getUsers().then(() => {
              this.alertify.success('Success');
              this.updating = false;
            });
          }, 2000);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private makeUserFormData(form: FormData, updatedUser: User) {
    form.append('UserId', updatedUser.userId.toString());
    form.append('Firstname', updatedUser.firstname);
    form.append('Lastname', updatedUser.lastname);
    form.append('UserEmail', updatedUser.userEmail);
    form.append('HospitalId', "1");
  }

  private isMismatch(i: number) {
    return this.users[i].firstname !== this.usersForUpdate[i].firstname ||
           this.users[i].lastname !== this.usersForUpdate[i].lastname ||
           this.users[i].userEmail !== this.usersForUpdate[i].userEmail ||
           this.users[i]?.hospitalId !== this.usersForUpdate[i]?.hospitalId
  }

  private anyUserChanges(inputsLength: number, firstnameInputs: any, isChanging: boolean,
                        lastnameInputs: any, emailInputs: any, hospitalIdInputs: any) {
    for (let index = 0; index < inputsLength; index++) {
      if (firstnameInputs[index].value.toString() !== '') {
        isChanging = true;
        this.usersForUpdate[index].firstname = firstnameInputs[index].value.toString();
      }
      if (lastnameInputs[index].value.toString() !== '') {
        isChanging = true;
        this.usersForUpdate[index].lastname = lastnameInputs[index].value.toString();
      }
      if (emailInputs[index].value.toString() !== '') {
        isChanging = true;
        this.usersForUpdate[index].userEmail = emailInputs[index].value.toString();
      }
      if (hospitalIdInputs[index].value.toString() !== '') {
        isChanging = true;
        this.usersForUpdate[index].hospitalId = hospitalIdInputs[index].value.toString();
      }
    }

    return isChanging;
}

  private getUserInputs() {
    const inputsLength = document.getElementsByClassName('firstnameInput').length;
    const firstnameInputs = document.getElementsByClassName('firstnameInput') as unknown as HTMLInputElement;
    const lastnameInputs = document.getElementsByClassName('lastnameInput') as unknown as HTMLInputElement;
    const emailInputs = document.getElementsByClassName('emailInput') as unknown as HTMLInputElement;
    const hospitalIdInputs = document.getElementsByClassName('hospitalIdInput') as unknown as HTMLInputElement;

    return { inputsLength, firstnameInputs, lastnameInputs, emailInputs, hospitalIdInputs };
  }

  deleteUserConfirmation(userId: number) {
    this.alertify.confirm('Are you sure you want to delete this user?', () => this.deleteUser(userId));
  }

  private deleteUser(userId: number) {
    this.usersService.deleteUser(userId).subscribe(() => {
      this.getUsers();
      this.alertify.warning('User deleted');
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

  private getMedications(): Promise<Medication[]> {
    return new Promise<Medication[]>((resolve, reject) => {
      this.medicationsService.getMedications().subscribe((meds: any) => {
        resolve(this.medications = meds);
      }, (error: any) => {
        reject(console.log(error));
      });
    });
  }
  private getMedicationsForUpdate() {
    this.medicationsService.getMedications().subscribe((meds: any) => {
      this.medicationsForUpdate = meds;
    }, (error: any) => {
      console.log(error);
    });
  }

  createMedication(medicationForCreation: Medication) {
    this.medicationsService.createMedication(medicationForCreation).subscribe(() => {
      this.getMedications();
      this.getMedicationsForUpdate();
      this.alertify.success('Success');
    }, (error: { error: string; }) => {
      this.alertify.error(error.error);
    });
  }

  updateMedications() {
    let isChanging = Boolean(true);
    try {
      const { inputsLength, medicineIdInputs, amountInputs, typeInputs, timeInputs } = this.getMedicationsInputs();

      if (isChanging) {
        this.updating = true;
        for (let i = 0; i < this.medications.length; i++) {
          if (this.medications[i].medicineId !== this.medicationsForUpdate[i].medicineId) {
            const newMed = this.medicationsForUpdate[i];
            this.medicationsService.updateMedication(newMed).subscribe(() => { }, (error: any) => {
              console.log(error);
            });
            continue;
          }
          if (this.medications[i].medicationAmount !== this.medicationsForUpdate[i].medicationAmount) {
            const newMed = this.medicationsForUpdate[i];
            this.medicationsService.updateMedication(newMed).subscribe(() => { }, (error: any) => {
              console.log(error);
            });
            continue;
          }
          if (this.medications[i].medicationType !== this.medicationsForUpdate[i].medicationType) {
            const newMed = this.medicationsForUpdate[i];
            this.medicationsService.updateMedication(newMed).subscribe(() => { }, (error: any) => {
              console.log(error);
            });
            continue;
          }
          if (this.medications[i].medicationTime !== this.medicationsForUpdate[i].medicationTime) {
            const newMed = this.medicationsForUpdate[i];
            this.medicationsService.updateMedication(newMed).subscribe(() => { }, (error: any) => {
              console.log(error);
            });
            continue;
          }
        }
        setTimeout(() => {
          this.getMedications().then(() => {
          this.alertify.success('Medications updated!');
          this.updating = false;
          });
        }, 1000);
      }
      } catch (e) {
      console.log(e);
    }
  }

  private getMedicationsInputs() {
    const inputsLength = document.getElementsByClassName('departmentNameInput').length;

    const medicineIdInputs = document.getElementsByClassName('medicineIdInput') as unknown as HTMLInputElement;
    const amountInputs = document.getElementsByClassName('medicationAmountInput') as unknown as HTMLInputElement;
    const typeInputs = document.getElementsByClassName('medicationTypeInput') as unknown as HTMLInputElement;
    const timeInputs = document.getElementsByClassName('medicationTimeInput') as unknown as HTMLInputElement;

    return { inputsLength, medicineIdInputs, amountInputs, typeInputs, timeInputs };
  }

  deleteMedicationConfirmation(medId: number) {
    this.alertify.confirm('Are you sure you want to delete this medication?', () => this.deleteMedication(medId));
  }

  private deleteMedication(medId: number) {
    this.medicationsService.deleteMedication(medId).subscribe(() => {
      this.getMedications();
      this.alertify.warning('Medication deleted');
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

  open(content: any) {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  changeEditMode(editMode: boolean) {
    this.editMode = editMode;
  }
  changeUpdateMode() {
    this.updateMode = !this.updateMode;
  }
}
