import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      this.loggedInSubject.next(!!user);
      this.user = user ? { uid: user.uid, email: user.email || '', displayName: user.displayName || '' } : null;
      this.userSubject.next(this.user);
    });
  }

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable().pipe(filter(user => user !== null));
  private user: User | null = null; 

  getCurrentUser(): User | null {
    return this.user;
  }

  getCurrentUserUID(): string{
    return this.user?.uid || '';
  }

  signInWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider());
  }

  registerWithEmailAndPassword(user: { email: string; password: string }) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  signInWithEmailAndPassword(user: { email: string; password: string }) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signOut() {
    return this.auth.signOut();
  }

  isLoggedIn(): Observable<boolean> {
    return this.auth.authState.pipe(map((user: any) => !!user));
  }
}
