// ==UserScript==
// @name           trakt.tv - show IMDb & RottenTomatoes ratings in trakt lists
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description	   Loads ratings from omdbapi.com
//
// @include        /^https?://(.+\.)?trakt\.tv/(.+/)?lists/.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js

// @grant          GM_xmlhttpRequest
//
// @version        0.0.1
// ==/UserScript==

$(function() {

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
                            'html': 'IMDb: ' + res.imdbRating + ' (' + res.imdbVotes + ' Votes)'
                        });
                        var h2 = $('<h4>', {
                            'html': 'RT (c/u): ' + res.tomatoRating.replace("N/A", "-") + ' / ' + res.tomatoUserRating.replace("N/A", "-")
                        });
                        $(movie).find('.titles').prepend(h2);
                        $(movie).find('.titles').prepend(h);

                    }
                });

            });

        }
    });

});