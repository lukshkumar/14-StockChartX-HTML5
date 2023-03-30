import {
  IPlotOptions,
  IPlotConfig,
  IPlotDefaults,
  Plot
} from "../index";
import { JsUtil } from "../index";
import { PlotEvent } from "../Utils/PlotEvent";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// region Interfaces

export interface IPointPlotOptions extends IPlotOptions {
  pointSize: number;
}

export interface IPointPlotConfig extends IPlotConfig {
  pointSize?: number;
}

export interface IPointPlotDefaults extends IPlotDefaults {
  pointSize: number;
}

// endregion

// region Declarations

/**
 * Plot events enumeration values.
 * @name PlotEvent
 * @enum {string}
 * @property {string} POINT_SIZE_CHANGED Plot point size has been changed
 * @readonly
 * @memberOf StockChartX
 */

const PointPlotStyle = {
  DOT: "dot"
};
Object.freeze(PointPlotStyle);

// endregion

/**
 * Describes points plot.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.PointPlot
 * @augments StockChartX.Plot
 * @example
 *  var plot = new StockChartX.PointPlot({
 *      dataSeries: closeDataSeries
 *  });
 */
export class PointPlot extends Plot {
  // region Static properties

  static readonly Style = PointPlotStyle;
  static readonly defaults: IPointPlotDefaults = {
    plotStyle: PointPlot.Style.DOT,
    pointSize: 2
  };

  // endregion

  // region Properties

  /**
   * Gets/Sets plot's point size.
   * @name pointSize
   * @type {number}
   * @memberOf StockChartX.PointPlot#
   */
  get pointSize(): number {
    let size = (<IPointPlotOptions>this._options).pointSize;

    return size || PointPlot.defaults.pointSize;
  }

  set pointSize(value: number) {
    if (JsUtil.isNegativeNumber(value))
      throw new TypeError("Value must be a positive number.");

    this._setOption("pointSize", value, PlotEvent.POINT_SIZE_CHANGED);
  }

  // endregion

  constructor(config?: IPointPlotConfig) {
    super(config);

    this._plotThemeKey = "point";
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let params = this._valueDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      radius = this.pointSize,
      prevX = null,
      valuesSameX = [],
      ySameX = [],
      x;
    let drawPointsFunc = (xPoint: number) => {
      for (let j = 0, yCount = ySameX.length; j < yCount; j++) {
        context.beginPath();
        context.arc(xPoint, ySameX[j], radius, 0, 2 * Math.PI);
        context.fill();
      }
    };

    context.scxApplyFillTheme(
      params.theme.fill ? params.theme.fill : params.theme
    );
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
      if (x === prevX) {
        if (valuesSameX.indexOf(value) >= 0) continue;

        let y = projection.yByValue(value);
        if (ySameX.indexOf(y) >= 0) continue;

        valuesSameX.push(value);
        ySameX.push(y);
        continue;
      }

      if (prevX != null) {
        drawPointsFunc(prevX);

        ySameX.length = valuesSameX.length = 0;
      }

      prevX = x;
      valuesSameX.push(value);
      ySameX.push(projection.yByValue(value));
    }
    drawPointsFunc(x);
  }
}
