//global variables

//firebase setup 
var config = {
    apiKey: "AIzaSyBvZkq3uk82lcf1Dun4IJf4QzHu8e7b5Qg",
    authDomain: "rps-multiplayergame.firebaseapp.com",
    databaseURL: "https://rps-multiplayergame.firebaseio.com",
    projectId: "rps-multiplayergame",
    storageBucket: "rps-multiplayergame.appspot.com",
    messagingSenderId: "637786741042"
};
firebase.initializeApp(config);

var database = firebase.database()

var playerRef = database.ref("/players");

var players = [];
var player1 = {
    name: "",
    currentPick: "",
    isTurn: true,
    score: 0
}
var player2 = {
    name: "",
    currentPick: "",
    isTurn: false,
    score: 0
}

var usersName;
var opponentsName;

//Get player name function 
$("#start-btn").on("click", function(event){
    event.preventDefault();

    var playerName = $("#player-name").val().trim();
    console.log("playerName: ", playerName);

    playerRef.push({
        playerName: playerName
    })

    usersName = playerName;

})

playerRef.on("value", function(snap) {
  console.log("Get player count...");
  console.log(snap.numChildren());
  $("#connected-players").text(snap.numChildren());
  if (snap.numChildren() == 2) {
    console.log("Two Players here please submit your names to start");
    //Call start game function
    console.log("snap: ", snap)
    players = snap.val();
    console.log(players);

    var keys = Object.keys(players);
    console.log("KEYS: ", keys);
    var key1 = keys[0];
    var key2 = keys[1];

    player1.name = players[key1].playerName;
    console.log("Player1 Name: ", player1.name);
    
    player2.name = players[key2].playerName;
    console.log("Player2 Name: ", player2.name);

    if (player1.name === usersName){
        opponentsName = player2.name;
        usersName = player1.name;
    } else {
        opponentsName = player1.name;
        usersName = player2.name;
    }

    startGame();
  }
});

// Start game: 
// Once two players are connected start a game between those two
function startGame() {
    $("#start-div").hide();

    $("#play-div").show();

    // Display info telling them the game has started. Who they are playing and whos turn it is. 
    var greeting = $("<h1>");
    greeting.text(`Hi ${usersName} welcome to my rpg game. You are playing ${opponentsName}.`);

    

    $("#play-div").append(greeting);

}


// something to keep track of turns

// Notify other user of turn 

// Update scores 
