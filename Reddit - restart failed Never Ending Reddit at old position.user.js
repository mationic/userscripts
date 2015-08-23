// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at old position
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.1.5
// @description    When using the "Reddit Enhancement Suite" with "Never Ending Reddit" option, at some point the next page cannot be loaded anymore. Currently your only option is to reload Reddit and start from the top. This script searches bottom up for the next working entry it can use as starting point. This way you can continue browsing from the same position.
// @updateURL      https://github.com/mationic/userscripts/raw/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20old%20position.user.js
// @downloadURL    https://github.com/mationic/userscripts/raw/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20old%20position.user.js
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant          none
// @include        /^https?:\/\/(.+\.)?reddit\.com\/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true */
    /*global $, jQuery */

    $.noConflict();

    var button, link, nextLink, ids = [],
        doSearch = function () {
            var url = link + ids.pop();
            $.get(url, function (data) {
                var count;
                if ($(data).find('#siteTable div.thing').size()) {
                    button.text("link found - loading");
                    count = url.match("/count=(\\d+)/i");
                    if (count !== null && count.length > 1) {
                        url.replace(count[0], 'count=' + (1 + parseInt($(".thing").last().find("span.rank").text(), 10) - parseInt(button.data("checkedLinks"), 10)));
                    }
                    window.location.href = url;
                    return false;
                }
                data = null;
                nextLink();
            }).error(nextLink);
        };

    nextLink = function () {
        var checked = parseInt(button.data("checkedLinks"), 10) + 1;
        if (ids.length === 0 || checked > 30) {
            button.text("Could'nt find a working link :(");
            return false;
        }
        button.data("checkedLinks", checked);
        button.text("Searching for link (checked: " + checked + ")");
        doSearch();
    };

    $(function () {
        $(document).bind('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'DIV' && e.target.getAttribute('id') && e.target.getAttribute('id') === 'NERFail') {
                button = $('<a>', {
                    'text': 'search for working link to continue NER',
                    'style': 'cursor:pointer;'
                }).click(function () {

                    button.data("checkedLinks", 0);
                    $('#siteTable').find('div.thing').each(function () {
                        ids.push($(this).data('fullname'));
                    });

                    doSearch();
                    return false;
                });
                $('div#NERFail>p.nextprev>a').first().before(button);
                link = button.next().attr('href').split('t3_').shift();
            }
        });
    });

//        for testing
//        $('.neverEndingReddit>p').first().remove(); $('.neverEndingReddit>p').append($('.neverEndingReddit>p>a').clone()).attr('class','nextprev');
//        $('.neverEndingReddit').attr('id','NERFail'); var tmp = $('div#NERFail'), par = tmp.parent(); tmp.remove(); par.append(tmp);

}(jQuery));
