/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Chart } from "../../index";
import {
    IHtmlControl,
    HtmlControl
} from "../../index";

"use strict";

export interface IChartHtmlControlConfig {
    chart: Chart;
}

export interface IChartHtmlControl extends IHtmlControl {
    chart: Chart;
}

/**
 * Represents abstract chart control with frame.
 * @constructor StockChartX.ChartHtmlControl
 * @abstract
 * @augments StockChartX.HtmlControl
 */
export abstract class ChartHtmlControl extends HtmlControl
    implements IChartHtmlControl {
    // region Properties

    /**
     * @internal
     */
    private _chart: Chart;

    /**
     * Gets parent chart.
     * @name chart
     * @type {StockChartX.Chart}
     * @readonly
     * @memberOf StockChartX.ChartHtmlControl#
     */
    get chart(): Chart {
        return this._chart;
    }

    // endregion

    constructor(config: IChartHtmlControlConfig) {
        super();

        if (!config) throw new TypeError("Config is not specified.");
        this._chart = config.chart;
    }

    /**
     * @internal
     */
    protected abstract _subscribe();

    /**
     * @internal
     */
    protected abstract _unsubscribe();

    /**
     * @inheritdoc
     */
    destroy() {
        if (this._unsubscribe) this._unsubscribe();

        super.destroy();
    }
}
