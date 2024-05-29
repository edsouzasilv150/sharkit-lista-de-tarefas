import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const success = this.authService.loginOrRegister(this.username, this.email, this.password);
    if (success) {
      this.router.navigate(['/listar']);
    } else {
      alert('Login falhou. Por favor, verifique suas credenciais.');
    }
  }
}
