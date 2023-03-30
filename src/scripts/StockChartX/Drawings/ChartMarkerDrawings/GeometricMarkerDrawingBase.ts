import { Geometry } from "../../index";
import { IDrawingConfig, IDrawingOptions, IDrawingDefaults, Drawing } from "../../index";
import { ISize } from "../../index";
import { IPoint } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */


// @if SCX_LICENSE != 'free'

"use strict";

// region Interfaces

export interface IGeometricMarkerDrawingBaseConfig extends IDrawingConfig {
    size?: ISize;
}

export interface IGeometricMarkerDrawingBaseOptions extends IDrawingOptions {
    size?: ISize;
}

export interface IGeometricMarkerDrawingBaseDefaults extends IDrawingDefaults {
    size?: ISize;
}

// endregion

// region Declarations

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} SIZE_CHANGED Size changed
 * @readonly
 * @memberOf StockChartX
 */
export const SIZE_CHANGED = 'drawingSizeChanged';

// endregion

/**
 * Represents abstract geometric marker drawing.
 * @param {object} [config] The configuration object.
 * @param {StockChartX~Point | StockChartX.ChartPoint} [config.point] The point.
 * @param {StockChartX~Size} [config.size] The size.
 * @abstract
 * @constructor StockChartX.AbstractGeometricMarkerDrawing
 * @augments StockChartX.Drawing
 */
export abstract class GeometricMarkerDrawingBase extends Drawing {
    // region Static members

    static get subClassName(): string {
        return 'abstractMarker';
    }

    static defaults: IGeometricMarkerDrawingBaseDefaults = {
        size: {
            width: 14,
            height: 14
        }
    };

    // endregion

    // region Properties

    /**
     * Gets/Sets size.
     * @name size
     * @type {StockChartX~Size}
     * @memberOf StockChartX.GeometricMarkerDrawingBase#
     */
    get size(): ISize {
        return (<IGeometricMarkerDrawingBaseOptions>this._options).size ||
            (<IGeometricMarkerDrawingBaseDefaults>this._defaults).size ||
            GeometricMarkerDrawingBase.defaults.size;
    }

    set size(value: ISize) {
        this._setOption('size', value, SIZE_CHANGED);
    }

    // endregion

    constructor(config?: IGeometricMarkerDrawingBaseConfig) {
        super(config);
    }

    /**
     * @inheritDoc
     */
    pointsLocalizationKeys(): string[] {
        let chartPointsNames = [
            'drawingSettingDialog.start'
        ];

        return chartPointsNames;
    }

    /**
     * inheritdoc
     */
    hitTest(point: IPoint): boolean {
        if (!this.canHandleEvents)
            return false;

        let bounds = this.bounds();

        return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
    }
}

// @endif