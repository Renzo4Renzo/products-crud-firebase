import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Session } from 'src/app/common/session';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [Session],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public session: Session) {}

  ngOnInit(): void {}

  onLogout() {
    this.session.removeSession();
    this.router.navigate(['login']);
  }
}
