// ==UserScript==
// @name           trakt.tv - show IMDb & RottenTomatoes ratings in trakt lists
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
// @description	   Loads ratings from omdbapi.com
//
// @include        /^https?://(.+\.)?trakt\.tv/(.+/)?(lists|watchlist|collection)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        0.0.2
//
// ==/UserScript==

$(function() {

    $('head').append('<style>.ratings { padding-left: 10px!important; background-color: white; color: black; font-size: 12px!important; text-align: left!important; };</style>');
    $('head').append('<style>.value { padding-left: 15px!important; font-weight: bolder!important; font-size: 13px!important; };</style>');

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
                        console.log(res);
                        if (typeof(res.imdbRating) == 'undefined' || res.imdbRating == "N/A") {
                            res.imdbRating = '-   ';
                            res.imdbVotes = 0;
                        }
                        if (typeof(res.tomatoRating) == 'undefined' || res.tomatoRating == "N/A") res.tomatoRating = '-';
                        if (typeof(res.tomatoUserRating) == 'undefined' || res.tomatoUserRating == "N/A") res.tomatoUserRating = '-';
                        var h = $('<h4>', {
                            'class': 'ratings',
                            'html': 'IMDb: <span class="value">' + res.imdbRating + ' (' + res.imdbVotes + ' Votes)</span>'
                        });
                        var h2 = $('<h4>', {
                            'class': 'ratings',
                            'html': 'R.T. c/u: <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;' + res.tomatoRating + ' / ' + res.tomatoUserRating + '</span>'
                        });
                        $(movie).find('.quick-icons').after(h2);
                        $(movie).find('.quick-icons').after(h);

                    }
                });

            });

        }
    });

    if ($('div[data-type="movie"]').size()) {
        $('div[data-type="episode"]').each(function(i) {
            var blank = $('<h4>', {
                'class': 'ratings',
                'html': '&nbsp;<span class="value">&nbsp;</span>'
            });
            $(this).find('.quick-icons').after(blank);
            $(this).find('.quick-icons').after(blank.clone());
        });
    }

});