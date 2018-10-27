
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBvZkq3uk82lcf1Dun4IJf4QzHu8e7b5Qg",
    authDomain: "rps-multiplayergame.firebaseapp.com",
    databaseURL: "https://rps-multiplayergame.firebaseio.com",
    projectId: "rps-multiplayergame",
    storageBucket: "rps-multiplayergame.appspot.com",
    messagingSenderId: "637786741042"
};
var app = firebase.initializeApp(config);
console.log(firebase.app().name);  // "[DEFAULT]"

var auth = app.auth();
// The above is shorthand for:
// var auth = firebase.auth(app);

var database = firebase.database();
var isNewUser = false;

// var defaultAuth = firebase.auth();
//document loads hide inputs
$("#player-name").hide();
$("#player-email").hide();
$("#player-password").hide();
$("#start-btn").hide();

$("#signin-btn").on("click", function(){
    $("#player-email").show();
    $("#player-password").show();
    $("#start-btn").show();
    $("#player-name").hide();
    isNewUser = false;
})

$("#register-btn").on("click", function(){
    $("#player-name").show();
    $("#player-email").show();
    $("#player-password").show();
    $("#start-btn").show();
    isNewUser = true;
})

$("#start-btn").on("click", function () {
    
    if (isNewUser) {
        //create account
        submitCreateAccount();
    } else {
        //sign in
        signInAccount();
    }
}) 

// User create Accouunt function 
function submitCreateAccount() {
    var displayName = $("#player-name").val().trim();
    var email = $("#player-email").val().trim();
    var password = $("#player-password").val().trim();

    console.log(`Name: ${displayName}, Email: ${email}, password: ${password}.`);

    auth.createUserWithEmailAndPassword(email, password)
        .catch(function (err){
            console.log("ERROR: ", err);
        })
        .then(function (user) {
            console.log("Account created: ", user);
            //add the displayName
            user.updateProfile({ displayName: displayName });
        })
}

function signInAccount() {
    var email = $("#player-email").val().trim();
    var password = $("#player-password").val().trim();

    console.log(`Signing in... Email: ${email}, password: ${password}.`);

    // Sign in existing user
    auth.signInWithEmailAndPassword(email, password)
        .catch(function (err) {
            // Handle errors
            console.log("ERRORS", err);

        })
    $("#register-btn").hide();
    $("#signin-btn").hide();
    $("#player-name").hide();
    $("#player-email").hide();
    $("#player-password").hide();
}

auth.onAuthStateChanged(function (user) {
    console.log(`Auth state changes user is ${user}`);
    if (user) {
        // User is signed in.
        console.log("USER SIGNED IN!");
        console.log("user: ", user);
        console.log("name: ", user.displayName);
        console.log("email: ", user.email);
        $("#start-div").hide();
    }
});

var user = firebase.auth().currentUser;

if (user) {
    // User is signed in.
    console.log("currentUser: ", user);
    
} else {
    // No user is signed in.
    console.log("no current user.");
}












/*

// Sign out user
firebase.auth().signOut()
    .catch(function (err) {
        // Handle errors
    });



///>>>>>>>>>AUTHENTICATION<<<<<<<<<<<<<<<<<
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

//Requires user to enter a display name
ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ]
});


var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
    
// User create Accouunt function 
function submitCreateAccount() {
    var displayName = document.querySelector("#entry-displayname");
    var email = document.querySelector("#entry-email");
    var password = document.querySelector("#entry-password");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function (user) {
            //add the displayName
            user.updateProfile({ displayName: displayName.value });
        })
}

// User sign in function
function signInWithEmailandPassword() {
    var email = document.querySelector("#email");
    var password = document.querySelector("#password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value);
}

// sign in/ create account with google functions 

/* on auth state change method. Fire if user log ins or off */












/*
//---------------GAME VARIABLES SET UP-------------------//
var player1id;
var player2id;
var currentUser;
var opponent;

var player1 = {
    id: player1id,
    name: "",
    isTurn: true,
    choice: ""
};

var player2 = {
    id: player2id,
    name: "",
    isTurn: false,
    choice: ""
}


// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

var uid = firebase.auth().currentUser.uid;

console.log("Current user ID: ", uid);

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {
        console.log("Connections snap: ", snap.val());

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        console.log("Con: ", con);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#watchers").text(snap.numChildren());

    console.log("connecectionsRef snap: ", snap.val());

    var keys = Object.keys(snap.val());
    console.log("KEYS: ", keys);

     player1id = keys[0];
     console.log("player 1 id: ", player1id);
    player1.id = player1id;

     if (keys.length == 2) {
         player2id = keys[1];
         console.log("player 2 id: ", player2id);
         player2.id = player2id;
         currentUser = player2;
         opponent = player1;
     } 
     else if (keys.length == 1) {
         currentUser = player1;
         opponent = player2;
     }

     
});


$("#start-btn").on("click", function(){

    console.log("Player input: ", $("#player-name").val().trim());
    if (currentUser == player1) {
        player1.name = $("#player-name").val().trim();
        console.log("YOU ARE PLAYER 1");
        
    } else {
        player2.name = $("#player-name").val().trim();
        console.log("YOU ARE PLAYER 2");

    }

    console.log("Your name: ", currentUser.name);

})

*/

