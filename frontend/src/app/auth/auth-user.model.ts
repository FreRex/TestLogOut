export class AuthUser {
  constructor(
    public id: string,
    public username: string,
    public commessa: string,
    public autorizzazione: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }
}
