import { Component, OnInit } from '@angular/core';
import { ScrollService } from '../../shared/services/scroll/scroll.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private scrollService: ScrollService,
  ) {
  }
  loggedUser: User | null = null;
  alreadyLoggedIn = false;
  showSettings: boolean = false;
  createSettings = false;



  ngOnInit() {
    this.loadLoggedUser();
    this.checkIfIsStillLoggedIn();
  }

  loadLoggedUser() {
    this.authService.user$.subscribe((user) => {
      this.loggedUser = user;
      if (!user) {
        this.loggedUser = null;
      }
    });
  }

  checkIfIsStillLoggedIn() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (!loggedIn) {
        this.loggedUser = null;
      }
    });
  }

  scrollToElement(elementId: string): void {
    this.scrollService.scrollToElement(elementId);
  }

  toAbout() {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }

  toGraphs() {
    document.getElementById("graphs")?.scrollIntoView({ behavior: "smooth" });
  }
  toData() {
    document.getElementById("data")?.scrollIntoView({ behavior: "smooth" });
  }

  tooverviewMap() {
    document.getElementById("overviewMap")?.scrollIntoView({ behavior: "smooth" });
  }

  createSettingsComponent(){
    this.createSettings = true;
    
  }

  logout(){
    this.authService.signOut();
  }

}
