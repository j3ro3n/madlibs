import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private gameState : any;
  private madLib : any;
  
  constructor() { }

  getGameState() {
    return this.gameState;
  }

  setGameState(state : any) {
    this.gameState = state;
  }

  getGameMadLib() {
    return this.madLib;
  }

  setGameMadLib(madlib : any) {
    this.madLib = madlib;
  }
}