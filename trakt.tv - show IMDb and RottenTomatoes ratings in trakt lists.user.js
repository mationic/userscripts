// ==UserScript==
// @name           trakt.tv - add IMDb & RottenTomatoes movie ratings (and sorting options for ratings)
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluis
// @author         jesuis-parapluie
// @description    Inserts movie ratings from IMDb, RottenTomatoes and Metacritic into trakt (with sorting options).
//
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(shows|calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        0.1.22
//
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true, regexp: true, newcap: true*/
    /*global jQuery, GM_xmlhttpRequest */
    $.noConflict();

    var loadRatingsForItem = function () {
            var imdb = $('<h3>', {
                    'class': 'ratings',
                    'html': '<div style="float: left; width: 90px;">IMDb</div><span class="value">&nbsp;</span>'
                }),
                tomatoes = $('<h3>', {
                    'class': 'ratings',
                    'html': '<div style="float: left; width: 97px;">R.T. / Metascore</div><span class="value">&nbsp;</span>'
                }),
                dummy = $('<h3>', {
                    'class': 'ratings',
                    'style': 'opacity: 0.8; height: 18px;'
                }),
                url = $(this).attr('data-url');

            if ($(this).attr('data-type') !== 'movie') {
                $(this).find('.quick-icons').after(dummy).after(dummy.clone());
            } else {
                $(this).find('.quick-icons').after(tomatoes).after(imdb);
                if (url) {
                    $(imdb).find('span.value').html('<span style="color: #999!important; font-weight: normal; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;loading<span>');
                    $.get(url, function (data) {
                        var imdb_id = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "http://www.omdbapi.com/?plot=short&tomatoes=true&r=json&i=" + imdb_id,
                            onload: function (json) {
                                var r, res = $.parseJSON(json.responseText);
                                for (r in res.Ratings) {
                                    if (res.Ratings.hasOwnProperty(r) && res.Ratings[r].Source === "Rotten Tomatoes") {
                                        res.tomatoRating = res.Ratings[r].Value;
                                    }
                                }
                                if (res.tomatoRating === undefined || res.tomatoRating === "N/A") {
                                    res.tomatoRating = '-';
                                }
                                if (res.Metascore === undefined || res.Metascore === "N/A") {
                                    res.Metascore = '-';
                                }
                                if (res.imdbRating === undefined || res.imdbRating === "N/A") {
                                    $(imdb).find('span.value').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-');
                                } else {
                                    $(imdb).find('span.value').html('<a href="http://www.imdb.com/title/' + res.imdbID + '">' + res.imdbRating + '<span style="font-size: 11px!important; font-style: normal; color: #999;"> (' + res.imdbVotes + ')</span></a>');
                                }
                                $(tomatoes).find('span.value').html(res.tomatoRating + '<span style="font-size: 11px!important; font-style: normal; color: #999;"> &nbsp;/&nbsp; </span>' + res.Metascore);
                            },
                            onerror: function () {
                                $(imdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                            }
                        });
                    }).fail(function () {
                        $(imdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
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
                r = $(item).find("h3.ratings").text().match(/IMDb\W+(\d(\.\d)?).*/i);
            }
            if (type === 'tomatometer') {
                r = $(item).find("h3.ratings").text().match(/R\.T\.[^\d]+(\d*)%?.*/i);
            }
            if (type === 'metascore') {
                r = $(item).find("h3.ratings").text().match(/R\.T\. \/[^\/]+\/\W*(\d+).*/i);
            }
            if (r !== null && r.length > 1 && r[1] !== '-') {
                return r[1];
            }
            return -1;
        },
        sortByRating = function (e) {
            var items, order,
                dict = {},
                parent = $("div.grid-item").parent(),
                how = function (a, b) { return a - b; };

            $(".no-top").hide();
            if ($('#sortable-name').size() > 0) {
                $('#sortable-name').text($(e.target).text()).attr('data-sort-by', $(e.target).attr('data-sort-by'));
            } else {
                $('.trakt-icon-swap-vertical').next().find('.btn-default').html($(e.target).text() + ' <span class="caret"></span>');
            }
            $("div.grid-item").each(function () {
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
        setPositioning = function () {
            setTimeout(function () {
                if ($('.trakt-icon-swap-vertical').next().find('a.rating:contains("' + $('.trakt-icon-swap-vertical').next().find('.btn-default').text().trim() + '")').size() > 0) {
                    $("div.grid-item").each(function () { $(this).attr('style', '{position:relative;top:0px;left:0px;}'); });
                } else if ($('.grid-item').first().attr('style') !== undefined) {
                    $("div.grid-item").each(function () { $(this).css('position', 'absolute'); });
                }
            }, 500);
        },
        init = function () {

            $("div[id*=\"huckster-desktop\"]").html("");

            if (/^\/users\/.+\/(collection|ratings|lists\/|watchlist)/.test(window.location.pathname) && $('.trakt-icon-swap-vertical').next().find('ul a.rating').size() === 0) {
                var sortMenu = $('.trakt-icon-swap-vertical').next().find('ul');
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='imdb' data-sort-how='desc'>IMDb rating</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='tomatometer' data-sort-how='desc'>TomatoMeter</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='metascore' data-sort-how='desc'>Metascore</a>" }));
                sortMenu.find('a.rating').click(sortByRating);
                sortMenu.find('a').click(setPositioning);
                $(window).on('resize', setPositioning);
                $('#sort-direction').click(function () {
                    $('.trakt-icon-swap-vertical').next().find('a.rating:contains("' + $('.trakt-icon-swap-vertical').next().find('.btn-default').text().trim() + '")').click();
                });
            } else {
                $(window).off('resize', setPositioning);
            }
            if ($("div.grid-item[data-type='movie']").size() > 0) {
                $("div.grid-item").not('.ratingsloaded').each(loadRatingsForItem);
            }
        };


    $(window).ready(function () {
        $('head').append('<style>h3.ratings, h3.ratings a { padding-top:4px!important; padding-bottom:0px!important; padding-left: 5px!important; margin-top: 0px!important; margin-left:1px!important; margin-right:1px!important; background-color: #292D41; color: white; font-size: 10px!important; text-align: left!important; };</style>');
        $('head').append('<style>span.value,  span.value>a { padding-left: 4px!important; font-weight: bolder!important; font-size: 12px!important; };</style><style>.quick-icons { border-bottom:none!important; };</style>');
        init();

        $(window).on('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'BODY') {
                $(e.target).ready(init);
            }
        });

    });

}(jQuery));
