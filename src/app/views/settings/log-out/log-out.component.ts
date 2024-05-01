import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [],
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.css'
})
export class LogOutComponent {
  constructor(private auth: AuthService){}

  logout(){
    this.auth.signOut();
  }
}
