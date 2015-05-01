// ==UserScript==
// @name           trakt.tv - show IMDb & RottenTomatoes ratings in trakt lists
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description	   Loads ratings from omdbapi.com
//
// @include        /^https?://(.+\.)?trakt\.tv/(.+/)?(lists|watchlist|collection)/?.*$/
//
// @grant          GM_xmlhttpRequest
//
// @version        0.0.1
// ==/UserScript==

$(function() {

    $('head').append('<style>.ratings { padding-left: 5px!important; background-color: white; color: black; font-size: 12px!important; text-align: left!important; };</style>');
    $('head').append('<style>.value { padding-left: 10px!important; font-weight: bolder!important; font-size: 13px!important; };</style>');

    $('div[data-type="movie"]').each(function(i) {

        var url = $(this).attr('data-url');
        if (url) {
            var movie = $(this);
            $.get(url, function(data) {
                var imdb = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://www.omdbapi.com/?plot=short&tomatoes=true&r=json&i=" + imdb,
                    onload: function(json) {
                        var res = $.parseJSON(json.responseText);
                        var h = $('<h4>', {
                            'class': 'ratings',
                            'html': 'IMDb: <span class="value">' + res.imdbRating + ' (' + res.imdbVotes + ' Votes)</span>'
                        });
                        var h2 = $('<h4>', {
                            'class': 'ratings',
                            'html': 'RT (c/u): <span class="value">' + res.tomatoRating.replace("N/A", "-") + ' / ' + res.tomatoUserRating.replace("N/A", "-") + '</span>'
                        });
                        $(movie).find('.quick-icons').after(h2);
                        $(movie).find('.quick-icons').after(h);

                    }
                });

            });

        }
    });

});