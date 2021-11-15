export class Session {
  saveSession(username: string) {
    localStorage.setItem('username', username);
  }
  getSession() {
    return localStorage.getItem('username');
  }
  removeSession() {
    localStorage.removeItem('username');
  }
}
