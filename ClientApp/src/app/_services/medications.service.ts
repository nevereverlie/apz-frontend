import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Medication {
  medicationId: number;
  userId: number;
  medicineName: string;
  medicationAmount: number;
  medicationType: string;
  medicationTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {
  baseUrl = environment.apiUrl + 'medications/';

  constructor(private http: HttpClient) { }

  getMedications(): any{
    return this.http.get(this.baseUrl);
  }

  createMedication(medication: Medication): any {
    return this.http.post(this.baseUrl + 'add', medication)
  }

  updateMedication(medicationToUpdate: Medication): any {
    return this.http.put(this.baseUrl + 'update', medicationToUpdate);
  }

  deleteMedication(medicationId: number): any {
    return this.http.delete(this.baseUrl + 'delete/' + medicationId);
  }
}
