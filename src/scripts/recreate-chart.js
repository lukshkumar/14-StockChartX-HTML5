/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/* global createChart */

$(function() {
    "use strict";

    function addChart() {
        createChart({
            chartContainer: '#chartContainer',
            fullWindowMode: false
        }).then(function(chart) {
            window.gChart = chart;
        });
    }

    var btn = $('<button id="recreateChartButton">Recreate Chart</button>')
        .on('click', function() {
            var chart = window.gChart;

            $('body').removeClass('scxTheme' + chart.theme.name);
            chart.destroy();

            var chartContainer = document.createElement('div');
            chartContainer.id = 'chartContainer';
            $(chartContainer).prependTo($('body'));

            addChart();
        });
    $('<div id="recreationBtnContainer"></div>')
        .append(btn)
        .insertAfter($('#chartContainer'));
    addChart();
});
