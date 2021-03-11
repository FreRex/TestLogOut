export class Proj{
  constructor(
  public id: number,
  public idutente: number,
  public pk_proj: number,
  public nome: string,
  public long_centro_map: string,
  public lat_centro_map: string,
  public nodi_fisici?:string,
  public nodi_ottici?:string,
  public tratte?: string,
  public conn_edif_opta?:string
  ){}
}
