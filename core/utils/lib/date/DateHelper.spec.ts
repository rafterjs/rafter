import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { DateHelper } from './DateHelper';

describe('DateHelper', () => {
  const dateHelper = new DateHelper();
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = useFakeTimers(new Date('2021-02-23T00:00:00.000Z'));
  });

  afterEach(() => {
    if (clock) {
      clock.restore();
    }
  });

  describe('getNow()', () => {
    it(`should successfully get the current datetime`, () => {
      const now = dateHelper.getNow();

      expect(now.toJSDate()).toEqual(new Date('2021-02-23T00:00:00.000Z'));
    });
  });

  describe('getPastDate()', () => {
    it(`should successfully get a date in the past`, () => {
      const pastDate = dateHelper.getPastDate({ years: 1, months: 1, days: 1 });

      expect(pastDate.toJSDate()).toEqual(new Date('2020-01-22T00:00:00.000Z'));
    });
  });

  describe('getFutureDate()', () => {
    it(`should successfully get a date in the future`, () => {
      const pastDate = dateHelper.getFutureDate({ years: 1, months: 1, days: 1 });

      expect(pastDate.toJSDate()).toEqual(new Date('2022-03-24T00:00:00.000Z'));
    });
  });

  describe('getDateFromJsDate()', () => {
    it(`should successfully get a date from a JS Date`, () => {
      const jsDate = dateHelper.getDateFromJsDate(new Date('2021-02-23T00:00:00.000Z'));

      expect(jsDate.toJSDate()).toEqual(new Date('2021-02-23T00:00:00.000Z'));
    });
  });

  describe('getDateFromShortDateString()', () => {
    it(`should successfully get a date from a string with a short date format in UTC`, () => {
      const date = dateHelper.getDateFromShortDateString('2021-02-02', { zone: 'UTC' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-02T00:00:00.000Z'));
    });

    it(`should successfully get a date from a string with a short date format in Australia/Melbourne`, () => {
      const date = dateHelper.getDateFromShortDateString('2021-02-02', { zone: 'Australia/Melbourne' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-01T13:00:00.000Z'));
    });
  });

  describe('getDateFromLongDateString()', () => {
    it(`should successfully get a date from a string with a long date format in UTC`, () => {
      const date = dateHelper.getDateFromLongDateString('2021-02-02 20:02:01.000', { zone: 'UTC' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-02T20:02:01.000Z'));
    });

    it(`should successfully get a date from a string with a long date format in Australia/Melbourne`, () => {
      const date = dateHelper.getDateFromLongDateString('2021-02-02 20:02:01.000', { zone: 'Australia/Melbourne' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-02T09:02:01.000Z'));
    });
  });

  describe('getDateFromIsoDateString()', () => {
    it(`should successfully get a date from a string with an iso date format in UTC`, () => {
      const date = dateHelper.getDateFromIsoDateString('2021-02-02T20:02:01.000', { zone: 'UTC' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-02T20:02:01.000Z'));
    });

    it(`should successfully get a date from a string with an iso date format in Australia/Melbourne`, () => {
      const date = dateHelper.getDateFromIsoDateString('2021-02-02T20:02:01.000', { zone: 'Australia/Melbourne' });

      expect(date.toJSDate()).toEqual(new Date('2021-02-02T09:02:01.000Z'));
    });
  });

  describe('getDifferenceBetweenDatesInMonths()', () => {
    it(`should successfully get the difference between 2 dates in months`, () => {
      const startDate = dateHelper.getDateFromIsoDateString('2021-02-02T20:02:01.000');
      const endDate = dateHelper.getDateFromIsoDateString('2021-04-06T20:02:01.000');
      const months = dateHelper.getDifferenceBetweenDatesInMonths(startDate, endDate);

      expect(months).toEqual(2.1);
    });
  });

  describe('getDifferenceBetweenShortDatesInMonths()', () => {
    it(`should successfully get the difference between 2 dates in months`, () => {
      const months = dateHelper.getDifferenceBetweenShortDatesInMonths('2021-02-02', '2021-04-06');

      expect(months).toEqual(2.1);
    });
  });

  describe('getDifferenceBetweenDatesInDays()', () => {
    it(`should successfully get the difference between 2 dates in days`, () => {
      const startDate = dateHelper.getDateFromIsoDateString('2021-02-02T20:02:01.000');
      const endDate = dateHelper.getDateFromIsoDateString('2021-04-06T20:02:01.000');
      const months = dateHelper.getDifferenceBetweenDatesInDays(startDate, endDate);

      expect(months).toEqual(63);
    });
  });

  describe('getDifferenceBetweenShortDatesInDays()', () => {
    it(`should successfully get the difference between 2 dates in days`, () => {
      const months = dateHelper.getDifferenceBetweenShortDatesInDays('2021-02-02', '2021-04-06');

      expect(months).toEqual(63);
    });
  });

  describe('formatToShortDateString()', () => {
    it(`should successfully format a date to a short date string`, () => {
      const now = dateHelper.getNow();
      const shortDate = dateHelper.formatToShortDateString(now);

      expect(shortDate).toEqual('2021-02-23');
    });
  });

  describe('formatToLongDateTimeString()', () => {
    it(`should successfully format a date to a long date string`, () => {
      const now = dateHelper.getNow();
      const longDate = dateHelper.formatToLongDateTimeString(now);

      expect(longDate).toEqual('2021-02-23 00:00:00.000');
    });
  });

  describe('formatToIsoDateTimeString()', () => {
    it(`should successfully format a date to an iso date string`, () => {
      const now = dateHelper.getNow();
      const isoDate = dateHelper.formatToIsoDateTimeString(now);

      expect(isoDate).toEqual('2021-02-23T00:00:00.000Z');
    });
  });
});
