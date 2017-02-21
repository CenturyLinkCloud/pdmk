//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/ SEE CREDITS FOR CONTRIBUTIONS AND CREDITS FOR THIS PROJECT 
/
/ Program: "PlasticDatastoreHelp.js" => Plastic Data Modeling Kit [pdmk]
/                                       Help Demo Datastore
/ Author: John R B Woodworth <John.Woodworth@CenturyLink.com>
/
/ Support Contact: plastic@centurylink.com
/
/ Created: 04 January, 2014
/ Last Updated: 10 February, 2017
/
/ VERSION: 1.0.0b
/
/ NOTES:
/
/ CHANGES:
/
//-------------------------------------------------------------------*/
///////////////////////////////////////////////////////////////////////
//-------------------------------------------------------------------//
/*                               ___ 
            _______             /  /\                        ___
           /  ___  \        ___/  /  \ _                    /  /\_________
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
//-------------------------------------------------------------------//
/*-------------------------------------------------------------------*/

// Register The "Help" Datastore
Plastic.RegisterDatastore({
    help: {
        type: 'array'
       ,autoExpand: true
       ,delimiter: ':'
       ,rootTitle: 'Help Topics [pdmk]'
       ,rootRowObject: {
                title: 'Help Topics [pdmk]', tooltip: 'Help Topics', type: 'root', key: 'help'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;text-align:left;">' + //->
                        'Help Topics - The [pdmk] Basics - ' + //->
                        '<a style="float:right;padding:10px;color:#197771;font-size:20px;font-weight:bold;border-radius:5px;' + //->
                        '    box-shadow:2px 2px 8px 4px #6699aa;cursor:pointer;text-decoration:none;margin:-12px 0px;' + //->
                        '    background-color:#4fcfaf;border:solid #197771 2px;" title="1.0.0b &quot;Epoxy&quot;"' + //->
                        '    href="releases/pdmk-1.0.0b.zip">Download [pdmk]</a>' + //->
                        '</div>' + //->
                        '<p>We proudly introduce to you the [pdmk] toolkit. This main page provides answers to basic questions ' + //->
                        'about [pdmk]. Once you\'ve determined [pdmk] may be the right toolkit for your needs please feel ' + //->
                        'free to browse other [pdmk] related help topics by selecting from the options on the left.</p>' + //->
                        '<p>We highly recommend checking out our video tutorial in the <span activate="start">Getting Started</span> ' + //->
                        'section which will walk you through building a simple [pdmk] application.</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'What is [pdmk] ?</div>' + //->
                        '<p>The [pdmk] toolkit provides an easy way to build rich graphical applications backed ' + //->
                        'by variety of data sources in a matter of days, not months. It is written in 100% native ' + //->
                        'JavaScript and requires zero html coding or css knowledge to use.</p>' + //->
                        '<p>All the other <span activate="credits">Amazing Libraries</span> [pdmk] needs to function ' + //->
                        'are fully integrated making it even easier to <span activate="start">dive right in</span>.</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'Who is [pdmk] for ?</div>' + //->
                        '<p>The [pdmk] toolkit is designed for developers with all levels of experience. ' + //->
                        'By introducing a number of new concepts even people with zero previous programming ' + //->
                        'experience can have a working data driven graphical application in a matter of a few days.</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'What types of applications can [pdmk] build ?</div>' + //->
                        '<p>Any application where its primary function is working with data. At first glance this might seem ' + //->
                        'to be a fairly short list but given some thought on the matter one can see this solution ' + //->
                        'actually fits a <u>lot</u> of needs.</p>' + //->
                        '<p>Some examples might be:<ul style="list-style-type:none;">' + //->
                        '<li style="font-weight:bold;margin:0px 0px 5px -20px;">Travel Reservation</li>' + //->
                        'Airline and hotel reservation systems typically interact with a lot of data. From availability and amenities ' + //->
                        'to local restaurants and entertainment [pdmk] can track and allow users to quickly and easily interact with ' + //->
                        'all these data sources.' + //->
                        '<li style="font-weight:bold;margin:10px 0px 3px -20px;">Customer Relationship Management (CRM)</li>' + //->
                        'CRM software can be a salesperson\'s best tool. Building a CRM application can empower a small sales force ' + //->
                        'to move quickly and stay focused on what is important for the business to be successful.' + //->
                        '<li style="font-weight:bold;margin:10px 0px 3px -20px;">Selling Goods or Services</li>' + //->
                        'This is probably an obvious example. Presenting and allowing users to select and purchase goods and ' + //->
                        'services can be done simply and effectively. Additionally, tracking products and local inventory ' + //->
                        'can be integrated into the "user experience" for a more positive result.' + //->
                        '<li style="font-weight:bold;margin:10px 0px 3px -20px;">Journal or Blog Entries</li>' + //->
                        'Yes [pdmk] can function as a content management system (CMS) tracking and presenting content in a ' + //->
                        'consistent and uniform flow.' + //->
                        '<li style="font-weight:bold;margin:10px 0px 3px -20px;;">Etc.</li>' + //->
                        'As you can see, once the problem of building the application is shifted to one of data management ' + //->
                        'a lot of opportunities open up.' + //->
                        '</ul></p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'Why use [pdmk] instead of &lt;any other&gt; framework ?</div>' + //->
                        '<p>The [pdmk] toolkit is <u>not</u> a <a href="https://en.wikipedia.org/wiki/Web_framework">' + //->
                        'Web Application Framework</a> (WAF). While it shares many similarities ' + //->
                        '(after all it is a framework for building web applications) it was designed ' + //->
                        'from an entirely different perspective.</p>' + //->
                        '<p>First, It strives to be a completely CODEFREE&trade; development tool. It accomplishes this ' + //->
                        'through its <span activate="playbook">Playbook</span> which is a JSON based configuration ' + //->
                        'file describing everything the application should do and how its data should be managed.</p>' + //->
                        '<p>Second, it greatly simplifies common problems such as event handling. Events can be a ' + //->
                        'very difficult concept for newcomers to grasp. The [pdmk] provides "action" assignments ' + //->
                        'and takes care of all the little details (e.g. data validation) in an easy to visualize and ' + //->
                        'generalized way.</p>' + //->
                        '<p>Finally, our team is working to build a number of <span activate="datastore">Datastores</span> ' + //->
                        'which can be used out-of-the-box and configured to use a variety of backing data sources.</p>' + //->
                        '<p>Click <span activate="introduction">next</span> to find out more about [pdmk].</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'Can you add &lt;any cool new&gt; feature ?</div>' + //->
                        '<p>Please check out our <span activate="roadmap">Project Roadmap</span> to see if your feature ' + //->
                        'is already in the works. We are very engaged with our user community and the more popular a new feature ' + //->
                        'is the more attention we can dedicate to it.</p>' + //->
                        '<p>Want to flex your coding kung fu? <a href="https://github.com/CenturyLinkCloud/pdmk">Check out the ' + //->
                        '[pdmk] code repo</a> and submit your solution.</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'What is [pdmk]\'s Current Version ?</div>' + //->
                        '<p>Currently [pdmk] is in public-beta (codename: Epoxy).  Once all features have been tested as ' + //->
                        'working and complete its version will move to version 1.0.0 (codename: "Polylactic Acid").</p>' + //->
                        '<div class="plastic-form-title" style="text-align:left;">' + //->
                        'What\'s up with the name ?</div>' + //->
                        '<p>"Plastic Data Modeling Kit" [pdmk] comes from how flexible all of the components are and the ' + //->
                        'way applications are built. Plastic Data can be easily molded or adapted to any shape ' + //->
                        'and this toolkit allows one to assemble applications similar to a plastic car or ' + //->
                        'airplane model kit.</p>' + //->
                        '<div style="position:relative;">' + //->
                        '<img src="images/plastic-information.png" ' + //->
                             'style="position:absolute;width:30px;height:30px;top:-5px;right:-5px;">' + //->
                        '<pre style="border:solid #eeeeff;padding:0px 15px;overflow:auto;margin-left:80px;font-size:11px;">\n' + //->
                        'Plastic:\n' + //->
                        '  - formative, creative\n' + //->
                        '  - capable of being molded or modeled plastic clay\n' + //->
                        '  - capable of adapting to varying conditions : pliable\n' + //->
                        '  - sculptural\n' + //->
                        '  - capable of being deformed continuously and permanently in any direction\n' + //->
                        '    without rupture\n\n' + //->
                        'Plastic Data:\n' + //->
                        '  - data which can easily be formed, molded, pliably adapted and manipulated\n' + //->
                        '    to varying conditions\n' + //->
                        '</pre>\n' + //-> 
                        '</div>\n' + //-> 
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
        }
       ,rowDefault: { sharing: 'private', isvisibleparent: false, active: true }
       ,data: [
            {
                title: 'Introduction to Plastic', tooltip: 'Introduction', type: 'introduction', key: 'introduction'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Introduction to Plastic Data Modeling Kit [pdmk]</div>' + //->
                        '<div style="text-align:right;"><span activate="help">&lt;&lt; Back to Help Topics</span></div>' + //->
                        'The [pdmk] toolkit provides the ability to easily model (fashion or shape) ' + //->
                        'data as if it were made of plastic.  It does this by providing common layout, ' + //->
                        'presentation, data management and event component categories which work ' + //->
                        'together as easy to use generic snap-to-fit building blocks.<br><br>' + //->
                        'These blocks fit into the following 5 categories:<br>' + //->
                        '<ul><li><span activate="datastore">Datastore</span> Objects</li>' + //->
                        '<ul><li style="list-style-type:none;">Common interface for various data sources</li></ul>' + //->
                        '<li><span activate="stack">Stack</span> Objects</li>' + //->
                        '<ul><li style="list-style-type:none;">Geometry and flow management</li></ul>' + //->
                        '<li><span activate="view">View</span> Objects</li>' + //->
                        '<ul><li style="list-style-type:none;">Datastore navigation</li></ul>' + //->
                        '<li><span activate="widget">Widget</span> Objects</li>' + //->
                        '<ul><li style="list-style-type:none;">Datastore interaction</li></ul>' + //->
                        '<li><span activate="action">Actions</span></li>' + //->
                        '<ul><li style="list-style-type:none;">Event generalization and handling</li></ul>' + //->
                        '</ul></div>' + //->
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
            }
           ,{
                title: 'Getting Started With [pdmk]', tooltip: 'Getting Started', type: 'start', key: 'start'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Getting Started With [pdmk]</div>' + //->
                        'The easiest way to get started with [pdmk] is to dive right in and take one of ' + //->
                        '<span activate="examples">JSFiddle Examples</span> for a spin. The ' + //->
                        '<span activate="examples-context">Context Menu Example</span> demonstrates ' + //->
                        'interaction with our demo <span activate="datastore">Datastores</span> and ' + //->
                        'the hierarchical structure and flow of the <span activate="playbook">Playbook</span>.<br><br>' + //->
                        'Our commitment to our user community and questions they raise will help us expand not only our ' + //->
                        'interactive JSFiddle example archive with real-world examples but also build a repository ' + //->
                        'of reusable ready-to-go Datastores for use in your project.<br><br>' + //->
                        'Once you get the hand of [pdmk] in the JSFiddle playground, simply download [pdmk] to your ' + //->
                        'project\'s site and add the following code to activate all that is plastic.<br><br>' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        '&lt;script src="https://ioneyez.github.io/pdmk/scripts/pdmk-min.js" type="text/javascript"&gt;&lt;/script&gt;\n' + //->
                        '&lt;link  href="https://ioneyez.github.io/pdmk/style/pdmk-min.css" rel="stylesheet" type="text/css"&gt;\n\n' + //->
                        '&lt;!-- Optional Demo Datastores --&gt;\n' + //->
                        '&lt;script src="https://ioneyez.github.io/pdmk/scripts/PlasticDatastoreHelp.js" type="text/javascript"&gt;&lt;/script&gt;\n' + //->
                        '</pre><br>' + //->
                        'To help get you on your way, take a quick look at our video tutorial:<br><br>' + //->
                        '<div class="pdmk-flowplayer" ' + //->
                        '    style="display:block;width:650px;height:366px;background-image:url(videos/intro_part1of4.png);">\n' + //->
                        '    <video data-embed="false">\n' + //->
                        '        <source type="video/mp4"  src="videos/pdmktut_1of4.m4v">\n' + //->
                        '    </video>\n' + //->
                        '</div><br><br>\n' + //->
                        '<div class="pdmk-flowplayer" ' + //->
                        '    style="display:block;width:650px;height:366px;background-image:url(videos/intro_part2of4.png);">\n' + //->
                        '    <video>\n' + //->
                        '        <source type="video/mp4"  src="videos/pdmktut_2of4.m4v">\n' + //->
                        '    </video>\n' + //->
                        '</div><br><br>\n' + //->
                        '<div class="pdmk-flowplayer" ' + //->
                        '    style="display:block;width:650px;height:366px;background-image:url(videos/intro_part3of4.png);">\n' + //->
                        '    <video>\n' + //->
                        '        <source type="video/mp4"  src="videos/pdmktut_3of4.m4v">\n' + //->
                        '    </video>\n' + //->
                        '</div><br><br>\n' + //->
                        '<div class="pdmk-flowplayer" ' + //->
                        '    style="display:block;width:650px;height:366px;background-image:url(videos/intro_part4of4.png);">\n' + //->
                        '    <video>\n' + //->
                        '        <source type="video/mp4"  src="videos/pdmktut_4of4.m4v">\n' + //->
                        '    </video>\n' + //->
                        '</div><br><br>\n' + //->
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
            }
           ,{
                title: 'Datastore Object', tooltip: 'Datastore Object', type: 'datastore', key: 'datastore'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'The Datastore Object [pdmk]</div>' + //->
                        '<div style="text-align:right;"><span activate="introduction">&lt;&lt; Back to Introduction</span></div>' + //->
                        'The pdmk Datastore is a Javascript Object providing common methods for ' + //->
                        'easily interacting with its underlying data (Create, Read, Update, Delete ' + //->
                        'and Commit) a set of <span activate="rowobject">rowObjects</span>.  Each rowObject provides details about a ' + //->
                        'single row of data and its relationships with other rowObjects in the same datastore. ' + //->
                        'The interface provided by the Datastore object is identical regardless of ' + //->
                        'Where or how the backing data exists or is accessed.<br><br>' + //->
                        'The Datastore object also provides caching services and error detection/ ' + //->
                        'management through a defined set of interfaces allowing the data access ' + //->
                        'problem to be solved in a general manner and connect to any View ' + //->
                        'conforming to the pdmk defined rules for Views.<br><br>' + //->
                        'In order to allow the Datastore to interact with the backing data source ' + //->
                        'a handful of "handler" functions will need to be created. These handlers ' + //->
                        'allow custom data sources to be easily normalized and made to be compatible ' + //->
                        'with very little effort.  As the pdmk community grows, many handlers will ' + //->
                        'be created and shared making this requirement even easier.<br><br>' + //->
                        'These handler functions are listed below:<br>' + //->
                        '<ul><li>createRowHandler(parentRowObject, rowObject, callback, optionObject)<br>' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'function myRowCreator (parentRowObject, rowObject, callFunction, options) {\n' + //->
                        '    var datastore = this;\n' + //->
                        '    if ((callFunction) && (typeof (callFunction) === \'function\')) {\n' + //->
                        '        var attributes = {};\n' + //->
                        '        attributes.myname = "";\n' + //->
                        '        attributes.active = true;\n' + //->
                        '        attributes.left = "field";\n' + //->
                        '        // Use rowObject[1] for first rowObject, //->\n' + //->
                        '        // rowObject[0] is used for tranactional "state" information only\n' + //->
                        '        rowObject[1].actions = myActionHandler;\n' + //->
                        '        rowObject[1].flags = myFlagHandler;\n' + //->
                        '        rowObject[1].attributes = jQuery.extend({}, rowObject[1].attributes, attributes);\n' + //->
                        '        callFunction.call(datastore, rowObject, fopts);\n' + //->
                        '    } else {\n' + //->
                        '        _PlasticBug(\'WARN: callFunction not properly defined for createRowHandler\', 2);\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        '</li>' + //->
                        '<li>readRowHandler([parentKey,] key, callback, optionObject)' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'function myRowReader ( parentkey, key, callFunction, options ) {\n' + //->
                        '    // NOTE: parentkey is optional, set parentkey = null unless provided\n' + //->
                        '    [parentkey, key, callFunction, options] = [null, parentkey, key, callFunction, options] //->\n' + //->
                        '        .slice( ((arguments.length > 2) && (typeof (arguments[2]) === \'function\')) );\n' + //->
                        '    var datastore = this;\n' + //->
                        '    if ((callFunction) && (typeof (callFunction) === \'function\')) {\n' + //->
                        '        if (parentkey === null) { // Get Root rowObject\n' + //->
                        '            var data = myReadDataBackend.call(datastore, key, datastore.nextSequence());\n' + //->
                        '            callFunction(data, optionObject);\n' + //->
                        '        } else { // Get Child rowObject\n' + //->
                        '            var data = myReadDataBackend.call(datastore, parentkey, key, datastore.nextSequence());\n' + //->
                        '            callFunction(data, optionObject);\n' + //->
                        '        }\n' + //->
                        '    } else {\n' + //->
                        '        _PlasticBug(\'WARN: callFunction not properly defined for readRowHandler\', 2);\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        '</li>' + //->
                        '<li>updateRowHandler(rowObject, dirtyObject, errorObject, updateObject, callback, options)</li>' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'function myRowUpdater (rowObject, dirtyObj, errorObj, updateObj, callFunction, options) {\n' + //->
                        '    var datastore = this;\n' + //->
                        '    if ((callFunction) && (typeof (callFunction) === \'function\')) {\n' + //->
                        '        /* TODO: ! *PERFORM CUSTOM PROCESSING HERE* !\n' + //->
                        '                 Custom syntax and error management is processed here\n' + //->
                        '                 NOTE: \'dirtyObject\' and \'errorObject\' Objects contain\n' + //->
                        '                       accumulated data which can be removed or reacted to\n' + //->
                        '                       in this method\n' + //->
                        '                 NOTE: update[1] contains non-committed changes to rowObject[1]\n' + //->
                        '                       for only a <i><u>single update cycle</u></i>\n' + //->
                        '                       All changes to the \'attributes\' Object are\n' + //->
                        '                       rolled into the main \'rowObject\' Object\n' + //->
                        '                       to make simple processing methods easier\n' + //->
                        '        */\n' + //->
                        '    } else {\n' + //->
                        '        _PlasticBug(\'WARN: callFunction not properly defined for updateRowHandler\', 2);\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        '</li>' + //->
                        '<li>deleteRowHandler(key, rowObjects, callback, options)</li>' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'function myRowDeleter (key, rowObjects, callFunction, options) {\n' + //->
                        '    var datastore = this;\n' + //->
                        '    if ((callFunction) && (typeof (callFunction) === \'function\')) {\n' + //->
                        '        /* TODO: ! *PERFORM CUSTOM PROCESSING HERE* !\n' + //->
                        '                 Custom syntax and error management is processed here\n' + //->
                        '                 NOTE: The \'rowObjects\' Object contains accumulated data\n' + //->
                        '                       which can be validated and flagged for deletion.\n' + //->
                        '        */\n' + //->
                        '    } else {\n' + //->
                        '        _PlasticBug(\'WARN: callFunction not properly defined for deleteRowHandler\', 2);\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        '<li>commitRowHandler(rowObjects, callback, options)</li>' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'function myRowCommiter (rowObjects, callFunction, options) {\n' + //->
                        '    var datastore = this;\n' + //->
                        '    if ((callFunction) && (typeof (callFunction) === \'function\')) {\n' + //->
                        '        /* TODO: ! *PERFORM CUSTOM PROCESSING HERE* !\n' + //->
                        '                 Custom syntax and error management is processed here\n' + //->
                        '                 NOTE: The \'rowObjects\' Object contains accumulated data\n' + //->
                        '                       which can be validated and committed to the backing\n' + //->
                        '                       storage. Clean data is returned to the callFunction\n' + //->
                        '                       and any \'dirty\' flags are cleared for presentation.\n' + //->
                        '        */\n' + //->
                        '    } else {\n' + //->
                        '        _PlasticBug(\'WARN: callFunction not properly defined for commitRowHandler\', 2);\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        '</ul></div>' + //->
                        'In order to use a Datastore it must be registered.  A simple example is ' + //->
                        'provided below:' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'Plastic.RegisterDatastore({\n' + //->
                        '    myDS: {\n' + //->
                        '        readRowHandler: myRowFetcher\n' + //->
                        '       ,commitRowHandler: myRowSaver\n' + //->
                        '    }\n' + //->
                        '});\n' + //->
                        '</pre>' + //->
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
            }
           ,[
                {
                    title: 'The rowObject Structure', tooltip: 'The rowObject Structure', type: 'rowobject', key: 'rowobject'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'The rowObject Structure [pdmk]</div>' + //->
                            '<div style="text-align:right;"><span activate="datastore">&lt;&lt; Back to Datastore</span></div>' + //->
                            'The pdmk <span activate="datastore">Datastore</span> provides a heirarchical array of rowObjects. These ' + //->
                            'rowObjects are JavaScript Objects containing references to these ' + //->
                            'heirarchical relationships as well as customizable "attributes".<br><br>' + //->
                            'These attributes allow a form of structured-unstructured data bridge ' + //->
                            'thus dramatically reducing the Level-Of-Effort (LOE) generally ' + //->
                            'associated with application development. ' + //->
                            '</div>' + //->
                            '<pre class="prettyprint linenums">\n' + //->
                            '{\n' + //->
                            '    "key" : "/tmp"\n' + //->
                            '   ,"parentKey" : "/"\n' + //->
                            '   ,"title" : "tmp"\n' + //->
                            '   ,"qualifiedTitle" : "/tmp"\n' + //->
                            '   ,"tooltip" : "Temporary Directory"\n' + //->
                            '   ,"firstChild" : "~plastic"\n' + //->
                            '   ,"prev" : "/sys"\n' + //->
                            '   ,"next" : "/usr"\n' + //->
                            '   ,"lastChild" : "TMP.987654.dat"\n' + //->
                            '   ,"dirty" : null\n' + //->
                            '   ,"error" : null\n' + //->
                            '   ,"deleted" : null\n' + //->
                            '   ,"disabled" : false\n' + //->
                            '   ,"selected" : null\n' + //->
                            '   ,"hidden" : null\n' + //->
                            '   ,"isolated" : null\n' + //->
                            '   ,"attributes" : {\n' + //->
                            '        "customAttribute1" : "One"\n' + //->
                            '       ,"customAttribute2" : "Two"\n' + //->
                            '       ,"customAttribute3" : "Three"\n' + //->
                            '       ,"customAttribute4" : "Four"\n' + //->
                            '    }\n' + //->
                            '}\n' + //->
                            '</pre>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
            ]
           ,{
                title: 'Component Classes', tooltip: 'Component Classes', type: 'component', key: 'component'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'The [pdmk] Component Classes</div>' + //->
                        '<div style="text-align:right;"><span activate="introduction">&lt;&lt; Back to Introduction</span></div>' + //->
                        'The Stack component class provides geometry and layout management components ' + //->
                            'or "where" and "when" view and widget components are displayed.  Example ' + //->
                            'stack components would be splitters (horizontal and vertical) and tabs. ' + //->
                            'The next few sections describe the components of this class:<br>' + //->
                            '<ul><li><span activate="stack">Stack Class</span></li>' + //->
                            '<li><span activate="view">View Class</span></li>' + //->
                            '<li><span activate="widget">Widget Class</span></li>' + //->
                            '<li><span activate="action">Actions & Feedback [Events]</span></li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
            }
           ,[
                {
                    title: 'Stack Class', tooltip: 'Stack Component Class', type: 'stack', key: 'stack'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'The Stack Component Class</div>' + //->
                            '<div style="text-align:right;"><span activate="component">&lt;&lt; Back to Component Classes</span></div>' + //->
                            'The Stack component class provides geometry and layout management components ' + //->
                            'or "where" and "when" view and widget components are displayed.  Example ' + //->
                            'stack components would be splitters (horizontal and vertical) and tabs. ' + //->
                            'The next few sections describe the components of this class:<br>' + //->
                            '<ul><li><span activate="stack-tab">Tab Stack</span></li>' + //->
                            '<li><span activate="stack-hsplit">HSplit Stack</span></li>' + //->
                            '<li><span activate="stack-vsplit">VSplit Stack</span></li>' + //->
                            '<li><span activate="stack-stack">Stack Stack</span></li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
               ,[
                    {
                        title: 'Tab Stack', tooltip: 'The Stack-Tab Component', type: 'stack-tab', key: 'stack-tab'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Tab Stack [stack-tab] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="stack">&lt;&lt; Back to Stack</span></div>' + //->
                                'The tab component provides a number of components stacked on top of one ' + //->
                                'another with clickable "tabs" for the user to easilly switch between them. ' + //->
                                'Think of the subordinate (child) components as a deck of cards with labeled ' + 
                                'indexing tabs affixed to the ends of the cards.  While only one card ' + //->
                                'is visible at a time, any of the cards may be moved to the top of the deck ' + //->
                                'by pulling on the indexing tab and moving it.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-stack-tab.png" ' + //->
                                'class="plastic-help-image" width="513" height="177"></div>' + //->
                                'Example "stack-tab" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'stack-tab\'\n' + //->
                                '   ,options: {\n' + //->
                                '        prettyNames: { RightTab: \'US States\' }\n' + //->
                                '    }\n' + //->
                                '   ,children: {\n' + //->
                                '        LeftTab: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'os\'\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '       ,RightTab: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'states\'\n' + //->
                                '               ,forceRootExpanded: true\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                  
                        }
                    }
                   ,{
                        title: 'HSplit Stack', tooltip: 'The Stack-HSplit Component', type: 'stack-hsplit', key: 'stack-hsplit'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Horizontal Split Stack [stack-hsplit] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="stack">&lt;&lt; Back to Stack</span></div>' + //->
                                'The tab component provides a number of components stacked on top of one ' + //->
                                'The hsplit component provides a number of components stacked beside one ' + //->
                                'another with optional draggable "splitters" for the user to easilly resize ' + //->
                                'between two adjacent children. ' + //->
                                'Think of the subordinate (child) components as a deck of cards where ' + //->
                                'cards are attached to each other on ajacent sides and their width is ' + //->
                                'infinately stretchable. In this stack component all children are visible ' + //->
                                'at all times.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-stack-hsplit.png" ' + //->
                                'class="plastic-help-image"></div>' + //->
                                'Example "stack-hsplit" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'stack-hsplit\'\n' + //->
                                '   ,children: {\n' + //->
                                '        LeftStack: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'os\'\n' + //->
                                '               ,defaultwidth: \'300px\'\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '       ,RightStack: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'states\'\n' + //->
                                '               ,forceRootExpanded: true\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                  
                        }
                    }
                   ,{
                        title: 'VSplit Stack', tooltip: 'The Stack-VSplit Component', type: 'stack-vsplit', key: 'stack-vsplit'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Vertical Split Stack [stack-vsplit] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="stack">&lt;&lt; Back to Stack</span></div>' + //->
                                'The vsplit component provides a number of components stacked beside on top ' + //->
                                'of one another with optional draggable "splitters" for the user to easilly' + //->
                                'resize between two adjacent children. ' + //->
                                'Think of the subordinate (child) components as a deck of cards where ' + //->
                                'cards are attached to each other above or below and their height is ' + //->
                                'infinately stretchable. In this stack component all children are visible ' + //->
                                'at all times.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-stack-vsplit.png" ' + //->
                                'class="plastic-help-image"></div>' + //->
                                'Example "stack-vsplit" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'stack-vsplit\'\n' + //->
                                '   ,children: {\n' + //->
                                '        TopStack: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'os\'\n' + //->
                                '               ,defaultheight: \'350px\'\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '       ,BottomStack: {\n' + //->
                                '            type: \'view-tree\'\n' + //->
                                '           ,options: {\n' + //->
                                '                datastore: \'states\'\n' + //->
                                '               ,forceRootExpanded: true\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                  
                        }
                    }
                   ,{
                        title: 'Stack Stack', tooltip: 'The Stack-Stack Component', type: 'stack-stack', key: 'stack-stack'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Stack Stack [stack-stack] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="stack">&lt;&lt; Back to Stack</span></div>' + //->
                                'The stack component provides a number of components stacked beside on top ' + //->
                                'of one another with optional draggable "splitters" for the user to easilly' + //->
                                'resize between two adjacent children. ' + //->
                                'Think of the subordinate (child) components as a deck of cards where ' + //->
                                'cards are attached to each other above or below and their height is ' + //->
                                'infinately stretchable. In this stack component all children are visible ' + //->
                                'at all times.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-stack-vsplit.png" ' + //->
                                'class="plastic-help-image"></div>' + //->
                                'Example "stack-stack" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'stack-stack\'\n' + //->
                                '   ,children: {\n' + //->
                                '        OsForm: {\n' + //->
                                '            type: \'widget-form\'\n' + //->
                                '           ,options: {\n' + //->
                                '                title: \'Properties\'\n' + //->
                                '               ,layout: [\n' + //->
                                '                    [\'title\']\n' + //->
                                '                   ,[\'user\',\'group\']\n' + //->
                                '                   ,[\'mode\']\n' + //->
                                '                   ,[\'created\',\'modified\']\n' + //->
                                '                ]\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '       ,StatesForm: {\n' + //->
                                '            type: \'widget-form\'\n' + //->
                                '           ,options: {\n' + //->
                                '                title: \'State Capital\'\n' + //->
                                '               ,layout: [\n' + //->
                                '                    [\'title\', \'capital\']\n' + //->
                                '                ]\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                        }
                    }
                ]
               ,{
                    title: 'View Class', tooltip: 'View Component Class', type: 'view', key: 'view'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'The View Component Class</div>' + //->
                            '<div style="text-align:right;"><span activate="component">&lt;&lt; Back to Component Classes</span></div>' + //->
                            'The View component class provides navigation and interaction components ' + //->
                            'or "what" and "how" stack and widget components are selected.  Example ' + //->
                            'view components would be tree and list.<br><br>' + //->
                            'The next few sections describe the components of this class:<br>' + //->
                            '<ul><li><span activate="view-tree">Tree View</span></li>' + //->
                            '<li><span activate="view-list">List View</span></li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
               ,[
                    {
                        title: 'Tree View', tooltip: 'The View-Tree Component', type: 'view-tree', key: 'view-tree'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Tree View [view-tree] Component</div>' + //->
                                'The tree component provides a hierarchically nested list of rowObjects ' + //->
                                'where only rowObject titles are displayed for each row.  Activating a ' + //->
                                'row renders (initializes) another \'target\' component within the plabook ' + 
                                'exchanging DataStore and rowObject details with this new focal target.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-view-tree.png" ' + //->
                                'class="plastic-help-image" width="689" height="254"></div>' + //->
                                'Example "view-tree" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'view-tree\'\n' + //->
                                '   ,options: {\n' + //->
                                '        datastore: \'os\'\n' + //->
                                '       ,defaultTarget: \'OsForm\'\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                  
                        }
                    }
                   ,{
                       title: 'List View', tooltip: 'The View-List Component', type: 'view-list', key: 'view-list'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The List View [view-list] Component</div>' + //->
                                'The list component provides a number of components stacked on top of one ' + //->
                                'another with clickable "tabs" for the user to easilly switch between them. ' + //->
                                'Think of the subordinate (child) components as a deck of cards with labeled ' + 
                                'indexing tabs affixed to the ends of the cards.  While only one card ' + //->
                                'is visible at a time, any of the cards may be moved to the top of the deck ' + //->
                                'by pulling on the indexing tab and moving it.<br><br>' + //->
                                '<div class="plastic-help-image-wrap"><img src="images/help-view-list.png" ' + //->
                                'class="plastic-help-image" width="699" height="319"></div>' + //->
                                'Example "view-list" definition (with options):' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'view-list\'\n' + //->
                                '   ,options: {\n' + //->
                                '        datastore: \'os\'\n' + //->
                                '       ,defaultTarget: \'OsForm\'\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                  
                        }
                    }
                ]
               ,{
                    title: 'Widget Class', tooltip: 'Widget Component Class', type: 'widget', key: 'widget'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'The Widget Component Class</div>' + //->
                            '<div style="text-align:right;"><span activate="component">&lt;&lt; Back to Component Classes</span></div>' + //->
                            'The Widget component class provides direct "row-level" interaction components ' + //->
                            'and allows specific details for the selected components to be edited.  Example ' + //->
                            'widget components would be form and context.<br><br>' + //->
                            'The next few sections describe the components of this class:<br>' + //->
                            '<ul><li><span activate="widget-form">Form Widget</span></li>' + //->
                            '<li><span activate="widget-context">Context Widget</span></li>' + //->
                            '<li><span activate="widget-buttonbar">Buttonbar Widget</span></li>' + //->
                            '<li><span activate="widget-dialog">Dialog Widget</span></li>' + //->
                            '<li><span activate="widget-iframe">Iframe Widget</span></li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
               ,[
                    {
                        title: 'Form Widget', tooltip: 'The Widget-Form Component', type: 'widget-form', key: 'widget-form'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Form Widget [widget-form] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to Widget</span></div>' + //->
                                'The form widget component creates an interactive html form based upon the ' + //->
                                '<span activate="rowobject">rowObject</span> which was passed to it.  Forms are rendered ' + //->
                                '(primarily) based on the layout configuration option (described below). ' + //->
                                'Allowed changes are propagated back to the datastore via the component which activated the ' + //->
                                'form, generally by means of an <span activate="action">Action</span>.<br><br>' + //->
                                'NOTE: An interactive <span activate="examples-form">Simple Form Example</span> is ' + //->
                                'also available for this component.<br><br>' + //->
                                'Example "widget-form" definition (with options): ' + //->
                                '</div>' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'widget-form\'\n' + //->
                                '   ,options: {\n' + //->
                                '        title: \'Sample Form Title\'\n' + //->
                                '       ,description: \'Sample Form Description\'\n' + //->
                                '       ,layout: [\n' + //->
                                '            [\'title\']\n' + //->
                                '           ,[\'user\', \'group\']\n' + //->
                                '           ,[\'mode\']\n' + //->
                                '           ,[\'created\', \'modified\']\n' + //->
                                '        ]\n' + //->
                                '       ,help: {\n' + //->
                                '            _inlinepre: \'This help content is shown above form rendering\'\n' + //->
                                '           ,_inline: \'This help content is shown below form rendering\'\n' + //->
                                '           ,$title: \'This help content is shown below the "title" field in the layout\'\n' + //->
                                '        }\n' + //->
                                '       ,jumpIf: {\n' + //->
                                '            // If all tests in the below array are true, a logic branch will occur and\n' + //->
                                '            // Jump to the component named \'SecondForm\', this form will not be rendered.\n' + //->
                                '            SecondForm: [ [ \'isequal\', \'type\', \'example\' ] ]\n' + //->
                                '            // All \'jumpIf\' statements are evaluated in the order provided. The one below\n' + //->
                                '            // will proceed only if the above evaluates to false and it evaluates to true.\n' + //->
                                '           ,MessageDlg: [ [ \'isgreater\', \'children\', 0 ] ]\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                            }
                    }
                   ,{
                        title: 'Context Widget', tooltip: 'The Widget-Context Component', type: 'widget-context', key: 'widget-context'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Context Widget [widget-context] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to Widget</span></div>' + //->
                                'The context widget component creates a floating menu based on its ' + //->
                                'configuration.  This menu is generally launched by right-clicking its parent component.  ' + //->
                                'Each menu item may be assigned an <span activate="action">Action</span> which will be evaluated ' + //->
                                'against the <span activate="rowobject">rowObject</span> of the parent component to determine ' + //->
                                'whether or not it should be enabled and assign an appropriate default icon.  For example, ' + //->
                                'to perform a \'commit\' action, the associated rowObject must be test true for \'dirty\' and ' + //->
                                '\'not-error\' tests to be enabled.<br><br>' + //->
                                'NOTE: An interactive <span activate="examples-context">Context Widget Example</span> is ' + //->
                                'also available for this component.<br><br>' + //->
                                'Example "widget-context" definition (with options): ' + //->
                                '</div>' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'widget-context\'\n' + //->
                                '   ,options: {\n' + //->
                                '        type: \'.*\'\n' + //->
                                '       ,menu: {\n' + //->
                                '            Previous: {\n' + //->
                                '                action: \'prev\'\n' + //->
                                '               ,path: \'-\'\n' + //->
                                '               ,against: \'-\'\n' + //->
                                '               ,hideIf: [ [ \'isequal\', \'type\', \'example\' ] ]\n' + //->
                                '            }\n' + //->
                                '           ,Next: {\n' + //->
                                '                action: \'next\'\n' + //->
                                '               ,path: \'-\'\n' + //->
                                '               ,against: \'-\'\n' + //->
                                '               ,disableIf: [ [ \'error\' ] ]\n' + //->
                                '            }\n' + //->
                                '           ,Activate: {\n' + //->
                                '                target: \'MainStackForm\'\n' + //->
                                '               ,separator: true\n' + //->
                                '               ,icon: \'create\'\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                            }
                    }
                   ,{
                        title: 'Buttonbar Widget', tooltip: 'The Widget-Buttonbar Component', type: 'widget-buttonbar', key: 'widget-buttonbar'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Buttonbar Widget [widget-buttonbar] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to Widget</span></div>' + //->
                                'The buttonbar widget component creates a row of buttons based on its ' + //->
                                'configuration.  Each button in the buttonbar may be assigned an <span activate="action">Action</span> ' + //->
                                'which will be evaluated against the <span activate="rowobject">rowObject</span> of the ' + //->
                                'active component to determine whether or not it should be enabled.  For example, ' + //->
                                'to perform a \'commit\' action, the associated rowObject must be test true for \'dirty\' and ' + //->
                                '\'not-error\' tests to be enabled.<br><br>' + //->
                                'Example "widget-buttonbar" definition (with options): ' + //->
                                '</div>' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'widget-buttonbar\'\n' + //->
                                '   ,options: {\n' + //->
                                '        fixedheight: \'34px\'\n' + //->
                                '       ,buttons: {\n' + //->
                                '            Previous: {\n' + //->
                                '                action: \'prev\'\n' + //->
                                '               ,path: \'-\'\n' + //->
                                '               ,against: \'-\'\n' + //->
                                '            }\n' + //->
                                '           ,Next: {\n' + //->
                                '                action: \'next\'\n' + //->
                                '               ,path: \'-\'\n' + //->
                                '               ,against: \'-\'\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                            }
                    }
                   ,{
                        title: 'Dialog Widget', tooltip: 'The Widget-Dialog Component', type: 'widget-dialog', key: 'widget-dialog'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Dialog Widget [widget-dialog] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to Widget</span></div>' + //->
                                'The dialog widget component creates a modal popup window within the [pdmk] application ' + //->
                                'based on content from its configuration.  Each button assigned to the dialog ' + //->
                                'may be assigned an <span activate="action">Action</span> ' + //->
                                'which will be evaluated against the <span activate="rowobject">rowObject</span> of the ' + //->
                                'active component to determine whether or not it should be enabled.  For example, ' + //->
                                'to perform a \'commit\' action, the associated rowObject must be test true for \'dirty\' and ' + //->
                                '\'not-error\' tests to be enabled.<br><br>' + //->
                                'Example "widget-dialog" definition (with options): ' + //->
                                '</div>' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'widget-dialog\'\n' + //->
                                '   ,options: {\n' + //->
                                '        title: \'My Example Dialog\'\n' + //->
                                '       ,message: \'You selected "%&lbrace;message&rbrace;"!\'\n' + //->
                                '       ,buttons: {\n' + //->
                                '            Close: {\n' + //->
                                '                action: \'cancel\'\n' + //->
                                '               ,close: true\n' + //->
                                '            }\n' + //->
                                '        }\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                            }
                    }
                   ,{   title: 'Iframe Widget', tooltip: 'The Widget-Iframe Component', type: 'widget-iframe', key: 'widget-iframe'
                       ,attributes: {
                            preinlinehelp: '<div style="font-style:normal;">' + //->
                                '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                                'The Iframe Widget [widget-iframe] Component</div>' + //->
                                '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to Widget</span></div>' + //->
                                'The iframe widget component creates a framed browser window within the [pdmk] application ' + //->
                                'window.  Title and location options can be provided within the widget-iframe definition.<br><br>' + //->
                                'Example "widget-iframe" definition (with options): ' + //->
                                '</div>' + //->
                                '<pre class="prettyprint linenums">\n' + //->
                                '{\n' + //->
                                '    type: \'widget-iframe\'\n' + //->
                                '   ,options: {\n' + //->
                                '        title: \'My Example IFrame - "%{title}"\'\n' + //->
                                '       ,location: \'https://example.net/funwithplastic/%{path}/\'\n' + //->
                                '    }\n' + //->
                                '}\n' + //->
                                '</pre>' + //->
                                'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                                '</div>'
                            }
                    }
                ]
            ]
           ,{
                title: 'Actions [Events]', tooltip: 'Plastic Actions [Event Handling]', type: 'action', key: 'action'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Plastic Actions [Event Handling]</div>' + //->
                        '<div style="text-align:right;"><span activate="widget">&lt;&lt; Back to the Widget Component Class</span></div>' + //->
                        'The [pdmk] toolkit provides a suite of generalized/ context-aware "actions" ' + //->
                        'or "events" which can be specified in the <span activate="playbook">Playbook</span>. ' + //->
                        'A simple example would be to create a new <span activate="rowobject">rowObject</span>. ' + //->
                        'The next few sections describe the actions and events in further detail:<br>' + //->
                        '<ul><li><span activate="actions">Plastic Actions</span></li>' + //->
                        '<li><span activate="tests">Plastic Tests</span></li>' + //->
                        '</ul>' + //->
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
            }
           ,[
                {
                    title: 'Plastic Actions', tooltip: 'Performing Generalized Actions [Events]', type: 'action', key: 'actions'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Performing Generalized Actions [Events]</div>' + //->
                            '<div style="text-align:right;"><span activate="action">&lt;&lt; Back to Actions [Events]</span></div>' + //->
                            'The [pdmk] toolkit provides a generalized set of defined "actions" or "events" ' + //->
                            'which can be performed on an active <span activate="rowobject">rowObject</span>. ' + //->
                            'These actions will be automatically validated against a set of ' + //->
                            '<span activate="tests">Tests</span> to see whether or not they may be performed.<br><br>' + //->
                            'Beyond the active rowObject, three optional parameters ' + //->
                            'may be passed to provide more details to the action.  The first parameter is its "path" ' + //->
                            'specifying the full or relative path to the rowObject\'s attribute to be used ' + //->
                            'in the action.  The second is "against" which determines the expanded value which will ' + //->
                            'be used against the rowObject\'s specified or inferred path for added specificity. ' + //->
                            'The third and final parameter is "target" which specifies an alternate target which ' + //->
                            'will be expanded for attributes and used as the target upon successfull completion ' + //->
                            'of all soociated tests.<br><br>' + //->
                            'This section outlines which actions are available to the [pdmk] toolkit:<br>' + //->
                            '<ul><li>create: Create a child rowObject under the active rowObject</li>' + //->
                            '<li>read: Read the active rowObject</li>' + //->
                            '<li>update: Update the active rowObject</li>' + //->
                            '<li>delete: Delete the active rowObject</li>' + //->
                            '<li>cut: Cut the active rowObject into the associated DataStore\'s Clipboard</li>' + //->
                            '<li>copy: Copy the active rowObject into the associated DataStore\'s Clipboard</li>' + //->
                            '<li>paste: Paste the associated DataStore\'s Clipboard rowObject into the active rowObject</li>' + //->
                            '<li>reverse: Activate the active Stack\'s previous sibling stack</li>' + //->
                            '<i>NOTE: Use of path="-" and against="-" will reverse to previous rowObject of associated ' + //->
                            'DataStore (flattened)</i></li>' + //->
                            '<li>prev: Alias of "reverse"</li>' + //->
                            '<li>forward: Activate the active Stack\'s next sibling stack</li>' + //->
                            '<i>NOTE: Use of path="-" and against="-" will advance to next rowObject of associated ' + //->
                            'DataStore (flattened)</i></li>' + //->
                            '<li>next: Alias of "forward"</li>' + //->
                            '<li>reload: Invalidate and reload descendant rowObjects of active rowObject</li>' + //->
                            '<li>clear: Reset all changes to active rowObject removing it if it is "isolated"</li>' + //->
                            '<li>cancel: Alias of "clear"</li>' + //->
                            '<li>commit: Commit changes in active rowObject to DataStore\'s backing store (if "dirty")</li>' + //->
                            '<li>commitall: Commit all changes to all "dirty" rowObjects in all DataStores to ' + //->
                            'respective backing stores</li>' + //->
                            '<li>security: Switch to another security context specified by "against"</li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
               ,{
                    title: 'Plastic Tests', tooltip: 'Testing Whether Actions Are Allowed', type: 'tests', key: 'tests'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Testing Whether Actions Are Allowed</div>' + //->
                            '<div style="text-align:right;"><span activate="action">&lt;&lt; Back to Actions [Events]</span></div>' + //->
                            'The [pdmk] toolkit provides a generalized manner of testing whether or not ' + //->
                            'an <span activate="actions">action</span> should be allowed by performing a series ' + //->
                            'of one or more tests. <i><u>Every test in the series must pass for an action to ' + //->
                            'be allowed.</u></i><br><br>' + //->
                            'If an action is predefined these tests will be defined automatically based on ' + //->
                            'a generalized set of rules.  This set of tests may be overridden or appended in the ' + //->
                            '<span activate="playbook">Playbook</span> to taylor specific tests for an action. ' + //->
                            'However, over time it is our experience this type of customization is ' + //->
                            'actually quite rare.<br><br>' + //->
                            'Beyond the active <span activate="rowobject">rowObject</span>, two optional parameters ' + //->
                            'may be passed to provide more details to the test.  The first parameter is its "path" ' + //->
                            'specifying the full or relative path to the rowObject\'s attribute to be used ' + //->
                            'for the test.  The second is "against" which determines the expanded value which will ' + //->
                            'be used for comparison against the rowObject\'s specified or inferred path.  More will ' + //->
                            'be provided in test definitions below which expect these values to be populated.<br><br>' + //->
                            'This section outlines which tests are available to the [pdmk] toolkit:<br>' + //->
                            '<ul><li>cancreate: A rowObject may be created under the specified parent</li>' + //->
                            '<li>canread: A rowObject may be read from the specified parent</li>' + //->
                            '<li>canupdate: The active rowObject may be updated</li>' + //->
                            '<li>candelete: The active rowObject may be deleted</li>' + //->
                            '<li>cancommit: The active rowObject may be committed</li>' + //->
                            '<li>isancestor: The active rowObject (or that identified by "path") is an ' + //->
                            'ancestor of the rowObject identified by "against"</li>' + //->
                            '<li>isdescendant: The active rowObject (or that identified by "path") is a ' + //->
                            'descendant of the rowObject identified by "against"</li>' + //->
                            '<li>isless: The value in "path" is less than the value of "against"</li>' + //->
                            '<li>isgreater: The value in "path" is more than the value of "against"</li>' + //->
                            '<li>islike: The value in "path" matches the RegExp value of "against"</li>' + //->
                            '<li>isequal: The value in "path" is to the value of "against"</li>' + //->
                            '<li>doesexist: The specified "path" contains a value other than an ' + //->
                            'undefined JavaScript Object</li>' + //->
                            '<li>hasselection: A rowObject attribute group "path" has an item selected</li>' + //->
                            '<li>selectionhas: </li>' + //->
                            '<li>type: The active rowObject is of the "against" type</li>' + //->
                            '<li>dirty: The active rowObject is dirty (has been modified)</li>' + //->
                            '<li>deleted: The active rowObject is scheduled for deletion</li>' + //->
                            '<li>error: The active rowObject has a validation error</li>' + //->
                            '<li>isolated: The active rowObject does not exist in the DataStore\'s backing store</li>' + //->
                            '<li>disabled: The active rowObject has been disabled</li>' + //->
                            '<li>canpaste: The active rowObject can accept the rowObject in the DataStore\'s clipboard</li>' + //->
                            '<li>canreload: The specified "path" can be reloaded</li>' + //->
                            '<li>canforward: There are available siblings in the active Stack and it may be advanced<br>' + //->
                            '<i>NOTE: Use of path="-" and against="-" will return if associated DataStore can be advanced ' + //->
                            'to the next rowObject (flattened)</i></li>' + //->
                            '<li>canreverse: There are available siblings in the active Stack and so it may be reversed<br>' + //->
                            '<i>NOTE: Use of path="-" and against="-" will return if associated DataStore can be reversed ' + //->
                            'to the previous rowObject (flattened)</i></li>' + //->
                            '</ul>' + //->
                            'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                            '</div>'
                    }
                }
            ]
           ,{
                title: 'The Plastic Playbook', tooltip: 'The Plastic Playbook', type: 'playbook', key: 'playbook'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'The Plastic Playbook</div>' + //->
                        '<div style="text-align:right;"><span activate="action">&lt;&lt; Back to Actions [Events]</span></div>' + //->
                        'By far, the easiest way to understand the [pdmk] Playbook is to visualize every phase of ' + //->
                        'an application (any application). An example may be an airline reservation application. ' + //->
                        'This may begin with a date and destination selection then jump to flight selection. ' + //->
                        'These two points (date/ destination and flight selection) are known locations within ' + //->
                        'the application where interaction with the user is required and navigation can flow into ' + //->
                        'or away from. If you then visualize these points as scene in a movie or an act in a play ' + //->
                        'you notice the entire application; every scene, every act is known in advance and only the ' + //->
                        'jumps or transitions can change, this is how the playbook is designed.<br><br>' + //->
                        'Another aspect to applications is their physical layout or geometry. The playbook offers ' + //->
                        'control over the application layout by logically splitting the window\'s real estate into ' + //->
                        '<span activate="stack">Stacks</span>. Stacks can be organized side-by-side (horizontally), ' + //->
                        'above-and-below (vertically) or stacked (like playing cards). By defining the application\'s ' + //->
                        'transitions and layout in a JSON formatted configuration file (the Playbook) every aspect of ' + //->
                        'the application is known to the application upon initialization and only the data may change. ' + //->
                        'As detailed in the <span activate="datastore">Datastore</span> section, while data may change ' + //->
                        'the methods for accessing and interacting with it will not.<br><br>' + //->
                        'Below is an example Playbook for a simple file browser:\n' + //->
                        '<pre class="prettyprint linenums">\n' + //->
                        'MainApplication: {\n' + //->
                        '    type: <span activate="stack-vsplit">\'stack-vsplit\'</span>\n' + //->
                        '   ,children: {\n' + //->
                        '        TopPane: {\n' + //->
                        '            type: <span activate="view-tree">\'view-tree\'</span>\n' + //->
                        '           ,options: {\n' + //->
                        '                datastore: \'os\'\n' + //->
                        '               ,defaultheight: \'200px\'\n' + //->
                        '               ,defaultTarget: \'PropForm\'\n' + //->
                        '            }\n' + //->
                        '        }\n' + //->
                        '       ,Bottom: {\n' + //->
                        '            type: \'stack-vsplit\'\n' + //->
                        '           ,children: {\n' + //->
                        '                Buttons: {\n' + //->
                        '                    type: <span activate="widget-buttonbar">\'widget-buttonbar\'</span>\n' + //->
                        '                   ,options: {\n' + //->
                        '                        fixedheight: \'36px\'\n' + //->
                        '                       ,buttons: {\n' + //->
                        '                            Save: {\n' + //->
                        '                                action: \'commit\'\n' + //->
                        '                            }\n' + //->
                        '                           ,Cancel: {\n' + //->
                        '                                action: \'cancel\'\n' + //->
                        '                            }\n' + //->
                        '                        }\n' + //->
                        '                    }\n' + //->
                        '                }\n' + //->
                        '               ,PropForm: {\n' + //->
                        '                    type: <span activate="widget-form">\'widget-form\'</span>\n' + //->
                        '                   ,options: {\n' + //->
                        '                        title: \'Properties\'\n' + //->
                        '                       ,layout: [\n' + //->
                        '                            [\'title\']\n' + //->
                        '                           ,[\'user\',\'group\']\n' + //->
                        '                           ,[\'mode\']\n' + //->
                        '                           ,[\'created\',\'modified\']\n' + //->
                        '                        ]\n' + //->
                        '                    }\n' + //->
                        '                }\n' + //->
                        '            }\n' + //->
                        '        }\n' + //->
                        '    }\n' + //->
                        '}\n' + //->
                        '</pre>' + //->
                        'Select from the help sections on the left for more information and <span activate="examples">examples</span>.' + //->
                        '</div>'
                }
            }
           ,{
                title: 'Examples [JSFiddle]', tooltip: 'Plastic Samples on JSFiddle', type: 'instructions', key: 'examples'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Examples on JSFiddle</div>' + //->
                        '<div style="text-align:right;"><span activate="playbook">&lt;&lt; Back to Playbook</span></div>' + //->
                        'The following sections provide [pdmk] examples using the powerful JSFiddle testing ' + //->
                        'engine.<br><br>' + //->
                        '<img src="images/jsfiddlenav1.png" style="border:solid green 1px;"><br>Use the JSFiddle ' + //->
                        'navigation tabs to view switch the view between the Playbook\'s [JavsScript] and [Result].<br><br>' + //->
                        '<img src="images/jsfiddleedit1.png" style="border:solid green 1px;"><br>Use the [Edit in ' + //->
                        'JSFiddle] to actively interact with any of the examples and a new window with interactive ' + //->
                        'editor will be launched.<br><br>' + //->
                        'Feel free to modify the any of the example <span activate="playbook">Playbooks</span> to ' + //->
                        'better understand how all the plastic parts fit together.<br><br>' + //->
                        '<i>NOTE: None of the provided examples require "any" HTML or CSS to function.  This is one of ' + //->
                        'the many benefits of the [pdmk] toolkit.</i><br><br>' + //->
                        '<ul><li><span activate="examples-tab">Simple Tab Example</span></li>' + //->
                        '<li><span activate="examples-form">Simple Form Example</span></li>' + //->
                        '<li><span activate="examples-dialog">Simple Dialog Example</span></li>' + //->
                        '<li><span activate="examples-context">Context Menu Example</span></li>' + //->
                        '</ul>' + //->
                        '</div>'
                }
            }
           ,[
                {
                    title: 'Simple Tab Example', tooltip: 'Simple Tab Example', type: 'example', key: 'examples-tab'
                   ,attributes: {
                        fiddletitle: 'Simple Tab Example'
                       ,fiddlepath: 'L2s9tp1p'
                    }
                }
               ,{
                    title: 'Simple Form Example', tooltip: 'Vertical Panes with Form Widget', type: 'example', key: 'examples-form'
                   ,attributes: {
                        fiddletitle: 'Simple Form Example'
                       ,fiddlepath: 'pgL8ctbq'
                    }
                }
               ,{
                    title: 'Simple Dialog Example', tooltip: 'Dialog Widget with Form Editor', type: 'example', key: 'examples-dialog'
                   ,attributes: {
                        fiddletitle: 'Simple Dialog Example'
                       ,fiddlepath: 'g4v4dh85'
                    }
                }
               ,{
                    title: 'Context Menu Example', tooltip: 'Tree View with Context Menu', type: 'example', key: 'examples-context'
                   ,attributes: {
                        fiddletitle: 'Context Menu Example'
                       ,fiddlepath: '70yy03yg'
                    }
                }
            ]
           ,{
                title: 'Project Roadmap [Bakelite]', tooltip: 'Project Roadmap [Bakelite]', type: 'roadmap', key: 'roadmap'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Project Roadmap [Bakelite]</div>' + //->
                        '<div style="text-align:right;"><span activate="examples">&lt;&lt; Back to Examples</span></div>' + //->
                        'This following sections define scheduled changes and enhancements on the [pdmk] product roadmap. ' + //->
                        'Some of these features may be currently in an uncooked state and must continue baking before ' + //->
                        'officially offered, others have yet to go into the kiln.<br><br>' + //->
                        'Project Milestones:<br>' + //->
                        '<ul><li><span activate="version100">Version 1.0.0 [PLA]</span>:</li>"Polylactic Acid"' + //->
                        '<li><span activate="version120">Version 1.2.0 [PC]</span>:</li>"Polycarbonate"' + //->
                        '<li><span activate="version140">Version 1.4.0 [ABS]</span>:</li>"Acrylonitrile Butadiene Styrene"' + //->
                        '<li><span activate="version160">Version 1.6.0 [HDPE]</span>:</li>"High Density Polyethylene"' + //->
                        '<li><span activate="version180">Version 1.8.0 [PVC]</span>:</li>"Polyvinyl Chloride"' + //->
                        '<li><span activate="version200">Version 2.0.0 [PET]</span>:</li>"Polyethylene Terephthalate"' + //->
                        '</ul></div>'
                }
            }
           ,[
                {
                    title: 'Version 1.0.0 [PLA]', tooltip: 'Version 1.0.0 - "Polylactic Acid"', type: 'version100', key: 'version100'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 1.0.0 - "Polylactic Acid"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 1.0.0 will be released after completion of any major bugfixes.  All ' + //->
                            'components of the public-beta release [Epoxy] will then be considered complete, rolled ' + //->
                            'into the PLA release and new components and features will begin their cycle.<br><br>' + //->
                            '</div>'
                    }
                }
               ,{
                    title: 'Version 1.2.0 [PC]', tooltip: 'Version 1.2.0 - "Polycarbonate"', type: 'version120', key: 'version120'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 1.2.0 - "Polycarbonate"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 1.2.0 will include the following changes:<br><br>' + //->
                            'Updated components:<br>' + //->
                            '<ul><li>Code Refactoring and Optimizations:</li>There are a few examples of similar ' + //->
                            '        logic blocks which can be combined to lower the memory footprint.' + //->
                            '<li>Extend Cache Object:</li>The cache object needs tuning and LRU purging logic.' + //->
                            '<li>Update Datastore Types:</li>Implement enhanced Datastore types such as "hybrid" ' + //->
                            '        and "partitioned".' + //->
                            '<li>Revamped Shopping Cart:</li>The shopping cart component needs better theming ' + //->
                            '        and cache management support.' + //->
                            '<li>Advanced HTML Tooltips:</li>Allow markup in tooltips for [pdmk] components.' + //->
                            '</ul></div>'
                    }
                }
               ,{
                    title: 'Version 1.4.0 [ABS]', tooltip: 'Version 1.4.0 - "Acrylonitrile Butadiene Styrene"', type: 'version140', key: 'version140'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 1.4.0 - "Acrylonitrile Butadiene Styrene"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 1.4.0 will include the following changes:<br><br>' + //->
                            'New components:<br>' + //->
                            '<ul><li>Menu Widget:</li>This component provides a fixed menu loosely modeled ' + //->
                            '        after the <span activate="widget-context">Context Widget</span> component.' + //->
                            '<li>Search Widget:</li>This component provides an interactive searchbar with advanced ' + //->
                            '        syntax awareness.' + //->
                            '<li>Resultset Widget:</li>This component provides an interactive list of results from ' + //->
                            '        the Search Widget Component.' + //->
                            '<li>Filterlist Widget:</li>This component provides a way to easilly select multiple items ' + //->
                            '        from an array or datastore.' + //->
                            '<li>Breadcrumb Widget:</li>This component provides a context aware method to jump between ' + //->
                            '        several navigation points.' + //->
                            '</ul></div>'
                    }
                }
               ,{
                    title: 'Version 1.6.0 [HDPE]', tooltip: 'Version 1.6.0 - "High Density Polyethylene"', type: 'version160', key: 'version160'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 1.6.0 - "High Density Polyethylene"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 1.6.0 will include the following changes:<br><br>' + //->
                            'Updated components:<br>' + //->
                            '<ul><li>jQuery/ jQueryUI/ QUnit:</li>These libraries need to be updated to latest stable ' + //->
                            '        versions.' + //->
                            '<li>DataTables:</li>This library needs updated to latest stable version.' + //->
                            '        syntax awareness.' + //->
                            '<li>Sparkline:</li>This library needs updated to latest stable version. ' + //->
                            '</ul></div>'
                    }
                }
               ,{
                    title: 'Version 1.8.0 [PVC]', tooltip: 'Version 1.8.0 - "Polyvinyl Chloride"', type: 'version180', key: 'version180'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 1.8.0 - "Polyvinyl Chloride"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 1.8.0 will include the following changes:<br><br>' + //->
                            'New components:<br>' + //->
                            '<ul><li>Drag-N-Drop Support:</li>All included components will offer dnd support where appropriate. ' + //->
                            '        This will extend the list of supported <span activate="actions">Actions</span>.' + //->
                            '<li>Better Theming:</li>Make component theming easier for users.' + //->
                            '</ul></div>'
                    }
                }
               ,{
                    title: 'Version 2.0.0 [PET]', tooltip: 'Version 2.0.0 - "Polyethylene Terephthalate"', type: 'version200', key: 'version200'
                   ,attributes: {
                        preinlinehelp: '<div style="font-style:normal;">' + //->
                            '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                            'Version 2.0.0 - "Polyethylene Terephthalate"</div>' + //->
                            '<div style="text-align:right;"><span activate="roadmap">&lt;&lt; Back to Bakelite</span></div>' + //->
                            'Version 2.0.0 will include the following changes:<br><br>' + //->
                            'New components:<br>' + //->
                            '<ul><li>Smartphone/ Tablet Branch:</li>The [pdmk] will provide touch/ swipe awareness and ' + //->
                            '        better navigation for smaller devices.' + //->
                            '</ul></div>'
                    }
                }
            ]
           ,{
                title: 'LICENSE', tooltip: 'License [MIT]', type: 'license', key: 'license'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'LICENSE TERMS [MIT]</div>' + //->
                        '<pre class="plastic-legal" style="font-size:10px;">\n' + //->
                        'Copyright (c) 2014-2015 CenturyLink, Inc.\n\n' + //->
                        'Permission is hereby granted, free of charge, to any person obtaining a copy\n' + //->
                        'of this software and associated documentation files (the "Software"), to deal\n' + //->
                        'in the Software without restriction, including without limitation the rights\n' + //->
                        'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' + //->
                        'copies of the Software, and to permit persons to whom the Software is\n' + //->
                        'furnished to do so, subject to the following conditions:\n\n' + //->
                        'The above copyright notice and this permission notice shall be included in\n' + //->
                        'all copies or substantial portions of the Software.\n\n' + //->
                        'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' + //->
                        'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' + //->
                        'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE\n' + //->
                        'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' + //->
                        'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' + //->
                        'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n' + //->
                        'THE SOFTWARE.\n' + //->
                        '</pre>\n' + //->
                        '</div>\n'
                }
            }
           ,{
                title: 'CREDITS', tooltip: 'Credits and Contributions', type: 'credits', key: 'credits'
               ,attributes: {
                    preinlinehelp: '<div style="font-style:normal;">' + //->
                        '<div class="plastic-form-title" style="margin-top:0px;">' + //->
                        'Credits and Contributions</div>' + //->
                        '<pre class="plastic-legal" style="font-size:10px;">\n' + //->
                        'Copyright (c) 2014-2015 CenturyLink, Inc.\n\n\n' + //->
                        'The Plastic Data Modeling Kit [pdmk] is a 100% JavaScript data modeling toolkit\n' + //->
                        'which leverages many robust JavaScript frameworks and libraries to function.\n' + //->
                        'This file contains a list of these libraries and official project contributors.\n' + //->
                        'Without the support of these libraries and individuals this project [pdmk]\n' + //->
                        'would not be possible.\n\n\n\n' + //->
                        'Support Frameworks and Libraries -\n\n' + //->
                        '  Plastic -\n\n' + //->
                        '    jQuery - http://jquery.com/ [MIT License]\n' + //->
                        '    jQuery UI - http://jqueryui.com/ [MIT License]\n' + //->
                        '    jQuery Context Menu - http://medialize.github.com/jQuery-contextMenu/ [MIT License]\n' + //->
                        '    jQuery DynaTree - http://dynatree.googlecode.com/ [MIT License]\n' + //->
                        '    jQuery DataTables - http://www.datatables.net/ [BSD License]\n' + //->
                        '    jQuery Sparkline - http://omnipotent.net/jquery.sparkline/ [New BSD License] \n' + //->
                        '    QUnit - http://qunitjs.com/ [MIT License]\n' + //->
                        '    BigInt - http://leemon.com/crypto/BigInt.html [Public Domain]\n' + //->
                        '    jsSHA - https://github.com/Caligatio/jsSHA/ [Copyright Attribution]\n\n' + //->
                        '  Not-Plastic -\n\n' + //->
                        '    google-code-prettify - https://code.google.com/p/google-code-prettify/ [Apache License 2.0]\n\n\n' + //->
                        'Core Software Architecture and Plastic Contributors [pdmk]\n\n' + //->
                        '                                 ___  \n' + //->
                        '            _______             /  /\\                        ___\n' + //->
                        '           /  ___  \\        ___/  /  \\__                    /  /\\_________\n' + //->
                        '          /  /\\  )  )__    /  /  /   /__\\                  /  /  \\        \\\n' + //->
                        '         /  /  \\/  / \\_\\__/__/  /   /  /\\\\_  ____         /  /  _/__      /\\\n' + //->
                        '        /  /___/  /  /  ____   /   /  ___  \\/    \\       /  / _/  _/\\    /  \\\n' + //->
                        '       /  _______/  /  /\\  /  /   /  /\\  \\___/)  /\\___  /  /_/  _/\\\\ \\  /    \\\n' + //->
                        '      /  /\\      \\ /  /  \\/  /   /  /  \\__\\__/  /  \\  \\/      _/\\\\ \\\\/ /      \\\n' + //->
                        '     /  /  \\______/   (__/  /   /  /   /    /  /   / //  _   /\\\\ \\\\/  /       /\n' + //->
                        '    /  /   /      (________/   /__/   /    /__/   / //  / \\  \\ \\\\/   /       /\n' + //->
                        '   /__/   /       /\\       \\  /\\  \\  /     \\  \\  / //__/   \\__\\/    /       /\n' + //->
                        '   \\  \\  /       / /\\_______\\/ /\\__\\/       \\__\\/ /  \\ \\  / \\  \\   /       /\n' + //->
                        '  / \\__\\/       / /           /__________________/  / \\_\\/   \\__\\ /       /\n' + //->
                        ' /             / \\___________/ \\=                \\ /____________ /       /\n' + //->
                        ' \\____________/   \\=         \\  \\==               \\ \\=           \\      /\n' + //->
                        '  \\=          \\    \\==        \\  \\===              \\ \\==          \\    /\n' + //->
                        '   \\==         \\    \\===       \\  \\====_____________\\/\\===         \\  /\n' + //->
                        '    \\===        \\  / \\====______\\/                     \\====________\\/\n' + //->
                        '     \\====_______\\/\n\n' + //->
                        '  Concept -\n\n' + //->
                        '    Chief Software Architect - John Woodworth &lt;john.woodworth@centurylink.com&gt;\n\n' + //->
                        '  Design -\n\n' + //->
                        '    Chief Software Architect - John Woodworth &lt;john.woodworth@centurylink.com&gt;\n' + //->
                        '    Software Integration Consultant - Dean Ballew &lt;dean.ballew@centurylink.com&gt;\n' + //->
                        '    Graphical Interface Consultant - Shashwath Bindinganaveli Raghavan\n\n' + //->
                        '  Development -\n\n' + //->
                        '    Chief Software Architect - John Woodworth &lt;john.woodworth@centurylink.com&gt;\n' + //->
                        '    Lead Playbook Consultant - Dean Ballew &lt;dean.ballew@centurylink.com&gt;\n\n' + //->
                        '  Testing -\n\n' + //->
                        '    Test Architect/ Consultant - Shashwath Bindinganaveli Raghavan\n\n' + //->
                        '  End User Enablement -\n\n' + //->
                        '    Chief Systems Integrator - John Woodworth &lt;john.woodworth@centurylink.com&gt;\n' + //->
                        '    Chief End User Integrator - Dean Ballew &lt;dean.ballew@centurylink.com&gt;\n\n' + //->
                        '  Official [pdmk] Code Maintainers -\n\n' + //->
                        '    Chief Software Architect - John Woodworth &lt;john.woodworth@centurylink.com&gt;\n' + //->
                        '    Chief End User Integrator - Dean Ballew &lt;dean.ballew@centurylink.com&gt;\n\n' + //->
                        '</pre>\n' + //->
                        '</div>\n'
                }
            }
        ]
    } 
   ,os: {
        rowDefault: function() {
            return { user: 'none', group: 'none', mode: '0600', created: (new Date()), modified: (new Date()) };
        }
       ,readRowHandler: function(parentkey, key, retFunction, fopts){
            var datastore = this;
            if ((Storage) && ('localStorage' in window)) {
                var promiseSeq = this.nextSequence();
                var retVal = 0;
                var rowObject = {};
                var attributes = datastore.option('rowDefault');
                if (parentkey === null) { // Get Tree Root
                    if ((retFunction) && (typeof (retFunction) === 'function')) {
                        if ('pdmkds:' + datastore.name + ':root' in localStorage) {
                            var thisKey = localStorage['pdmkds:' + datastore.name + ':root'];
                            rowObject = JSON.parse(localStorage['pdmkds:' + datastore.name + '_' + thisKey]);
                            rowObject.attributes.created = new Date(rowObject.attributes.created);
                            rowObject.attributes.modified = new Date(rowObject.attributes.modified);
                            if ('pdmkds:' + datastore.name + ':children_' + thisKey in localStorage) {
                                var children = JSON.parse(localStorage['pdmkds:' + datastore.name + ':children_' + thisKey]);
                                if (children.length) {
                                    rowObject.firstChild = children[0];
                                    rowObject.lastChild = children[children.length -1];
                                }
                            }
                        } else { // Prime The Datastore
                            var parentKey, children = [];
                            attributes = datastore.option('rowDefault');
                            rowObject = datastore.getGenericRowObject(null, uuid(), $.extend({}, attributes, {
                                type: 'root', isolated: null, title: datastore.option('rootTitle')
                               ,qualifiedTitle: datastore.option('rootTitle'), tooltip: datastore.option('rootTitle')
                               ,children: []
                            }), { merge: true });
                            localStorage['pdmkds:' + datastore.name + ':root'] = rowObject.key;
                            localStorage['pdmkds:' + datastore.name + '_' + rowObject.key] = JSON.stringify(rowObject);
                            parentKey = rowObject.key;
                            // Create direct children of Root '/'
                            $.each(['bin', 'dev', 'home', 'tmp', 'var'], function(index, name){
                                var cRowObject = datastore.getGenericRowObject(parentKey, uuid(), $.extend({}, attributes, {
                                    type: 'folder', isolated: null, title: name
                                   ,qualifiedTitle: '/' + name, tooltip: '/' + name
                                   ,children: null
                                }), { merge: true });
                                localStorage['pdmkds:' + datastore.name + '_' + cRowObject.key] = JSON.stringify(cRowObject);
                                children[children.length] = cRowObject.key;
                            });
                            localStorage['pdmkds:' + datastore.name + ':children_' + parentKey] = JSON.stringify(children);
                        }
                        retFunction([{ "status" : "creating", "id" : datastore.nextSequence() }, rowObject], fopts);
                    } else {
                        //_PlasticBug('WARN: retFunction not properly defined for readRowHandler', 2);
                    }
                } else {
                    if ((retFunction) && (typeof (retFunction) === 'function')) {
                        if ('pdmkds:' + datastore.name + ':children_' + parentkey in localStorage) {
                            var pchildren = JSON.parse(localStorage['pdmkds:' + datastore.name + ':children_' + parentkey]);
                            if (pchildren.length) {
                                if (key === null) { key = pchildren[0]; }; // Locate first child of parentkey
                                if ('pdmkds:' + datastore.name + '_' + key in localStorage) {
                                    rowObject = JSON.parse(localStorage['pdmkds:' + datastore.name + '_' + key]);
                                    rowObject.attributes.created = new Date(rowObject.attributes.created);
                                    rowObject.attributes.modified = new Date(rowObject.attributes.modified);
                                    if (pchildren.length > 1) {
                                        var prev = null;
                                        while ((pchildren.length) && (pchildren[0] !== key)) { prev = pchildren.shift(); };
                                        rowObject.prev = prev;
                                        rowObject.next = (pchildren.length > 1) ? pchildren[1] : null;
                                    }
                                    if ('pdmkds:' + datastore.name + ':children_' + key in localStorage) {
                                        var children = JSON.parse(localStorage['pdmkds:' + datastore.name + ':children_' + pchildren[0]]);
                                        if (children.length) {
                                            rowObject.firstChild = children[0];
                                            rowObject.lastChild = children[children.length -1];
                                        }
                                    }
                                    retFunction([{ "status" : "live", "id" : datastore.nextSequence() }, rowObject], fopts);
                                } else {
                                    retFunction([{ "status" : "empty", "id" : datastore.nextSequence() }], fopts);
                                }
                            } else {
                                retFunction([{ "status" : "empty", "id" : datastore.nextSequence() }], fopts);
                            }
                        } else {
                            retFunction([{ "status" : "empty", "id" : datastore.nextSequence() }], fopts);
                        }
                    } else {
                        //_PlasticBug('WARN: retFunction not properly defined for readRowHandler', 2);
                    }
                }
                return retVal;
            } else {
                // Local Storage Unsupported (FindMe!!)
            }
        }
       ,commitRowHandler: function(rowObjects, retFunction, fopts) {
            var thisRowObjects = rowObjects;
            var datastore = this;
            var thisFopts = fopts;
            if ((Storage) && ('localStorage' in window)) {
                for (var cntRow = 1; cntRow < thisRowObjects.length; cntRow ++) {
                    var thisParentKey = thisRowObjects[cntRow].parentKey;
                    if (thisRowObjects[cntRow].deleted) {
                        // NOTE: No Orphan-Checks are performed here
                        if (thisParentKey === null) {
                            localStorage.removeItem('pdmkds:' + datastore.name + ':root');
                            localStorage.removeItem('pdmkds:' + datastore.name + '_' + thisRowObjects[cntRow].key);
                        } else if ('pdmkds:' + datastore.name + ':children_' + thisParentKey in localStorage) {
                            var newSiblings = [];
                            var siblings = JSON.parse(localStorage['pdmkds:' + datastore.name + ':children_' + thisParentKey]);
                            for (var thisSibling = 0; thisSibling < siblings.length; thisSibling ++) {
                                if (siblings[thisSibling] !== thisRowObjects[cntRow].key) {
                                    newSiblings[newSiblings.length] = siblings[thisSibling];
                                }
                            }
                            if (newSiblings.length) {
                                localStorage['pdmkds:' + datastore.name + ':children_' + thisParentKey] = JSON.stringify(newSiblings);
                            } else {
                                localStorage.removeItem('pdmkds:' + datastore.name + ':children_' + thisParentKey);
                            }
                        }
                        localStorage.removeItem('pdmkds:' + datastore.name + '_' + thisRowObjects[cntRow].key);
                    } else {
                        if (thisParentKey === null) { // Root rowObject
                            thisRowObjects[cntRow].isolated = null;
                            thisRowObjects[cntRow].deleted = null;
                            thisRowObjects[cntRow].dirty = null;
                            localStorage['pdmkds:' + datastore.name + '_' + thisRowObjects[cntRow].key] = JSON.stringify(thisRowObjects[cntRow]);
                        } else {
                            var siblings = [];
                            if ('pdmkds:' + datastore.name + ':children_' + thisParentKey in localStorage) {
                                siblings = JSON.parse(localStorage['pdmkds:' + datastore.name + ':children_' + thisParentKey]);
                            }
                            if ($.inArray(thisRowObjects[cntRow].key, siblings) < 0) {
                                siblings[siblings.length] = thisRowObjects[cntRow].key;
                            }
                            // Sort These???(FindMe!!)
                            localStorage['pdmkds:' + datastore.name + ':children_' + thisParentKey] = JSON.stringify(siblings);
                            thisRowObjects[cntRow].isolated = null;
                            thisRowObjects[cntRow].deleted = null;
                            thisRowObjects[cntRow].dirty = null;
                            thisRowObjects[cntRow].firstChild = null;
                            thisRowObjects[cntRow].prev = null;
                            thisRowObjects[cntRow].next = null;
                            thisRowObjects[cntRow].lastChild = null;
                            localStorage['pdmkds:' + datastore.name + '_' + thisRowObjects[cntRow].key] = JSON.stringify(thisRowObjects[cntRow]);
                        }
                    }
                } 
                setTimeout( function(){retFunction.call(datastore, thisRowObjects, thisFopts)}, 2000 );
            } else {
                // Local Storage Unsupported (FindMe!!)
            }
        }
       ,prettyNames: {
            title: 'Filename'
           ,user: 'User'
           ,group: 'Group'
           ,mode: 'Mode'
           ,created: 'Created'
           ,modified: 'Modified'
        }
       ,attributes: 'title,user,group,mode,created,modified'
       //,selected: 'title,user,group,mode,created,modified'
    }
   ,osro: {
        type: 'array'
       ,delimiter: '/'
       ,rootTitle: '[OS]'
       ,includeRoot: false
       ,rootRowObject: {
                title: '[OS]', tooltip: 'Operating System Root', type: 'root', key: '/' //, next: '/bin'
        }
       ,rowDefault: { user: 'none', group: 'none', mode: '0600', created: (new Date(0)), modified: (new Date(0)) }
       ,data: [
            {
                title: 'bin', tooltip: 'Binary', type: 'folder', key: '/bin'
               ,attributes: {
                    user: 'root', group: 'root', mode: '0755'
                   ,created: (new Date(2015,1,10)), modified: (new Date(2015,1,10))
                }
            }
           ,{ title: 'dev', tooltip: 'Devices', type: 'folder', key: '/dev' }
           ,{ title: 'usr', tooltip: 'User', type: 'folder', key: '/usr' }
           ,{ title: 'home', tooltip: 'Home', type: 'folder', key: '/home' }
           ,[
                { title: 'adam', tooltip: 'Adam Ant', type: 'folder', key: '/adam' }
               ,{ title: 'lisa', tooltip: 'Lisa Leaf', type: 'folder', key: '/lisa' }
               ,{ title: 'xana', tooltip: 'Xana Du', type: 'folder', key: '/xana' }
            ]
           ,{ title: 'tmp', tooltip: 'Temporary', type: 'folder', key: '/tmp' }
        ]
    }
   ,states: {
        type: 'array'
       ,delimiter: '/'
       ,rootTitle: 'US States'
       ,includeRoot: false
       ,prettyNames: {
            title: 'State'
           ,capital: 'State Capital'
           ,remainpop: 'Remaining Population'
           ,pop: 'Population'
           ,remainseat: 'Remaining Seats'
           ,seat: 'Seats in US House'
           ,remainperc: 'Remaining Percentage'
           ,perc: '% of US Population'
           ,maxveh: 'Based upon Max'
           ,veh: 'Vehicles per Capita'
        }
       ,rootRowObject: {
            title: 'US States', tooltip: 'US States', type: 'root', key: 'root', next: '/Alabama', attributes: { pop: 320746592, seat: 435, perc: 100, veh: 1140 }
        }
       ,rowDefault: function(data) {
            return {    remainpop:  (data) ? (320746592 - data.pop) : 0
                       ,remainseat: (data) ? (435 - data.seat) : 0
                       ,remainperc: (data) ? (100 - data.perc) : 0
                       ,maxveh:     (data) ? (1140 - data.veh) : 0
                   };
        }
       ,data: [
            { title: 'Alabama', tooltip: 'Alabama', type: 'folder', key: '/Alabama', attributes: { capital: 'Montgomery', pop: 4858979, seat: 7, perc: 1.51, veh: 1030 } }
           ,{ title: 'Alaska', tooltip: 'Alaska', type: 'folder', key: '/Alaska', attributes: { capital: 'Juneau', pop: 738432, seat: 1, perc: .23, veh: 960 } }
           ,{ title: 'Arizona', tooltip: 'Arizona', type: 'folder', key: '/Arizona', attributes: { capital: 'Phoenix', pop: 6828065, seat: 9, perc: 2.12, veh: 660 } }
           ,{ title: 'Arkansas', tooltip: 'Arkansas', type: 'folder', key: '/Arkansas', attributes: { capital: 'Little Rock', pop: 2978204, seat: 4, perc: .93, veh: 700 } }
           ,{ title: 'California', tooltip: 'California', type: 'folder', key: '/California', attributes: { capital: 'Sacramento', pop: 39144818, seat: 53, perc: 12.18, veh: 840 } }
           ,{ title: 'Colorado', tooltip: 'Colorado', type: 'folder', key: '/Colorado', attributes: { capital: 'Denver', pop: 5456574, seat: 7, perc: 1.7, veh: 340 } }
           ,{ title: 'Connecticut', tooltip: 'Connecticut', type: 'folder', key: '/Connecticut', attributes: { capital: 'Hartford', pop: 3590886, seat: 5, perc: 1.13, veh: 860 } }
           ,{ title: 'Delaware', tooltip: 'Delaware', type: 'folder', key: '/Delaware', attributes: { capital: 'Dover', pop: 945934, seat: 1, perc: .29, veh: 950 } }
           ,{ title: 'Florida', tooltip: 'Florida', type: 'folder', key: '/Florida', attributes: { capital: 'Tallahassee', pop: 20271272, seat: 27, perc: 6.31, veh: 710 } }
           ,{ title: 'Georgia', tooltip: 'Georgia', type: 'folder', key: '/Georgia', attributes: { capital: 'Atlanta', pop: 10214860, seat: 14, perc: 3.18, veh: 820 } }
           ,{ title: 'Hawaii', tooltip: 'Hawaii', type: 'folder', key: '/Hawaii', attributes: { capital: 'Honolulu', pop: 1431603, seat: 2, perc: .45, veh: 760 } }
           ,{ title: 'Idaho', tooltip: 'Idaho', type: 'folder', key: '/Idaho', attributes: { capital: 'Boise', pop: 1654930, seat: 2, perc: .51, veh: 790 } }
           ,{ title: 'Illinois', tooltip: 'Illinois', type: 'folder', key: '/Illinois', attributes: { capital: 'Springfield', pop: 12859995, seat: 18, perc: 4.0, veh: 750 } }
           ,{ title: 'Indiana', tooltip: 'Indiana', type: 'folder', key: '/Indiana', attributes: { capital: 'Indianapolis', pop: 6619680, seat: 9, perc: 2.06, veh: 610 } }
           ,{ title: 'Iowa', tooltip: 'Iowa', type: 'folder', key: '/Iowa', attributes: { capital: 'Des Moines', pop: 3123899, seat: 4, perc: .97, veh: 1050 } }
           ,{ title: 'Kansas', tooltip: 'Kansas', type: 'folder', key: '/Kansas', attributes: { capital: 'Topeka', pop: 2911641, seat: 4, perc: .91, veh: 830 } }
           ,{ title: 'Kentucky', tooltip: 'Kentucky', type: 'folder', key: '/Kentucky', attributes: { capital: 'Frankfort', pop: 4425092, seat: 6, perc: 1.38, veh: 840 } }
           ,{ title: 'Louisiana', tooltip: 'Louisiana', type: 'folder', key: '/Louisiana', attributes: { capital: 'Baton Rouge', pop: 4670724, seat: 6, perc: 1.45, veh: 910 } }
           ,{ title: 'Maine', tooltip: 'Maine', type: 'folder', key: '/Maine', attributes: { capital: 'Augusta', pop: 1329328, seat: 2, perc: .41, veh: 780 } }
           ,{ title: 'Maryland', tooltip: 'Maryland', type: 'folder', key: '/Maryland', attributes: { capital: 'Annapolis', pop: 6006401, seat: 8, perc: 1.87, veh: 790 } }
           ,{ title: 'Massachusetts', tooltip: 'Massachusetts', type: 'folder', key: '/Massachusetts', attributes: { capital: 'Boston', pop: 6794422, seat: 9, perc: 2.11, veh: 820 } }
           ,{ title: 'Michigan', tooltip: 'Michigan', type: 'folder', key: '/Michigan', attributes: { capital: 'Lansing', pop: 9922576, seat: 14, perc: 3.11, veh: 870 } }
           ,{ title: 'Minnesota', tooltip: 'Minnesota', type: 'folder', key: '/Minnesota', attributes: { capital: 'St. Paul', pop: 5489594, seat: 8, perc: 1.71, veh: 870 } }
           ,{ title: 'Mississippi', tooltip: 'Mississippi', type: 'folder', key: '/Mississippi', attributes: { capital: 'Jackson', pop: 2992333, seat: 4, perc: .93, veh: 680 } }
           ,{ title: 'Missouri', tooltip: 'Missouri', type: 'folder', key: '/Missouri', attributes: { capital: 'Jefferson City', pop: 6083672, seat: 8, perc: 1.89, veh: 830 } }
           ,{ title: 'Montana', tooltip: 'Montana', type: 'folder', key: '/Montana', attributes: { capital: 'Helena', pop: 1032949, seat: 1, perc: .32, veh: 1120 } }
           ,{ title: 'Nebraska', tooltip: 'Nebraska', type: 'folder', key: '/Nebraska', attributes: { capital: 'Lincoln', pop: 1896190, seat: 3, perc: .59, veh: 1000 } }
           ,{ title: 'Nevada', tooltip: 'Nevada', type: 'folder', key: '/Nevada', attributes: { capital: 'Carson City', pop: 2890845, seat: 4, perc: .9, veh: 500 } }
           ,{ title: 'New Hampshire', tooltip: 'New Hampshire', type: 'folder', key: '/New Hampshire', attributes: { capital: 'Concord', pop: 1330608, seat: 2, perc: .41, veh: 830 } }
           ,{ title: 'New Jersey', tooltip: 'New Jersey', type: 'folder', key: '/New Jersey', attributes: { capital: 'Trenton', pop: 8958013, seat: 12, perc: 2.79, veh: 690 } }
           ,{ title: 'New Mexico', tooltip: 'New Mexico', type: 'folder', key: '/New Mexico', attributes: { capital: 'Santa Fe', pop: 2085109, seat: 3, perc: .65, veh: 770 } }
           ,{ title: 'New York', tooltip: 'New York', type: 'folder', key: '/New York', attributes: { capital: 'Albany', pop: 19795791, seat: 27, perc: 6.16, veh: 570 } }
           ,{ title: 'North Carolina', tooltip: 'North Carolina', type: 'folder', key: '/North Carolina', attributes: { capital: 'Raleigh', pop: 10042802, seat: 13, perc: 3.12, veh: 670 } }
           ,{ title: 'North Dakota', tooltip: 'North Dakota', type: 'folder', key: '/North Dakota', attributes: { capital: 'Bismarck', pop: 756927, seat: 1, perc: .24, veh: 1080 } }
           ,{ title: 'Ohio', tooltip: 'Ohio', type: 'folder', key: '/Ohio', attributes: { capital: 'Columbus', pop: 11613423, seat: 16, perc: 3.61, veh: 910 } }
           ,{ title: 'Oklahoma', tooltip: 'Oklahoma', type: 'folder', key: '/Oklahoma', attributes: { capital: 'Oklahoma City', pop: 3911338, seat: 5, perc: 1.22, veh: 860 } }
           ,{ title: 'Oregon', tooltip: 'Oregon', type: 'folder', key: '/Oregon', attributes: { capital: 'Salem', pop: 4028977, seat: 5, perc: 1.25, veh: 770 } }
           ,{ title: 'Pennsylvania', tooltip: 'Pennsylvania', type: 'folder', key: '/Pennsylvania', attributes: { capital: 'Harrisburg', pop: 12802503, seat: 18, perc: 3.98, veh: 760 } }
           ,{ title: 'Rhode Island', tooltip: 'Rhode Island', type: 'folder', key: '/Rhode Island', attributes: { capital: 'Providence', pop: 1056298, seat: 2, perc: .33, veh: 730 } }
           ,{ title: 'South Carolina', tooltip: 'South Carolina', type: 'folder', key: '/South Carolina', attributes: { capital: 'Columbia', pop: 4896146, seat: 7, perc: 1.52, veh: 770 } }
           ,{ title: 'South Dakota', tooltip: 'South Dakota', type: 'folder', key: '/South Dakota', attributes: { capital: 'Pierre', pop: 858469, seat: 1, perc: .27, veh: 950 } }
           ,{ title: 'Tennessee', tooltip: 'Tennessee', type: 'folder', key: '/Tennessee', attributes: { capital: 'Nashville', pop: 6600299, seat: 9, perc: 2.05, veh: 840 } }
           ,{ title: 'Texas', tooltip: 'Texas', type: 'folder', key: '/Texas', attributes: { capital: 'Austin', pop: 27469114, seat: 36, perc: 8.55, veh: 720 } }
           ,{ title: 'Utah', tooltip: 'Utah', type: 'folder', key: '/Utah', attributes: { capital: 'Salt Lake City', pop: 2995919, seat: 4, perc: .93, veh: 870 } }
           ,{ title: 'Vermont', tooltip: 'Vermont', type: 'folder', key: '/Vermont', attributes: { capital: 'Montpelier', pop: 626042, seat: 1, perc: .19, veh: 910 } }
           ,{ title: 'Virginia', tooltip: 'Virginia', type: 'folder', key: '/Virginia', attributes: { capital: 'Richmond', pop: 8382993, seat: 11, perc: 2.61, veh: 840 } }
           ,{ title: 'Washington', tooltip: 'Washington', type: 'folder', key: '/Washington', attributes: { capital: 'Olympia', pop: 7170351, seat: 10, perc: 2.23, veh: 870 } }
           ,{ title: 'West Virginia', tooltip: 'West Virginia', type: 'folder', key: '/West Virginia', attributes: { capital: 'Charleston', pop: 1844128, seat: 3, perc: .57, veh: 750 } }
           ,{ title: 'Wisconsin', tooltip: 'Wisconsin', type: 'folder', key: '/Wisconsin', attributes: { capital: 'Madison', pop: 5771337, seat: 8, perc: 1.80, veh: 860 } }
           ,{ title: 'Wyoming', tooltip: 'Wyoming', type: 'folder', key: '/Wyoming', attributes: { capital: 'Cheyenne', pop: 586107, seat: 1, perc: .18, veh: 1140 } }
        ]
    }
});

// ** http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523 ** //
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
