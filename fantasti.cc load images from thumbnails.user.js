// ==UserScript==
// @name           fantasti.cc load images from thumbnails
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @description	   Show images instead of thumbnails (works with AutoPager or similar programs for endless scrolling)
//
// @include        /^https?://(.+\.)?fantasti\.cc/(.+/)?images/.*$/
// @exclude        http://fantasti.cc/category/tagcloud/images/*
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @version	   0.6
// @grant          none
// ==/UserScript==
function loadImgs()
{
  var query = $('div#loop');
  var q = $('div[id*="post_"]');
  if (!query.size())
  {
    query = $('div#archive');
    q = $('.xxx').parent();
  }
  query.each(function (i)
  {
    if (!$(this).hasClass('done'))
    {
      $(this).addClass('done');
      var imgs = $('<div>', {
        'class': 'images'
      });
      var p = $(this).find('.pages').last();
      if (p.size())
      {
        $(this).before(p.parent(), imgs);
      } 
      else
      {
        imgs.appendTo($(this));
      }
      $(this).find(q).each(function (i) {
        if (!$(this).hasClass('imgdone'))
        {
          $(this).addClass('imgdone');
          var href = $(this).find('a').attr('href');
          $.get(href, function (data) {
            var link = $('<a>', {
              'href': href
            });
            link.append($(data).find('div[id*=\'albums\']').find('img'));
            imgs.append(link);
          });
        }
      });
    }
  });
}
$(function ()
{
  var l = $('<a>', {
    id: 'loadImgs',
    class: 'subm_link',
    style: 'color:#FF4700;cursor:pointer;font-weight:bold;',
    text: 'Load images'
  }).click(function (e)
  {
    var query;
    if ($('a#loadImgs').hasClass('imagesVisible')) {
      $('a#loadImgs').removeClass('imagesVisible');
      $('a#loadImgs').html('Load images');
      $('div.images').hide();
      query = $('div[id*="post_"]');
      if (!query.size()) query = $('.xxx').parent();
      query.show();
    } else {
      $('a#loadImgs').addClass('imagesVisible');
      $('a#loadImgs').html('Load thumbnails');
      $('div.images').show();
      query = $('div[id*="post_"]');
      if (!query.size()) query = $('.xxx').parent();
      query.hide();
      loadImgs();
    }
  });
  $('.sm-navlist').append($('<li>').append(l));
  $(document).bind('DOMNodeInserted', function (e)
  {
    if ($('a#loadImgs').hasClass('imagesVisible') && e.target.tagName === 'DIV' && e.target.getAttribute('id') && (e.target.getAttribute('id') == 'loop' || e.target.getAttribute('id') == 'archive'))
    {
      $('div.images').show();
      $('div[id*="post_"]').hide();
      var query = $('div[id*="post_"]');
      if (!query.size()) query = $('.xxx').parent();
      query.hide();
      loadImgs();
    }
  });
});