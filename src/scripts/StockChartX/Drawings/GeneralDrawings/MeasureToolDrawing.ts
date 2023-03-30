/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";

// @if SCX_LICENSE != 'free'

"use strict";

const Class = {
    MeasureTool: 'scxMeasureTool'
};

export class MeasureToolDrawing extends Drawing {
    static get className(): string {
        return 'measureTool';
    }

    /**
     * @internal
     */
    private _infoControls;

    get pointsNeeded(): number {
        return 2;
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;

        return {
            left: Math.min(points[0].x, points[1].x),
            top: Math.min(points[0].y, points[1].y),
            width: Math.abs(points[0].x - points[1].x),
            height: Math.abs(points[0].y - points[1].y)
        };
    }

    /**
     * @internal
     */
    private _createInfoControls() {
        let controls = this._infoControls;
        if (controls)
            return;

        let root = this.chartPanel.container.scxAppend('div', Class.MeasureTool);
        this._infoControls = {
            rootDiv: root,
            firstPoint: root.scxAppend('div'),
            lastPoint: root.scxAppend('div'),
            range: root.scxAppend('div'),
            bars: root.scxAppend('div')
        };
    }

    _finishUserDrawing() {
        super._finishUserDrawing();

        this.remove();
    }

    remove(): boolean {
        if (this._infoControls) {
            this._infoControls.rootDiv.remove();
            this._infoControls = null;
        }

        return super.remove();
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints();
        if (points.length === 0)
            return;

        if (points.length > 1) {
            this.context.scxStrokePolyline(points, this.actualTheme.line);
        }

        if (this.selected)
            this._drawSelectionMarkers(points);

        this._drawValues(points);
        this._drawInfo();
    }

    /**
     * @internal
     */
    private _drawValues(points: IPoint[]) {
        let context = this.context,
            projection = this.projection,
            theme = this.actualTheme,
            valueOffset = this._getSelectionMarkerWidth(theme) + 5,
            chartPoints = this.chartPoints,
            firstValue = chartPoints[0].getValue(projection),
            firstText = this.chartPanel.formatValue(firstValue);

        context.textBaseline = 'bottom';
        context.scxApplyTextTheme(theme.text);

        context.fillText(firstText, points[0].x, points[0].y - valueOffset);
        if (chartPoints.length > 1) {
            let lastValue = chartPoints[1].getValue(projection),
                lastText = this.chartPanel.formatValue(lastValue);

            context.fillText(lastText, points[1].x, points[1].y - valueOffset);
        }
    }

    /**
     * @internal
     */
    private _drawInfo() {
        this._createInfoControls();

        let theme = this.actualTheme,
            projection = this.projection,
            controls = this._infoControls,
            points = this.chartPoints,
            panel = this.chartPanel,
            dateScale = panel.chart.dateScale,
            firstDate = points[0].getDate(projection),
            firstValue = points[0].getValue(projection);

        controls.firstPoint.text(`${dateScale.formatDate(firstDate)} ${panel.formatValue(firstValue)}`);
        if (points.length > 1) {
            let lastDate = points[1].getDate(projection),
                lastValue = points[1].getValue(projection);
            controls.lastPoint.text(`${dateScale.formatDate(lastDate)} ${panel.formatValue(lastValue)}`);

            let instrument = this.chart.instrument,
                range = lastValue - firstValue;
            if (instrument && instrument.tickSize) {
                controls.range.text(`Range (Pips) ${panel.formatValue(range / instrument.tickSize)}`);
            } else {
                controls.range.text(`Range ${panel.formatValue(range)}`);
            }

            let recordsCount = this.chart.barsBetweenPoints(points[0], points[1]);
            controls.bars.text(`Bars ${recordsCount}`);
        }

        controls.rootDiv
            .scxPosition(this.chartPanel.contentFrame.left, 0)
            .scxTextStyle(theme.text)
            .scxFill(theme.fill);
    }
}

Drawing.register(MeasureToolDrawing);

// @endif