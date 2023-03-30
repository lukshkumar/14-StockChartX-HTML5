/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

$(function() {
    "use strict";

    var allInstruments = [];
    $(function() {
        var server = new StockChartX.DataServer.DataServer({
            SERVER_HOST: '52.5.119.147',
            SERVER_PORT: 20019
        });
        new StockChartX.DataServer.LoginWindow(server).show(function() {
            new StockChartX.DataServer.DataFeedSelectWindow(server).show(init);
        });
        function init(dataFeed, instruments) {
            StockChartX.DataServer.selectedDataFeedName = dataFeed.Name;
            allInstruments = instruments;
            StockChartX.getAllInstruments = function() {
                return allInstruments;
            };
            $('.pageContent').show();
            $(window).on('unload', server.logout);
            new StockChartX.DataServer.Chart(server);   // eslint-disable-line no-new
        }
    });
});
