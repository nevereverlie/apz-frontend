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
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationComponent implements OnInit {
  users!: User[];
  userId!: number;
  usersForUpdate: any;
  medications: Medication[] = [];
  medicationsForUpdate: Medication[] = [];
  medicationForCreation: Medication = {
    medicationId: 0,
    medicineName: 'Medicine',
    medicationAmount: 0,
    medicationType: 'Type',
    medicationTime: '00:00',
    userId: 0
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
    private modalService: NgbModal,
    private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('token') as string).nameid;
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
    try {
      const { inputsLength, firstnameInputs, lastnameInputs, emailInputs, hospitalIdInputs } = this.getUserInputs();

      this.anyUserChanges(inputsLength, firstnameInputs, lastnameInputs,
                                       emailInputs, hospitalIdInputs);

      if (isChanging) {
        let isErrorResponse = false;
        this.updating = true;
        for (let i = 0; i < this.users.length; i++) {
          if (this.isMismatch(i)) {
            console.log("Mismatch");
            const updatedUser = this.usersForUpdate[i];
            this.usersService.updateUser(updatedUser).subscribe(() => { }, (error: any) => {
              console.log(error);
              isErrorResponse = true;
            });
          }
        }
        if (!isErrorResponse) {
          setTimeout(() => {
            this.getUsers().then(() => {
              this.alertify.success('Профілі успішно оновлено');
              this.updating = false;
            });
          }, 1000);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  anyUserChanges(inputsLength: number, firstnameInputs: HTMLInputElement[], lastnameInputs: HTMLInputElement[],
                 emailInputs: HTMLInputElement[], hospitalIdInputs: HTMLInputElement[]): void {
    for (let i = 0; i < inputsLength; i++) {
      this.usersForUpdate[i].firstname = firstnameInputs[i].value || this.users[i].firstname;
      this.usersForUpdate[i].lastname = lastnameInputs[i].value || this.users[i].lastname;
      this.usersForUpdate[i].userEmail = emailInputs[i].value || this.users[i].userEmail;
      this.usersForUpdate[i].hospitalId = hospitalIdInputs[i].value || this.users[i].hospitalId;
    }
  }

  // private makeUserFormData(form: FormData, updatedUser: User) {
  //   form.append('UserId', updatedUser.userId.toString());
  //   form.append('Firstname', updatedUser.firstname);
  //   form.append('Lastname', updatedUser.lastname);
  //   form.append('UserEmail', updatedUser.userEmail);
  //   form.append('HospitalId', updatedUser.hospitalId.toString());
  // }

  private isMismatch(i: number) {
    console.log(this.users);
    console.log(this.usersForUpdate);
    return this.users[i].firstname !== this.usersForUpdate[i].firstname ||
           this.users[i].lastname !== this.usersForUpdate[i].lastname ||
           this.users[i].userEmail !== this.usersForUpdate[i].userEmail ||
           this.users[i]?.hospitalId !== this.usersForUpdate[i]?.hospitalId
  }

  private getUserInputs() {
    const inputsLength = document.getElementsByClassName('firstnameInput').length;
    const firstnameInputs = document.getElementsByClassName('firstnameInput') as unknown as HTMLInputElement[];
    const lastnameInputs = document.getElementsByClassName('lastnameInput') as unknown as HTMLInputElement[];
    const emailInputs = document.getElementsByClassName('emailInput') as unknown as HTMLInputElement[];
    const hospitalIdInputs = document.getElementsByClassName('hospitalIdInput') as unknown as HTMLInputElement[];

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
        console.log(meds);
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
      const { inputsLength, medicineNameInputs, amountInputs, typeInputs, timeInputs } = this.getMedicationsInputs();

      if (isChanging) {
        this.updating = true;
        for (let i = 0; i < this.medications.length; i++) {
          if (this.medications[i].medicineName !== this.medicationsForUpdate[i].medicineName) {
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

    const medicineNameInputs = document.getElementsByClassName('medicineNameInput') as unknown as HTMLInputElement;
    const amountInputs = document.getElementsByClassName('medicationAmountInput') as unknown as HTMLInputElement;
    const typeInputs = document.getElementsByClassName('medicationTypeInput') as unknown as HTMLInputElement;
    const timeInputs = document.getElementsByClassName('medicationTimeInput') as unknown as HTMLInputElement;

    return { inputsLength, medicineNameInputs, amountInputs, typeInputs, timeInputs };
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
