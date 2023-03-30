import { IDateTimeParts } from "../../index";
import { DateScaleCalibrator, IDateScaleMajorTick, CustomFormatter, CustomFormat, IDateScaleCalibratorOptions, IDateScaleCalibratorConfig } from "../../index";
import { TimeSpan } from "../../index";
import { DummyCanvasContext } from "../../index";
import { DateScale } from "../../index";
import { CustomDateTimeFormat } from "../../index";
import { JsUtil } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface ICustomDateScaleCalibratorConfig extends IDateScaleCalibratorConfig {
    majorTicks?: {
        minOffset?: number;
        monospaced?: boolean;
        customFormat?: CustomFormat;
        customFormatter?: CustomFormatter;
    };
    minorTicks?: {
        count?: number;
    };
}

interface ICustomDateScaleCalibratorOptions extends IDateScaleCalibratorOptions {
    majorTicks?: {
        minOffset?: number;
        monospaced?: boolean;
        customFormat?: CustomFormat;
        customFormatter?: CustomFormatter;
    };
    minorTicks?: {
        count?: number;
    };
}

export interface ICustomDateScaleCalibratorDefaults {
    majorTicks: {
        minOffset: number;
        monospaced: boolean;
        customFormat?: CustomFormat;
        customFormatter?: CustomFormatter;
    };
    minorTicks: {
        count: number;
    };
}

// endregion

/**
 * The date scale calibrator which uses floating date format.
 * @constructor StockChartX.CustomDateScaleCalibrator
 * @augments StockChartX.DateScaleCalibrator
 */
export class CustomDateScaleCalibrator extends DateScaleCalibrator {
    static defaults: ICustomDateScaleCalibratorDefaults = {
        majorTicks: {
            minOffset: 30,
            monospaced: true,
        },
        minorTicks: {
            count: 0
        }
    };

    static get className(): string {
        return 'StockChartX.CustomDateScaleCalibrator';
    }

    // region Properties

    /**
     * Gets/Sets min horizontal offset between date labels.
     * @name minLabelsOffset
     * @type {Number}
     * @memberOf StockChartX.CustomDateScaleCalibrator#
     */
    get minLabelsOffset(): number {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        return majorTicks && majorTicks.minOffset != null
            ? majorTicks.minOffset
            : CustomDateScaleCalibrator.defaults.majorTicks.minOffset;
    }

    set minLabelsOffset(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error("Min labels offset must be greater or equal to 0.");

        let options = <ICustomDateScaleCalibratorOptions>this._options;
        (options.majorTicks || (options.majorTicks = {})).minOffset = value;
    }

    /**
     * Gets/Sets number of minor ticks on the date scale.
     * @name minorTicksCount
     * @type {number}
     * @memberOf StockChartX.CustomDateScaleCalibrator#
     */
    get minorTicksCount(): number {
        let minorTicks = (<ICustomDateScaleCalibratorOptions>this._options).minorTicks;

        return minorTicks && minorTicks.count != null
            ? minorTicks.count
            : CustomDateScaleCalibrator.defaults.minorTicks.count;
    }

    set minorTicksCount(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Ticks count must be a positive number or 0.');

        let options = <ICustomDateScaleCalibratorOptions>this._options;
        (options.minorTicks || (options.minorTicks = {})).count = value;
    }

    /**
     * Gets/Sets flag that indicates whether major ticks should have approximately the same width.
     * @name monospaced
     * @type {boolean}
     * @memberOf StockChartX.CustomDateScaleCalibrator#
     */
    get monospaced(): boolean {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        return majorTicks && majorTicks.monospaced != null
            ? majorTicks.monospaced
            : CustomDateScaleCalibrator.defaults.majorTicks.monospaced;
    }

    set monospaced(value: boolean) {
        let options = <ICustomDateScaleCalibratorOptions>this._options;
        (options.majorTicks || (options.majorTicks = {})).monospaced = value;
    }

    /**
     * @internal
     */
    private _formatter = new CustomDateTimeFormat();

    /**
     * Gets/Sets custom format of major ticks labels
     * @name customFormat
     * @type {CustomFormat}
     * @memberOf StockChartX.CustomDateScaleCalibrator#
     */
    get customFormat(): CustomFormat {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        return majorTicks ? majorTicks.customFormat : null;
    }

    set customFormat(value: CustomFormat) {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        if (majorTicks)
            majorTicks.customFormat = value;
    }

    /**
     * Gets/Sets custom formatter that returns label for each major ticks
     * @name customFormatter
     * @type {CustomFormatter}
     * @memberOf StockChartX.CustomDateScaleCalibrator#
     */
    get customFormatter(): CustomFormatter {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        return majorTicks ? majorTicks.customFormatter : null;
    }

    set customFormatter(value: CustomFormatter) {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        if (majorTicks)
            majorTicks.customFormatter = value;
    }

    // endregion

    constructor(config?: ICustomDateScaleCalibratorConfig) {
        super(config);
    }

    /**
     * @internal
     */
    private _customMajorFormat(labelIndex: number, date: Date): string {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        if (majorTicks && majorTicks.customFormat)
            return majorTicks.customFormat(this, labelIndex, date);

        return null;
    }

    /**
     * @internal
     */
    private _customMajorFormatter(labelIndex: number, date: Date): string {
        let majorTicks = (<ICustomDateScaleCalibratorOptions>this._options).majorTicks;

        if (majorTicks && majorTicks.customFormatter)
            return majorTicks.customFormatter(this, labelIndex, date);

        return null;
    }

    /**
     * @internal
     */
    protected _calibrateMajorTicks(dateScale: DateScale) {
        let dates = dateScale.getDateDataSeries().values,
            chart = dateScale.chart,
            frame = dateScale.projectionFrame,
            projection = dateScale.projection,
            record = projection.recordByColumn(0),
            lastRecord = dateScale.maxAllowedRecord,
            labelsOffset = this.minLabelsOffset,
            textDrawBounds = dateScale._textDrawBounds(),
            minTextX = textDrawBounds.left,
            maxTextX = textDrawBounds.left + textDrawBounds.width,
            prevLabelRight = frame.left,
            dummyContext = DummyCanvasContext,
            timeInterval = dateScale.chart.timeInterval,
            monospaced = this.monospaced,
            monospacedWidth: number,
            prevLabel: IDateScaleMajorTick,
            maxX = chart.chartPanelsContainer.panelsContentFrame.width,
            lastVisibleDate = dateScale.getDateDataSeries().lastValue;

        this._formatter.locale = chart.locale;

        dummyContext.applyTextTheme(dateScale.actualTheme.text);

        let charWidth = dummyContext.textWidth('9');

        while (record <= lastRecord) {
            let date = record >= 0 && record < dates.length
                ? <Date>dates[record]
                : projection.dateByRecord(record);

            let dateString = this._customMajorFormatter(record, date);

            if (!dateString) {
                let customFormat = this._customMajorFormat(record, date);

                if (customFormat)
                    dateString = this._formatter.format(date, customFormat);
                else
                    dateString = this._labelDateString(date, prevLabel && prevLabel.date, timeInterval);
            }


            if (!dateString || dateString === (prevLabel && prevLabel.text)) {
                // Date string was not changed. There is no need to show it again.
                record++;
                continue;
            }

            let x = projection.xByRecord(record);
            if (x < frame.left) {
                record++;
                continue;
            }
            if (x >= maxX)
                break;

            // Calculate rough text width. Because canvas's method is too slow.
            let textWidth = dateString.length * charWidth,
                textStartX = x - textWidth / 2,
                nextX;

            if (textStartX < prevLabelRight) {
                nextX = prevLabelRight + textWidth / 2;
            } else if (monospacedWidth && (x - prevLabel.x) < monospacedWidth) {
                nextX += monospacedWidth - (x - prevLabel.x);
            } else {
                textWidth = dummyContext.textWidth(dateString);
                textStartX = x - textWidth / 2;
                if (textStartX < prevLabelRight) {
                    nextX = prevLabelRight + textWidth / 2;
                } else {
                    let textX = x,
                        textAlign = 'center';
                    if (textStartX < minTextX) {
                        textStartX = textX = minTextX;
                        textAlign = 'left';
                    } else if (textStartX + textWidth > maxTextX) {
                        textX = maxTextX;
                        textStartX = textX - textWidth;
                        textAlign = 'right';
                    }

                    let label = {
                        x,
                        textX,
                        textAlign,
                        date,
                        text: this.showVirtualDates || date <= lastVisibleDate ? dateString : null
                    };
                    this.majorTicks.push(label);

                    if (monospaced && !monospacedWidth && prevLabel)
                        monospacedWidth = x - prevLabel.x;

                    prevLabelRight = textStartX + textWidth + labelsOffset;
                    nextX = Math.ceil(prevLabelRight);
                    prevLabel = label;
                }
            }

            if (nextX > maxX)
                break;

            let nextRecord = projection.recordByX(nextX) + 1;
            record = nextRecord > record ? nextRecord : record + 1;
        }
    }

    /**
     * @internal
     */
    protected _calibrateMinorTicks() {
        super._calibrateMinorTicks(this.minorTicksCount);
    }

    /**
     * @internal
     */
    private _labelDateString(date: Date, prevDate: Date, timeInterval: number): string {
        if (!prevDate)
            prevDate = new Date(0);

        let format = this._findFormat(date, prevDate, timeInterval);
        if (!format)
            return null;

        return this._formatter.format(date, format);
    }

    /**
     * @internal
     */
    private _findFormat(date: Date, prevDate: Date, timeInterval: number): string {
        if (date <= prevDate)
            return null;

        let ts = TimeSpan,
            dateParts: IDateTimeParts = {},
            prevDateParts: IDateTimeParts = {};

        // Year periodicity
        dateParts.year = date.getFullYear();
        prevDateParts.year = prevDate.getFullYear();
        if (timeInterval >= ts.MILLISECONDS_IN_YEAR) {
            return this._yearPeriodicityFormat(dateParts, prevDateParts);
        }

        // Month periodicity
        dateParts.month = date.getMonth() + 1;
        prevDateParts.month = prevDate.getMonth() + 1;
        if (timeInterval >= ts.MILLISECONDS_IN_MONTH) {
            return this._monthPeriodicityFormat(dateParts, prevDateParts);
        }

        // Day/Week periodicity
        dateParts.day = date.getDate();
        prevDateParts.day = prevDate.getDate();
        if (timeInterval >= ts.MILLISECONDS_IN_DAY) {
            return this._dayPeriodicityFormat(dateParts, prevDateParts);
        }

        // Hour periodicity
        dateParts.hour = date.getHours();
        prevDateParts.hour = prevDate.getHours();
        if (timeInterval >= ts.MILLISECONDS_IN_HOUR) {
            return this._hourPeriodicityFormat(dateParts, prevDateParts);
        }

        // Minute periodicity
        dateParts.minute = date.getMinutes();
        prevDateParts.minute = prevDate.getMinutes();
        if (timeInterval >= ts.MILLISECONDS_IN_MINUTE) {
            return this._minutePeriodicityFormat(dateParts, prevDateParts);
        }

        // Second periodicity
        dateParts.second = date.getSeconds();
        prevDateParts.second = prevDate.getSeconds();
        if (timeInterval >= ts.MILLISECONDS_IN_SECOND) {
            return this._secondPeriodicityFormat(dateParts, prevDateParts);
        }

        // Millisecond periodicity
        dateParts.minute = date.getMilliseconds();
        prevDateParts.minute = prevDate.getMilliseconds();

        return this._millisecondPeriodicityFormat(dateParts, prevDateParts);
    }

    private _yearPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts): string {
        return dateParts.year !== prevDateParts.year ? "YYYY" : null;
    }

    private _monthPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts): string {
        if (dateParts.year !== prevDateParts.year) {
            return dateParts.month === 1 ? "YYYY" : "MMM YYYY";
        }
        if (dateParts.month !== prevDateParts.month) {
            return "MMM";
        }

        return null;
    }

    private _dayPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts): string {
        if (dateParts.year !== prevDateParts.year) {
            return dateParts.day === 1
                ? this._monthPeriodicityFormat(dateParts, prevDateParts)
                : "D MMM YYYY";
        }
        if (dateParts.month !== prevDateParts.month) {
            return dateParts.day === 1 ? "MMM" : "D MMM";
        }
        if (dateParts.day !== prevDateParts.day) {
            return "D";
        }

        return null;
    }

    private _hourPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts, isRequired: boolean = false): string {
        if (dateParts.hour === 0)
            return this._dayPeriodicityFormat(dateParts, prevDateParts);

        if (dateParts.year !== prevDateParts.year) {
            return "D MMM YYYY HH:mm";
        }
        if (dateParts.month !== prevDateParts.month || dateParts.day !== prevDateParts.day) {
            return "D MMM HH:mm";
        }
        if (isRequired || dateParts.hour !== prevDateParts.hour) {
            return "HH:mm";
        }

        return null;
    }

    private _minutePeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts, required: boolean = false): string {
        let isRequired = dateParts.minute !== prevDateParts.minute;

        return this._hourPeriodicityFormat(dateParts, prevDateParts, isRequired);
    }

    private _secondPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts): string {
        let isRequired = dateParts.second !== prevDateParts.second;
        let format = this._minutePeriodicityFormat(dateParts, prevDateParts, isRequired);

        if (format && dateParts.second !== 0)
            format += ":ss";

        return format;
    }

    private _millisecondPeriodicityFormat(dateParts: IDateTimeParts, prevDateParts: IDateTimeParts): string {
        let format = this._secondPeriodicityFormat(dateParts, prevDateParts);
        if (dateParts.millisecond === 0 || dateParts.millisecond === prevDateParts.millisecond)
            return format;

        return format
            ? `${format}.SSS`
            : "ss.SSS";
    }
}

DateScaleCalibrator.register(CustomDateScaleCalibrator);