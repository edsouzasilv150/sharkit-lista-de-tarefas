import { Injectable } from '@angular/core';

interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'users';

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): User[] {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private findUser(username: string): User | undefined {
    const users = this.loadUsers();
    return users.find(user => user.username === username);
  }

  login(username: string, password: string): boolean {
    const user = this.findUser(username);
    if (user && user.password === password) {
      return true;
    }
    return false;
  }

  register(username: string, email: string, password: string): void {
    const users = this.loadUsers();
    const userExists = this.findUser(username);
    if (!userExists) {
      users.push({ username, email, password });
      this.saveUsers(users);
    }
  }

  loginOrRegister(username: string, email: string, password: string): boolean {
    let user = this.findUser(username);
    if (!user) {
      this.register(username, email, password);
      user = this.findUser(username);
    }
    if (user && user.password === password) {
      return true;
    }
    return false;
  }
}
