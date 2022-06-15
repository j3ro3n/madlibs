import { Component } from '@angular/core';
import { StoreService } from '../service/localStore.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.services';

/*
  Component to contain the game functionality.
*/
@Component({
  selector: 'game',
  templateUrl: '../view/game.component.html'
})
export class GameComponent {
  // Local properties for display.
  formData : any;
  formDataKeys : any[] = [];
  madLibData : any[] = [];
  
  timeMax: number = 0;
  timeToGo: number = 0;
  timePercent = 100;
  interval: any;

  endButtonText: string = "";
  footer_message: string = "";

  // Constructor
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
      // TODO: Uncomment this
      // this.quit();
      
      // TODO: Comment this
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
    }
  }

  // Event: onInit append. Do last minute updates to UI elements, store what is needed and display.
  async ngOnInit() {
    // Load final text values.
    this.endButtonText = this.generateButtonText();
    this.footer_message = this.store.MAD_LIBS_FOOTER;

    // Update the player list.
    this.convertPlayerList();

    // Get the current Mad lib and store it.
    let sessionID = this.formData.sessieid;
    await this.api.postMadLib({
      sessieid: sessionID,
      request: "mad lib"
    }).then((result) => {
      this.store.setGameMadLib(result);
    });
    this.convertMadLibData(this.store.getGameMadLib());

    // Start the clock.
    this.timeMax = this.store.getTimeLimit();
    this.timeToGo = this.timeMax;
    this.timerCountdown();
  }

  // Convert the original Mad Lib json into a word list useable by the html.
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

  // Convert the current game state json into a player list useable by the html.
  convertPlayerList() {
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

  // Generate a random string to put on the confirm button.
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
  
  // Return the user to the main screen.
  quit() {
    this.router.navigate([ '' ]);
  }

  // 'Shuffle' functionality. Refresh the words to use different words. 
  refreshWords() {
    // TODO: WRITE REFRESH FUNCTIONALITY
    let snackBarRef = this.snackBar.open("Exception: NYI", 'Okay', { duration: 5000 });
  }

  // 'Report' functionality. Report words and make them go away.
  reportWords() {
    // TODO: WRITE REPORT FUNCTIONALITY
    let snackBarRef = this.snackBar.open("Exception: NYI", 'Okay', { duration: 5000 });
  }

  // Start the countdown for the clock.
  timerCountdown() {
    if (this.timeMax > 0) {
      this.interval = setInterval(() => {
        if(this.timeToGo > 0) {
          this.timeToGo--;
          this.timePercent = this.timeToGo / this.timeMax * 100;
        } else {
          clearInterval(this.interval);
          // TODO: Simulate end game forcing here.
          let snackBarRef = this.snackBar.open("Exception: NYI", 'Okay', { duration: 5000 });
        }
      }, 1000)
    } else {
      this.timePercent = 100;
    }
  }
}