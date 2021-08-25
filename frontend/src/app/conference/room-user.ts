export interface RoomUser {
  idutente: string;
  nome: string;
  // iniziali: string;
  // socketid: string;
  stream: boolean;
  audioOn?: boolean;
  audioStream?: MediaStream;
}
