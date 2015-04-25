1.80
I finally added a storing option (for the settings).
There are two new menu buttons, one to hide/show the sidebar, one for autoloading the comments and images. The script should work on Chrome and Firefox, at least it did for me... Please contact me if you have problems / the script is not working.
They only things stored are the settings from added menu, currently three booleans.

If you don't care about the new features and just want the normal comment preview, you can disable the new menu buttons in the options part of the script. There is also an option to change the comment sorting now.

--

Original script from userscripts.org with following updates:
 - added https
 - adjusted color scheme for nightmode
 - added optional keyboard shortcut 't' for RES
 - option for auto expand all images in RES
 - retries to fetch comments if Reddit doesn't respond
 - option for auto loading all comments
 - option for hiding the sidebar
 - menu buttons for the settings

<s>The auto loading options are disabled by default. For activating you have to set the corresponding variables to true in the options part of the script.</s>

Comment autoloading can cause problems!
The autoloading option produces a lot of overhat and cause a lot of traffic in the background. A new loaded page on Reddit produces lots of requests in a short time. That will cause some requests to fail. Currently every request will be repeated until success. It may take a while sometimes.
When there are connection problems, like Reddits server are overloaded again, I strongly suggest to switch off the autoloading.
