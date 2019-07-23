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

// Submitting
$("#submit-button").on("click", function() {
    event.preventDefault();

    var name = $("#trainNameInput").val().trim();
    var destination = $("#trainDestinationInput").val().trim();
    var firstTime = $("#trainTimeInput").val().trim();
    var frequency = parseInt($("#frequencyInput").val().trim());

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    })

    $("input").val("");
})

// database

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot);
    // making new table element for entry
    var newTrain = $("<tr>").appendTo($("#timeTable"));
    addData(snapshot.val().name).appendTo(newTrain);
    addData(snapshot.val().destination).appendTo(newTrain);

    var firstTime = moment(snapshot.val().firstTime, "HH:mm");
    addData(firstTime.format("hh:mm a")).appendTo(newTrain);

    var frequency = snapshot.val().frequency;
    addData(frequency).appendTo(newTrain);

    var localCurrentHour = moment().hour();
    var localCurrentMinutes = moment().minutes();
    var localCurrentTime = moment(localCurrentHour + ":" + localCurrentMinutes, "HH:mm");
    $("#current-time").text(localCurrentTime.format("hh:mm a"));

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

    addData(nextArrivalTime).appendTo(newTrain);
    addData(minutesAway).appendTo(newTrain);
}, function(errorObject) {


})

function addData(data) {
    return $("<td>").text(data)
}