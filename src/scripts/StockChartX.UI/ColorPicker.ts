import { Spectrum } from "../external/typescript/spectrum";
import { Environment } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */


"use strict";

const $ = window.jQuery;

export class ColorPicker {
  private _picker: any;

  constructor(domObjects: JQuery, config: Spectrum.Options) {
    let params = this._getInitParams();
    this._picker = domObjects.spectrum($.extend(params, config));
  }

  public getColor(): string {
    return <string>this._picker.spectrum("get").toRgbString();
  }

  public setColor(color: string): void {
    this._picker.spectrum("set", color);
  }

  public spectrum(methodName: string, val: any) {
    this._picker.spectrum(methodName, val);
  }

  private _getInitParams(): any {
    if (Environment.isPhone)
      return {
        color: "#000",
        showInput: false,
        showInitial: true,
        allowEmpty: false,
        showAlpha: false,
        disabled: false,
        maxSelectionSize: 1,
        showPalette: true,
        showSelectionPalette: false,
        showPaletteOnly: true,
        palette: this._getPalette()
      };

    return {
      color: "#000",
      showInput: false,
      showInitial: true,
      allowEmpty: false,
      showAlpha: false,
      disabled: false,
      maxSelectionSize: 1,
      showPalette: true,
      showSelectionPalette: true,
      showPaletteOnly: true,
      togglePaletteOnly: true,
      palette: this._getPalette(),
      cancelText: "Cancel",
      chooseText: "Choose",
      togglePaletteMoreText: "More",
      togglePaletteLessText: "Less"
    };
  }

  private _getPalette(): string[][] {
    if (Environment.isPhone)
      return [
        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
        [
          "#ea9999",
          "#f9cb9c",
          "#ffe599",
          "#b6d7a8",
          "#a2c4c9",
          "#9fc5e8",
          "#b4a7d6",
          "#d5a6bd"
        ],
        [
          "#80c00000",
          "#80b45f06",
          "#80bf9000",
          "#8038761d",
          "#80134f5c",
          "#800b5394",
          "#80351c75",
          "#80741b47"
        ]
      ];

    return [
      ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
      ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
      [
        "#f4cccc",
        "#fce5cd",
        "#fff2cc",
        "#d9ead3",
        "#d0e0e3",
        "#cfe2f3",
        "#d9d2e9",
        "#ead1dc"
      ],
      [
        "#ea9999",
        "#f9cb9c",
        "#ffe599",
        "#b6d7a8",
        "#a2c4c9",
        "#9fc5e8",
        "#b4a7d6",
        "#d5a6bd"
      ],
      [
        "#e06666",
        "#f6b26b",
        "#ffd966",
        "#93c47d",
        "#76a5af",
        "#6fa8dc",
        "#8e7cc3",
        "#c27ba0"
      ],
      [
        "#c00",
        "#e69138",
        "#f1c232",
        "#6aa84f",
        "#45818e",
        "#3d85c6",
        "#674ea7",
        "#a64d79"
      ],
      [
        "#900",
        "#b45f06",
        "#bf9000",
        "#38761d",
        "#134f5c",
        "#0b5394",
        "#351c75",
        "#741b47"
      ],
      [
        "#600",
        "#783f04",
        "#7f6000",
        "#274e13",
        "#0c343d",
        "#073763",
        "#20124d",
        "#4c1130"
      ]
    ];
  }
}
