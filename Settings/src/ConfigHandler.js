/**
 * @file ConfigHandler.js
 * @description This file contains functions for reading and writing configuration data from a JSON file.
 * The functions provide getters and setters for various configuration values such as series, blacklist, and kakera thresholds.
 * The configuration data is cached in memory to improve performance.
 * @code ConfigHandler.js
 */

const fs = require('fs');
const configFilePath = '../settings/config.json';
let cachedConfig = null;

/**
 * Reads the configuration file and returns the parsed JSON data.
 * If the file is missing or corrupted, a default structure is provided.
 * Logs an error if writing fails.
 * @returns {Object} The configuration data.
 */
function readConfigFile() {
	if (cachedConfig !== null) {
		return cachedConfig;
	}

	try {
		const configFile = fs.readFileSync(configFilePath, 'utf8');
		cachedConfig = JSON.parse(configFile);
	}
	catch (error) {
		console.error('Error reading config file:', error);
		// Provide a default structure if the file is missing or corrupted
		cachedConfig = {
			series: ['Hololive'],
			blacklist: ['Yogori'],
			kakera_threshold: {
				first_hour: 700,
				second_hour: 600,
				third_hour: 400,
			},
		};
	}

	return cachedConfig;
}

/**
 * Get the series configuration value.
 * @returns {Array} The series configuration value.
 */
function getSeries() {
	const configData = readConfigFile();
	return configData.series;
}

/**
 * Get the blacklist configuration value.
 * @returns {Array} The blacklist configuration value.
 */
function getBlacklist() {
	const configData = readConfigFile();
	return configData.blacklist;
}

/**
 * Get the kakera threshold configuration value.
 * @returns {Object} The kakera threshold configuration value.
 */
function getKakeraThreshold() {
	const configData = readConfigFile();
	return configData.kakera_threshold || {};
}

/**
 * Get the kakera threshold for the first hour.
 * @returns {number} The kakera threshold for the first hour.
 */
function getKakeraThresholdFirstHour() {
	const configData = readConfigFile();
	return configData.kakera_threshold.first_hour || 0;
}

/**
 * Get the kakera threshold for the second hour.
 * @returns {number} The kakera threshold for the second hour.
 */
function getKakeraThresholdSecondHour() {
	const configData = readConfigFile();
	return configData.kakera_threshold.second_hour || 0;
}

/**
 * Get the kakera threshold for the third hour.
 * @returns {number} The kakera threshold for the third hour.
 */
function getKakeraThresholdThirdHour() {
	const configData = readConfigFile();
	return configData.kakera_threshold.third_hour || 0;
}

/**
 * Get all the configuration values.
 * @returns {Object} The complete configuration object.
 */
function getAllConfigValues() {
	const configData = readConfigFile();
	// Directly return the object without converting to an array
	return configData;
}

/**
 * Write the configuration data to the file. Logs an error if writing fails.
 * @param {Object} config - The configuration data to write.
 */
function writeConfigFile(config) {
	try {
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
		cachedConfig = config;
	}
	catch (error) {
		console.error('Error writing config file:', error);
	}
}

/**
 * Empties the series array.
 */
function clearSeries() {
	const config = readConfigFile();
	config.series = [];
	writeConfigFile(config);
}

/**
 * Add a new series to the series array.
 * @param {string} newSeries - The new series to add.
 */
function addSeries(newSeries) {
	const config = readConfigFile();
	if (!config.series.includes(newSeries)) {
		config.series.push(newSeries);
		writeConfigFile(config);
	}
}

/**
 * Remove a series from the series array.
 * @param {string} seriesToRemove - The series to remove.
 */
function removeSeries(seriesToRemove) {
	const config = readConfigFile();
	const index = config.series.indexOf(seriesToRemove);
	if (index !== -1) {
		config.series.splice(index, 1);
		writeConfigFile(config);
	}
}

/**
 * Clear the blacklist array.
 */
function clearBlacklist() {
	const config = readConfigFile();
	config.blacklist = [];
	writeConfigFile(config);
}

/**
 * Add an item to the blacklist array.
 * @param {string} item - The item to add.
 */
function addBlacklist(item) {
	const config = readConfigFile();
	if (!config.blacklist.includes(item)) {
		config.blacklist.push(item);
		writeConfigFile(config);
	}
}

/**
 * Remove an item from the blacklist array.
 * @param {string} itemToRemove - The item to remove.
 */
function removeBlacklist(itemToRemove) {
	const config = readConfigFile();
	const index = config.blacklist.indexOf(itemToRemove);
	if (index !== -1) {
		config.blacklist.splice(index, 1);
		writeConfigFile(config);
	}
}

/**
 * Set the kakera threshold for the first hour.
 * @param {number} value - The value to set.
 */
function setKakeraThresholdFirstHour(value) {
	const config = readConfigFile();
	config.kakera_threshold.first_hour = Number(value);
	writeConfigFile(config);
}

/**
 * Set the kakera threshold for the second hour.
 * @param {number} value - The value to set.
 */
function setKakeraThresholdSecondHour(value) {
	const config = readConfigFile();
	config.kakera_threshold.second_hour = Number(value);
	writeConfigFile(config);
}

/**
 * Set the kakera threshold for the third hour.
 * @param {number} value - The value to set.
 */
function setKakeraThresholdThirdHour(value) {
	const config = readConfigFile();
	config.kakera_threshold.third_hour = Number(value);
	writeConfigFile(config);
}


module.exports = {
	// Getters
	getSeries,
	getBlacklist,
	getKakeraThreshold,
	getAllConfigValues,
	getKakeraThresholdFirstHour,
	getKakeraThresholdSecondHour,
	getKakeraThresholdThirdHour,

	// Setters
	writeConfigFile,
	clearSeries,
	addSeries,
	removeSeries,
	clearBlacklist,
	addBlacklist,
	removeBlacklist,
	setKakeraThresholdFirstHour,
	setKakeraThresholdSecondHour,
	setKakeraThresholdThirdHour,
};
