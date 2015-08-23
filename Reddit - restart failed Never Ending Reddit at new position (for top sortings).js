// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at new position (for top sortings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.0.9
// @description    Reddit Enhancement Suite "Never Ending Reddit" description
// @updateURL      https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @downloadURL    https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant          none
// @include        /^https?:\/\/(.+\.)?reddit\.com\/top/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser:true, newcap:true */
    /*global $, jQuery  */

    var button, link, ids = [],
        linkSearch = function () {
            var url;

            if (ids.length === 0) {
                return false;
            }
            url = link + ids.pop();

            $.get(url, function (data) {
                if ($(data).find('#siteTable div.thing').size()) {
                    button.text("Found. Click here to continue browsing");
                    button.attr('href', url);
                    button.off('click');
                    return true;
                }
                data = null;
                if (ids.length === 0) {
                    button.text("Could'nt find a working link :(");
                    return false;
                }
                button.data("checkedLinks", parseInt(button.data("checkedLinks"), 10) + 1);
                button.text("Searching for working link (checked: " + button.data("checkedLinks") + ")");
                return linkSearch();
            });
        };

    $(function () {


        $(document).bind('DOMNodeInserted', function (e) {

            $('.neverEndingReddit>p').first().remove();
            $('.neverEndingReddit>p').append($('.neverEndingReddit>p>a').clone());
            $('.neverEndingReddit>p').attr('class','nextprev');
            $('.neverEndingReddit').attr('id','NERFail');
            var tmp = $('div#NERFail');
            var par = tmp.parent();
            tmp.remove();
            par.append(tmp);

            if (e.target.tagName === 'DIV' && e.target.getAttribute('id') && e.target.getAttribute('id') === 'NERFail') {
                button = $('<a>', {
                    'text': 'find link and continue browsing',
                    'href': '',
                    'style': 'color:red;'
                }).mouseDown(function () {

                    button.css('color', '');
                    button.data("checkedLinks", 0);
                    $('#siteTable').find('div.thing').each(function () {
                        ids.push($(this).data('fullname'));
                    });

                    linkSearch();
                });
                $('div#NERFail>p.nextprev>a').first().after(button);
                link = button.next().attr('href').split('t3_').shift();
            }
        });
    });
}(jQuery));
