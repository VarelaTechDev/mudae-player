const {
	scheduleTaskSeconds,
	killScheduleSeconds,
	// Adjust the path to where your scheduler module is located
} = require('./delay.js');

function printLove() {
	console.log('I love you <3');
}

// Schedule the printLove function to run every 10 seconds
scheduleTaskSeconds(5, printLove);

// Optionally, if you want to stop the scheduled task at some point:
// killScheduleSeconds();
