import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private gameState : any;
  private madLib : any;

  readonly MAD_LIBS_FOOTER = "Project conceived of and created by the Madder Libs team, Avans University of Applied Science, 2022.";
  
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