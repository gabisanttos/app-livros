
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.local';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  booksRead?: number;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment?.apiUrl || '';


  private localUser: UserProfile = {
    id: '1',
    name: 'Andrey Dias',
    email: 'andrey@example.com',
    phone: '—',
    age: 0,
    booksRead: 0
  };

  constructor(private http: HttpClient) {
    console.log('UserService carregado');
  }


  getProfile(token?: string): Observable<UserProfile> {
  if (!this.apiUrl) {
    return of(this.localUser);
  }

  const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

  // observe: 'body' garante Observable<UserProfile>
  return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, {
    headers,
    observe: 'body'
  }) as Observable<UserProfile>;
}

updateProfile(token: string | undefined, data: Partial<UserProfile>): Observable<UserProfile> {
  if (!this.apiUrl) {
    this.localUser = { ...this.localUser, ...data };
    return of(this.localUser);
  }

  const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : undefined;

  return this.http.put<UserProfile>(`${this.apiUrl}/user/profile`, data, {
    headers,
    observe: 'body'
  }) as Observable<UserProfile>;
}
}
