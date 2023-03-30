import { Control } from "../index";
import { IWindowEvent } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export class HandlersEvents<T extends Control> {
  private _handlers: T[];

  get handlers(): T[] {
    return this._handlers;
  }

  constructor(handlers: T[]) {
    this._handlers = handlers;
  }

  handleEvent(event: IWindowEvent): boolean {
    let isHandled = false;

    this._handlers.forEach((handler: T) => {
      if (handler.handleEvent(event)) isHandled = true;
    });

    return isHandled;
  }

  destroy() {
    this._handlers.forEach((handler: T) => handler.destroy());
  }

  draw() {
    this._handlers.forEach((handler: T) => handler.draw());
  }
}
