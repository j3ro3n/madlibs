var express = require('express');
var app = express();

const cors = require('cors');
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
                "mad lib": "A malicious $CREATURE drowns at a $EVENT to clean the $SUBSTANCE from another $OBJECT.",
                "creature": {
                    "creature_1": "Gecko",
                    "creature_2": "Lynx",
                    "creature_3": "Homo sapiens",
                    "creature_4": "Tyrannosaurus Rex"
                },
                "event": {
                    "event_1": "Birthday party",
                    "event_2": "Community Cleanup",
                    "event_3": "Car race",
                    "event_4": "Paddle game"
                },
                "substance": {
                    "substance_1": "Alcohol",
                    "substance_2": "Oil",
                    "substance_3": "Peanut Butter",
                    "substance_4": "Honey"
                },
                "object": {
                    "object_1": "Baseball Bat",
                    "object_2": "Smartphone",
                    "object_3": "Drinking bottle",
                    "object_4": "Lighter"
                }
            }
        );
    } else {
        res.json(
            { 
                error: "Wrong request."
            }
        );
    }
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
