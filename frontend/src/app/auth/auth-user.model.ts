export class AuthUser {
  constructor(
    public idutente: string,
    public idutcas: string,
    public nome: string, // nome e cognome
    // public cognome: string,
    public username: string,
    public idcommessa: string,
    // TODO recuperare commessa dal backend
    public commessa: string,
    public autorizzazione: string,
    private _token: string,
    public tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
