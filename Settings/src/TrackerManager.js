const fs = require('fs');
const trackerFilePath = '../settings/tracker.json';
let cachedTracker = null;

function readTrackerFile() {
	if (cachedTracker !== null) {
		return cachedTracker;
	}

	try {
		const fileContent = fs.readFileSync(trackerFilePath, 'utf8');
		cachedTracker = JSON.parse(fileContent);
		return cachedTracker;
	}
	catch (error) {
		console.error('Error reading tracker file:', error);
		// Define a default structure if the file is missing or corrupted
		return {
			kakera_power: 0,
			has_claimed: false,
			claim_interval: 60,
			next_dk_available: '2022-10-01T12:00:00Z',
			current_threshold_tier: 3,
			time_last_react: '2022-10-01T12:00:00Z',
		};
	}
}

function writeTrackerFile(tracker) {
	try {
		fs.writeFileSync(trackerFilePath, JSON.stringify(tracker, null, 2), 'utf8');
		// Update the cache with the new tracker data
		cachedTracker = tracker;
	}
	catch (error) {
		console.error('Error writing tracker file:', error);
	}
}

function getKakeraPower() {
	return readTrackerFile().kakera_power;
}

function setKakeraPower(value) {
	const tracker = readTrackerFile();
	tracker.kakera_power = value;
	writeTrackerFile(tracker);
}

function getHasClaimed() {
	return readTrackerFile().has_claimed;
}

function setHasClaimed(value) {
	const tracker = readTrackerFile();
	tracker.has_claimed = value;
	writeTrackerFile(tracker);
}

function getClaimInterval() {
	return readTrackerFile().claim_interval;
}

function setClaimInterval(value) {
	const tracker = readTrackerFile();
	tracker.claim_interval = value;
	writeTrackerFile(tracker);
}

function getNextDkAvailable() {
	return readTrackerFile().next_dk_available;
}

function setNextDkAvailable(value) {
	const tracker = readTrackerFile();
	tracker.next_dk_available = value;
	writeTrackerFile(tracker);
}

function getCurrentThresholdTier() {
	return readTrackerFile().current_threshold_tier;
}

function setCurrentThresholdTier(value) {
	const tracker = readTrackerFile();
	tracker.current_threshold_tier = value;
	writeTrackerFile(tracker);
}

function getTimeLastReact() {
	return readTrackerFile().time_last_react;
}

function setTimeLastReact(value) {
	const tracker = readTrackerFile();
	tracker.time_last_react = value;
	writeTrackerFile(tracker);
}

module.exports = {
	// Getters
	getKakeraPower,
	getHasClaimed,
	getClaimInterval,
	getNextDkAvailable,
	getCurrentThresholdTier,
	getTimeLastReact,

	// Setters
	setKakeraPower,
	setHasClaimed,
	setClaimInterval,
	setNextDkAvailable,
	setCurrentThresholdTier,
	setTimeLastReact,
};