/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { ContextMenu } from "./index";
import { Drawing } from "../StockChartX/index";
import { IContextMenuConfig } from "./index";
import { HtmlLoader } from "./index";
import { HtmlContainer } from "./index";
"use strict";

// region Interfaces

export interface IDrawingContextMenu extends IContextMenuConfig {
  drawing: Drawing;
}

// endregion

// region Declarations

const DrawingContextMenuItem = {
  CLONE: "clone",
  DELETE: "delete",
  SETTINGS: "settings"
};
Object.freeze(DrawingContextMenuItem);

// endregion

export class DrawingContextMenu extends ContextMenu {
  private static _container: JQuery;

  public static MenuItem = DrawingContextMenuItem;

  constructor(config: IDrawingContextMenu, targetDomObject?: JQuery) {
    super(config, targetDomObject);

    HtmlLoader.loadHtml("DrawingContextMenu.html", (html: string) => {
      if (!DrawingContextMenu._container) {
        DrawingContextMenu._container = HtmlContainer.instance.register(
          "DrawingContextMenu",
          html
        );
      }

      config.menuContainer = DrawingContextMenu._container;
    });
  }
}
