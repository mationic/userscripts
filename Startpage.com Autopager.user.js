// ==UserScript==
// @name           Startpage.com Autopager
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
//
// @description    Autopager for startpage.com
//
// @include        /^https?://(.+\.)?startpage\.com\/?do\/(meta)?search(\.pl)?(\?.*)?$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
//
// @version        0.0.5
// ==/UserScript==

(function ($) {
    "use strict";
    /*jslint browser:true, regexp: true, newcap:true */
    /*global $, jQuery, GM_xmlhttpRequest, GM_getValue, GM_setValue */
    var addAutoPager = function () {
        $(document).bind('scroll', function () {
            var pos = $(document).height() - $('body').scrollTop() - $('html').scrollTop() - $(window).height(),
                form = $('#nextnavbar form'),
                data = "",
                breaker,
                s;
            if (!$('#results_content').hasClass('loading') && pos < 50) {
                $('#results_content').addClass('loading');
                breaker = $('<div>', {
                    'class': 'breaker',
                    'style': 'clear: both; line-height: 20px; text-align: center; margin-top: 20px; margin-bottom: 20px; border: 1px solid; opacity: 0.5; font-style: italic;',
                    'html': 'loading page <span class="nr"></span> ..'
                });
                breaker.css('width', $('#results_content .result').css('width'));
                s = parseInt($('#pagenavigation #pnform').html().match(/.*&nbsp;(\d+)&nbsp;.*/).pop(), 10) + 1;
                breaker.find('.nr').text(s);
                $('#results, #video_results').last().append(breaker);

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
                        var java = "java";
                        if ($(response.responseText).find('#results, #video_results').size()) {
                            breaker.after($(response.responseText).find('#results, #video_results').html());
                            $('#search_footer').html($(response.responseText).find('#search_footer').html());
                            $('.classified').hide();
                            $('.classified').last().show();
                            breaker.css('font-style', 'normal');
                            breaker.attr('id', 'pagenav' + breaker.find('span').text());
                            breaker.html($('#pagenavigation').clone(true).html());
                            breaker.find('div').css('display', 'inline');
                            breaker.find('form').each(function (i) {
                                $(this).attr('id', $(this).attr('name') + '_' + breaker.attr('id') + '_' + i);
                                $(this).attr('name', $(this).attr('id'));
                                if ($(this).attr('name').substr(0, 6) !== "pnform") {
                                    $(this).find('a').attr("href", java + "script:document." + $(this).attr('name') + ".submit();");
                                }
                            });
                            $('#pagenavigation div').css('display', 'inline');
                            $('#results_content').removeClass('loading');
                        } else {
                            $('.breaker').last().remove();
                        }
                    },
                    onerror: function () {
                        $('.breaker').last().remove();
                        $('#results_content').removeClass('loading');
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
        $('#head_left').parent().append(link);
        if (GM_getValue('SP-Autopager', false)) {
            link.find('span').text('on');
            addAutoPager();
        }
    });
}(jQuery));