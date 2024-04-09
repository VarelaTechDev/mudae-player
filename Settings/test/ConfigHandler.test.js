const fs = require('fs');
const {
	getSeries,
	getBlacklist,
	getKakeraThreshold,
	getKakeraThresholdFirstHour,
	getKakeraThresholdSecondHour,
	getKakeraThresholdThirdHour,
	getAllConfigValues,
} = require('../src/ConfigHandler');

// Mocking the fs module
jest.mock('fs');

describe('ConfigHandler Getters', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();

		// Setup fs.readFileSync mock to return a JSON string
		fs.readFileSync.mockReturnValue(JSON.stringify({
			series: ['Hololive'],
			blacklist: ['Yogori'],
			kakera_threshold: {
				first_hour: 700,
				second_hour: 600,
				third_hour: 400,
			},
		}));
	});

	test('getSeries returns the correct series array', () => {
		const series = getSeries();
		expect(series).toEqual(['Hololive']);
	});

	test('getBlacklist returns the correct blacklist array', () => {
		const blacklist = getBlacklist();
		expect(blacklist).toEqual(['Yogori']);
	});

	test('getKakeraThreshold returns the correct kakera threshold object', () => {
		const kakeraThreshold = getKakeraThreshold();
		expect(kakeraThreshold).toEqual({
			first_hour: 700,
			second_hour: 600,
			third_hour: 400,
		});
	});

	test('getKakeraThresholdFirstHour returns the correct kakera threshold for the first hour', () => {
		const firstHourThreshold = getKakeraThresholdFirstHour();
		expect(firstHourThreshold).toBe(700);
	});

	test('getKakeraThresholdSecondHour returns the correct kakera threshold for the second hour', () => {
		const secondHourThreshold = getKakeraThresholdSecondHour();
		expect(secondHourThreshold).toBe(600);
	});

	test('getKakeraThresholdThirdHour returns the correct kakera threshold for the third hour', () => {
		const thirdHourThreshold = getKakeraThresholdThirdHour();
		expect(thirdHourThreshold).toBe(400);
	});

	test('getAllConfigValues returns all the configuration values', () => {
		const expectedConfig = {
			series: ['Hololive'],
			blacklist: ['Yogori'],
			kakera_threshold: {
				first_hour: 700,
				second_hour: 600,
				third_hour: 400,
			},
		};

		const configValues = getAllConfigValues();
		expect(configValues).toEqual(expectedConfig);
	});
});
