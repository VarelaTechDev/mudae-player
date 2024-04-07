function isDST() {
	const jan = new Date(new Date().getFullYear(), 0, 1);
	const jul = new Date(new Date().getFullYear(), 6, 1);
	return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == new Date().getTimezoneOffset();
}

function generate24Intervals(startHour, startMinute) {
	const intervals = [];

	// Generate 8 cycles to cover a full day
	for (let cycle = 0; cycle < 8; cycle++) {
		for (let intervalNum = 1; intervalNum <= 3; intervalNum++) {
			// Calculate end time
			let endHour = startHour;
			let endMinute = startMinute + 59;

			if (endMinute >= 60) {
				endHour++;
				endMinute %= 60;
			}

			// Convert 24-hour time to 12-hour format for easier readability
			const start = `${startHour % 24}:${String(startMinute).padStart(2, '0')}`;
			const end = `${endHour % 24}:${String(endMinute).padStart(2, '0')}`;

			intervals.push({ start, end, interval: intervalNum });

			// Prepare for the next interval start
			startHour = endHour;
			startMinute = (endMinute + 1) % 60;
			// Hour increment at the 60th minute
			if (startMinute === 0) {
				startHour++;
			}
		}
		// After 3 intervals, skip 1 hour to start the next cycle
		startHour += 1;
		// Ensure the hour wraps correctly
		if (startHour >= 24) startHour -= 24;
	}


	// Filter out any potential duplicates due to hour wrapping
	return intervals.filter((value, index, self) =>
		index === self.findIndex((t) => (
			t.start === value.start && t.end === value.end
		)),
	);
}

// Use the function
const isDaylightSavingTime = isDST();
const intervals = isDaylightSavingTime ? generate24Intervals(1, 30) : generate24Intervals(0, 30);

console.log(intervals);

// No DST
console.log(generate24Intervals(0, 30));

function findInterval(time, intervalsData) {
	// Convert the input time to minutes past midnight for easier comparison
	const [inputHour, inputMinute] = time.split(':').map(Number);
	const inputTimeInMinutes = inputHour * 60 + inputMinute;

	// Iterate over the intervals
	for (const interval of intervalsData) {
		// Convert the start and end times of the interval to minutes past midnight
		const [startHour, startMinute] = interval.start.split(':').map(Number);
		const [endHour, endMinute] = interval.end.split(':').map(Number);
		const startTimeInMinutes = startHour * 60 + startMinute;
		const endTimeInMinutes = endHour * 60 + endMinute;

		// Check if the input time falls within the interval
		if (inputTimeInMinutes >= startTimeInMinutes && inputTimeInMinutes <= endTimeInMinutes) {
			return interval;
		}
	}

	// If no matching interval was found, return null
	return null;
}

// Use the function
const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
const currentInterval = findInterval(currentTime, intervals);
console.log(currentInterval);
