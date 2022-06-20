import { Component } from '@angular/core';
import { StoreService } from '../service/localStore.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.services';
import { WaitingDialog } from './waitingdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TimerService } from '../service/timer.services';

export interface MadLibDataObject {
  key: string,
  category: string,
  word1: string,
  word1color: string,
  word2: string,
  word2color: string,
  word3: string,
  word3color: string,
  word4: string,
  word4color: string
}

export interface CustomWord {
  categorykey: string,
  word: string
}

/*
  Component to contain the game functionality.
*/
@Component({
  selector: 'game',
  templateUrl: '../view/game.component.html'
})
export class GameComponent {
  // Local properties for display.
  gameData : any;
  gameDataKeys : any[] = [];
  
  madLibData : MadLibDataObject[] = [];
  madLibChoices : any = {};
  madLibSentence : string = "";

  refreshPlayerInterval : any;

  reportModeOn : boolean = false;
  reportColor : string = "accent";

  submitted : boolean = false;

  shuffleModeOn : boolean = false;
  shuffleColor : string = "accent";
  shuffleCost : number;

  endButtonText: string = "";
  footer_message: string = "";

  customWords : CustomWord[] = [];

  // Constructor
  constructor(
    private api : ApiService,
    public waitingDialog : MatDialog,
    private store : StoreService,
    protected timer : TimerService,
    private router : Router,
    private snackBar: MatSnackBar
  ) {
    // Grab data from the form.
    this.gameData = store.getGameState();

    // For quick testing, if left empty, fill with junk values.
    if (this.gameData == undefined) {
      this.quit();
    }

    // Re-initialize the cost number for shuffling at the start of each round.
    // (ie. every time this component is constructed)
    this.shuffleCost = -1;

    // Get the last player to join the session. Save their id. Hope it's the last player. ¯\_(ツ)_/¯
    let playerNumber = Object.keys(this.gameData).filter((item) => {
      return this.gameData[item] !== null && item.indexOf("name") > 0
    }).length;
    let playerIdKey = "player_" + playerNumber + "_id";
    this.store.setPlayerId(this.gameData[playerIdKey]);
  }

  // Event: onInit append. Do last minute updates to UI elements, store what is needed and display.
  async ngOnInit() {
    // Load final text values.
    this.endButtonText = this.generateButtonText();
    this.footer_message = this.store.MAD_LIBS_FOOTER;

    // Update the player list.
    this.convertGameJSONtoUIObjects();

    // Get the current Mad lib and store it.
    let sessionID = this.gameData.sessieid;
    try {
      // Get the current Mad Lib from the server.
      await this.api.post({
        sessieid: sessionID,
        playerid: this.store.getPlayerId(),
        request: "mad lib"
      }, "madlib").then((result) => {
        this.store.setGameMadLib(result);
      });
    } catch(exception) {
      this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
    }
    this.convertMadLibJSONtoUIObjects(this.store.getGameMadLib());

    // Start the clock.
    this.store.setTimeLimit(this.store.getGameState().sessieTimer);
    this.startTimer();

    // Start the refresh timer:
    this.refreshPlayerInterval = setInterval(async () => {
      try {
        await this.api.post({
          nickname: this.store.getPlayerName(),
          playerid: this.store.getPlayerId(),
          sessieid: sessionID,
          sessieTimer: this.store.getTimeLimit()
        }, "gamestate").then((result) => {
          this.store.setGameState(result);
          this.store.setTimeLimit(this.store.getGameState().sessieTimer);
          if (!this.timer.isTimerSet() && this.store.getTimeLimit() > 0) {
            this.startTimer();
          }
        });
      } catch(exception) {
        this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
      }

      // Update the player list.
      this.convertGameJSONtoUIObjects();
    }, 3000);
  }

  // Add a choice to prevent code redundancy
  addChoice(categoryObject: MadLibDataObject, category: string, word: string) {
    if (this.madLibChoices[categoryObject.category] !== undefined) {
      
      // A response for this category was already stated. Add to array.
      // Check if the sent in version was already logged, or if it's a second answer.
      let previousAnswer = this.madLibChoices[categoryObject.category].filter((descriptor: any) => {
        return descriptor.category == category;
      });
      if (previousAnswer.length == 0) {
        if (word.trim() !== '') {
          this.madLibChoices[categoryObject.category].push({
            word: word,
            category: category
          });
        }
      } else {
        if (word.trim() == '') {
          let removalIndex = -1;
          for (let index = 0; index < this.madLibChoices[categoryObject.category].length; index++) {
            if (this.madLibChoices[categoryObject.category][index].category == category) {
              removalIndex = index;
              continue;
            }
          }
          this.madLibChoices[categoryObject.category].splice(removalIndex, 1);
        } else {
          previousAnswer[0].word = word;
        }
      }
    } else {
      // No response has been logged for this yet. Add it.
      this.madLibChoices[categoryObject.category] = [
        {
          word: word,
          category: category
        }
      ];
    }
  }

  // See if all answers were given
  answersAllGiven(): boolean {
    // Get all the parts to be replaced.
    let substitute_words = this.madLibSentence.split('$');

    // Count the amount of answers given.
    let madLibChoicesTrueLength = 0;
    Object.keys(this.madLibChoices).forEach((internalArray: any) => {
      madLibChoicesTrueLength += this.madLibChoices[internalArray].length;
    });

    return (substitute_words.length-1 == madLibChoicesTrueLength);
  }

  // Convert the current game state json into a player list useable by the html.
  convertGameJSONtoUIObjects() {
    // Refresh the game data.
    this.gameData = this.store.getGameState();

    // Check if list was previously set. If so, reset.
    if (this.gameDataKeys.length > 0) {
      this.gameDataKeys = [];
    }

    // Fill player list and score.
    let gameDataTemp = Object.keys(this.gameData).filter(prop => {
      return prop.indexOf("name") > 0 
    });
    
    gameDataTemp.forEach(item => {
      // Create keys for querying later:
      let name = item.substring(0, item.length-5).concat("_name");
      let score = item.substring(0, item.length-5).concat("_score");
      let id = item.substring(0, item.length-5).concat("_id");
      let inactive = item.substring(0, item.length-5).concat("_inactive");
      
      // Add the keys to an internal key array:
      if (this.gameData[item] !== '') {
        this.gameDataKeys.push(
          {
            "name": name,
            "score": score,
            "id": id,
            "inactive": inactive
          });
      }
    });
  }

  // Convert the original Mad Lib json into a word list useable by the html.
  convertMadLibJSONtoUIObjects(convMadLibData : any) {
    this.madLibSentence = convMadLibData.madlib;
    
    let madLibDataTemp = convMadLibData.categories;
        
    madLibDataTemp.forEach((category : any) => {
      let categoryName = category.type;
      
      category.words.forEach((option : any) => {
        this.madLibData.push({
          key: categoryName + ' ' + option.id,
          category: categoryName.toUpperCase(),
          word1: option.word_1,
          word1color: "",
          word2: option.word_2,
          word2color: "",
          word3: option.word_3,
          word3color: "",
          word4: option.word_4,
          word4color: ""
        });
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

  /*
    This class will change bindings of a category worth of buttons, either coloring one of the buttons
    or uncoloring all of the buttons.
  */
  highlightButton(context: MadLibDataObject, button: number) {
    context.word1color = '';
    context.word2color = '';
    context.word3color = '';
    context.word4color = '';

    switch (button) {
      case 1: context.word1color = 'warn'; break;
      case 2: context.word2color = 'warn'; break;
      case 3: context.word3color = 'warn'; break;
      case 4: context.word4color = 'warn'; break;
      default: return;
    }
  }
  
  // Return the user to the main screen.
  quit() {
    clearInterval(this.refreshPlayerInterval);
    this.router.navigate([ '' ]);
  }

  // Report a word and remove it from the context. Finally, replace it with a new option.
  async onWordReport(context: MadLibDataObject, wordReported: string) {
    let ucCategory = context.category[0].toUpperCase() + context.category.substr(1).toLowerCase();
    let wordsInContext = [
      context.word1,
      context.word2,
      context.word3,
      context.word4
    ];
    
    let wordToReport = wordsInContext[parseInt(wordReported.substring(wordReported.length-1))-1];
    
    this.snackBar.open("Alright, we'll report that word and make sure it doesn't show up anymore in this session.", "Thanks", { duration: 10000 });

    let newWords : string[] = [];
    try {
      // Request the voting state.
      await this.api.post({
        sessieid: this.store.getGameState().sessieid,
        category: ucCategory,
        word: wordToReport
      }, "report").then((result: any) => {
        newWords = [
          result.word_1,
          result.word_2,
          result.word_3,
          result.word_4
        ];
      });
    } catch(exception) {
      this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
    }

    newWords = newWords.filter((word: string) => {
      return !wordsInContext.includes(word);
    });

    switch(wordReported) {
      case "word1": context.word1 = newWords[0]; break;
      case "word2": context.word2 = newWords[0]; break;
      case "word3": context.word3 = newWords[0]; break;
      case "word4": context.word4 = newWords[0]; break;
      default: return;
    }

    this.reportWords();
  }

  // When a word button is clicked, execute the following code.
  onWordClicked(category: string, word: string) {
    let categoryObject = this.madLibData.filter((item) => {
      return item.key == category;
    })[0];
    let categoryWord = Object.keys(categoryObject).filter((itemKey) => {
      switch (itemKey) {
        case "word1": return categoryObject.word1 == word;
        case "word2": return categoryObject.word2 == word;
        case "word3": return categoryObject.word3 == word;
        case "word4": return categoryObject.word4 == word;
        default: return false;
      }
    })[0];
    
    // Use the highlighter to show pretty buttons.
    if (categoryWord == undefined) {
      // No matching word was found. Custom input. Unhighlight all buttons. Save custom input to array.
      if (this.customWords.filter((item) => {
        return item.categorykey == categoryObject.key
      })[0] == undefined) {
        if (word.trim() !== "") {
          this.customWords.push({
            categorykey: categoryObject.key,
            word: word
          });
        }
      } else {
        if (word.trim() !== "") {
          this.customWords.filter((item) => {
            return item.categorykey == categoryObject.key
          })[0].word = word;
        } else {
          this.customWords
            .splice(
              this.customWords.indexOf(
                this.customWords.filter((item) => {
                  return item.categorykey == categoryObject.key
                })[0]
              ), 1
            );
        }
      }
      
      this.highlightButton(
        categoryObject,
        0
      );
    } else {
      // A matching word was found. Highlight that button, also remove custom input if it existed.
      if (this.customWords.filter((item) => {
        return item.categorykey == categoryObject.key
      })[0] !== undefined) {
        this.customWords
        .splice(
          this.customWords.indexOf(
            this.customWords.filter((item) => {
              return item.categorykey == categoryObject.key
            })[0]
          ), 1
        );
      }

      this.highlightButton(
        categoryObject, 
        parseInt(categoryWord.substring(categoryWord.length-1, categoryWord.length))
      );
    }

    // Save the response to the result matrix.
    this.addChoice(categoryObject, category, word);
  }

  // Request four new words for a category.
  async refreshCategory(categoryName : string) {
    if (this.shuffleModeOn) {
      let categoryType = categoryName.substring(0, categoryName.indexOf(' '));
      let newWords = {
        id: 0,
        word_1: "",
        word_2: "",
        word_3: "",
        word_4: ""
      };

      // API call goes here to get new values.
      try {
        // Request the voting state.
        await this.api.post({
          sessieid: this.gameData.sessieid,
          playerid: this.store.getPlayerId(),
          category: categoryType,
          score: this.shuffleCost
        }, "shuffle").then((result: any) => {
          newWords = result;
        });
      } catch(exception) {
        this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
      }

      this.shuffleCost--;
      
      // Get the current context for the item we want to change.
      let context = this.madLibData.filter((item) => {
        return item.key == categoryName;
      })[0];
      // Reset all color for category
      context.word1color = "";
      context.word2color = "";
      context.word3color = "";
      context.word4color = "";
      // Set the words to what was retrieved.
      context.word1 = newWords.word_1;
      context.word2 = newWords.word_2;
      context.word3 = newWords.word_3;
      context.word4 = newWords.word_4;
    }

    this.refreshWords();
  }

  // 'Shuffle' functionality. Refresh the words to use different words. 
  refreshWords() {
    this.shuffleModeOn = !this.shuffleModeOn;
    this.shuffleColor = this.shuffleColor == "accent" ? "warn" : "accent";
  }

  // 'Report' functionality. Report words and make them go away.
  reportWords() {
    this.reportModeOn = !this.reportModeOn;
    this.reportColor = this.reportColor == "accent" ? "warn" : "accent";
  }

  // Start the timer, according to the first player's time limit set in the store.
  startTimer() {
    this.timer.setClock(this.store.getTimeLimit());
    this.timer.timerCountdown();
    this.timer.timerDone.subscribe(() => {
      if (!this.submitted) {
        if (this.answersAllGiven()) {
          this.submitMadLib();
        } else {
          let allCategories: any[] = []
          for (let index = 0; index < this.madLibData.length; index ++) {
            allCategories.push({
              key: this.madLibData[index].key,
              category: this.madLibData[index].category,
              mldi: index
            });
          }
          for (let index = 0; index < allCategories.length; index ++) {
            let result = this.madLibChoices[allCategories[index].category];
            if (result !== undefined) {
              let iResult = result.find((key: any) => {
                return key.category == allCategories[index].key;
              });
              if (iResult !== undefined) {
                allCategories.splice(index, 1);
                index--;
              }
            }
          };
          
          allCategories.forEach((categoryKey) => {
             let randomNumber = Math.ceil(Math.random() * 4);
            switch(randomNumber){
              case 1:
                this.addChoice(
                  this.madLibData[categoryKey.mldi], 
                  categoryKey.key,
                  this.madLibData[categoryKey.mldi].word1
                );
              break;
              case 2:
                this.addChoice(
                  this.madLibData[categoryKey.mldi], 
                  categoryKey.key,
                  this.madLibData[categoryKey.mldi].word2
                );
              break;
              case 3:
                this.addChoice(
                  this.madLibData[categoryKey.mldi], 
                  categoryKey.key,
                  this.madLibData[categoryKey.mldi].word3
                );
              break;
              case 4:
                this.addChoice(
                  this.madLibData[categoryKey.mldi], 
                  categoryKey.key,
                  this.madLibData[categoryKey.mldi].word4
                );
              break;
              default:
                // This is literally unreachable.
              break;
            }
          });
  
          this.submitMadLib(false);
        }
      }
    });
  }

  // Create and submit the finished Mad Lib.
  async submitMadLib(voteable: boolean = true) {
    // If the amount of answers given does not equal one less than the parts to be replaced,
    // show a snackbar. Otherwise, substitute for category words in mad lib.
    if (!this.answersAllGiven()) {
      this.snackBar.open("You need to select/write a word for every category before submitting!", 'Oops!', { duration: 3000 });
    } else {
      this.submitted = true;

      // Check if any words were custom filled and submit them to the API if they were.
      if (this.customWords.length > 0) {
        this.customWords.forEach((wordObject) => {
          // Do API call to submit word
          try {
            // Request the voting state.
            this.api.post({
              category: wordObject.categorykey.split(' ')[0],
              word: wordObject.word
            }, "word").then((result: any) => {
              if (result.result == "success") {
                // If success of this action ever becomes important, do something here.
              } else {
                // If failure of this action ever becomes important, do something here.
              }
            });
          } catch(exception) {
            this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
          }
        });
      }

      // Get all the parts to be replaced and replace them with category words to finish the mad lib.
      let substitute_words = this.madLibSentence.split('$');
      let finishedMadLib = "";
      substitute_words.forEach((partial) => {
        let firstWord = partial.substring(0, partial.indexOf(' '));
        if (firstWord.indexOf(',') > 0) {
          firstWord = firstWord.substring(0, firstWord.indexOf(','));
        }
        if (firstWord.indexOf('.') > 0) {
          firstWord = firstWord.substring(0, firstWord.indexOf('.'));
        }
        if (firstWord.indexOf('!') > 0) {
          firstWord = firstWord.substring(0, firstWord.indexOf('!'));
        }
        if (firstWord.indexOf('?') > 0) {
          firstWord = firstWord.substring(0, firstWord.indexOf('?'));
        }
        if (firstWord == '') {
          firstWord = partial.substring(0, partial.length-1);
        }
        let foundCategory = Object.keys(this.madLibChoices).find((key) => {
          return key == firstWord;
        });
        if (foundCategory !== undefined) {
          let word = this.madLibChoices[foundCategory][0].word;
          this.madLibChoices[foundCategory].splice(0, 1);
          finishedMadLib = finishedMadLib.concat(partial.replace(firstWord, word.toLowerCase()));
        } else {
          finishedMadLib = finishedMadLib.concat(partial);
        }
      });

      // Console log the resulting mad lib.
      const dialogRef = this.waitingDialog.open(WaitingDialog, {
        width: '250px',
        data: {
          reason: "other players",
          timer: this.timer
        }
      });
      dialogRef.disableClose = true;
      
      let votingStateObject = {
        error: "awaiting-submissions-error"
      };
      while (votingStateObject.error !== undefined) {
        // Wait for one second between requests.
        await new Promise(f => setTimeout(f, 1000));
        
        try {
          // Request the voting state.
          await this.api.post({
            sessieid: this.gameData.sessieid,
            nickname: this.store.getPlayerName(),
            playerid: this.store.getPlayerId(),
            madlib: finishedMadLib,
            voteable: voteable
          }, "submit").then((result: any) => {
            votingStateObject = result;
          });
        } catch(exception) {
          this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
        }
      }

      this.store.setVotingState(votingStateObject);
      dialogRef.close();
      clearInterval(this.refreshPlayerInterval);
      this.router.navigate([ "vote" ]);
    }
  }
}