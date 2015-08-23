// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at new position (for top sortings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.0.2
// @description    ..
// @updateURL      https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @downloadURL    https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include        /^https?:\/\/(.+\.)?reddit\.com\/top/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser:true, newcap:true */
    /*global $, jQuery  */

    var button, commentIDs = [],
        link = $('div#NERFail>p.nextprev>a').last().prev().attr('href').split('t3_').shift(),
        getCommentIDs = function () {
            //button = $('div#NERFail>p.nextprev>a#NERcontinue');
            button.css('color', '');
            button.data("checkLinks", 0);
            $('#siteTable').find('div.thing').each(function () {
                commentIDs.push($(this).data('fullname'));
            });
        },
        checkLinks = function () {
            var url;

            if (commentIDs.length === 0) {
                return false;
            }
            url = link + commentIDs.pop();

            $.get(url, function (data) {
                if ($(data).find('#siteTable div.thing').size()) {
                    button.text("Found. Click here to continue browsing");
                    button.attr('href', url);
                    button.off('click');
                    return true;
                }
                if (commentIDs.length === 0) {
                    button.text("Could'nt find a working link :(");
                    return false;
                }
                button.data("checkedLinks", parseInt(button.data("checkedLinks"), 10) + 1);
                button.text("Searching for working link (checked: " + button.data("checkedLinks") + ")");
                return checkLinks();
            });
        };

    $(function () {
        $(document).bind('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'DIV' && e.target.getAttribute('id') && e.target.getAttribute('id') === 'NERFail') {
                button = $('<a>', {
                    'text': 'find link and continue browsing',
                    'href': '',
                    'style': 'color:red;'
                }).click(function () {
                    getCommentIDs();
                    checkLinks();
                });
                $('div#NERFail>p.nextprev>a').first().after(button);
            }
        });
    });
}(jQuery));
