import { Component } from '@angular/core';
import { Session } from './common/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Session],
})
export class AppComponent {
  constructor(public session: Session) {}

  title = 'products-crud-firebase';
}
