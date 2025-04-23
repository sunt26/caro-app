export class Payload {
  playerId: string;
  action: string;
  data: any;

  constructor(playerId: string, action: string, data: any) {
    this.playerId = playerId;
    this.action = action;
    this.data = data;
  }
}