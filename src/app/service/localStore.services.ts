import { Injectable } from '@angular/core';

/*
  Store service to store and retrieve persistent states throughout all forms.
*/
@Injectable()
export class StoreService {
  // Stored properties
  private gameState : any;
  private madLib : any;
  private timeLimit : number = 0;

  // Stored final values.
  readonly MAD_LIBS_FOOTER = "Project conceived of and created by the Madder Libs team, Avans University of Applied Science, 2022.";
  
  constructor() { }

  // Get the current working mad lib.
  getGameMadLib() {
    return this.madLib;
  }

  // Update/set the current working mad lib.
  setGameMadLib(madlib : any) {
    this.madLib = madlib;
  }

  // Get the current game state.
  getGameState() {
    return this.gameState;
  }

  // Update/set the current game state.
  setGameState(state : any) {
    this.gameState = state;
  }

  // Get the current time limit.
  getTimeLimit() {
    return this.timeLimit;
  }

  // Update/set the current time limit.
  setTimeLimit(newLimit : number) {
    this.timeLimit = newLimit;
  }
}