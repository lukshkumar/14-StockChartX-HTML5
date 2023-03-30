import {
    IChartPanelObjectConfig,
    IChartPanelObject,
    IChartPanelObjectOptions,
    ChartPanelObject,
    IChartPanelObjectState
} from "../index";
import { IChartPoint, ChartPoint } from "../index";
import { IStrokeTheme } from "../index";

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

export interface IValueLineConfig extends IChartPanelObjectConfig {
    point?: IChartPoint;
    extended?: boolean;
    theme?: IStrokeTheme;
    visible?: boolean;
}

export interface IValueLine extends IChartPanelObject {
    point: ChartPoint;
    extended: boolean;
    theme: IStrokeTheme;
}

interface IValueLineOptions extends IChartPanelObjectOptions {
    point: ChartPoint;
    extended: boolean;
    theme: IStrokeTheme;
}

// endregion

/**
 * Represents value line from some value on the value scale to a given point or opposite border.
 * @constructor StockChartX.ValueScale
 * @augments StockChartX.ChartPanelObject
 */
export class ValueLine extends ChartPanelObject implements IValueLine {
    // region Properties

    /**
     * Gets/Sets line point.
     * @name point
     * @type {ChartPoint}
     * @memberOf StockChartX.ValueLine#
     */
    get point(): ChartPoint {
        return (<IValueLineOptions>this._options).point;
    }
    set point(value: ChartPoint) {
        this._setOption("point", value);
    }

    /**
     * Gets/Sets flag that indicates whether line should be extended to the border.
     * @name extended
     * @type {boolean}
     * @memberOf StockChartX.ValueLine#
     */
    get extended(): boolean {
        return (<IValueLineOptions>this._options).extended;
    }

    set extended(value: boolean) {
        this._setOption("extended", value);
    }

    /**
     * Gets/Sets theme.
     * @name theme
     * @type {StockChartX.StrokeTheme}
     * @memberOf StockChartX.ValueLine#
     */
    get theme(): IStrokeTheme {
        return (<IValueLineOptions>this._options).theme;
    }

    set theme(value: IStrokeTheme) {
        this._setOption("theme", value);
    }

    // endregion

    constructor(config: IValueLineConfig) {
        super(config && { options: <IChartPanelObjectOptions>config });
    }

    /**
     * @inheritDoc
     */
    loadState(state: IChartPanelObjectState) {
        super.loadState(state);

        if (state && state.options) {
            let options = <IValueLineOptions>state.options;
            if (options) {
                let suppress = this.suppressEvents();

                let point = options.point;
                if (point) {
                    this.point = new ChartPoint(point);
                }

                this.suppressEvents(suppress);
            }
        }
    }

    /**
     * @inheritDoc
     */
    draw() {
        if (!this.visible) return;

        let projection = this.projection,
            point = this.point.toPoint(projection),
            panelFrame = this.chartPanel.contentFrame,
            scale = this.panelValueScale,
            context = this.context;

        context.beginPath();
        if (scale.leftFrame != null) {
            context.moveTo(panelFrame.left, point.y);
            context.lineTo(this.extended ? panelFrame.right : point.x, point.y);
        }
        if (scale.rightFrame != null) {
            context.moveTo(this.extended ? panelFrame.left : point.x, point.y);
            context.lineTo(panelFrame.right, point.y);
        }
        context.scxStroke(this.theme);
    }
}
