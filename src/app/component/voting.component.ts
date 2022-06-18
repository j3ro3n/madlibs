import { Component } from '@angular/core';
import { StoreService } from '../service/localStore.services';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.services';
import { WaitingDialog } from './waitingdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TimerService } from '../service/timer.services';

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
    optionSelected : number = -1;
    optionWinner : number = -1;
    footer_message : string = "";

    // Constructor
    constructor(
        private api : ApiService,
        public waitingDialog : MatDialog,
        private store : StoreService,
        protected timer : TimerService,
        private router : Router
    ) {
        // For quick testing, if left empty, fill with junk values.
        if (store.getVotingState() == undefined) {
            // this.quit();

            // Add junk data for testing for now.
            let testVotingState = {
                sessieid: "S4NT4",
                player1_name: "Santa Clause",
                player1_madlib: "This is something jolly.",
                player1_id: "1",
                player1_voteable: "true",
                player2_name: "Donner",
                player2_madlib: "This is something funny.",
                player2_id: "2",
                player2_voteable: "true",
                player3_name: "Blitzen",
                player3_madlib: "This is something hilarious.",
                player3_id: "3",
                player3_voteable: "true",
                player4_name: "Dasher",
                player4_madlib: "This is something kind of good.",
                player4_id: "4",
                player4_voteable: "false",
                player5_name: "Dancer",
                player5_madlib: "This is something mediocre.",
                player5_id: "5",
                player5_voteable: "true",
                player6_name: "Comet",
                player6_madlib: "This is something that should be weaponized.",
                player6_id: "6",
                player6_voteable: "false"
                // player6_name: "",
                // player6_madlib: "",
                // player6_id: "",
                // player6_voteable: ""
            }
            this.store.setPlayerName("Santa Clause");
            this.votingData = this.convertVotingJSONtoUIObjects(testVotingState);
        } else {
            // Grab data from the form.
            this.votingData = this.convertVotingJSONtoUIObjects(store.getVotingState());
        }
    }

    // Event: onInit append. Do last minute updates to UI elements, store what is needed and display.
    async ngOnInit() {
        // Get data for display:
        this.footer_message = this.store.MAD_LIBS_FOOTER;

        // Start a 30 second timer
        this.timer.setClock(30);
        this.timer.timerCountdown();
        this.timer.timerDone.subscribe(() => {
            console.log("Timer done!");
        });
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

        if (votingDataTemp.length == 1) {
            this.onVote(votingDataTemp[0]);
        }

        return votingDataTemp;
    }

    // Return the user to the main screen.
    quit() {
        this.router.navigate([ '' ]);
    }

    // When the next button is pressed, the game should put in a request for the sessions mad lib.
    // This will either generate the next mad lib or will give another generated option.
    onNext() {
        // API call here.
        console.log("Next was pressed.");
    }

    // When a vote is cast, this function is called. It disables all buttons and submits the vote.
    // Finally, when reply is received it will show the winning option and make the next button available.
    async onVote(context : any) {
        // Make the vote icon visible.
        this.optionSelected = context.uiid;

        this.votingData.forEach((item) => {
            item.disabled = "true"
        });

        // API call to submit vote, then show result:
        // This is test:
        this.timer.stopTimer();
        await new Promise(f => setTimeout(f, 3000));
        this.optionWinner = 4;
        
        console.log(context);
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