// ==UserScript==
// @name           trakt.tv - add IMDb & RottenTomatoes movie ratings (and sorting options for ratings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
// @description    Inserts movie ratings from IMDb and RottenTomatoes into trakt and adds sorting options for ratings.
//
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(shows|calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        0.1.13
//
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true,regexp: true, newcap: true, todo: true */
    /*global $, jQuery, GM_xmlhttpRequest */

    var loadRatingsForItem = function () {
            var imdb = $('<h3>', {
                    'class': 'ratings',
                    'html': 'IMDb: <span class="value">&nbsp;</span>'
                }),
                tomatoes = $('<h3>', {
                    'class': 'ratings',
                    'html': 'R.T. c/u: <span class="value">&nbsp;</span>'
                }),
                url;
            $(this).find('.quick-icons').after(tomatoes);
            $(this).find('.quick-icons').after(imdb);
            $(this).addClass('ratingsloaded');

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
                                if (res.tomatoRating === undefined || res.tomatoRating === "N/A") {
                                    res.tomatoRating = '-';
                                }
                                if (res.tomatoUserRating === undefined || res.tomatoUserRating === "N/A") {
                                    res.tomatoUserRating = '-';
                                }
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
            if (type === 'originalOrder') {
                return $(item).attr('startOrder');
            }
            if (type === 'trakt') {
                r = $(item).find("div.percentage").text().slice(0, -1);
                if (r !== null && r >= 0 && r <= 100) {
                    return r;
                }
            }
            if (type === 'imdb') {
                r = $(item).find("h3.ratings").text().match(/IMDb\:\W+(\d(\.\d)?).*/i);
            }
            if (type === 'rtcritic') {
                r = $(item).find("h3.ratings").text().match(/R\.T\. c\/u\:\W+(\d(\.\d)?)-?\W*\/.*/i);
            }
            if (type === 'rtuser') {
                r = $(item).find("h3.ratings").text().match(/R\.T\. c\/u\:\W+\d?\.?\d?-?\W*\/\W*(\d(\.\d)?)-?.*/i);
            }
            if (r !== null && r.length > 1) {
                return r[1];
            }
            return -1;
        },
        sortByRating = function (e) {
            var items, order,
                dict = {},
                parent = $("div.grid-item").parent(),
                how = function (a, b) { return a - b; };
            $('#sortable-name').attr('data-sort-by', $(e.target).attr('data-sort-by'));
            $('#sortable-name').text($(e.target).text());
            $("div.grid-item").each(function () {
                $(this).css('position', '').css('left', '').css('top', '');
                var rating = parseRating(this, $(e.target).attr('data-sort-by'));
                if (dict[rating] === undefined) {
                    dict[rating] = [$(this)];
                } else {
                    dict[rating].push($(this));
                }
            });
            if ($('#sort-direction').hasClass('desc')) {
                how = function (b, a) { return a - b; };
            }

            order = Object.keys(dict).sort(how);

            while (order.length > 0) {
                items = dict[order.pop()];
                while (items.length > 0) {
                    parent.append(items.shift());
                }
            }
        },
        orderratings = function () {
            if ($('.trakt-icon-swap-vertical').next().find('a.rating[data-sort-by=' + $('#sortable-name').attr('data-sort-by') + ']').size() > 0) {
                setTimeout(function () {
                    $("div.grid-item").each(function () { $(this).attr('style', '{position:relative;top:0px;left:0px;}'); });
                }, 500);
            } else {
                $("div.grid-item").each(function () { $(this).css('position', 'absolute'); });
            }
        },
        init = function () {

            $("div[id*=\"huckster-desktop\"]").html("");

            if (/^\/users\/.+\/(collection|ratings|lists\/|watchlist)/.test(window.location.pathname) && $('.trakt-icon-swap-vertical').next().find('ul a.rating').size() === 0) {
                var sortMenu = $('.trakt-icon-swap-vertical').next().find('ul');
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='imdb' data-sort-how='desc'>IMDb Rating</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='rtcritic' data-sort-how='desc'>RottenTomatoes critic</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='rtuser' data-sort-how='desc'>RottenTomatoes user</a>" }));
                sortMenu.find('a.rating').click(sortByRating);
                sortMenu.find('a').click(orderratings);
                $('#sort-direction').click(function () {
                    $('.trakt-icon-swap-vertical').next().find('ul').find('a.rating[data-sort-by=' + $('#sortable-name').attr('data-sort-by') + ']').click();
                });
            }
            if ($("div.grid-item[data-type='movie']").size() > 0) {
                $('div.grid-item').not('.ratingsloaded').each(loadRatingsForItem);
            }
        };


    $(window).ready(function () {

        $('head').append('<style>.ratings { padding-top:2px!important; margin-top: 0px!important; margin-left:1px!important; margin-right:1px!important; padding-left: 10px!important; background-color: #292D41; color: white; font-size: 12px!important; text-align: left!important; };</style>');
        $('head').append('<style>.value { padding-left: 8px!important; font-weight: bolder!important; font-size: 13px!important; };</style><style>.quick-icons { border-bottom:none!important; };</style>');
        init();

        $(window).on('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'BODY') {
                $(e.target).ready(init);
            }
        });
        $(window).on('resize', orderratings);
    });

}(jQuery));