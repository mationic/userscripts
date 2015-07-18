// ==UserScript==
// @name           Chaturbate.com auto login
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description    Chaturbate auto login + hiding of amazon etc
//
// @include        /^https?://(.+\.)?chaturbate\.com/?.*$/
//
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
//
// @grant          none
//
// @version        0.0.3
// ==/UserScript==

/**
 *      The JQuery Cookie plugin is only used to disable the terms and conditions overlay.
 **/
jQuery.noConflict();

(function ($) {
    "use strict";
    /*jslint browser: true */
    /*global $, jQuery */

    var options = {
        autoLogin: { active: false, username: '', password: '' }
    };

    $(function () {

        $('#entrance_terms:visible, #overlay:visible').hide();
        if ($.cookie('agreeterms') !== '1') { $.cookie('agreeterms', '1', {expires: 365, path: '/'}); }

        $("img, p").each(function () { if ($(this).css('position') === "fixed" || $(this).css('position') === "absolute") { $(this).hide(); } });

        if (options !== undefined && options.autoLogin !== undefined && options.autoLogin.active === true && options.autoLogin.password !== '' && options.autoLogin.username !== '' && $('a[href$="auth/login/"]').size() > 0) {
            $('#login-box').find('form input[type="password"]').attr('value', options.autoLogin.password);
            $('#login-box').find('form input[name="username"]').attr('value', options.autoLogin.username);
            $('#login-box').find('form input[type="submit"]').click();
        }

    });


}(jQuery));
