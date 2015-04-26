

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


--
*v1.80*
I finally added a storing option for the settings.
There are two new menu buttons, one to hide/show the sidebar, one for autoloading the comments and images. The script is tested on Chrome and Firefox. Please contact me if you encounter any problems.

If you don't care about the new features and just want the normal comment preview, you can disable the new menu buttons in the options part of the script. There is also an option to change the comment sorting now.

Please notice that the comment autoloading produces a lot of over-hat and therefore can cause a lot of traffic in the background. A new loaded page on Reddit produces lots of comment-requests at once. That will cause some requests to fail. Currently every request will just be repeated until success. That may take a while sometimes.
You should disable the autoloading if Reddit already has connection problems. Otherwise it will produce a lot of repeating requests (like small DOS-attack), causing even more stress for the server.
