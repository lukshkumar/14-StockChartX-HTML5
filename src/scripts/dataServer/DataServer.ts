import { Periodicity } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

export interface IData {
  Login?: string;
  Password?: string;
  IsTail?: boolean;
  Success?: boolean;
  Reason?: boolean;
  ID?: number;
  Bars?: {
    Close: number;
    Date: number;
    High: number;
    Low: number;
    Open: number;
    Volume: number;
  };
}

interface ILogginInParams {
  Login?: string;
  Password?: string;
  MsgType: string;
  Symbol?: {
    DataFeed: string;
    Exchange: string;
    Symbol: string;
    Company: string;
    Type: number;
  };
}

export interface IParams {
  from: number;
  to: number;
  barsCount: number;
  interval: number;
  periodicity: string;
  symbol: {
    company: string;
    exchange: string;
    symbol: string;
    type: number;
  };
}

export interface ISymbol {
  company: string;
  exchange: string;
  symbol: string;
  type: number;
}

export class DataServer {
  private ws = null;
  private config;

  private loggingIn: boolean = null;
  private loggingOut: boolean = null;

  private userCredentials = {
    login: "",
    password: ""
  };

  private messageSubscribers = {
    login: [],
    logout: [],
    dataFeeds: [],
    quotes: [],
    history: []
  };

  constructor(config: any) {
    this.config = $.extend(
      {
        SERVER_HOST: null,
        SERVER_PORT: null
      },
      config
    );
  }

  private static generateUniqueEventID() {
    let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));

    do {
      let ascicode = Math.floor(Math.random() * 42 + 48);
      if (ascicode < 58 || ascicode > 64) {
        idstr += String.fromCharCode(ascicode);
      }
    } while (idstr.length < 32);

    return idstr;
  }

  private subscribe(event: any, fn: any) {
    let id = DataServer.generateUniqueEventID();
    this.messageSubscribers[event][id] = fn;
    return id;
  }

  private notify(event: any, id: any, data: IData) {
    if (id == null || this.messageSubscribers[event][id] === null) {
      id = DataServer.getFirstSubscriberId(this.messageSubscribers[event]);
      if (id === null) return false;
    }

    if ("history" === event && data.IsTail === false) {
      this.messageSubscribers[event][id](data);
      return true;
    }

    this.messageSubscribers[event][id](data);
    delete this.messageSubscribers[event][id];
    return true;
  }

  private connect() {
    if (this.ws != null && this.ws.readyState === 1) return;

    let support =
      "MozWebSocket" in window
        ? "MozWebSocket"
        : "WebSocket" in window
        ? "WebSocket"
        : null;

    if (support == null) {
      // console.log("* Your browser can't support WebSockets");
      return false;
    }

    this.ws = new window[support](
      "ws://" + this.config.SERVER_HOST + ":" + this.config.SERVER_PORT + "/"
    );

    this.ws.onopen = () => {
      if (this.loggingIn) {
        this.sendQuery({
          MsgType: "LoginRequest",
          Login: this.userCredentials.login,
          Password: this.userCredentials.password
        });
      }
    };
    this.ws.onclose = () => {
      if (this.loggingOut) return;

      this.loggingIn = false;
    };

    this.ws.onmessage = (evt: JQueryEventObject) => {
      let obj = window.jQuery.parseJSON(evt.data);
      switch (obj.MsgType) {
        case "LoginResponse":
          if (obj.Error !== null)
            this.notify("login", null, { Success: false, Reason: obj.Error });
          else this.notify("login", null, { Success: true });
          break;

        case "LogoutResponse":
          this.loggingOut = false;
          this.disconnect();
          break;

        case "DataFeedListResponse":
          this.notify("dataFeeds", null, obj.DataFeeds);
          break;

        case "HistoryResponse":
          this.notify("history", obj.ID, {
            ID: obj.ID,
            Bars: obj.Bars,
            IsTail: obj.Tail
          });
          break;

        case "NewTickResponse":
          let objTick = obj.Tick;
          let quotes = "quotes";
          for (let item of objTick) {
            let subscribers = this.messageSubscribers[quotes][
              item.Symbol.Symbol
            ];

            for (let i in subscribers) {
              if (subscribers.hasOwnProperty(i)) subscribers[i](item);
            }
          }
          break;
        default:
          break;
      }
    };

    return true;
  }

  private disconnect() {
    if (this.ws == null || this.ws.readyState !== 1) return;

    this.ws.close();
    this.ws = null;
  }

  private sendQuery(params: ILogginInParams) {
    if (!this.ws || this.ws.readyState !== 1) return;

    this.ws.send(JSON.stringify(params));
  }

  doLogin(fn: (responseD: any) => void, data: IData) {
    this.subscribe("login", fn);

    this.userCredentials.login = data.Login;
    this.userCredentials.password = data.Password;

    this.loggingIn = true;
    this.connect();
  }

  doLogout() {
    this.loggingOut = true;
    this.sendQuery({ MsgType: "LogoutRequest" });
    this.disconnect();
  }

  private static getFirstSubscriberId(objectArray: any) {
    for (let i in objectArray) {
      if (objectArray.hasOwnProperty(i)) return i;
    }
    return null;
  }

  getDataFeeds(fn: any) {
    this.subscribe("dataFeeds", fn);
    this.sendQuery({ MsgType: "DataFeedListRequest" });
  }

  subscribeQuote(fn: any, symbol: ISymbol) {
    let quotes = "quotes";
    if (typeof this.messageSubscribers[quotes][symbol.symbol])
      this.messageSubscribers[quotes][symbol.symbol] = [];

    this.messageSubscribers[quotes][symbol.symbol].push(fn);

    this.sendQuery({
      MsgType: "SubscribeRequest",
      Symbol: {
        DataFeed: "Simulation DataFeed",
        Exchange: symbol.exchange,
        Symbol: symbol.symbol,
        Company: symbol.company,
        Type: symbol.type
      }
    });
  }

  unsubscribeQuote(fn: any, symbol: ISymbol) {
    let quotes = "quotes";
    let subscribers = this.messageSubscribers[quotes][symbol.symbol];
    if (!subscribers) return;

    for (let i in subscribers)
      if (subscribers.hasOwnProperty(i) && subscribers[i] === fn)
        subscribers.splice(i, 1);

    if (subscribers.length === 0)
      delete this.messageSubscribers[quotes][symbol.symbol];

    this.sendQuery({
      MsgType: "UnsubscribeRequest",
      Symbol: {
        DataFeed: "Simulation DataFeed",
        Exchange: symbol.exchange,
        Symbol: symbol.symbol,
        Company: symbol.company,
        Type: symbol.type
      }
    });
  }

  public getHistory(fn: any, params: IParams) {
    let id = this.subscribe("history", fn);
    let p = {
      MsgType: "HistoryRequest",
      Selection: {
        Id: id,
        Symbol: {
          DataFeed: "Simulation DataFeed",
          Exchange: params.symbol.exchange,
          Symbol: params.symbol.symbol,
          Company: params.symbol.company,
          Type: params.symbol.type
        },
        Periodicity: DataServer.convertPeriodicity(params.periodicity),
        Interval: params.interval,
        barsCount: params.barsCount,
        From: params.from,
        To: params.to
      }
    };

    if (params.barsCount) {
      p.Selection.barsCount = params.barsCount;
    } else if (params.from && params.to) {
      p.Selection.From = params.from;
      p.Selection.To = params.to;
    } else return;

    this.sendQuery(p);
    return id;
  }

  private static convertPeriodicity(periodicity: any) {
    switch (periodicity) {
      case Periodicity.MINUTE:
        return 1;
      case Periodicity.HOUR:
        return 2;
      case Periodicity.DAY:
        return 3;
      case Periodicity.WEEK:
        return 4;
      case Periodicity.MONTH:
        return 5;
      case Periodicity.YEAR:
        return 6;
      default:
        break;
    }
  }
}
