/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { EventsDispatcher } from "../index";
// region Interfaces

export interface IEventObject {
  type: string;
  sender: object;
  target: object;
}

export interface IValueChangedEvent extends IEventObject {
  value?: any;
  oldValue?: any;
}

export type IEventHandler = (eventObject: IEventObject) => void;

export interface IEventableObject {
  suppressEvents(suppress?: boolean);
  fire(eventType: string, event: IEventObject);
  fireValueChanged(eventType: string, newValue: any, oldValue?: any);
}

// endregion

export class EventableObject implements IEventableObject {
  // Members

  /**
   * @internal
   */
  private _eventsDispatcher: EventsDispatcher = new EventsDispatcher();

  /**
   * @internal
   */
  protected _suppressEvents: boolean = false;

  /**
   * @internal
   */
  private _event: IValueChangedEvent = {
    type: null,
    sender: this,
    target: this,
    value: undefined,
    oldValue: undefined
  };

  // endregion

  /**
   * Suppresses/Allows all events.
   * @method suppressEvents
   * @param {boolean} [suppress = true] The flag to suppress or resume events raising.
   * @returns {boolean} The old value.
   * @memberOf StockChartX.EventableObject#
   * @example <caption>Suppress events</caption>
   *  obj.suppressEvents();
   * @example <caption>Resume events</caption>
   *  obj.suppressEvents(false);
   */
  suppressEvents(suppress: boolean = true): boolean {
    let oldValue = this._suppressEvents;
    this._suppressEvents = suppress;

    return oldValue;
  }

  // Subscribe/Unsubscribe events

  /**
   * Subscribes to events.
   * @method on
   * @param {String} events The event names to subscribe.
   * @param {IEventHandler} handler The event handler.
   * @param {Object} [target] The optional target. For internal use.
   * @returns {StockChartX.EventableObject}
   * @memberOf StockChartX.EventableObject#
   * @see [off]{@linkcode StockChartX.EventableObject#off} to unsubscribe events.
   * @example <caption>Subscribe to 'my_event' event.</caption>
   *      obj.on('my_event', function(event) {});
   *
   * @example <caption>Subscribe to two events at once.</caption>
   *      obj.on('click key_press', function(event) {});
   */
  on(events: string, handler: IEventHandler, target?: object): EventableObject {
    this._eventsDispatcher.on(events, handler, target);

    return this;
  }

  /**
   * Unsubscribes from events.
   * @method off
   * @param {String} events The event names to unsubscribe.
   * @param {Object} [target] The optional target. For internal use.
   * @returns {StockChartX.EventableObject}
   * @memberOf StockChartX.EventableObject#
   * @see [on]{@linkcode StockChartX.EventableObject#on} to subscribe events.
   * @example <caption>Unsubscribe from 'my_event' event.</caption>
   *      obj.off('my_event');
   *
   * @example <caption>Unsubscribe from two events.</caption>
   *      obj.off('click key_press');
   */
  off(events: string, target?: object): EventableObject {
    this._eventsDispatcher.off(events, target);

    return this;
  }

  // endregion

  // region Events firing

  /**
   * Fires event.
   * @method fire
   * @param {String} event The event name.
   * @param {Object} data The event data.
   * @memberOf StockChartX.EventableObject#
   * @example
   *  obj.fire('custom_event', {customData: 'some data'});
   */
  fire(event: string, data: IEventObject) {
    if (!this._suppressEvents) {
      if (data) data.sender = this;
      this._eventsDispatcher.fire(event, data);
    }
  }

  fireValueChanged(eventType: string, newValue?: any, oldValue?: any) {
    this.fireTargetValueChanged(this, eventType, newValue, oldValue);
  }

  fireTargetValueChanged(
    target: object,
    eventType: string,
    newValue?: any,
    oldValue?: any
  ) {
    if (!this._suppressEvents) {
      let event = this._event;

      event.target = target || this;
      event.value = newValue;
      event.oldValue = oldValue;
      this.fire(eventType, event);
    }
  }

  // endregion
}
