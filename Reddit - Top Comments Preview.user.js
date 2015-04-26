// ==UserScript==
// @name           Reddit - Top Comments Preview
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         Erik Wannebo, gavin19, jesuis-parapluie
// @description    Preview to the top comments on Reddit (optional: autoload comments, autoload images, autohide sidebar)
// @include        /^https?://(.+\.)?reddit\.com/.*$/
// @exclude        /^https?://(.+\.)?reddit\.com/.+/comments/.*$/
// @grant          GM_getValue
// @grant          GM_setValue
// @version        1.84
// ==/UserScript==
(function() {
    'use strict';
    var topCP = {
        opts: {
            /* Number of comments to display. Default is 3 */
            topComments: 3,
            /* Changes the comment sorting. Available sortings: top, best, new, hot, controversial, old */
            commentSorting: 'top',
            /* Disables the option for hiding the sidebar. */
            disableSidebarButton: false,
            /* Disables the autoloading option for images and comments. */
            disableAutoloadButton: false,
            /* set keyboard shortcut 't' to show/hide active top comments (needs RES) */
            disableShortCut: false
        },
        addTopLinks: function() {
            var i,
                len,
                link,
                li,
                articleID,
                tmp,
                parent,
                a = document.querySelectorAll('.linklisting .comments:not(.empty)');
            if (a.length) {
                for (i = 0, len = a.length; i < len; i += 1) {
                    if (!a[i].parentNode.parentNode.querySelector('.toplink') && /[0-9]/.test(a[i])) {
                        articleID = a[i].getAttribute('href');
                        articleID = articleID.substring(articleID.indexOf('/comments/') + 10, articleID.indexOf('/comments/') + 16);
                        link = document.createElement('a');
                        li = document.createElement('li');
                        //li.className = 'rcp';
                        li.appendChild(link);
                        link.className = 'toplink';
                        tmp = 'java';
                        link.href = tmp + 'script:;';
                        link.setAttribute('id', 'toplink' + articleID);
                        link.setAttribute('style', 'color:orangered;text-decoration:none;');
                        link.textContent = ' ' + topCP.opts.commentSorting;
                        parent = a[i].parentNode.parentNode;
                        parent.insertBefore(li, parent.querySelector('.first + li'));
                        topCP.addListener(link, articleID);
                        if (GM_getValue('autoLoadComments', false)) {
                            topCP.retrieveTopComments(link, articleID);
                        }
                    }
                }
            }
        },
        addListener: function(link, id) {
            link.addEventListener('click', function() {
                topCP.retrieveTopComments(this, id);
            });
        },
        retrieveTopComments: function(ele, articleID) {
            var pre,
                url,
                xhr,
                thisPre;
            
            topCP.kill_preview = function() {
                this.parentNode.removeChild(this);
            };
            ele = ele.parentNode.parentNode.parentNode;
            if (!document.querySelector('#preview' + articleID)) {
                pre = document.createElement('div');
                pre.setAttribute('id', 'preview' + articleID);
                pre.classList.add('loading');
                // ele.querySelector('.expando').parentNode.parentNode.classList.contains('self, image, video, video-muted gallery')
                if (GM_getValue('autoLoadComments', false)) {
                    ele.appendChild(pre);
                } else {
                    ele.insertBefore(pre, ele.querySelector('.expando'));
                }
            }
            if (document.querySelector('#preview' + articleID).classList.contains('loading')) {
                url = window.location.href.split('/')[0] + '//www.reddit.com/comments/' + articleID + '/.json?limit=' + (topCP.opts.topComments + 5) + '&sort=' + topCP.opts.commentSorting;
                xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        topCP.onloadJSON(xhr);
                    } else if (xhr.status === 503) {
                        // Service not available, retry every second
                        setTimeout(topCP.retrieveTopComments(ele, articleID), 1000);
                    }
                };
                xhr.send(null);
            } else {
                thisPre = document.querySelector('#preview' + articleID);
                thisPre.parentNode.parentNode.style.marginBottom = '';
                thisPre.parentNode.removeChild(thisPre);
            }
        },
        onloadJSON: function(response) {
            var i,
                len,
                content,
                score,
                contentDiv,
                article,
                author,
                permalink,
                newHTML = '',
                comments = JSON.parse(response.responseText),
                commentsLength = comments[1].data.children.length,
                articleID = comments[0].data.children[0].data.id,
                threadLink = comments[0].data.children[0].data.permalink;
            len = topCP.opts.topComments < commentsLength ? topCP.opts.topComments : commentsLength;
            for (i = 0; i < len; i += 1) {
                content = comments[1].data.children[i].data.body_html;
                if (content) {
                    contentDiv = document.createElement('div');
                    contentDiv.innerHTML = content;
                    content = contentDiv.firstChild.textContent;
                    author = comments[1].data.children[i].data.author;
                    score = comments[1].data.children[i].data.score;
                    permalink = threadLink + comments[1].data.children[i].data.id;
                    newHTML += (i > 0 ? '<hr>' : '');
                    newHTML += '<a class="ulink" target="_blank" href="/u/' + author;
                    newHTML += '">' + author + '</a>';
                    newHTML += '<span class="points">| score: ' + score + '</span>';
                    newHTML += '<a class="permalink" target="_blank" href="' + permalink + '">permalink</a><br />' + content;
                }
            }
            article = document.querySelector('#preview' + articleID);
            if (article) {
                article.classList.remove('loading');
                article.innerHTML = newHTML;
            }
        },
        addStyle: function() {
            var style,
                sheet = '';
            sheet += 'div[id^=preview]{box-sizing:border-box;-moz-box-sizing:border-box;background:#fff;border-radius:5px;border:1px solid #dbdbdb;white-space:normal;padding:5px;display:inline-block;margin:8px 0;}';
            sheet += '.loading:before{content:"Loading...";}div[id^=preview] .md{border:1px solid #ddd;background:#f0f0f0;box-sizing:border-box;-moz-box-sizing:border-box;margin:3px 0;box-sizing:border-box;padding:2px 8px;}';
            sheet += 'div[id^=preview] .md *{white-space:normal;}div[id^=preview] .md code{white-space:pre;}';
            sheet += 'div[id^=preview] .md pre{overflow:visible}div[id^=preview]>*{font-size: small;}';
            sheet += 'div[id^=preview] .ulink,div[id^=preview] .md a{font-weight:bold;color:#369!important;}';
            sheet += '.aubox a.disabled {color: #995F5F;font-weight: normal;}';
            sheet += '.aubox a.enabled {color: #009D2D;font-weight: normal;}';
            sheet += 'a.sideswitch {cursor:pointer;}';
            sheet += '.listing-page .buttons li{vertical-align:top;}.toplink{text-decoration:none;}';
            sheet += '.permalink { float: right; color: #666;}.points{color:#333;font-weight:bold;margin-left:.5em;}';
            sheet += '.res-nightmode div[id^=preview] .ulink,.res-nightmode div[id^=preview] .md a{color: rgb(20, 150, 220)!important;}';
            sheet += '.res-nightmode div[id^=preview]{ background: #333!important;border-color:#666!important}';
            sheet += '.res-nightmode .toplink{color: #eee!important;}';
            sheet += '.res-nightmode div[id^=preview] .points{color: #ddd!important;}';
            sheet += '.res-nightmode div[id^=preview] .permalink{color: #ccc!important;}';
            sheet += '.res-nightmode div[id^=preview] .md{background:#555!important;border-color: #222!important;}';
            sheet += '.res-nightmode div[id^=preview] .md blockquote{color:#8C8C8C!important;}';
            sheet += '.res-nightmode div[id^=preview] hr{border-color:#777!important;}';
            style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = sheet;
            document.querySelector('head').appendChild(style);
        },
        toggle: function(className) {
            (function(style) {
                style.display = style.display === 'none' ? '' : 'none';
            })(document.querySelector(className).style);
        },
        init: function() {
            if (!topCP.opts.disableSidebarButton) {
                var text = 'hide';
                if (GM_getValue('sideBarToggle', true)) {
                    text = 'show';
                    topCP.toggle('.side');
                }
                var sidebar = document.createElement('li');
                sidebar.innerHTML = '<a class="sideswitch">' + text + ' sidebar</a>';
                sidebar.addEventListener('click', function(e) {
                    topCP.toggle('.side');
                    GM_setValue('sideBarToggle', !GM_getValue('sideBarToggle', true));
                    var text = 'hide';
                    if (GM_getValue('sideBarToggle')) text = 'show';
                    document.querySelector('.sideswitch').innerHTML = text + ' sidebar';
                });
                document.querySelector('.tabmenu').appendChild(sidebar);
            } else {
                GM_setValue('sideBarToggle', false);
                document.querySelector('.side').style.display = '';
            }
            if (!topCP.opts.disableAutoloadButton) {
                var loadbar = document.createElement('li');
                loadbar.className = 'aubox';
                loadbar.innerHTML = '<a>load</a>';
                if (document.querySelector('#RESConsoleVersion') !== null) {
                    var expimg = 'disabled';
                    if (GM_getValue('autoExpandImages', false)) expimg = 'enabled';
                    var spanImages = document.createElement('span');
                    spanImages.innerHTML = '<a href="#" class="' + expimg + '">images</a>';
                    spanImages.addEventListener('click', function(e) {
                        GM_setValue('autoExpandImages', !GM_getValue('autoExpandImages', false));
                        location.reload();
                    });
                    loadbar.appendChild(spanImages);
                }
                var expcom = 'disabled';
                if (GM_getValue('autoLoadComments', false)) expcom = 'enabled';
                var spanComments = document.createElement('span');
                spanComments.innerHTML = '<a href="#" class="' + expcom + '">comments</a>';
                spanComments.addEventListener('click', function(e) {
                    GM_setValue('autoLoadComments', !GM_getValue('autoLoadComments', false));
                    location.reload();
                });
                loadbar.appendChild(spanComments);
                document.querySelector('.tabmenu').appendChild(loadbar);
            } else {
                GM_setValue('autoExpandImages', false);
                GM_setValue('autoLoadComments', false);
            }
            document.body.addEventListener('DOMNodeInserted', function(e) {
                if ((e.target.tagName === 'DIV') && (e.target.getAttribute('id') && e.target.getAttribute('id').indexOf('siteTable') !== -1)) {
                    topCP.addTopLinks();
                }
            }, true);
            if (!topCP.opts.disableShortCut && document.querySelector('#RESConsoleVersion') !== null) {
                window.addEventListener('keyup', function(e) {
                    //t: keycode 84
                    if (e.keyCode === 84 && document.querySelector('.RES-keyNav-activeElement')) {
                        document.querySelector('.RES-keyNav-activeElement .toplink').click();
                    }
                });
                if (GM_getValue('autoExpandImages', false)) {
                    document.querySelector('#viewImagesButton').click();
                }
            }
            topCP.addStyle();
            topCP.addTopLinks();
        }
    };
    if (document.body) {
        setTimeout(function() {
            topCP.init();
        }, 300);
    } else {
        window.addEventListener('load', function() {
            topCP.init();
        }, false);
    }
})();