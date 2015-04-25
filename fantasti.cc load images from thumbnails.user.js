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
// @version	   0.4
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
          $.get($(this).find('a').attr('href'), function (data) {
            imgs.append($(data).find('div.s').find('img') [1]);
          });
        }
      });
    }
  });
}
$(function ()
{
    
  var l = $('<div>', {
    id: 'loadImgs',
    style: 'margin-left: 110px;text-decoration: underline;color:#f00;cursor:pointer;font-weight: bolder;',
    text: 'Show images'
  }).click(function (e)
  {
    if ($('div#loadImgs').hasClass('imagesVisible')) {
      $('div#loadImgs').removeClass('imagesVisible');
      $('div#loadImgs').html('Show images');
      $('div.images').hide();
      var query = $('div[id*="post_"]');
      if (!query.size()) query = $('.xxx').parent();
      query.show();
    } else {
      $('div#loadImgs').addClass('imagesVisible');
      $('div#loadImgs').html('Show thumbnails');
      $('div.images').show();
      var query = $('div[id*="post_"]');
      if (!query.size()) query = $('.xxx').parent();
      query.hide();
      loadImgs();
    }
  });
  var query = $('.search_result_cams_2');
  if (!query.size()) query = $('#search').parent();
  l.insertAfter(query);
  
  $(document).bind('DOMNodeInserted', function (e)
  {
    if ($('div#loadImgs').hasClass('imagesVisible') && e.target.tagName === 'DIV' && e.target.getAttribute('id') && (e.target.getAttribute('id') == 'loop' || e.target.getAttribute('id') == 'archive'))
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
