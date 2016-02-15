#!/bin/bash

##-------------------------------------------------------------------##
##///////////////////////////////////////////////////////////////////##
VERSION=1.0.0b
COPYRIGHT='
/*!
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/ SEE CREDITS FOR CONTRIBUTIONS AND CREDITS FOR THIS PROJECT
/ AUTHOR: John R B Woodworth <John.Woodworth@CenturyLink.com>
/ SUPPORT CONTACT: funwithplastic@ctl.io
                                 ___  
            _______             /  /\                        ___
           /  ___  \        ___/  /  \__                    /  /\_________
          /  /\  )  )__    /  /  /   /__\                  /  /  \        \
         /  /  \/  / \_\__/__/  /   /  /\\_  ____         /  /  _/__      /\
        /  /___/  /  /  ____   /   /  ___  \/    \       /  / _/  _/\    /  \
       /  _______/  /  /\  /  /   /  /\  \___/)  /\___  /  /_/  _/\\ \  /    \
      /  /\      \ /  /  \/  /   /  /  \__\__/  /  \  \/      _/\\ \\/ /      \
     /  /  \______/   (__/  /   /  /   /    /  /   / //  _   /\\ \\/  /       /
    /  /   /      (________/   /__/   /    /__/   / //  / \  \ \\/   /       /
   /__/   /       /\       \  /\  \  /     \  \  / //__/   \__\/    /       /
   \  \  /       / /\_______\/ /\__\/       \__\/ /  \ \  / \  \   /       /
  / \__\/       / /           /__________________/  / \_\/   \__\ /       /
 /             / \___________/ \=                \ /____________ /       /
 \____________/   \=         \  \==               \ \=           \      /
  \=          \    \==        \  \===              \ \==          \    /
   \==         \    \===       \  \====_____________\/\===         \  /
    \===        \  / \====______\/                     \====________\/
     \====_______\/
 */
'
##///////////////////////////////////////////////////////////////////##
##-------------------------------------------------------------------##

function dieError() {
    echo $0 Ver. $VERSION
    echo "Usage: $0"
    echo "Terminating with exit code ${2-255}:"
    echo "    ${1-An error has occured}"  # Message
    exit ${2-255}                         # Exit Code
}

function sweepArgsFor() { # Bruteforce Option Matcher
    matchTo=$1; shift;
    retVal=0
    while [ $# -gt 0 ]; do
        [ "$1" = "$matchTo" ] && retVal=1
        shift
    done
    return $retVal
}

# Check For Disabling Of Library Inclusion
sweepArgsFor 'nojq' $* # Disable jQuery Libraries ??
OPT_NOJQ=$?
sweepArgsFor 'nobi' $* # Disable BigInt Libraries ??
OPT_NOBI=$?
sweepArgsFor 'nora' $* # Disable rangy Libraries ??
OPT_NORA=$?
sweepArgsFor 'nocm' $* # Disable contextMenu Libraries ??
OPT_NOCM=$?
sweepArgsFor 'nosl' $* # Disable SparkLine Libraries ??
OPT_NOSL=$?
sweepArgsFor 'nody' $* # Disable Dynatree Libraries ??
OPT_NODY=$?
sweepArgsFor 'nodt' $* # Disable DataTables Libraries ??
OPT_NODT=$?
sweepArgsFor 'enqu' $* # Enable QUinit Libraries ??
OPT_ENQU=$?

export COPYRIGHT
[ -e "$(which dirname 2> /dev/null)" ] || dieError "Unable to locate 'dirname' utility" 10
[ -e "$(which xargs 2> /dev/null)"   ] || dieError "Unable to locate 'xargs' utility"   15
[ -e "$(which echo 2> /dev/null)"    ] || dieError "Unable to locate 'echo' utility"    20
[ -e "$(which java 2> /dev/null)"    ] || dieError "Unable to locate 'java' utility"    25
[ -e "$(which perl 2> /dev/null)"    ] || dieError "Unable to locate 'perl' utility"    30
[ -e "$(which grep 2> /dev/null)"    ] || dieError "Unable to locate 'grep' utility"    35
[ -e "$(which sed 2> /dev/null)"     ] || dieError "Unable to locate 'sed' utility"     40
[ -e "$(which cat 2> /dev/null)"     ] || dieError "Unable to locate 'cat' utility"     45
[ -e "$(which cp 2> /dev/null)"      ] || dieError "Unable to locate 'cp' utility"      50
cd "$(dirname $0)"
rm pdmk-min.js pdmk-min.css 2> /dev/null
echo "Minifying files:"

(
    [ $OPT_NOJQ -gt 0 ] || echo ../scripts/jquery.js
    [ $OPT_NOJQ -gt 0 ] || echo ../scripts/jquery-ui.custom.js
    [ $OPT_NODY -gt 0 ] || echo ../scripts/jquery.dynatree.js
    [ $OPT_NOCM -gt 0 ] || echo ../scripts/jquery.contextMenu.js
    [ $OPT_NOBI -gt 0 ] || echo ../scripts/BigInt.js
    [ $OPT_NORA -gt 0 ] || echo ../scripts/rangy.js
    echo ../scripts/PlasticGlue.js
    echo ../scripts/PlasticDatastore.js
    echo ../scripts/PlasticStack.js
    echo ../scripts/PlasticView.js
    echo ../scripts/PlasticWidget.js
    [ $OPT_NOSL -gt 0 ] || echo ../scripts/jquery.sparkline.js
    [ $OPT_NODT -gt 0 ] || echo ../scripts/jquery.dataTables.js
    [ $OPT_NODT -gt 0 ] || echo ../scripts/dataTables.scroller.js
    [ $OPT_NODT -gt 0 ] || echo ../scripts/ui.multiselect.js
    [ $OPT_ENQU -gt 0 ] && echo ../scripts/qunit.js
)   | xargs cat \
    | sed 's#/\*!#/\* #g' \
    | ( [ $OPT_ENQU -gt 0 ] && cat || grep -v -- '-##QUNIT##-' ) \
    | perl -ne 'print $_ unless ($_ =~ /(?<!_[.])_PlasticBug/)' \
    | perl -ne 'if ($.==1){print $ENV{COPYRIGHT}.$_;}else{print $_}' \
    | java -jar ../NOT-PLASTIC/yuicompressor-2.4.8.jar --type js -o pdmk-min.js

(
    [ $OPT_ENQU -gt 0 ] && echo ../style/qunit.css
    echo ../style/PlasticStyle.css
    [ $OPT_NOJQ -gt 0 ] || echo ../style/jquery-ui.css
    [ $OPT_NODY -gt 0 ] || echo ../skin/dynatree.css
    [ $OPT_NOCM -gt 0 ] || echo ../style/jquery.contextMenu.css
    [ $OPT_NODT -gt 0 ] || echo ../style/jquery.dataTables.css
    [ $OPT_NODT -gt 0 ] || echo ../style/ui.multiselect.css
)   | xargs cat \
    | sed 's#/\*!#/\*#g' \
    | perl -ne 'if ($.==1){print $ENV{COPYRIGHT}.$_;}else{print $_}' \
    | java -jar ../NOT-PLASTIC/yuicompressor-2.4.8.jar --type css -o pdmk-min.css

echo "Copying minified files:"
cp -v pdmk-min.js ../scripts/
cp -v pdmk-min.css ../style/


