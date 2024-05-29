import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('deve ser criado component', () => {
    expect(service).toBeTruthy();
  });

  it('deve registrar um novo usuário', () => {
    service.register('testuser', 'test@example.com', 'password123');
    expect(service.login('testuser', 'password123')).toBeTruthy();
  });

  it('não deve registrar um usuário existente', () => {
    service.register('existinguser', 'existing@example.com', 'password123');
    service.register('existinguser', 'test@example.com', 'password123');
    expect(service.login('existinguser', 'password123')).toBeTruthy();
    expect(service.login('test@example.com', 'password123')).toBeFalsy();
  });

  it('deve fazer login como usuário registrado', () => {
    service.register('testuser', 'test@example.com', 'password123');
    expect(service.login('testuser', 'password123')).toBeTruthy();
  });

  it('não deve fazer login em um usuário não registrado', () => {
    expect(service.login('unknownuser', 'password123')).toBeFalsy();
  });

  it('não deve fazer login com senha incorreta', () => {
    service.register('testuser', 'test@example.com', 'password123');
    expect(service.login('testuser', 'wrongpassword')).toBeFalsy();
  });

  it('deve fazer login ou registrar um usuário', () => {
    expect(service.loginOrRegister('newuser', 'new@example.com', 'password123')).toBeTruthy();
    expect(service.loginOrRegister('existinguser', 'existing@example.com', 'password123')).toBeTruthy();
    expect(service.loginOrRegister('existinguser', 'existing@example.com', 'wrongpassword')).toBeFalsy();
  });
});

