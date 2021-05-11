import {
  DateTime as LuxonDateTime,
  DateTimeFormatOptions as LuxonDateTimeFormatOptions,
  DateTimeJSOptions as LuxonDateTimeJSOptions,
  DateTimeOptions as LuxonDateTimeOptions,
  Duration as LuxonDuration,
  DurationObject,
} from 'luxon';

export type DateTime = LuxonDateTime;
export type Duration = LuxonDuration;
export type DateTimeOptions = LuxonDateTimeOptions;
export type DateTimeJSOptions = LuxonDateTimeJSOptions;
export type DateTimeFormatOptions = LuxonDateTimeFormatOptions;

// eslint-disable-next-line no-shadow
export enum DateFormats {
  YYYYMMDD = 'yyyy-MM-dd',
  YYYYMMDDhhmmss = 'yyyy-MM-dd HH:mm:ss.000',
}

export class DateHelper {
  public getNow(): DateTime {
    return LuxonDateTime.utc();
  }

  public getPastDate(duration: DurationObject): DateTime {
    return this.getNow().minus(duration);
  }

  public getFutureDate(duration: DurationObject): DateTime {
    return this.getNow().plus(duration);
  }

  public getDateFromJsDate(date: Date, options: DateTimeJSOptions = { zone: 'UTC' }): DateTime {
    return LuxonDateTime.fromJSDate(date, options);
  }

  public getDateFromShortDateString(date: string, options: DateTimeOptions = { zone: 'UTC' }): DateTime {
    return LuxonDateTime.fromFormat(date, DateFormats.YYYYMMDD, options);
  }

  public getDateFromLongDateString(date: string, options: DateTimeOptions = { zone: 'UTC' }): DateTime {
    return LuxonDateTime.fromFormat(date, DateFormats.YYYYMMDDhhmmss, options);
  }

  public getDateFromIsoDateString(date: string, options: DateTimeOptions = { zone: 'UTC' }): DateTime {
    return LuxonDateTime.fromISO(date, options);
  }

  public getDifferenceBetweenShortDatesInMonths(startDate: string, endDate: string): number {
    const startDt = this.getDateFromShortDateString(startDate);
    const endDt = this.getDateFromShortDateString(endDate);
    return this.getDifferenceBetweenDatesInMonths(startDt, endDt);
  }

  public getDifferenceBetweenDatesInMonths(startDate: DateTime, endDate: DateTime): number {
    return endDate.diff(startDate, ['days']).as('months');
  }

  public getDifferenceBetweenShortDatesInDays(startDate: string, endDate: string): number {
    const startDt = this.getDateFromShortDateString(startDate);
    const endDt = this.getDateFromShortDateString(endDate);
    return this.getDifferenceBetweenDatesInDays(startDt, endDt);
  }

  public getDifferenceBetweenDatesInDays(startDate: DateTime, endDate: DateTime): number {
    return endDate.diff(startDate, ['days']).as('days');
  }

  public formatToShortDateString(date: DateTime): string {
    return date.toFormat(DateFormats.YYYYMMDD);
  }

  public formatToLongDateTimeString(date: DateTime, options: DateTimeFormatOptions = { timeZone: 'UTC' }): string {
    return date.toFormat(DateFormats.YYYYMMDDhhmmss, options);
  }

  public formatToIsoDateTimeString(date: DateTime): string {
    return date.toISO();
  }
}

export default DateHelper;
