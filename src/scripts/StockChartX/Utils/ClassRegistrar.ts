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

export interface IConstructor<T> {
  new (): T;
}

// endregion

/**
 *  Represents an object that is responsible for keeping and resolving object constructors.
 *  @constructor StockChartX.ClassRegistrar
 */
export class ClassRegistrar<T> {
  /**
   * @internal
   */
  private _constructors = {};
  get registeredItems(): object {
    return this._constructors;
  }

  /**
   * Registers new class constructor.
   * @method register
   * @param {string} className The unique class name.
   * @param {Function} constructor The class constructor.
   * @memberOf StockChartX.ClassRegistrar#
   * @example
   * var MyClass = function() {};
   * var registrar = new StockChartX.ClassRegistrar();
   * registrar.register('MyClass', MyClass);
   */
  register(className: string, constructor: IConstructor<T>) {
    if (!className) throw new Error("Class name is not specified.");
    if (!constructor) throw new Error("Constructor is not specified.");

    let item = this._constructors[className];
    if (item) throw new Error(`'${className}' already registered.`);

    this._constructors[className] = constructor;
  }

  /**
   * Returns class constructor by a given class name.
   * @method resolve
   * @param {string} className The class name.
   * @returns {Function} Class constructor.
   * @memberOf StockChartX.ClassRegistrar#
   * @example
   * var constructor = registrar.resolve('MyClass');
   */
  resolve(className: string): IConstructor<T> {
    if (!className) throw new Error("Class name is not specified.");

    return this._constructors[className];
  }

  /**
   * Instantiates object by a given class name.
   * @param {string} className The class name.
   * @returns {Object} The instantiated object.
   * @memberOf StockChartX.ClassRegistrar#
   * @throws Error if class name is not registered.
   */
  createInstance(className: string): T {
    let constructor = this.resolve(className);
    if (!constructor) throw new Error(`'${className}' is not registered.`);

    return new constructor();
  }
}
