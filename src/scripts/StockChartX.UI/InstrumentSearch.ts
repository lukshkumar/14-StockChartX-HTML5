import { IInstrument } from "../StockChartX/index";
import { JsUtil } from "../StockChartX/index";
import { JQueryEventObject } from "../external/typescript/jquery";
import { HtmlContainer } from "./index";
import { MouseEvent } from "../StockChartX/index";
const $ = window.jQuery;
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

/**
 * Set instruments array by yourself if you want instrument selector do not to be dependent on StockChartX.getAllInstruments();
 */
export interface IInstrumentSearchConfig {
  value?: any;
  instruments?: IInstrument[];
  onChange?(instrument: IInstrument): void;
}

const EVENT_CONTEXT_MENU_OPEN = "scxContextMenuOpen";

const DATA_SYMBOL = "data-scxinstrument";
const CLASS_ACTIVE = "active";
const SEARCH_TIMER_DELAY = 250;
const RESULTS_DROP_WIDTH = "41.6651em";

const KEY = {
  ENTER: 13,
  ESCAPE: 27,
  DOWN: 40,
  UP: 38
};
/**
 * Describes InstrumentSearch component
 * @param {JQuery} rootContainer Root element of component
 * @param {IInstrumentSearchConfig} config Configuration of component
 * @param {any} [config.value] Value of instrument
 * @param {StockChartX.IInstrument[]} [config.instruments] Array of instruments
 * @param {Function} [config.onChange] Listener that will be invoked when instrument changed
 * @constructor StockChartX.UI.InstrumentSearch
 */
export class InstrumentSearch {
  /**
   * @internal
   */
  private _config: IInstrumentSearchConfig;

  /**
   * @internal
   */
  private _value: any;

  /**
   * @internal
   */
  private _inputField: JQuery;

  /**
   * @internal
   */
  private _isDropDownVisible: boolean;

  /**
   * @internal
   */
  private _resultsCount: number;

  /**
   * @internal
   */
  private _currentText: string;

  /**
   * @internal
   */
  private _searchDelayTimer: number;

  /**
   * @internal
   */
  private _resultsDropDown: JQuery;

  /**
   * @internal
   */
  private _noResults: JQuery;

  constructor(rootContainer: JQuery, config: IInstrumentSearchConfig) {
    this._inputField = rootContainer;
    this._config = config;
    this._value = config.value || "";
    this._config.onChange = JsUtil.isFunction(config.onChange)
      ? config.onChange
      : null;

    this._isDropDownVisible = false;
    this._resultsCount = 0;
    this._currentText = "";
    this._searchDelayTimer = null;
    this._resultsDropDown = $('<div class="scxInstrumentSearchResults"></div>');
    this._noResults = $(
      '<div class="scxInstrumentSearchNoResults" data-i18n="instrumentSearch.noResults">No results</div>'
    );

    if (
      config.instruments !== null &&
      Array.isArray(config.instruments) &&
      config.instruments.length > 0
    ) {
      this._config.instruments = config.instruments;
    }

    this._init();
  }

  /**
   * @internal
   */
  private _init(): void {
    this._inputField.addClass("scxInstrumentSearchInputField");
    this._inputField.attr("type", "text");

    if (this._config.value) {
      this._inputField.val(this._value);
      this._currentText = this._value;
    } else {
      this._inputField.val("");
    }

    HtmlContainer.instance.register("searchResult", this._resultsDropDown);

    this._setupInputListeners();

    this._inputField.on(MouseEvent.CLICK, () => {
      this._inputField.select();
    });

    $(window).scroll(() => {
      this._hideDropDown();
    });

    $(window).resize(() => {
      this._hideDropDown();
    });

    this._resultsDropDown.on(
      MouseEvent.CLICK,
      ".scxInstrumentSearchItem",
      (e: JQueryEventObject) => {
        this._setValue($(e.currentTarget).attr(DATA_SYMBOL), true);
        this._hideDropDown();
      }
    );

    this._resultsDropDown.on(
      MouseEvent.OVER,
      ".scxInstrumentSearchItem",
      (e: JQueryEventObject) => {
        $(e.currentTarget)
          .parent()
          .children()
          .removeClass(CLASS_ACTIVE);
        $(e.currentTarget).addClass(CLASS_ACTIVE);
      }
    );

    $(document).on(MouseEvent.CLICK, (evt: JQueryEventObject) => {
      let $target = $(evt.currentTarget);
      if (
        this._isDropDownVisible &&
        !$target.is(this._inputField) &&
        $target.parents(".scxInstrumentSearchResults").length === 0
      ) {
        this._inputField.val(this._value);
        this._hideDropDown();
      }
    });

    $("body").bind(EVENT_CONTEXT_MENU_OPEN, (evt: JQueryEventObject) => {
      this._inputField.val(this._value);
      this._hideDropDown();
    });
  }

  /**
   * Set instrument
   * @method set
   * @param {StockChartX.IInstrument} [instrument] Instrument to set
   * @memberOf StockChartX.UI.InstrumentSearch#
   */
  public set(instrument?: IInstrument): void {
    this._setValue(instrument ? instrument.symbol : "");
  }

  /**
   * Get instrument by symbol
   * @method getBySymbol
   * @returns {StockChartX.IInstrument} Instrument
   * @memberOf StockChartX.UI.InstrumentSearch#
   */
  public getBySymbol(): IInstrument {
    return this._getInstrumentBySymbol(this._value);
  }

  /**
   * @intenal
   */
  private _setupInputListeners(): void {
    this._inputField.on("input", () => {
      if (!this._isDropDownVisible) $("body").trigger("click");

      clearTimeout(this._searchDelayTimer);

      this._searchDelayTimer = setTimeout(() => {
        let text = this._getInputValue();
        if (text !== this._currentText) {
          let matchArray = this._search(text);
          this._currentText = text;
          this._resultsCount = matchArray.length;
          this._showDropDown();
          this._generateSearchResults(text.toUpperCase(), matchArray);
        }
      }, SEARCH_TIMER_DELAY) as any;
    });

    this._inputField.focus((e: JQueryEventObject) => {
      $(e.currentTarget).addClass(CLASS_ACTIVE);
    });

    this._inputField.blur((e: JQueryEventObject) => {
      $(e.currentTarget).removeClass(CLASS_ACTIVE);
    });

    this._inputField.keyup((e: JQueryEventObject) => {
      let pressedKey = e.which;

      switch (pressedKey) {
        case KEY.ESCAPE:
          this._inputField.val(this._value);
          this._hideDropDown();
          this._inputField.blur();
          break;
        case KEY.ENTER:
          let value = this._getInputValue();

          if (this._isDropDownVisible) {
            let activeItem = this._resultsDropDown.find(` > .${CLASS_ACTIVE}`);
            if (activeItem.length > 0) value = activeItem.attr(DATA_SYMBOL);
          }

          this._setValue(value, true);
          this._hideDropDown();
          this._inputField.blur();

          break;
        default:
          break;
      }
      if (
        !this._isDropDownVisible &&
        (pressedKey === KEY.DOWN || pressedKey === KEY.UP)
      ) {
        this._showDropDown();
        this._generateSearchResults(
          this._getInputValue().toUpperCase(),
          this._search(this._getInputValue())
        );
      }

      if (this._resultsCount > 0) {
        switch (pressedKey) {
          case KEY.DOWN:
            this._highlightDropDownItem(false);
            break;
          case KEY.UP:
            this._highlightDropDownItem(true);
            break;
          default:
            break;
        }
      }
    });
  }

  /**
   * @internal
   */
  private _getInputValue(): string {
    return $("<div></div>")
      .text(this._inputField.val())
      .html();
  }

  /**
   * @internal
   */
  private _highlightDropDownItem(isUpDirection: boolean): void {
    let resultsDropDown = this._resultsDropDown,
      activeItem = resultsDropDown.find(` > .${CLASS_ACTIVE}`),
      allItems = this._resultsDropDown.children();

    if (activeItem.length === 0) {
      if (isUpDirection) allItems.last().addClass(CLASS_ACTIVE);
      else allItems.first().addClass(CLASS_ACTIVE);
    } else {
      activeItem.removeClass(CLASS_ACTIVE);

      if (isUpDirection) {
        if (activeItem.is(allItems.first()))
          allItems.last().addClass(CLASS_ACTIVE);
        else activeItem.prev().addClass(CLASS_ACTIVE);
      } else {
        if (activeItem.is(allItems.last()))
          allItems.first().addClass(CLASS_ACTIVE);
        else activeItem.next().addClass(CLASS_ACTIVE);
      }
    }
    activeItem = resultsDropDown.find(` > .${CLASS_ACTIVE}`);

    let itemTopOffset = activeItem.outerHeight() * activeItem.index(),
      itemBottomOffset = itemTopOffset + activeItem.outerHeight();

    if (itemTopOffset < resultsDropDown.scrollTop()) {
      resultsDropDown.scrollTop(itemTopOffset);
    } else if (
      itemBottomOffset >
      resultsDropDown.scrollTop() + resultsDropDown.outerHeight()
    ) {
      resultsDropDown.scrollTop(itemBottomOffset - resultsDropDown.height());
    }
  }

  /**
   * @internal
   */
  private _setValue(val: string, fire?: boolean): void {
    this._value = this._currentText = val;
    this._inputField.val(val);

    if (fire && this._config.onChange) {
      this._config.onChange(this._getInstrumentBySymbol(val));
    }
  }

  /**
   * @internal
   */
  private _hideDropDown(): void {
    this._isDropDownVisible = false;
    this._resultsDropDown.hide();
    this._currentText = this._inputField.val();
  }

  /**
   * @internal
   */
  private _showDropDown(): void {
    this._resultsDropDown.width(RESULTS_DROP_WIDTH);

    let $window = $(window),
      bodyWidth = $window.width(),
      dropdownWidth = this._resultsDropDown.outerWidth(true);

    if (bodyWidth < dropdownWidth) this._resultsDropDown.outerWidth(bodyWidth);

    if (this._isDropDownVisible) return;

    this._isDropDownVisible = true;

    let dropdownTopPosition = this._inputField.outerHeight(),
      scrollTopPosition = $window.scrollTop(),
      scrollLeftPosition = $window.scrollLeft(),
      inputOffset = this._inputField.offset(),
      btnLeftPosition = inputOffset.left;

    if (scrollLeftPosition > 0) btnLeftPosition -= scrollLeftPosition;

    if (scrollTopPosition > 0) dropdownTopPosition -= scrollTopPosition;

    this._resultsDropDown.css({
      top: inputOffset.top + dropdownTopPosition + 2,
      left: btnLeftPosition,
      maxHeight: $window.height() - inputOffset.top - dropdownTopPosition - 10
    });

    if (bodyWidth < dropdownWidth) this._resultsDropDown.width(bodyWidth);

    this._resultsDropDown.show();
  }

  /**
   * @internal
   */
  private _generateSearchResults(text: string, array: any[]): void {
    this._noResults.detach();
    this._resultsDropDown.empty();

    if (array.length === 0) {
      this._noResults.appendTo(this._resultsDropDown);

      return;
    }

    let html = "";
    for (let item of array) {
      html += this._generateListElement(
        text,
        item.symbol,
        item.company,
        item.exchange
      );
    }

    if (html.length > 0) this._resultsDropDown.append($(html));
  }

  /**
   * @internal
   */
  private _generateListElement(
    text: string,
    symbol: string,
    company: string,
    exchange: string
  ): string {
    // tslint:disable prefer-template
    return (
      `<div class="scxInstrumentSearchItem" ${DATA_SYMBOL}="${symbol}">` +
      '<div class="scxInstrumentSearchItem_SymbolContainer">' +
      `<span class="scxInstrumentSearchItem_Symbol">${this._highlightHTMLText(
        text,
        symbol
      )}</span>` +
      "</div>" +
      '<div class="scxInstrumentSearchItem_NameContainer">' +
      `<span class="scxInstrumentSearchItem_Name">${this._highlightHTMLText(
        text,
        company
      )}</span>` +
      "</div>" +
      '<div class="scxInstrumentSearchItem_ExchangeContainer">' +
      `<span class="scxInstrumentSearchItem_Exchange">${exchange}</span>` +
      "</div>" +
      "</div>"
    );
    // tslint:enable
  }

  /**
   * @internal
   */
  private _highlightHTMLText(searchText: string, fullText: string): string {
    if (searchText === "") return fullText;

    let matchStartPositions = this._searchTextPositions(searchText, fullText),
      resultText = "",
      offset = 0;

    if (searchText.length === 1 && matchStartPositions.length > 1) {
      for (let i = matchStartPositions.length - 1; i > 0; i--) {
        if (matchStartPositions[i].pos - 1 === matchStartPositions[i - 1].pos) {
          matchStartPositions[i - 1].len += 1;
          matchStartPositions.splice(i, 1);
        }
      }
    }

    for (let startPosition of matchStartPositions) {
      resultText +=
        fullText.substr(offset, startPosition.pos - offset) +
        // tslint:disable prefer-template
        '<span class="scxHighlightedText">' +
        fullText.substr(startPosition.pos, startPosition.len) +
        "</span>";
      // tslint:enable

      offset = <number>startPosition.pos + <number>startPosition.len;
    }

    if (offset < fullText.length)
      resultText += fullText.substr(offset, fullText.length - offset);

    return resultText;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @internal
   */
  private _searchTextPositions(searchText: string, fullString: string): any[] {
    let startIndex = 0,
      index: number,
      result = [],
      searchTextLength = searchText.length;

    searchText = searchText.toLowerCase();
    fullString = fullString.toLowerCase();
    // tslint:disable-next-line:no-conditional-assignment
    while ((index = fullString.indexOf(searchText, startIndex)) > -1) {
      result.push({ pos: index, len: searchTextLength });
      startIndex = index + 1;
    }

    return result;
  }

  /**
   * @internal
   */
  private _search(text: string): IInstrument[] {
    text = text.toLowerCase() || "";

    let result = this._getInstruments().filter(
      (instrument: IInstrument) =>
        instrument.symbol.toLowerCase().indexOf(text) !== -1 ||
        instrument.company.toLowerCase().indexOf(text) !== -1
    );

    return result;
  }

  /**
   * @internal
   */
  private _getInstrumentBySymbol(symbol: string): IInstrument {
    for (let instrument of this._getInstruments()) {
      if (instrument.symbol === symbol) return instrument;
    }

    return null;
  }

  /**
   * @internal
   */
  private _getInstruments(): IInstrument[] {
    return this._config.instruments || window.StockChartX.getAllInstruments();
  }
}
