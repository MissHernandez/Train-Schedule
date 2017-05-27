  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBweJXOWEO9cIZvnCXwhoD_Eukd1d_a_pA",
    authDomain: "train-scheduler-6e931.firebaseapp.com",
    databaseURL: "https://train-scheduler-6e931.firebaseio.com",
    projectId: "train-scheduler-6e931",
    storageBucket: "train-scheduler-6e931.appspot.com",
    messagingSenderId: "1046285675395"
  };

  firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database();

    // Initial Values
    var train = "";
    var destination = "";
    var firstTime = "";
    var frequency = "";
    var currentTime = moment().format("HH:mm");

    // Capture Button Click
    $("#add-train").on("click", function() {
      // Don't refresh the page!
      event.preventDefault();

      //Store user inputs in variables
      train = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      firstTime = $("#train-time").val().trim();
      frequency = $("#frequency").val().trim();
      nextArrival = moment(firstTime, "HH:mm").format("HH:mm");

      //While nextArrival time is after currentTime, subtract the frequency.
      while (moment(nextArrival, "HH:mm").isAfter(moment(currentTime, "HH:mm"))) {
          nextArrival = moment(nextArrival, "HH:mm").subtract(frequency, "minutes");
        };   

      //While nextArrival time is before currentTime, add the frequency.
      while (moment(nextArrival, "HH:mm").isBefore(moment(currentTime, "HH:mm"))) {
          nextArrival = moment(nextArrival, "HH:mm").add(frequency, "minutes");
        };

      //Format nextArrival to HH:mm.
      nextArrival = moment(nextArrival, "HH:mm").format("HH:mm");

      //Get minutesAway. # of minutes of nextArrival from now.

      minutesAway = moment(nextArrival, "HH:mm").fromNow(true, "mm");

      //Send and store my values to the database.
      database.ref().push({
        train: train,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
      });

});

    // Firebase watcher + initial loader HINT: .on("value")
    database.ref().on("child_added", function(childSnapshot) {

      var child = childSnapshot.val();

      $("#schedule-display").append("<tr><td> " + childSnapshot.val().train + " </td><td> " + childSnapshot.val().destination + " </td><td> " + childSnapshot.val().frequency + " </td><td> " + childSnapshot.val().nextArrival + " </td><td> " + childSnapshot.val().minutesAway + " </td></tr>");

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
