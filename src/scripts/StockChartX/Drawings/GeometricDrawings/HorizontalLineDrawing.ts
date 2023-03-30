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
import { IRect } from "../../index";
import { Geometry } from "../../index";
import { HtmlUtil } from "../../index";

// @if SCX_LICENSE != 'free'

"use strict";

export interface IHorizontalLineDrawingOptions extends IDrawingOptions {
    showValueMarker: boolean;
}

export interface IHorizontalLineDrawingDefaults extends IDrawingDefaults {
    showValueMarker: boolean;
}


/**
 * Represents horizontal line drawing.
 * @constructor StockChartX.HorizontalLineDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create horizontal line drawing.
 *  var line1 = new StockChartX.HorizontalLineDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create horizontal line drawing.
 *  var line2 = new StockChartX.HorizontalLineDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create horizontal line drawing with a custom theme.
 *  var line3 = new StockChartX.HorizontalLineDrawing({
 *      point: {record: 10, value: 20.0}
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 1
 *          }
 *      }
 *  });
 */
export class HorizontalLineDrawing extends Drawing {
    static get className(): string {
        return 'horizontalLine';
    }

    static defaults: IHorizontalLineDrawingDefaults = {
        showValueMarker: true
    };

    /**
     * The flag that indicates whether value marker is visible.
     * @name showValueMarker
     * @type {boolean}
     * @memberOf StockChartX.HorizontalLineDrawing#
     */
    get showValueMarker(): boolean {
        let value = (<IHorizontalLineDrawingOptions>this._options).showValueMarker;

        return value != null ? value : HorizontalLineDrawing.defaults.showValueMarker;
    }

    set showValueMarker(value: boolean) {
        (<IHorizontalLineDrawingOptions>this._options).showValueMarker = !!value;
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
            left: frame.left,
            top: point.y,
            width: frame.width,
            height: 1
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        if (!this.canHandleEvents)
            return false;

        let p = this.cartesianPoint(0);

        return point && Geometry.isValueNearValue(point.y, p.y);
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
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(this.actualTheme.line);

        let x = Math.round(frame.left + frame.width / 2);

        if (this.selected) {
            this._drawSelectionMarkers({ x, y: point.y });
        }
    }

    /**
     * @inheritdoc
     */
    drawValueMarkers() {
        if (!this.showValueMarker)
            return;

        let point = this.chartPoints[0];
        if (!point)
            return;

        let marker = this.chart.valueMarker,
            fillColor = this.actualTheme.line.strokeColor,
            scale = this.panelValueScale,
            value = point.getValue(scale.projection);

        marker.theme.fill.fillColor = fillColor;
        marker.theme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(value, scale);
    }
}

Drawing.register(HorizontalLineDrawing);

// @endif