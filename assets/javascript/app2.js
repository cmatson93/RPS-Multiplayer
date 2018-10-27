// Initialize Firebase
var config = {
  apiKey: "AIzaSyBvZkq3uk82lcf1Dun4IJf4QzHu8e7b5Qg",
  authDomain: "rps-multiplayergame.firebaseapp.com",
  databaseURL: "https://rps-multiplayergame.firebaseio.com",
  projectId: "rps-multiplayergame",
  storageBucket: "rps-multiplayergame.appspot.com",
  messagingSenderId: "637786741042"
};
firebase.initializeApp(config);

var database = firebase.database();

// User create Accouunt function 
function submitCreateAccount() {
    var displayName = document.querySelector("#entry-displayname");
    var email = document.querySelector("#entry-email");
    var password = document.querySelector("#entry-password");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function(user){
            //add the displayName
            user.updateProfile({displayName: displayName.value});
        })
}

// User sign in function
function signInWithEmailandPassword(){
    var email = document.querySelector("#email");
    var password = document.querySelector("#password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value);
}

// sign in/ create account with google functions 

/* on auth state change method. Fire if user log ins or off */ 


//Chat system: 
/* 
    Realtime database
    - lots of json
    - will let you know if something changes in your database.
*/

function sendChatMessage() {
    ref = firebase.database().ref("/chat");
    messageField = document.querySelector("#chat-message");

    // Pushing in an object with a name and message
    ref.push().set({
        name: firebase.auth().currentUser.displayName,
        message: messageField.value
    })
    // Unique Key is made here automatically 
}

// Getting updates when something is pushed into the db
ref = firebase.database().ref("/chat");

//Only get the child added not the whole string -----> Twitch uses firebase for their chat! 
ref.on("child_added", function(snapshot){
    var message = snapshot.val();
    addChatMessage(message.name, message.message);
})

//Function to display chat onto the screen 
function addChatMessage(name, message){

}

// Match Making: setting users
//Create a game
ref = firebase.database().ref("/games");

function createGame() {
    var user = firebase.auth().currentUser();
    var currentGame = {
        creator: { uid: user.uid, displayName: user.displayName},
        state: STATE.OPEN
    }

    ref.push().set(currentGame);
}

function joinGame(key){
    var user = firebase.auth().currentUser;
    var gameRef = ref.child(key);
    gameRef.transaction(function(game){
        if (!game.joiner){
            game.state = STATE.JOINED;
            game.joiner = {uid: user.uid, displayName: user.displayName}
        }

        return game;
    })
}

//Watching game
function watchGame(key){
    var gameRef = ref.child(key);
    gameRef.on("value", function(snapshot){
        var game = snapshot.val();
        switch (game.state){
            case STATE.JOINED: joinedGame(gameRef, game); break;
            case STATE.TAKE_PICTURE: countDownToTakeingPicture(gameRef, game); break;
            case STATE.UPLOADED_PICTURE: displayUploadedPicture(game); detectMyFace(gameRef, game); break;
            case STATE.FACE_DETECTED: displayeDetectedEmotion(game); determindWinner(gameRef, game); break;
            case STATE.COMPLETE: showWinner(game); break;
        }
    })
}

