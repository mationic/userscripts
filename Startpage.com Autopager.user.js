// ==UserScript==
// @name           Startpage.com Autopager
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
//
// @description    Autopager for startpage.com
//
// @include        /^https?://(.+\.)?startpage\.com\/?do\/(meta)?search.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
//
// @version        0.0.3
// ==/UserScript==

(function ($) {
    "use strict";
    /*jslint browser:true, regexp: true, newcap:true */
    /*global $, jQuery, GM_xmlhttpRequest, GM_getValue, GM_setValue */
    var addAutoPager = function () {
        var breaker = $('<div>', {
            'class': 'breaker',
            'style': 'clear: both; line-height: 20px; text-align: center; margin-top: 20px; margin-bottom: 20px; background: rgb(230, 230, 230); font-style: italic;',
            'html': 'loading page <span class="nr" style="margin-left: 10px;">Loading page </span>'
        });
        breaker.css('width', $('#results_content .result').css('width'));
        $(document).bind('scroll', function () {
            var pos = $('#results_content').height() - $('#footer').height() - $('#head').height() - $('#results_header').height() - $('body,html').scrollTop(),
                form = $('#nextnavbar form'),
                data = "",
                br,
                s;
            if (!$('#results_content').hasClass('loading') && pos < 400) {
                $('#results_content').addClass('loading');
                br = breaker.clone();
                s = parseInt($('#pnform').html().match(/.*&nbsp;(\d+)&nbsp;.*/).pop(), 10) + 1;
                br.find('.nr').html('- ' + s + ' -');
                $('#results, #video_results').last().append(br);

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
                        if ($(response.responseText).find('#results, #video_results').size()) {
                            br.after($(response.responseText).find('#results, #video_results').html());
                            $('.classified').hide();
                            $('.classified').last().show();
                            br.css('font-style', 'inherit');
                            br.html('Page ' + br.find('.nr').html());
                            $('#search_footer').html($(response.responseText).find('#search_footer').html());
                        } else {
                            $('.breaker').last().remove();
                        }
                        $('#results_content').removeClass('loading');
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
        var link = $('<div>', {
            'class': 'autopager',
            'style': 'color:#608BD6;cursor:pointer;margin-top: 10px;font-weight:bold;text-align:center;',
            'html': 'Autopager <span style="color:#D5402C;">off</span>'
        }).click(function () {
            if ($(this).hasClass('isOn')) {
                $(this).removeClass('isOn');
                $(this).find('span').text('off');
                GM_setValue('SP-Autopager', false);
                $(document).unbind('scroll');
            } else {
                $(this).addClass('isOn');
                $(this).find('span').text('on');
                GM_setValue('SP-Autopager', true);
                addAutoPager();
            }
        });
        if ($('#results, #video_results').hasClass('no_side_bar')) {
            $('#results_header').append(link);
        } else {
            $('#side_bar').prepend(link);
        }
        if (GM_getValue('SP-Autopager', false)) {
            link.addClass('isOn');
            link.find('span').text('on');
            addAutoPager();
        }
    });
}(jQuery));