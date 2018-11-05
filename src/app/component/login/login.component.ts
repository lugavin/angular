import { Component, OnInit } from '@angular/core';
import { MockLoginService } from '../../service/mock-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // providers: [{ provide: MockLoginService, useClass: MockLoginService }],
  providers: [MockLoginService],
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
