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
app.get('/gamestate', (req, res) => {
    let request = decipher(req);
    
    var player2 = "";
    var player3 = "";
    var player4 = "";
    if (request.sessieid !== '') {
        player2 = "Bobby";
        player3 = "Buddy";
        player4 = "Johnny";
    }
    
    var login_response = {};
    if (request.sessieid == "") {
        login_response = {
            "sessieid": "R4ND0",
            "player_1_name": request.nickname,
            "player_1_score": 0,
            "player_1_id": "4L0N3",
            "player_2_name": "",
            "player_2_score": 0,
            "player_2_id": "",
            "player_3_name": "",
            "player_3_score": 0,
            "player_3_id": "",
            "player_4_name": "",
            "player_4_score": 0,
            "player_4_id": "",
            "player_5_name": "",
            "player_5_score": 0,
            "player_5_id": "",
            "player_6_name": "",
            "player_6_score": 0,
            "player_6_id": "",
            "sessieTimer": request.sessieTimer
        }
    } else {
        login_response = {
            "sessieid": request.sessieid,
            "player_1_name": player2 || "",
            "player_1_score": 0,
            "player_1_id": "9876",
            "player_2_name": player3 || "",
            "player_2_score": 0,
            "player_2_id": "4567",
            "player_3_name": player4 || "",
            "player_3_score": 0,
            "player_3_id": "6789",
            "player_4_name": request.nickname,
            "player_4_score": 0,
            "player_4_id": "MUL71",
            "player_5_name": "",
            "player_5_score": 0,
            "player_5_id": "",
            "player_6_name": "",
            "player_6_score": 0,
            "player_6_id": "",
            "sessieTimer": 30
        }
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
        res.json({
            "madlib": "A malicious $CREATURE drowns a $CREATURE at a $EVENT to clean the $SUBSTANCE from a $OBJECT.",
            "categories": [
                {
                    "type": "Creature",
                    "words": [
                        {
                            "id": 1,
                            "word_1": "Gecko",
                            "word_2": "Lynx",
                            "word_3": "Homo sapiens",
                            "word_4": "Tyrannosaurus Rex"
                        },
                        {
                            "id": 2,
                            "word_1": "Jaguar",
                            "word_2": "Kabouter Plop",
                            "word_3": "Trump",
                            "word_4": "Ninja"
                        }
                    ]
                },
                {
                    "type": "Event",
                    "words": [
                        {
                            "id": 1,
                            "word_1": "Birthday party",
                            "word_2": "Community Cleanup",
                            "word_3": "Car race",
                            "word_4": "Paddle game"
                        }
                    ]
                },
                {
                    "type": "Substance",
                    "words": [
                        {
                            "id": 1,
                            "word_1": "Alcohol",
                            "word_2": "Oil",
                            "word_3": "Peanut Butter",
                            "word_4": "Honey"
                        }
                    ]
                },
                {
                    "type": "Object",
                    "words": [
                        {
                            "id": 1,
                            "word_1": "Baseball Bat",
                            "word_2": "Smartphone",
                            "word_3": "Drinking bottle",
                            "word_4": "Lighter"
                        }
                    ]
                }
            ]
        });
    }
});

/*
    Mocked API request//response for sending in a mad lib. Randomized if finished. 
    If not finished, make em wait.
*/
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
            player2_name: "Test_player_2",
            player2_madlib: "This is something funny.",
            player2_id: "2",
            player2_voteable: "false",
            player3_name: "Test_player_3",
            player3_madlib: "This is something hilarious.",
            player3_id: "3",
            player3_voteable: "false",
            player4_name: "Test_player_4",
            player4_madlib: "This is something kind of good.",
            player4_id: "4",
            player4_voteable: "false",
            player5_name: "Test_player_5",
            player5_madlib: "This is something mediocre.",
            player5_id: "5",
            player5_voteable: "false",
            player6_name: "Test_player_6",
            player6_madlib: "This is something that should be weaponized.",
            player6_id: "6",
            player6_voteable: "false"
        }
    } else {
        responseJson = {
            error: "awaiting-submissions-error"
        };
    }

    // let request = decipher(req);
    
    // responseJson = {
    //     sessieid: request.sessieid,
    //     player1_name: request.nickname,
    //     player1_madlib: request.madlib,
    //     player1_id: request.playerid,
    //     player1_voteable: request.voteable,
    //     player2_name: "",
    //     player2_madlib: "",
    //     player2_id: "",
    //     player2_voteable: "",
    //     player3_name: "",
    //     player3_madlib: "",
    //     player3_id: "",
    //     player3_voteable: "",
    //     player4_name: "",
    //     player4_madlib: "",
    //     player4_id: "",
    //     player4_voteable: "",
    //     player5_name: "",
    //     player5_madlib: "",
    //     player5_id: "",
    //     player5_voteable: "",
    //     player6_name: "",
    //     player6_madlib: "",
    //     player6_id: "",
    //     player6_voteable: ""
    // }

    res.json(responseJson);
});

/*
    Mocked API request//response for voting for a mad lib. Randomized if finished. 
    If not finished, make em wait.
*/
app.get('/vote', (req, res) => {
    let randomIfFinished = Math.floor(Math.random() * 20);
    let responseJson = {};
    
    if (randomIfFinished > 3) {
        responseJson = {
            winner: "3"
        }
    } else {
        responseJson = {
            error: "awaiting-votes-error"
        };
    }

    res.json(responseJson);
});

/*
    Mocked API request//response for receiving a new set of words.
*/
app.get('/shuffle', (req, res) => {
    let request = decipher(req);
    res.json(getFourWords(request.category, 0));
});

/* 
    Mocked API request//response for receiving new words to be saved.
*/
app.get('/word', (req, res) => {
    let randomIfFinished = Math.floor(Math.random() * 20);
    if (randomIfFinished > 10) {
        res.json({
            result: "failed"
        });
    } else {
        res.json({
            result: "success"
        });
    }
});

/*
    Helper function to generate some pretend words.
*/
function getFourWords(category, id) {
    let creatureArray = [
        "Barbarian",
        "Big Bad Wolf",
        "Chocobo",
        "Crab",
        "Crane",
        "Donald Trump",
        "Gecko",
        "Goblin",
        "Homo sapiens",
        "Jaguar",
        "Joe Biden",
        "Kabouter Plop",
        "Kraken",
        "Lion",
        "Lynx",
        "Moogle",
        "Ninja",
        "Samurai",
        "T-Rex",
        "Uruk-hai"
    ];
    let eventArray = [
        "Babyshower",
        "Bar crawl",
        "Beach volley game",
        "Birthday party",
        "Chess tournament",
        "Community Cleanup",
        "Convention",
        "F1 Race",
        "Football game",
        "Hackathon",
        "High school prom",
        "Lowlands festival",
        "Market",
        "Paddle game",
        "Pinkpop festival",
        "Pot luck",
        "Public execution",
        "Ren faire",
        "School assessment",
        "Sweet 16 party"
    ];
    let objectArray = [
        "3D printer",
        "Baseball Bat",
        "Book",
        "Car key",
        "Cardboard box",
        "Drinking bottle",
        "Fineliner",
        "Fridge",
        "Headphones",
        "Houseplant",
        "Keyboard",
        "Kitchen counter",
        "Lighter",
        "Microphone",
        "Monitor",
        "Pencil",
        "Picture",
        "Smartphone",
        "Stepladder",
        "Tissue"
    ];
    let substanceArray = [
        "Alcohol",
        "BBQ sauce",
        "Beer",
        "Cake",
        "Cheese",
        "Cookie dough",
        "Honey",
        "Iced tea",
        "Mayonaise",
        "Milk",
        "Oil",
        "Oregano",
        "Peanut Butter",
        "Pepper",
        "Pie",
        "Salt",
        "Soy milk",
        "Water",
        "Whiskey",
        "Wine"
    ];

    let useArray;
    switch (category) {
        case "Creature": useArray = creatureArray; break;
        case "Event": useArray = eventArray; break;
        case "Object": useArray = objectArray; break;
        case "Substance": useArray = substanceArray; break;
        default: return {};
    }

    let arrayKeys = [];
    while (arrayKeys.length < 4) {

        let randomNumber = Math.floor(Math.random() * useArray.length);

        let goAhead = true;
        for (let index = 0; index < arrayKeys.length; index++) {
            if (arrayKeys[index] == randomNumber) {
                goAhead = false;
            }
        }
        if (goAhead) {
            arrayKeys.push(randomNumber);
        }
    }

    return {
        "id": id,
        "word_1": useArray[arrayKeys[0]],
        "word_2": useArray[arrayKeys[1]],
        "word_3": useArray[arrayKeys[2]],
        "word_4": useArray[arrayKeys[3]]
    };
}

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
