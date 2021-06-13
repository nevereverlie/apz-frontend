import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) { }

  getUsers(): any {
    return this.http.get(this.baseUrl);
  }

  getUserById(userId: number): any {
    return this.http.get(this.baseUrl + userId);
  }

  getUserByEmail(email: string): any {
    return this.http.get(this.baseUrl + 'byEmail/' + email);
  }

  updateUser(userToUpdate: User): any {
    return this.http.put(this.baseUrl + 'updateUser', userToUpdate);
  }

  updateProfile(profileToUpdate: User): any {
    return this.http.put(this.baseUrl + 'updateProfile', profileToUpdate);
  }

  deleteUser(userId: number): any {
    return this.http.delete(this.baseUrl + 'delete/' + userId);
  }
}
