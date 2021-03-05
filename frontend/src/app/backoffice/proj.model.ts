export class Proj{
  constructor(
  public id: number,
  public collaudatore: number,
  public pk_proj: number,
  public nome_progetto: string,
  public long_progetto: string,
  public lat_progetto: string,
  public nodi_fisici?:string,
  public nodi_ottici?:string,
  public tratte?: string,
  public conn_edif_opta?:string
  ){}
}
