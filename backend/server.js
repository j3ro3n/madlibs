var express = require('express');
var app = express();

const cors = require('cors');
const { response } = require('express');
app.use(cors({
    origin: '*'
}));

/*
    Mocked API request//response for getting the initial state of the game.

    Adds a session id if it was not set already, adds fake players if it was.
*/
app.get('/login', (req, res) => {
    let request = decipher(req);
    
    var player2 = "";
    var player3 = "";
    var player4 = "";
    if (request.sessieid !== '') {
        player2 = "Bobby";
        player3 = "Buddy";
        player4 = "Johnny";
    }
    
    var login_response = {
        "sessieid": request.sessieid || "R4ND0",
        "player_1_name": request.nickname,
        "player_1_score": 0,
        "player_2_name": player2 || "",
        "player_2_score": 0,
        "player_3_name": player3 || "",
        "player_3_score": 0,
        "player_4_name": player4 || "",
        "player_4_score": 0,
        "player_5_name": "",
        "player_5_score": 0,
        "player_6_name": "",
        "player_6_score": 0,
        "sessieTimer": request.sessieTimer
    }

    res.json(login_response);
});

/*
    Mocked API request//response for getting a mad lib.
*/
app.get('/madlib', (req, res) => {
    let request = decipher(req);

    // Fake attach mad lib to session id.
    // So busy. Mmh.
    if (request.request == "mad lib") {
        res.json(
            {
                "madlib": "A malicious $CREATURE drowns a $CREATURE at a $EVENT to clean the $SUBSTANCE from a $OBJECT.",
                "creature": [
                    {
                        "id": 1,
                        "creature_1": "Gecko",
                        "creature_2": "Lynx",
                        "creature_3": "Homo sapiens",
                        "creature_4": "Tyrannosaurus Rex"
                    },
                    {
                        "id": 2,
                        "creature_1": "Jaguar",
                        "creature_2": "Kabouter Plop",
                        "creature_3": "Tinky Winky",
                        "creature_4": "Ninja"
                    }
                ],
                "event": [
                    {
                        "id": 1,
                        "event_1": "Birthday party",
                        "event_2": "Community Cleanup",
                        "event_3": "Car race",
                        "event_4": "Paddle game"
                    }
                ],
                "substance": [
                    {
                        "id": 1,
                        "substance_1": "Alcohol",
                        "substance_2": "Oil",
                        "substance_3": "Peanut Butter",
                        "substance_4": "Honey"
                    }
                ],
                "object": [
                    {
                        "id": 1,
                        "object_1": "Baseball Bat",
                        "object_2": "Smartphone",
                        "object_3": "Drinking bottle",
                        "object_4": "Lighter"
                    }
                ]
            }
        );
    }
});

app.get('/submit', (req, res) => {
    let randomIfFinished = Math.floor(Math.random() * 20);
    let responseJson = {};
    
    if (randomIfFinished > 3) {
        let request = decipher(req);
    
        responseJson = {
            sessieid: request.sessieid,
            player1_name: request.nickname,
            player1_madlib: request.madlib,
            player1_id: request.playerid,
            player1_voteable: request.voteable,
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
        }
    } else {
        responseJson = {
            error: "awaiting-submissions-error"
        };
    }

    res.json(responseJson);
});

/*
    Helper function to not have to type out the JSON.parse bit. For easier reading.
*/
function decipher(json) {
    return JSON.parse(json.headers.requestjson);
}

/*
    Start the mock API server on port 1234.
*/
app.listen(1234)
