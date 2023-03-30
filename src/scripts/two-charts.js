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

    window.gCharts = [];
    $("#chartsWrapper")
        .find("div")
        .each(function(index, value) {
            createChart({
                chartContainer: value,
                fullWindowMode: false
            }).then(function(chart) {
                window.gCharts.push(chart);
            });
        });
});
