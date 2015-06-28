// ==UserScript==
// @name           Chaturbate exhibitionists - show only women (shemale / couple) online
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description    Filter gender on the amateur site: http://chaturbate.com/exhibitionist-cams
//
// @include        /^https?://(.+\.)?chaturbate\.com/exhibitionist-cams/.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          none
//
// @version        0.1.1
// ==/UserScript==

(function ($) {
    "use strict";
    /*jslint browser:true */
    /*global $, jQuery */

    var showc = function (e) {
        var i,
            len,
            cam,
            act;
        if (e === "update") {
            act = $('#main > div.top-section > ul > li.active').find('a').attr('href');
            if (act && act[0] === '#') {
                cam = act.substr(1);
            }
        } else {
            $('#main > div.top-section > ul > li').removeClass('active');
            $(this).addClass('active');
            cam = $(this).find('a').attr('href').substr(1);
        }

        if (cam !== null && cam !== 'all') {
            $('#main > div.content > div.c-1.endless_page_template > ul.list > li').hide();

            for (i = 0, len = cam.length; i < len; i += 1) {
                $('#main > div.content > div.c-1.endless_page_template > ul.list > li span.gender' + cam[i]).parent().parent().parent().show();
            }

        } else {
            $('#main > div.content > div.c-1.endless_page_template > ul.list > li').show();
        }

    };


    $(function () {
        $('#main > div.top-section > ul').prepend($('<br><br>'));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#all">All</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#fcs">Female+Couple+Shemale</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#fc">Female+Couple</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#m">Male</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#s">Shemale</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#c">Couple</a>' }).click(showc));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#f">Female</a>' }).click(showc));

        document.addEventListener("DOMNodeInserted", function (event) {
            if ($(event.path[0]).hasClass('list')) { showc('update'); }
        });
        var setting = window.location.href.split("#");
        if (setting && setting.length > 1) {
            $('#main > div.top-section > ul > li > a[href="#' + setting[1] + '"]').click();
        } else {
            $('#main > div.top-section > ul > li > a[href="#all"]').parent().addClass('active');
        }
    });


}(jQuery));

