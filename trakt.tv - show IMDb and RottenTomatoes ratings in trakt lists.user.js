// ==UserScript==
// @name           trakt.tv - add IMDb & RottenTomatoes movie ratings
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
// @description	   Adds ratings from IMDb and RottenTomatoes to trakt
//
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(shows|calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        0.1.1
//
// ==/UserScript==

(function() {
    'use strict';
    var getRatingsForElement = function() {

        var imdb = $('<h4>', {
            'class': 'ratings',
            'html': 'IMDb: <span class="value">&nbsp;</span>'
        });
        var tomatoes = $('<h4>', {
            'class': 'ratings',
            'html': 'R.T. c/u: <span class="value">&nbsp;</span>'
        });
        $(this).find('.quick-icons').after(tomatoes);
        $(this).find('.quick-icons').after(imdb);

        if ($(this).attr('data-type') == 'movie') {

            var url = $(this).attr('data-url');

            if (url) {

                var movie = $(this);
                $.get(url, function(data) {
                    var imdb_id = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://www.omdbapi.com/?plot=short&tomatoes=true&r=json&i=" + imdb_id,
                        onload: function(json) {
                            var res = $.parseJSON(json.responseText);
                            if (typeof(res.imdbRating) == 'undefined' || res.imdbRating == "N/A") {
                                res.imdbRating = '-   ';
                                res.imdbVotes = 0;
                            }
                            if (typeof(res.tomatoRating) == 'undefined' || res.tomatoRating == "N/A") res.tomatoRating = '-';
                            if (typeof(res.tomatoUserRating) == 'undefined' || res.tomatoUserRating == "N/A") res.tomatoUserRating = '-';
                            $(imdb).find('span').html(res.imdbRating + ' (' + res.imdbVotes + ' Votes)');
                            $(tomatoes).find('span').html('&nbsp;&nbsp;&nbsp;&nbsp;' + res.tomatoRating + ' / ' + res.tomatoUserRating + '</span>')
                        }
                    });

                });
            }

        }

    }

    $(window).ready(function() {

        $('head').append('<style>.ratings { padding-left: 10px!important; background-color: white; color: black; font-size: 12px!important; text-align: left!important; };</style>');
        $('head').append('<style>.value { padding-left: 8px!important; font-weight: bolder!important; font-size: 13px!important; };</style>');
        if ($("div.grid-item[data-type='movie']").size() > 0) $('div.grid-item').each(getRatingsForElement);

        $(window).bind('DOMNodeInserted', function(e) {
            if (e.target.tagName == 'BODY') {
                $(e.target).ready(function() {
                    if ($("div.grid-item[data-type='movie']").size() > 0) $('div.grid-item').each(getRatingsForElement);
                });
            }
        });

    });

})();