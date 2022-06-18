import { Injectable } from '@angular/core';

/*
  Store service to store and retrieve persistent states throughout all forms.
*/
@Injectable()
export class StoreService {
  // Stored properties
  private playerName : string = "";
  private playerId : string = "";
  private gameState : any;
  private votingState : any;
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

  // Get the playerId given to the player at the start.
  getPlayerId() {
    return this.playerId;
  }

  // Set the playerId, or overwrite it if it was set already.
  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  // Get the nickname chosen at the start.
  getPlayerName() {
    return this.playerName;
  }

  // At the start, set the player name for this player.
  setPlayerName(name: string) {
    this.playerName = name;
  }

  // Get the current time limit.
  getTimeLimit() {
    return this.timeLimit;
  }

  // Update/set the current time limit.
  setTimeLimit(newLimit : number) {
    this.timeLimit = newLimit;
  }

  // Get the current state of the Votes that may be cast.
  // Note: These are not the counted votes but **the madlibs that may be voted on**.
  getVotingState() {
    return this.votingState;
  }

  // Update/set the current voting state.
  setVotingState(state : any) {
    this.votingState = state;
  }
}