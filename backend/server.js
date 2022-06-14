var express = require('express');
var app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

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
        "sessieid": request.sessieid || "80008",
        "player_1": request.nickname,
        "player_2": player2 || "",
        "player_3": player3 || "",
        "player_4": player4 || "",
        "player_5": "",
        "player_6": ""
    }

    res.json(login_response);
});

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

function decipher(json) {
    return JSON.parse(json.headers.requestjson);
}

app.listen(1234)
