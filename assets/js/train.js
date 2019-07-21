var config = {
    // apiKey: "AIzaSyCWm736WLxvxj93jE0hzjbQ2qwYH0WtCgM",
    // authDomain: "train-scheduler-29f86.firebaseapp.com",
    // databaseURL: "https://train-scheduler-29f86.firebaseio.com",
    // projectId: "train-scheduler-29f86",
    // storageBucket: "",
    // messagingSenderId: "871464677087"
};
firebase.initializeApp(config);

var database = firebase.database();

var globalCurrentHour = moment().hour();
var globalCurrentMinutes = moment().minutes();
var globalCurrentTime = moment(globalCurrentHour + ":" + globalCurrentMinutes, "HH:mm");
$("#current-time").text(globalCurrentTime.format("hh:mm a"));

$("#submit-button").on("click", function() {
    event.preventDefault();

    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#first-train-time").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    })

    $("input").val("");
})

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot);
    var newTrain = $("<tr>").appendTo($("#train-data"));
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
})

function addData(data) {
    return $("<td>").text(data)
}