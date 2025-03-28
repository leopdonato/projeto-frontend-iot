import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
// import { Auth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }
}
