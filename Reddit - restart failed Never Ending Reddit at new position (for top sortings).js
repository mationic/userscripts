// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at new position (for top sortings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.0.1
// @description    ..
// @updateURL      https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @downloadURL    https://raw.githubusercontent.com/mationic/userscripts/master/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20new%20position%20(for%20top%20sortings).js
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include        /^https?:\/\/(.+\.)?reddit\.com\/top/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// ==/UserScript==


(function () {
    'use strict';
    /*jslint browser:true, newcap:true */
    /*global $, jQuery  */

    var findLink = function () {
        var link, trunk = $('div#NERFail>p.nextprev>a').last().prev().attr('href').split('t3_').shift(),
            button = $('div#NERFail>p.nextprev>a#NERcontinue'),
            commentIDs = [];
        button.css('color','');
        button.data("checkLinks", -1);
        $('#siteTable').find('div.thing').each(function() {
            commentIDs.push($(this).data('fullname'));
        });
        while (commentIDs.length > 0) {
            link = trunk + commentIDs.pop();
            button.text("Searching for working link (checked: "+(button.data("checkLinks")+1)+")");
            $.get(href, function (data) {
                if ($(data).find('#siteTable div.thing').size()) {
                    break;
                }
            }
        }
        if (commentIDs.length === 0) {
            button.text("Could'nt find a working link :(");
        } else {
            button.text("Found. Click here to continue browsing");
            button.attr('href', link);
            button.off('click');
        }
    }
    $(function () {
        $(document).bind('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'DIV' && e.target.getAttribute('id') && e.target.getAttribute('id') === 'NERFail') {
                var button = $('<a>', {
                     'text': 'find link and continue browsing',
                     'id': 'NERcontinue',
                     'href': 'javascript:;',
                     'style': 'color:red;'
                }).click(findLink);
                $('div#NERFail>p.nextprev>a').first().after(button);
            }
        });
    });

}(jQuery));
