

Original script from userscripts.org with following updates:
 - added https
 - adjusted color scheme for nightmode
 - added optional keyboard shortcut 't' for RES
 - option for auto expand all images in RES
 - retries to fetch comments if Reddit doesn't respond
 - option for auto loading all comments
 - option for hiding the sidebar
 - menu buttons for the settings
 - choose to add comments at bottom or top ot the entry


--
*v1.80*

I finally added a storing option for the settings.
There are two new menu buttons, one to hide/show the sidebar, one for autoloading the comments and images. The script is tested on Chrome and Firefox. Please contact me if you encounter any problems.

If you don't care about the new features and just want the normal comment preview, you can disable the new menu buttons in the options part of the script. There is also an option to change the comment sorting now.


--
*v1.86*

When autoloading, comments will now be added the bottom of each entry.
Comments added by clicking will still be added to the top.

You can change the position of the comments in the options of the script.


Please note that the comment autoloading produces over-hat and  can cause a lot of traffic. A new loaded page on Reddit produces lots of comment requests at once. That will cause some requests to fail. Currently every request will just be repeated until success. That may take a while sometimes.
If Reddit already has connection problems, you should disable autoloading. It will produce more and more repeating requests, causing even more stress for the server.