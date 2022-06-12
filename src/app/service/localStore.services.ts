import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private gameState : any;
  private timeState = 0;
  
  constructor() { }

  getGameState() {
    return this.gameState;
  }

  setGameState(state : any) {
    this.gameState = state;
  }

  setTimeState(targetTime: number) {
    this.timeState = targetTime;
  }
}