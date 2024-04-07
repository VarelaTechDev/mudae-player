const calculateDelayForNextExecution = (intervalSeconds) => {
	const now = new Date();
	const secondsPastTheMinute = now.getSeconds();
	const delay = intervalSeconds - (secondsPastTheMinute % intervalSeconds);
	// Return delay in milliseconds
	return delay * 1000;
};

let secondsTimeoutHandle;

// Updated scheduleTaskSeconds with renamed handle
const scheduleTaskSeconds = (intervalSeconds, taskFunction, args = [], isFirstExecution = true) => {
	if (isFirstExecution) {
		console.log(`Scheduling task to run every ${intervalSeconds} seconds.`);
	}

	const delay = calculateDelayForNextExecution(intervalSeconds);
	clearTimeout(secondsTimeoutHandle);

	secondsTimeoutHandle = setTimeout(() => {
		taskFunction(...args);
		scheduleTaskSeconds(intervalSeconds, taskFunction, args, false);
	}, delay);
};


let minutesTimeoutHandle;

const scheduleTaskMinutes = (intervalMinutes, taskFunction, args = [], isFirstExecution = true) => {
	if (isFirstExecution) {
		console.log(`Scheduling task to run every ${intervalMinutes} minutes.`);
	}

	const now = new Date();
	const secondsPastTheHour = now.getMinutes() * 60 + now.getSeconds();
	const delay = ((intervalMinutes * 60) - (secondsPastTheHour % (intervalMinutes * 60))) * 1000;
	clearTimeout(minutesTimeoutHandle);

	minutesTimeoutHandle = setTimeout(() => {
		taskFunction(...args);
		scheduleTaskMinutes(intervalMinutes, taskFunction, args, false);
	}, delay);
};


let hoursTimeoutHandle;

const scheduleTaskHours = (intervalHours, taskFunction, args = [], isFirstExecution = true) => {
	if (isFirstExecution) {
		console.log(`Scheduling task to run every ${intervalHours} hours.`);
	}

	const now = new Date();
	const secondsPastTheDay = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
	const delay = ((intervalHours * 3600) - (secondsPastTheDay % (intervalHours * 3600))) * 1000;
	clearTimeout(hoursTimeoutHandle);

	hoursTimeoutHandle = setTimeout(() => {
		taskFunction(...args);
		scheduleTaskHours(intervalHours, taskFunction, args, false);
	}, delay);
};

// For seconds
const killScheduleSeconds = () => {
	clearTimeout(secondsTimeoutHandle);
};

// For minutes
const killScheduleMinutes = () => {
	clearTimeout(minutesTimeoutHandle);
};

// For hours
const killScheduleHours = () => {
	clearTimeout(hoursTimeoutHandle);
};


module.exports = {
	scheduleTaskSeconds,
	scheduleTaskMinutes,
	scheduleTaskHours,
	killScheduleSeconds,
	killScheduleMinutes,
	killScheduleHours,
};