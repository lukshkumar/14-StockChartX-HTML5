import { JQueryEventObject } from "../external/typescript/jquery";

import { Drawing } from "../StockChartX/index";
import { MouseEvent } from "../StockChartX/index";
import { IPoint } from "../StockChartX/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

const CoordinateType = {
  X: "x",
  Y: "y",
  DATE: "date",
  VALUE: "value",
  RECORD: "record"
};

export interface ICoordinateInput {
  container: JQuery;
  inputElement: JQuery;
  type: string;
}

const $ = window.jQuery;
const Class = {
  CONTAINER: "scxCoordinatePanel",
  TABLE: "scxCoordinateTable",
  INPUT_CONTAINER: "scxCoordinate-input-container",
  COORDINATE_TYPE_CONTAINER: "scxCoordinate-type-container",
  COORDINATE_TYPE_ITEM: "scxCoordinate-type-item",
  COORDINATE_INPUT: "scxCoordinate-input",
  COORDINATE_DATEPICKER: "scxCoordinate-datetimepicker",
  POINT_LABEL: "scxCoordinate-point-label",
  ACTIVE: "active"
};
const DataAttr = "type";

const Label = {
  X: "x",
  Y: "y",
  RECORD: "record",
  DATE: "date",
  PRICE: "price"
};

const localizationKey = "drawingSettingDialog.coordinatePanel.types.";

const DefaultXCoordinateTypes = [
  CoordinateType.X,
  CoordinateType.RECORD,
  CoordinateType.DATE
];

const DefaultYCoordinateTypes = [CoordinateType.Y, CoordinateType.VALUE];

const numericFieldConfig = {
  showArrows: false,
  canBeNegative: true,
  value: 0,
  minValue: -100000000
};

const numericFloatFieldConfig = {
  showArrows: false,
  canBeNegative: true,
  priceDecimals: 5,
  value: 0,
  minValue: -1000000000
};

/**
 * Represents coordinatePanel
 * @param {JQuery} container
 * @constructor StockChartX.UI.CoordinatePanel
 */
export class CoordinatePanel {
  /**
   * @internal
   */
  private _container: JQuery;

  /**
   * @internal
   */
  private _table: JQuery;

  /**
   * @internal
   */
  private _drawing: Drawing;

  /**
   * @internal
   */
  private _inputs: ICoordinateInput[] = [];

  constructor(container: JQuery) {
    this._init(container);
  }

  /**
   * @internal
   */
  private _init(container: JQuery) {
    this._container = $(`<div class="${Class.CONTAINER}" />`).appendTo(
      container
    );
  }

  /**
   * @internal
   */
  private async _fill() {
    let table = (this._table = $(`<table class="${Class.TABLE}" />`)),
      // tslint:disable await-promise
      pointsLocalizationKeys = await this._drawing.pointsLocalizationKeys();
    // tslint:enable
    if (!pointsLocalizationKeys) return;

    for (let i = 0; i < pointsLocalizationKeys.length; i++) {
      let row = $("<tr/>").appendTo(table);

      let pointBehaviour = this._drawing.createPointBehavior,
        pointLabel = $(
          `<span class="${Class.POINT_LABEL}" data-i18n="${
          pointsLocalizationKeys[i]
          }"/>`
        ),
        xCoordinateInput = this._createCoordinateInput(
          i,
          pointBehaviour.x,
          DefaultXCoordinateTypes
        ),
        yCoordinateInput = this._createCoordinateInput(
          i,
          pointBehaviour.y,
          DefaultYCoordinateTypes
        );

      this._inputs.push(xCoordinateInput, yCoordinateInput);

      row.append([
        $("<td/>").append(pointLabel),
        $("<td/>").append(xCoordinateInput.container),
        $("<td/>").append(yCoordinateInput.container)
      ]);
    }

    this._drawing.chart.localize(this._container.append(table));
  }

  /**
   * @internal
   */
  private _createCoordinateInput(
    index: number,
    defaultType: string,
    possibleTypes: string[]
  ): ICoordinateInput {
    let value = this._getPointCoordinates(index, defaultType);

    let container = $(`<div class="${Class.INPUT_CONTAINER}"/>`),
      inputElement = $(
        `<input class="${Class.COORDINATE_INPUT} form-control scxNumericField">`
      ).scxNumericField(numericFieldConfig);

    let coordinateTypeChooser = this._createTypeChooser(
      possibleTypes,
      defaultType
    ),
      coordinateInput = { container, inputElement, type: defaultType },
      datePicker = this._createDatePicker();

    if (defaultType === CoordinateType.DATE) {
      datePicker.data("DateTimePicker").date(value);

      $(inputElement).hide();
      datePicker.show();
    } else {
      if (defaultType === CoordinateType.VALUE)
        inputElement.scxNumericField(numericFloatFieldConfig);

      inputElement.scxNumericField("setValue", value);
    }

    container.append(coordinateTypeChooser, inputElement, datePicker);

    coordinateTypeChooser
      .find(`.${Class.COORDINATE_TYPE_ITEM}`)
      .on(MouseEvent.CLICK, (event: JQueryEventObject) => {
        let typeItemElement = $(event.target),
          newType = typeItemElement.data(DataAttr);

        if (newType === coordinateInput.type) return;

        coordinateInput.type = newType;

        let newValue = this._getPointCoordinates(index, newType);

        if (newType === CoordinateType.DATE) {
          datePicker.data("DateTimePicker").date(newValue);

          $(inputElement).hide();
          datePicker.show();
        } else {
          let inputConfig =
            newType === CoordinateType.VALUE
              ? numericFloatFieldConfig
              : numericFieldConfig;

          inputElement.scxNumericField(inputConfig);
          inputElement.scxNumericField("setValue", newValue);

          $(inputElement).show();
          datePicker.hide();
        }

        $(`.${Class.COORDINATE_TYPE_ITEM}`, coordinateTypeChooser).removeClass(
          Class.ACTIVE
        );
        typeItemElement.addClass(Class.ACTIVE);
      });

    return coordinateInput;
  }

  /**
   * @internal
   */
  private _createDatePicker(): JQuery {
    let element = $(
      `<input class="${Class.COORDINATE_DATEPICKER} form-control"/>`
    );

    $(element).datetimepicker({
      widgetPositioning: {
        vertical: "top"
      },
      widgetParent: $(".scxDialog.in .modal-content")
    });
    $(element)
      .on("dp.change", (event: DatePickerChangeEvent) => {
        if (event.date == null) {
          $(element)
            .data("DateTimePicker")
            .date((<moment.Moment>event.oldDate).toDate());
        }
      })
      .on("dp.hide", (event: DatePickerEvent) => {
        if ($(element).val() === "")
          $(element)
            .data("DateTimePicker")
            .date(event.date.toDate());
      })
      .hide();

    return element;
  }

  /**
   * @internal
   */
  private _createTypeChooser(types: string[], primaryType: string) {
    let chooserContainer = $(
      `<div class="${Class.COORDINATE_TYPE_CONTAINER}"/>`
    );

    for (let typeItem of types) {
      let label = localizationKey;

      switch (typeItem) {
        case CoordinateType.X:
          label += Label.X;
          break;
        case CoordinateType.Y:
          label += Label.Y;
          break;
        case CoordinateType.RECORD:
          label += Label.RECORD;
          break;
        case CoordinateType.DATE:
          label += Label.DATE;
          break;
        case CoordinateType.VALUE:
          label += Label.PRICE;
          break;
        default:
          break;
      }

      let element = $(
        `<span class="${
        Class.COORDINATE_TYPE_ITEM
        }" data-type="${typeItem}" data-i18n="${label}"></span>`
      );

      if (typeItem === primaryType) element.addClass(Class.ACTIVE);

      chooserContainer.append(element);
    }

    return chooserContainer;
  }

  /**
   * @internal
   */
  private _getPointCoordinates(
    pointIndex: number,
    type: string
  ): number | Date {
    let projection = this._drawing.projection,
      point = this._drawing.cartesianPoint(pointIndex);

    switch (type) {
      case CoordinateType.X:
        return point.x;
      case CoordinateType.Y:
        return point.y;
      case CoordinateType.DATE:
        return projection.dateByX(point.x);
      case CoordinateType.RECORD:
        return projection.recordByX(point.x);
      case CoordinateType.VALUE:
        return projection.valueByY(point.y);
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _getCartesianPointByCoordinates(
    ...inputs: ICoordinateInput[]
  ): IPoint {
    let cartesians = [],
      projection = this._drawing.projection;

    for (let input of inputs) {
      let inputValue = input.inputElement.scxNumericField("getValue");

      switch (input.type) {
        case CoordinateType.X:
        case CoordinateType.Y:
          cartesians.push(inputValue);
          break;
        case CoordinateType.RECORD:
          cartesians.push(projection.xByRecord(inputValue));
          break;
        case CoordinateType.DATE:
          let datePicker = $(
            `.${Class.COORDINATE_DATEPICKER}`,
            input.container
          ).data("DateTimePicker"),
            date = datePicker.date().toDate();

          cartesians.push(projection.xByDate(date));
          break;
        case CoordinateType.VALUE:
          cartesians.push(projection.yByValue(inputValue));
          break;
        default:
          break;
      }
    }

    return {
      x: cartesians[0],
      y: cartesians[1]
    };
  }

  /**
   * Sets drawing values to coordinate panel
   * @method setValues
   * @param {Drawing} drawing Drawing that used for filling
   * @memberOf StockChartX.UI.CoordinatePanel#
   */
  setValues(drawing: Drawing) {
    this._drawing = drawing;
    this._reset();
    this._fill();
  }

  /**
   * @internal
   */
  private _reset() {
    if (this._table) this._table.remove();

    this._inputs = [];
  }

  /**
   * Apply coordinates to drawing.
   * @method apply
   * @memberOf StockChartX.UI.CoordinatePanel#
   */
  apply() {
    if (this._inputs.length === 0) return;

    let chartPoints = [];

    for (let i = 0; i < this._inputs.length - 1; i += 2) {
      let inputX = this._inputs[i],
        inputY = this._inputs[i + 1],
        chartPoint = this._getCartesianPointByCoordinates(inputX, inputY);

      chartPoints.push(chartPoint);
    }

    this._drawing.setChartPointsWithNormalize(chartPoints);
  }
}
