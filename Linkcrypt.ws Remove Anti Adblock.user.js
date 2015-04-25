// ==UserScript==
// @name           Linkcrypt.ws Remove Anti Adblock 
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description	   Removes anti adblock overlay and unhides container buttons
//
// @include        http://linkcrypt.ws/dir/*
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant none 
//
// @version		   0.0.4
// ==/UserScript==


function apply()
{
 	$('#ad_cont').css('display','');
	$('#ad_cont').attr('id','');
	$('#container_check').hide();
	$('#kbf1').hide();
	$('#container').show();
}

$(function ()
{
    
	document.addEventListener("DOMNodeInserted", apply);
	apply();

});