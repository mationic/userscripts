// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at old position
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.1.0
// @description    When using the "Reddit Enhancement Suite" with "Never Ending Reddit" option, at some point the next page cannot be loaded anymore. Currently your only option is to reload Reddit and start from the top. This script searches bottom up for the next working entry it can use as starting point. This way you are still able continue browsing from the same position.
// @updateURL      https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @downloadURL    https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant          none
// @include        /^https?:\/\/(.+\.)?reddit\.com\/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser:true, regexp:true */
    /*global $, jQuery  */

    var button, link, ids = [],
        linkSearch = function () {
            var url;

            if (ids.length === 0) {
                return false;
            }
            url = link + ids.pop();

            $.get(url, function (data) {
                var count;
                if ($(data).find('#siteTable div.thing').size()) {
                    button.text("link found - loading");
                    count = url.match(/count=(\d+)/i);
                    if (count !== null && count.length > 1) {
                        url.replace(count[0], 'count=' + (parseInt(count[1], 10) - parseInt(button.data("checkedLinks"), 10)));
                    }
                    window.location.href = url;
                    return false;
                }
                data = null;
                if (ids.length === 0) {
                    button.text("Could'nt find a working link :(");
                    return false;
                }
                button.data("checkedLinks", parseInt(button.data("checkedLinks"), 10) + 1);
                button.text("Searching for link (checked: " + button.data("checkedLinks") + ")");
                return linkSearch();
            });
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

                    linkSearch();
                    return false;
                });
                $('div#NERFail>p.nextprev>a').first().after(button);
                link = button.next().attr('href').split('t3_').shift();
            }
        });

       // for testing
//        $('.neverEndingReddit>p').first().remove(); $('.neverEndingReddit>p').append($('.neverEndingReddit>p>a').clone()).attr('class','nextprev');
//        $('.neverEndingReddit').attr('id','NERFail'); var tmp = $('div#NERFail'), par = tmp.parent(); tmp.remove(); par.append(tmp);


    });
}(jQuery));
