import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterModule,
        RouterTestingModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar component', () => {
    expect(component).toBeTruthy();
  });
});

// teste unitário do método OnLogin
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['loginOrRegister']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ RouterTestingModule, FormsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('deve chamar authService.loginOrRegister e navegar para "/listar" quando o login for bem-sucedido', () => {
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password123';

    authService.loginOrRegister.and.returnValue(true);
    component.username = username;
    component.email = email;
    component.password = password;

    spyOn(router, 'navigate');

    component.onLogin();

    expect(authService.loginOrRegister).toHaveBeenCalledWith(username, email, password);
    expect(router.navigate).toHaveBeenCalledWith(['/listar']);
  });

  it('deve exibir mensagem de erro quando o login não for bem sucedido', () => {
    authService.loginOrRegister.and.returnValue(false);
    spyOn(window, 'alert');

    component.onLogin();

    expect(authService.loginOrRegister).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Login falhou. Por favor, verifique suas credenciais.');
  });
});
