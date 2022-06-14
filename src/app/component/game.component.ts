import { Component } from '@angular/core';
import { StoreService } from '../service/localStore.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.services';

@Component({
  selector: 'game',
  templateUrl: '../view/game.component.html'
})
export class GameComponent {
  formData : any;
  formDataKeys : any[];
  madLibData : any[];
  madLibDataFull : any;

  timeMax = 60;
  timeToGo = this.timeMax;
  timePercent = 100;
  interval: any;

  endButtonText: string;

  constructor(
    private api : ApiService,
    private store : StoreService,
    private router : Router,
    private snackBar: MatSnackBar
  ) {
    // Grab data from the form.
    this.formData = store.getGameState();

    // For quick testing, if left empty, fill with junk values.
    if (this.formData == undefined) {
      // TODO: Replace this with a redirect to the main screen.
      this.formData = {
        "sessieid": "12345",
        "player_1_name": "Santa Clause",
        "player_1_score": "12",
        "player_2_name": "Donner",
        "player_2_score": "6",
        "player_3_name": "Blitzen",
        "player_3_score": "2",
        "player_4_name": "Dasher",
        "player_4_score": "10",
        "player_5_name": "Dancer",
        "player_5_score": "9",
        "player_6_name": "Comet",
        "player_6_score": "23"
      }

      // this.formData = {
      //   "sessieid": "54321",
      //   "player_1_name": "Santa Clause",
      //   "player_1_score": "",
      //   "player_2_name": "",
      //   "player_2_score": "",
      //   "player_3_name": "",
      //   "player_3_score": "",
      //   "player_4_name": "",
      //   "player_4_score": "",
      //   "player_5_name": "",
      //   "player_5_score": "",
      //   "player_6_name": "",
      //   "player_6_score": ""
      // }
      
      // this.formData = {
      //   "sessieid": "80008",
      //   "player_1": "Bob",
      //   "player_2": "",
      //   "player_3": "",
      //   "player_4": "",
      //   "player_5": "",
      //   "player_6": ""
      // }
    }

    // Convert the array given to properties that can be queried in the template.
    this.formDataKeys = [];
    this.updatePlayerList();
    this.madLibData = [];

    // Generate a random fun text for the end button.
    this.endButtonText = this.generateButtonText();
  }

  async ngOnInit() {
    let sessionID = this.formData.sessieid;
    await this.api.postMadLib({
      sessieid: sessionID,
      request: "mad lib"
    }).then((result) => {
      this.store.setGameMadLib(result);
    });
    this.convertMadLibData(this.store.getGameMadLib());
    this.madLibDataFull = this.store.getGameMadLib();
    this.startCountdown();
  }

  startCountdown() {
    if (this.timeMax > 0) {
      this.interval = setInterval(() => {
        if(this.timeToGo > 0) {
          this.timeToGo--;
          this.setTimeBar();
        } else {
          this.endTimer();
          let snackBarRef = this.snackBar.open("Timer ran out!", 'Test!', { duration: 5000 });
        }
      }, 1000)
    } else {
      this.timePercent = 100;
    }
  }

  setTimeBar() {
    this.timePercent = this.timeToGo / this.timeMax * 100;
  }

  endTimer() {
    clearInterval(this.interval);
  }

  generateButtonText() : string {
    let endButtonTexts = [];
    endButtonTexts.push( "Create your Mad Lib!" );
    endButtonTexts.push( "For pony!" );
    endButtonTexts.push( "Push it. Push it real good!" );
    endButtonTexts.push( "Today is a good day!" );
    endButtonTexts.push( "For glory!" );
    endButtonTexts.push( "Press it. You know you want to." );

    let randomNumber = Math.floor( Math.random() * endButtonTexts.length );

    return endButtonTexts[randomNumber];
  }
  
  quit() {
    this.router.navigate([ '' ]);
  }

  onReport() {
    // TODO: WRITE REPORT FUNCTIONALITY
    let snackBarRef = this.snackBar.open("Going into report mode!", 'Test!', { duration: 5000 });
  }

  onRefresh() {
    // TODO: WRITE REFRESH FUNCTIONALITY
    let snackBarRef = this.snackBar.open("Refreshing options!", 'Test!', { duration: 5000 });
  }

  convertMadLibData(convMadLibData : any) {
    let madLibDataTemp = Object.keys(convMadLibData).filter(prop => {
      return prop !== "mad lib";
    });
    madLibDataTemp.forEach(item => {
      let context = convMadLibData[item];
      let word1 = item + "_1";
      let word2 = item + "_2";
      let word3 = item + "_3";
      let word4 = item + "_4";

      this.madLibData.push({
        key: item,
        word1: context[word1],
        word2: context[word2],
        word3: context[word3],
        word4: context[word4]
      });
    })
  }

  updatePlayerList() {
    let formDataTemp = Object.keys(this.formData).filter(prop => {
      return prop !== "sessieid" && prop.indexOf("score") < 0
    });
    formDataTemp.forEach(item => {
      let name = item.indexOf("_name") > 0 
        ? item.substring(0, item.length-5).concat("_name") 
        : item;
      let score = item.indexOf("_name") > 0
        ? item.substring(0, item.length-5).concat("_score")
        : item.concat("_score");
      
      this.formDataKeys.push(
        { 
          "name": name,
          "score": score
        });
    });
  }
}