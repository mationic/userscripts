// ==UserScript==
// @name           trakt.tv - add IMDb & RottenTomatoes movie ratings (and sorting options for ratings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
// @description    Inserts movie ratings from IMDb and RottenTomatoes into trakt and adds sorting options for ratings.
//
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(shows|calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        0.1.9
//
// ==/UserScript==



(function ($) {
    'use strict';
    /*jslint browser:true,regexp: true, newcap: true */
    /*global $, jQuery, GM_xmlhttpRequest */
    var loadRatingsForItem = function () {
            var imdb = $('<h4>', {
                    'class': 'ratings',
                    'html': 'IMDb: <span class="value">&nbsp;</span>'
                }),
                tomatoes = $('<h4>', {
                    'class': 'ratings',
                    'html': 'R.T. c/u: <span class="value">&nbsp;</span>'
                }),
                url;
            $(this).find('.quick-icons').after(tomatoes);
            $(this).find('.quick-icons').after(imdb);

            if ($(this).attr('data-type') === 'movie') {

                url = $(this).attr('data-url');
                if (url) {
                    $(imdb).find('span').html('<span style="color: gray!important; font-weight: normal; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;loading<span>');
                    $.get(url, function (data) {
                        var imdb_id = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "http://www.omdbapi.com/?plot=short&tomatoes=true&r=json&i=" + imdb_id,
                            onload: function (json) {
                                var res = $.parseJSON(json.responseText);
                                if (res.imdbRating === undefined || res.imdbRating === "N/A") {
                                    res.imdbRating = '-   ';
                                    res.imdbVotes = 0;
                                }
                                if (res.tomatoRating === undefined || res.tomatoRating === "N/A") { res.tomatoRating = '-'; }
                                if (res.tomatoUserRating === undefined || res.tomatoUserRating === "N/A") { res.tomatoUserRating = '-'; }
                                $(imdb).find('span').html(res.imdbRating + ' (' + res.imdbVotes + ' Votes)');
                                $(tomatoes).find('span').html('&nbsp;&nbsp;&nbsp;&nbsp;' + res.tomatoRating + ' / ' + res.tomatoUserRating + '</span>');
                            },
                            onerror: function () {
                                $(imdb).find('span').html('<span style="color: red!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                            }
                        });

                    });
                }

            }

        },
        parseRating = function (item, type) {
            var r;
            if (type === 'originalOrder') { return $(item).attr('startOrder'); }
            if (type === 'trakt') {
                r = $(item).find("div.percentage").text().slice(0, -1);
                if (r !== null && r >= 0 && r <= 100) { return r; }
            }
            if (type === 'imdb') { r = $(item).find("h4.ratings").text().match(/IMDb\:\W+(\d(\.\d)?).*/i); }
            if (type === 'rtcritic') { r = $(item).find("h4.ratings").text().match(/R\.T\. c\/u\:\W+(\d(\.\d)?)-?\W*\/.*/i); }
            if (type === 'rtuser') { r = $(item).find("h4.ratings").text().match(/R\.T\. c\/u\:\W+\d?\.?\d?-?\W*\/\W*(\d(\.\d)?)-?.*/i); }
            if (r !== null && r.length > 1) { return r[1]; }
            return -1;
        },
        sortByRating = function (e) {
            $('.trakt-icon-swap-vertical').next().find('button').html($(e.target).text() + " <span class='caret'></span>");
            var dict = {},
                order,
                parent,
                items;
            $("div.grid-item").each(function () {
                var rating = parseRating(this, $(e.target).attr('id'));
                if (dict[rating] === undefined) {
                    dict[rating] = [$(this)];
                } else {
                    dict[rating].push($(this));
                }
            });
            order = Object.keys(dict).sort();
            parent = $("div.grid-item").parent();
            while (order.length > 0) {
                items = dict[order.pop()];
                while (items.length > 0) { parent.append(items.shift()); }
            }
        },
        init = function () {

            $("div[id*='huckster-desktop'").html('');

            if (/^\/users\/.+\/(collection|ratings|lists\/|watchlist)/.test(window.location.pathname)) {
                var sortMenu = $('.trakt-icon-swap-vertical').next().find('ul');
                sortMenu.find('a').first().attr('id', 'originalOrder');
                sortMenu.append($('<li>', { html: "<a id='imdb'>IMDb Rating</a>" }));
                sortMenu.append($('<li>', { html: "<a id='trakt'>Trakt Rating</a>" }));
                sortMenu.append($('<li>', { html: "<a id='rtcritic'>RottenTomatoes critic</a>" }));
                sortMenu.append($('<li>', { html: "<a id='rtuser'>RottenTomatoes user</a>" }));
                sortMenu.find('a').click(sortByRating);
            }

            $("div.grid-item").each(function (i) {
                $(this).attr('startOrder', 99 - i);
            });
            if ($("div.grid-item[data-type='movie']").size() > 0) { $('div.grid-item').each(loadRatingsForItem); }
        };


    $(window).ready(function () {

        $('head').append('<style>.ratings { padding-left: 10px!important; background-color: white; color: black; font-size: 12px!important; text-align: left!important; };</style>');
        $('head').append('<style>.value { padding-left: 8px!important; font-weight: bolder!important; font-size: 13px!important; };</style>');
        init();

        $(window).bind('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'BODY') { $(e.target).ready(init); }
        });

    });

}(jQuery));