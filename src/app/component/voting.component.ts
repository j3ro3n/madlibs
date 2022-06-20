import { Component } from '@angular/core';
import { StoreService } from '../service/localStore.services';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.services';
import { MatDialog } from '@angular/material/dialog';
import { TimerService } from '../service/timer.services';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface VoteDataObject {
  player: string,
  name?: string,
  madlib?: string,
  id?: string,
  disabled?: string,
  uiid?: number
}

/*
  Component to contain the game functionality.
*/
@Component({
  selector: 'vote',
  templateUrl: '../view/vote.component.html'
})
export class VoteComponent {
    // Local properties for display.
    votingData : VoteDataObject[];

    sessionID : string = "";
    optionSelected : number;
    optionWinner : number;
    footer_message : string = "";

    // Constructor
    constructor(
        private api : ApiService,
        public waitingDialog : MatDialog,
        private snackBar: MatSnackBar,
        private store : StoreService,
        protected timer : TimerService,
        private router : Router
    ) {
        // For quick testing, if left empty, fill with junk values.
        if (store.getVotingState() == undefined) {
            this.quit();
        }
        this.votingData = this.convertVotingJSONtoUIObjects(store.getVotingState());

        // Hard Reset this, just to be safe.
        this.optionSelected = -1;
        this.optionWinner = -1;
    }

    // Event: onInit append. Do last minute updates to UI elements, store what is needed and display.
    async ngOnInit() {
        // Get data for display:
        this.footer_message = this.store.MAD_LIBS_FOOTER;

        let elligibleVotes = this.votingData.filter((item) => {
            return item.disabled == "false";
        }).length > 0;
        if (!elligibleVotes) {
            this.nullVote();
        } else {
            // Start a 30 second timer
            this.timer.setClock(30);
            this.timer.timerCountdown();
            this.timer.timerDone.subscribe(() => {
                this.onVote({
                    disabled: "true",
                    id: this.store.getPlayerId(),
                    madlib: "",
                    name: "",
                    player: "",
                    uiid: -1
                });
            });
        }
    }

    // Convert the current voting state json into a list useable by the html.
    convertVotingJSONtoUIObjects(storeVotingObject: any) : VoteDataObject[] {
        this.sessionID = storeVotingObject.sessieid;
        
        let votingDataTemp: VoteDataObject[] = [];
        let votingDataKeys = Object.keys(storeVotingObject).filter(prop => {
            return prop !== "sessieid"
        });
        votingDataKeys.forEach(item => {
            if (storeVotingObject[item] !== undefined &&
                storeVotingObject[item] !== "") {
                let playerAttribute = item.split('_');
                
                // Check if an object already exists for player.
                let context = votingDataTemp.find((searcher) => {
                    return searcher.player == playerAttribute[0];
                });
                if (context == undefined) {
                    // No object exists for player. Create a new one.
                    switch (playerAttribute[1]) {
                        case "name":
                            votingDataTemp.push({
                                player: playerAttribute[0],
                                name: storeVotingObject[item]
                            });
                        break;
                        case "madlib": 
                            votingDataTemp.push({
                                player: playerAttribute[0],
                                madlib: storeVotingObject[item]
                            });
                        break;
                        case "id":
                            votingDataTemp.push({
                                player: playerAttribute[0],
                                id: storeVotingObject[item]
                            });
                        break;
                        case "voteable":
                            if (storeVotingObject[item] == "true") {
                                votingDataTemp.push({
                                    player: playerAttribute[0],
                                    disabled: "false"
                                });
                            } else {
                                votingDataTemp.push({
                                    player: playerAttribute[0],
                                    disabled: "true"
                                });
                            }
                        break;
                        default:
                            throw "Attribute unrecognized in playerAttribute array.";
                    }
                } else {
                    // Object exists, so append to this object.
                    switch (playerAttribute[1]) {
                        case "name":
                            context.name = storeVotingObject[item];
                        break;
                        case "madlib": 
                            context.madlib = storeVotingObject[item];
                        break;
                        case "id":
                            context.id = storeVotingObject[item];
                        break;
                        case "voteable":
                            if (storeVotingObject[item] == "true") {
                                context.disabled = "false";
                            } else {
                                context.disabled = "true";
                            }
                        break;
                        default:
                            throw "Attribute unrecognized in playerAttribute array.";
                    }
                }
            }
        });

        votingDataTemp = this.shuffleAnswers(votingDataTemp);

        let items = 0;
        votingDataTemp.forEach((item) => {
            if (this.store.getPlayerName() == item.name) {
                item.disabled = "true";
            }
            item.uiid = items;
            items++;
        });

        return votingDataTemp;
    }

    // Return the user to the main screen.
    quit() {
        this.router.navigate([ '' ]);
    }

    // Vote for yourself, since there were no viable other options.
    nullVote() {
        this.optionWinner = 10;
        
        let playerContext = this.votingData.filter((item) => {
            return item.id == this.store.getPlayerId();
        })[0];
        
        this.onVote(playerContext);
    }

    // When the next button is pressed, the game should put in a request for the sessions mad lib.
    // This will either generate the next mad lib or will give another generated option.
    async onNext() {
        try {
            await this.api.post({
                nickname: this.store.getPlayerName(),
                playerid: this.store.getPlayerId(),
                sessieid: this.sessionID,
                sessieTimer: this.store.getTimeLimit()
            }, "gamestate").then((result) => {
              this.store.setGameState(result);
            });
            this.router.navigate(['game']);
        } catch(exception) {
            this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
        }
    }

    // When a vote is cast, this function is called. It disables all buttons and submits the vote.
    // Finally, when reply is received it will show the winning option and make the next button available.
    async onVote(context : any) {
        // Make the vote icon visible.
        this.optionSelected = context.uiid;

        if (this.votingData.length > 1) {
            this.votingData.forEach((item) => {
                item.disabled = "true"
            });
        }

        // API call to submit vote, then show result.
        if (this.timer.isTimerSet()) {
            this.timer.stopTimer();
        }
        
        // Set result to error by default, then request updates every second until everyone has voted.
        let votingResultStateObject: any = {
            error: "awaiting-votes-error"
        };
        while ((votingResultStateObject.error !== undefined) 
            && (votingResultStateObject.error == "awaiting-votes-error")) {
            // Wait for one second between requests.
            await new Promise(f => setTimeout(f, 1000));
            
            try {
                // Submit the vote. The backend knows only to process it once.
                await this.api.post({
                    sessieid: this.sessionID,
                    playerid: this.store.getPlayerId(),
                    votedfor: context.id
                }, "vote").then((result: any) => {
                    votingResultStateObject = result;
                });
            } catch(exception) {
                this.snackBar.open("" + exception, 'Sorry', { duration: 5000 });
            }
        }
        
        let winnerContext = this.votingData.find((voter) => {
            return voter.id == votingResultStateObject.winner;
        });
        // This will really never not return a context, but just for safety, fall back to 10.
        // Doesn't really matter for score, just doesn't output any winner feedback.
        if (winnerContext?.uiid == 0) {
            this.optionWinner = 0;
        } else {
            this.optionWinner = winnerContext?.uiid || 10;
        }
    }

    // Found this option to shuffle an array on StackOverflow, works like a charm!
    // https://stackoverflow.com/questions/60787865/randomize-array-in-angular
    shuffleAnswers(answers : VoteDataObject[]) {
        var m = answers.length, t, i;

        while (m) {    
            i = Math.floor(Math.random() * m--);
            t = answers[m];
            answers[m] = answers[i];
            answers[i] = t;
        }

        return answers;
    }
}