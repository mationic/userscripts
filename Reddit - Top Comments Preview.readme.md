### Reddit - Top Comments Preview ###

Updated script based on the comments preview script from userscripts.org.

Features:

 - working with https and RES never ending reddit
 - colorschemes for normal and RES nightly mode in (thanks to gavin19)
 - Option for auto-expanding images
 - Option for for autoloading all comments
 - Skips comments from known automoderators
 - Automatically retries to add comments if request fails
 - Option for automatically hide side bar / toggle visibility
 - Shortcut 't' to show/hide comments in RES
 - comments added at bottom of entry
 - Shows loaded comments always below added entries.
   (Behaviour can be changed in settings.)


If you don't care about the new features and just want the old comment preview, you can disable the features in the options part of the script.
There is also an option to change the comment sorting for the preview.

**This script doesn't work with GreaseMonkey, use TamperMonkey instead!**

-------

**v2.08**

- Added option to skip comments from specific usernames
- Fixed RES bug (new comments didn't load sometimes)
- Fixed hide sidebar in comment section

-------

**v2.00**

- Added limit for comment requests repetition
- Adjusted nightmode for code and pre blocks, revised css code.
- Ignoring entries marked as RES duplicate
- Refactored and cleaned up code

Since I'm not planning to add more features, v2 updates will be most likely limited to bugfixes/perfomance.

----------

**v1.86**

When autoloading, comments will now be added the bottom of each entry.
Comments added by clicking will still be added to the top.

You can change the position of the comments in the options of the script.


--------

**v1.80**

I finally added a storing option for the settings.
There are two new menu buttons, one to hide/show the sidebar, one for autoloading the comments and images. The script is tested on Chrome and Firefox. Please contact me if you encounter any problems.
