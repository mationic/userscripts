// ==UserScript==
// @name           Startpage.com Autopager
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
//
// @description    Autopager for startpage.com
//
// @include        /^https?://(.+\.)?startpage\.com\/?do\/(meta)?search(\.pl)?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
//
// @version        0.0.7
// ==/UserScript==

(function ($) {
    "use strict";
    /*jslint browser:true, regexp: true, newcap:true */
    /*global $, jQuery, GM_xmlhttpRequest, GM_getValue, GM_setValue */
    var addAutoPager = function () {
        $(document).bind('scroll', function () {
            var pos = $(document).height() - $('body').scrollTop() - $('html').scrollTop() - $(window).height(),
                form = $('#nextnavbar form'),
                resultsQuery = '#results, #video_results',
                data = "",
                breaker,
                nr;
            if (!$('#results_content').hasClass('trigger-block') && pos < 50) {
                $('#results_content').addClass('trigger-block');
                breaker = $('<div>', {
                    'class': 'breaker',
                    'style': 'clear: both; line-height: 21px; text-align: center; margin: 10px; border: 1px solid; opacity: 0.7; font-style: italic;',
                    'html': 'loading page <span class="nr"></span> ..'
                });
                breaker.css('width', $('div#first-result').width());
                if ($("div[id*='pagenav'] .active").length !== 0) {  // new design
                    resultsQuery = '#bottom-result-container';
                    nr = parseInt($("div[id*='pagenav'] .active").last().text(), 10) + 1;
                    $('#pagenavigation').before(breaker);
                } else {
                    nr = parseInt($('#pagenavigation #pnform').html().match(/.*&nbsp;(\d+)&nbsp;.*/).pop(), 10) + 1;
                    $(resultsQuery).last().append(breaker);
                }
                if ($('#pagenavigation').find('a[id=' + nr + ']').length === 0) {
                    breaker.remove();
                    return true;
                }
                breaker.find('.nr').text(nr);
                form.find("input[type=\"hidden\"]").each(function () {
                    data += "&" + $(this).attr('name') + "=" + $(this).attr('value');
                });
                data = data.substring(1);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: form.attr('action'),
                    data: data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        var java = "java",
                            newPage = $(response.responseText);
                        if (newPage.find(resultsQuery).size()) {
                            breaker.after(newPage.find(resultsQuery).html());
                            breaker.css('font-style', 'normal');
                            breaker.attr('id', 'pagenav' + breaker.find('span').text());
                            $('.classified').hide();
                            $('.classified').last().show();
                            if ($('#search_footer').size()) {
                                $('#search_footer').html(newPage.find('#search_footer').html());
                                breaker.html($('#pagenavigation').clone(true).html());
                            } else {  // new design
                                breaker.html($('#pagenavigation').html());
                                $('#pagenavigation').remove();
                                $('#pagenavigation').html(newPage.find('#pagenavigation').html());
                            }
                            breaker.find('div').css('display', 'inline');
                            breaker.find('form').each(function (i) {
                                $(this).attr('id', $(this).attr('name') + '_' + breaker.attr('id') + '_' + i);
                                $(this).attr('name', $(this).attr('id'));
                                if ($(this).attr('name').substr(0, 6) !== "pnform") {
                                    $(this).find('a').attr("href", java + "script:document." + $(this).attr('name') + ".submit();");
                                }
                            });
                            $('#pagenavigation div').css('display', 'inline');
                            $('#results_content').removeClass('trigger-block');
                        } else {
                            $('.breaker').last().remove();
                        }
                    },
                    onerror: function () {
                        $('.breaker').last().html('error loading next page');
                    }
                });
            }
        });
    };
    $(function () {
        var link = $('<a>', {
            'class': 'autopager',
            'style': 'cursor:pointer;font-weight:normal;text-align:left;',
            'html': 'Autopager <span style="color:#D5402C;">off</span>'
        }).click(function () {
            if ($(this).find('span').text() === 'on') {
                $(this).find('span').text('off');
                GM_setValue('SP-Autopager', false);
                $(document).unbind('scroll');
            } else {
                $(this).find('span').text('on');
                GM_setValue('SP-Autopager', true);
                addAutoPager();
            }
        });
        if ($('#pagenavigation').length) {
            if ($('.navbar-header').length) {  // new design
                $('#head_left').before(link);
                link.css('position', 'relative');
                link.css('left', '640px');
                link.css('top', '63px');
            } else {
                $('#head_left').parent().append(link);
            }
            if (GM_getValue('SP-Autopager', false)) {
                link.find('span').text('on');
                addAutoPager();
            }
        }
    });
}(jQuery));