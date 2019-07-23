// FireBase data
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBqKlhgrBGKWsgHoBastjqBl8TC_P9hwhQ",
    authDomain: "isabel-n-train-scheduler-d82f5.firebaseapp.com",
    databaseURL: "https://isabel-n-train-scheduler-d82f5.firebaseio.com",
    projectId: "isabel-n-train-scheduler-d82f5",
    storageBucket: "",
    messagingSenderId: "352797329641",
    appId: "1:352797329641:web:cf445c41802a4ba2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// // Using Moment to set up Current Time
var globalCurrentHour = moment().hour();
var globalCurrentMinutes = moment().minutes();
var globalCurrentTime = moment(globalCurrentHour + ":" + globalCurrentMinutes, "HH:mm");
$(".currentTime").text(globalCurrentTime.format("h:mm a"));

// Submitting
var name;
var destination;
var firstTime;
var frequency;
var newTrain;

$("#submit-button").on("click", function () {
    event.preventDefault();

    name = $("#trainNameInput").val().trim();
    destination = $("#trainDestinationInput").val().trim();
    firstTime = $("#trainTimeInput").val().trim();
    frequency = parseInt($("#frequencyInput").val().trim());

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
    });

    $("input").val("");
})

// database
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());
    // making new table element for entry
     newTrain = $("<tr>").appendTo($("#timeTable"));

    var submission = snapshot.val();
    var trainfirstTime = submission.firstTime;
    // formatting time (First Time is the display Time)
    var firstTime = moment(trainfirstTime, "HH:mm");


    // adjusting local Time
    var localCurrentHour = moment().hour();
    var localCurrentMinutes = moment().minutes();
    var localCurrentTime = moment(localCurrentHour + ":" + localCurrentMinutes, "HH:mm");
    $("#current-time").text(localCurrentTime.format("hh:mm a"));

    // Looking at train Time with Current Time
    if (firstTime > localCurrentTime) {
        var nextArrivalTime = firstTime.format("hh:mm a");
        var minutesAway = firstTime.diff(localCurrentTime, "minutes");
    } else {
        var differenceInMinutes = localCurrentTime.diff(firstTime, "minutes");
        var minutesAway = frequency - (differenceInMinutes % frequency);

        var nextArrival = localCurrentTime.add(minutesAway, "minutes");
        var nextArrivalHour = nextArrival.hour();
        var nextArrivalMinutes = nextArrival.minutes();
        var nextArrivalTime = moment(nextArrivalHour + ":" + nextArrivalMinutes, "HH:mm").format("hh:mm a");
    }

    // Moving Data to HTML
    var newTrain = $("<tr>").append(
        $("<td class='submission' id='name'>").text(submission.name),
        $("<td class='submission' id='destination'>").text(submission.destination),
        $("<td class='submission' id='firstTrain'>").text(firstTime.format("hh:mm a")),
        $("<td class='submission' id='frequency'>").text(submission.frequency),
        $("<td class='submission' id='nextArrival'>").text(nextArrivalTime),
        $("<td class='submission' id='minutesAway'>").text(minutesAway),
    )

    newTrain.appendTo($("#timeTable"));

    

}, function (errorObject) {

    console.log("The read failed: " + errorObject.code);
})