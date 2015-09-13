// ==UserScript==
// @name           trakt.tv - auto fade watched and collected movies in lists
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
//
// @include        /https?:\/\/trakt.tv\/users\/\w+\/lists\/.*/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant          none
//
// @version        0.1.0
//
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true */
    /*global jQuery */
    $.noConflict();

    $(function () {
        $('a.fade-list-watched').addClass('selected');
        $('a.fade-list-collected').addClass('selected');
        $('.filter-dropdown button').addClass('selected');
        $('.grid-item').each(function () {
            if ($(this).find('a.watch.selected').size() > 0) { $(this).addClass('fade-watched-on'); }
            if ($(this).find('a.collect.selected').size() > 0) { $(this).addClass('fade-collected-on'); }
        });
        $('a.fade-list-watched.selected').click(function () { $('.grid-item').removeClass('fade-watched-on'); });
        $('a.fade-list-collected.selected').click(function () { $('.grid-item').removeClass('fade-collected-on'); });
    });

}(jQuery));
