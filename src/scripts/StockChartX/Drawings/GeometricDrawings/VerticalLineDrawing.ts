/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing, IDrawingOptions, IDrawingDefaults } from "../../index";
import { IPoint } from "../../index";
import { IWindowEvent } from "../../index";
import { IRect } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { HtmlUtil } from "../../index";

// @if SCX_LICENSE != 'free'

"use strict";

export interface IVerticalLineDrawingOptions extends IDrawingOptions {
    showDateMarker: boolean;
}

export interface IVerticalLineDrawingDefaults extends IDrawingDefaults {
    showDateMarker: boolean;
}

/**
 * Represents vertical line drawing.
 * @constructor StockChartX.VerticalLineDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create vertical line drawing.
 *  var line1 = new StockChartX.VerticalLineDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create vertical line drawing.
 *  var line2 = new StockChartX.VerticalLineDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create vertical line drawing with a custom theme.
 *  var line3 = new StockChartX.VerticalLineDrawing({
 *      point: {record: 10, value: 20.0}
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 1
 *          }
 *      }
 *  });
 */
export class VerticalLineDrawing extends Drawing {
    static get className(): string {
        return 'verticalLine';
    }

    static defaults: IVerticalLineDrawingDefaults = {
        showDateMarker: true
    };

    /**
     * The flag that indicates whether date marker is visible.
     * @name showDateMarker
     * @type {boolean}
     * @memberOf StockChartX.VerticalLineDrawing#
     */
    get showDateMarker(): boolean {
        let value = (<IVerticalLineDrawingOptions>this._options).showDateMarker;

        return value != null ? value : VerticalLineDrawing.defaults.showDateMarker;
    }

    set showDateMarker(value: boolean) {
        (<IVerticalLineDrawingOptions>this._options).showDateMarker = !!value;
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let point = this.cartesianPoint(0);
        if (!point)
            return null;

        let frame = this.chartPanel.contentFrame;

        return {
            left: point.x,
            top: frame.top,
            width: 1,
            height: frame.height
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        if (!this.canHandleEvents)
            return false;

        let p = this.cartesianPoint(0);

        return point && Geometry.isValueNearValue(point.x, p.x);
    }

    /**
     * @internal
     */
    protected _handlePanGesture(gesture: PanGesture, event: IWindowEvent): boolean {
        if (this.showDateMarker)
            this.chart.dateScale.setNeedsUpdate();

        return false;
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let point = this.cartesianPoint(0);
        if (!point)
            return;

        let context = this.context,
            frame = this.chartPanel.contentFrame;

        context.beginPath();
        context.moveTo(point.x, 0);
        context.lineTo(point.x, frame.bottom - frame.top);
        context.scxStroke(this.actualTheme.line);

        if (this.selected) {
            let y = Math.round(frame.height / 2);

            this._drawSelectionMarkers({ x: point.x, y });
        }
    }

    /**
     * @inheritdoc
     */
    drawDateMarkers() {
        if (!this.showDateMarker)
            return;

        let point = this.chartPoints[0];
        if (!point)
            return;

        let marker = this.chart.dateMarker,
            date = point.getDate(this.projection),
            fillColor = this.actualTheme.line.strokeColor,
            dateScale = this.chart.dateScale;

        marker.theme.fill.fillColor = fillColor;
        marker.theme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.theme.stroke.strokeColor = HtmlUtil.isDarkColor(fillColor)
            ? HtmlUtil.lighten(fillColor, 0.5)
            : HtmlUtil.lighten(fillColor, -0.5);
        marker.draw(date, dateScale);
    }
}

Drawing.register(VerticalLineDrawing);

// @endif