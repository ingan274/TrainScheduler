// FireBase data
var config = {
    apiKey: "AIzaSyBqKlhgrBGKWsgHoBastjqBl8TC_P9hwhQ",
    authDomain: "isabel-n-train-scheduler-d82f5.firebaseapp.com",
    databaseURL: "https://isabel-n-train-scheduler-d82f5.firebaseio.com",
    projectId: "isabel-n-train-scheduler-d82f5",
    storageBucket: "",
    messagingSenderId: "352797329641",
    appId: "1:352797329641:web:cf445c41802a4ba2"
};
firebase.initializeApp(config);

var database = firebase.database();

// Using Moment to set up Current Time
var globalCurrentHour = moment().hour();
var globalCurrentMinutes = moment().minutes();
var globalCurrentTime = moment(globalCurrentHour + ":" + globalCurrentMinutes, "HH:mm");
$(".currentTime").text(globalCurrentTime.format("h:mm a"));