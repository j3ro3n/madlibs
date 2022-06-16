import { EventEmitter, Injectable, Output } from '@angular/core';

/*
  Service to communicate with to reach the API backend.
*/
@Injectable()
export class TimerService {
  // Properties
  private timeMax: number = 0;
  private timeToGo: number = 0;
  private timePercent = 100;
  private interval: any;
  private timerSet: boolean = false;
  @Output() timerDone = new EventEmitter<any>();
  
  // Constructor
  constructor() {}

  // Set the values for the timer.
  setClock(timeMax: number, timeToGo: number) {
    this.timeMax = timeMax;
    this.timeToGo = timeToGo;
  }

  // Return the time percentage left
  getTimePercent(): number {
    return this.timePercent;
  }

  // Returns true if a timer is running.
  getTimerSet(): boolean {
    return this.timerSet;
  }

  // Start the countdown for the clock.
  timerCountdown() {
    if (this.timeMax > 0) {
      this.timerSet = true;
      this.interval = setInterval(() => {
        if(this.timeToGo > 0) {
          this.timeToGo--;
          this.timePercent = this.timeToGo / this.timeMax * 100;
        } else {
          clearInterval(this.interval);
          this.timerDone.emit(null);
        }
      }, 1000)
    } else {
      this.timePercent = 100;
    }
  }
}