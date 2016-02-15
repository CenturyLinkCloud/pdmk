//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*!------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/
/ Program: "PlasticGlue.js" => Plastic Data Modeling Kit [pdmk]
/                              Framework Glue Utilities
/ Author: John R B Woodworth <John.Woodworth@CenturyLink.com>
/
/ Support Contact: funwithplastic@ctl.io
/
/ Created: 04 January, 2014
/ Last Updated: 10 February, 2016
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
//-------------------------------------------------------------------//
// Cache Feedback Icons Into Memory For Aesthetics (FindMe!!)

(function ($) { /* jQuery */
    // ** http://stackoverflow.com/questions/4191386/jquery-how-to-find-an-element-based-on-a-data-attribute-value ** //
    $.fn.plasticKeyFilter = function (key, dsname) {
        return this.filter(
            function () { return (($(this).data('plastic-key') === key) && ($(this).data('plastic-store') === dsname)); }
        );
    };
    // ** http://stackoverflow.com/questions/7307173/what-is-the-equivalent-of-max-in-jquery ** //
    $.fn.plasticMax = function(selector) { 
        return Math.max.apply(null, this.map(function(index, el) { return selector.apply(el); }).get() ); 
    };
    $.fn.plasticMin = function(selector) { 
        return Math.min.apply(null, this.map(function(index, el) { return selector.apply(el); }).get() );
    };
    // Sort jQuery Elements Numerically By ".data(dataKey)"
    $.fn.plasticDataSorter = function(dataKey) { 
        return this.sort(function(a,b){$(a).data(dataKey)-$(b).data(dataKey)});
    };
})(jQuery);

(function (_,$) { /* window, jQuery */
    // Define Debugging Configuration and Handler
    _._PlasticRuntime = {};
    _._PlasticPrefs = $.extend({}, { BugPriority: 0, BugCategory: /^none$/i }, _._PlasticPrefs);
    _._PlasticBug = function(message, priority, category, level) {
        // Priority: Higher == More Verbose
        // Category: Restrict Messages By Categories (RegExp)
        // Level: log, info, warn, error
        if (_PlasticPrefs) {
            var unfiltered = (((priority === undefined) && (category === undefined)) || //->
                ((_PlasticPrefs.BugCategory) && (_PlasticPrefs.BugCategory.test(category)) && //->
                    (_PlasticPrefs.BugPriority > -1) && (priority <= _PlasticPrefs.BugPriority)) || //->
                ((_PlasticPrefs.BugCategory === undefined) && (_PlasticPrefs.BugPriority > -1) && //->
                    (priority <= _PlasticPrefs.BugPriority)));
            if ((unfiltered) && (window.console)) {
                if ((level) && (/^log|debug|info|warn|error$/.test(level)) && (console[level])) {
                    console[level](message);
                } else if (console.log) {
                    if (level) { message = level.toUpperCase() + ': ' + message; };
                    console.log(message);
                }
            }
        }
    };
    // Deep Debugging "Console Log" Object
    _.cl = ((_.console) && (_.console.log)) ? console.log : function(){};
    ///_.cl = function(){};
    // Define QUnit Unit Testing Stubs
    _.module=function(){};
    _.test=function(){};
    _.ok=function(){};
    if ($.error_pre === undefined) { $.error_pre = $.error; };
    $.error = function(msg, url, line){
        var thisMsg = msg, thisUrl = url, thisLine = line;
        if (/plastic/.test(url)) {
            $.get(thisUrl, function(data){
                var sLines = data.split(/\n/);
                alert('PDMK INITIALIZATION ERROR:\n\n' + //->
                    '...\n' + sLines[thisLine -1].replace(/^\s+/, '') + '\n...\n' + //->
                    '! ' + thisMsg + '\n----\n' + //->
                    thisUrl.replace(/^(file|https?):\/\/[^\/]+\//i, '/') + ':' + thisLine + '\n----\n');
            }, 'text').error(function(data){
                Plastic.Feedback(data);
            });
        } else {
            return $.error_pre(msg, url, line);
        }
    };
    _.onerror = $.error;
    _.onbeforeunload = function() {
    //    alert('TODO: Protect dirty data here !!!');
    };
    // Create Main "Plastic" Object
    _.Plastic = new function(){
        var readyStack = [];
        this.version = '1.0.0';
        this.release = 'Public Beta';
        this.ready = function(retFunction) { readyStack.push([this, retFunction]); };
        this.RegisterPlaybook = function(playbook, fopts) {
            _PlasticBug("Plastic.RegisterPlaybook(playbook); called", 4, 'function');
            _PlasticBug(playbook, 4, 'comment');
            if (_PlasticRuntime.playbook !== undefined) {
                // Clean up previous playbook (FindMe!!)
                _PlasticBug('INFO: Plastic Playbook Unregistered', 3);
            }
            _PlasticRuntime.playbook = playbook;
            _PlasticBug('Plastic Playbook Registered', 4, 'function');
        };
        this.RegisterDatastore = function(datastore, fopts) {
            _PlasticBug("Plastic.RegisterDatastore(datastore); called", 4, 'function');
            _PlasticBug(datastore, 4, 'comment');
            if (_PlasticRuntime.datastore === undefined) { _PlasticRuntime.datastore = {}; };
            var pds = _PlasticRuntime.datastore;
            for (var dsname in datastore) {
                if (pds[dsname] === undefined) {
                    pds[dsname] = new PlasticDatastore(dsname, { data: datastore[dsname].data });
                    _PlasticBug('New PlasticDatastore created: ' + dsname, 4, 'comment');
                    // Roll These IFs into Switch?? (FindMe!!)
                    if (typeof (datastore[dsname].createRowHandler) === "function") {
                        pds[dsname].createRowHandler = datastore[dsname].createRowHandler;
                        _PlasticBug('Custom createRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].readRowHandler) === "function") {
                        pds[dsname].readRowHandler = datastore[dsname].readRowHandler;
                        _PlasticBug('Custom readRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].updateRowHandler) === "function") {
                        pds[dsname].updateRowHandler = datastore[dsname].updateRowHandler;
                        _PlasticBug('Custom updateRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].deleteRowHandler) === "function") {
                        pds[dsname].deleteRowHandler = datastore[dsname].deleteRowHandler;
                        _PlasticBug('Custom deleteRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].commitRowHandler) === "function") {
                        pds[dsname].commitRowHandler = datastore[dsname].commitRowHandler;
                        _PlasticBug('Custom commitRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].searchRowHandler) === "function") {
                        pds[dsname].searchRowHandler = datastore[dsname].searchRowHandler;
                        _PlasticBug('Custom searchRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].requestSecurityContextHandler) === "function") {
                        pds[dsname].requestSecurityContextHandler = datastore[dsname].requestSecurityContextHandler;
                        _PlasticBug('Custom requestSecurityContextHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (typeof (datastore[dsname].syntaxRowHandler) === "function") {
                        pds[dsname].syntaxRowHandler = datastore[dsname].syntaxRowHandler;
                        _PlasticBug('Custom syntaxRowHandler defined: ' + dsname, 4, 'comment');
                    }
                    if (datastore[dsname].anchor) {
                        pds[dsname].option('anchor', datastore[dsname].anchor);
                    }
                    if (datastore[dsname].commit) {
                        pds[dsname].option('commit', datastore[dsname].commit);
                    }
                    if (datastore[dsname].rowDefault) {
                        pds[dsname].option('rowDefault', datastore[dsname].rowDefault);
                    }
                    if (datastore[dsname].includeRoot) {
                        pds[dsname].option('includeRoot', datastore[dsname].includeRoot);
                    }
                    if (datastore[dsname].trimDelimiter) {
                        pds[dsname].option('trimDelimiter', datastore[dsname].trimDelimiter);
                    }
                    if (datastore[dsname].delimiter) {
                        pds[dsname].option('delimiter', datastore[dsname].delimiter);
                    }
                    if (datastore[dsname].rootRowObject) {
                        pds[dsname].option('rootRowObject', datastore[dsname].rootRowObject);
                    }
                    if (datastore[dsname].augment) {
                        pds[dsname].option('augment', datastore[dsname].augment);
                    }
                    if (datastore[dsname].type) {
                        pds[dsname].option('type', datastore[dsname].type);
                    }
                    if (datastore[dsname].attributes) {
                        pds[dsname].option('attributes', datastore[dsname].attributes);
                    }
                    if (datastore[dsname].selected) {
                        pds[dsname].option('selected', datastore[dsname].selected);
                    }
                    if (datastore[dsname].dateFormat) {
                        pds[dsname].option('dateFormat', datastore[dsname].dateFormat);
                    }
                    if (datastore[dsname].prettyNames) {
                        pds[dsname].option('prettyNames', datastore[dsname].prettyNames);
                    }
                } else {
                    ///throw new Error("PlasticDatastore already exists with name '" + dsname + "'");
                }
            }
        };
        var buildOrder = 0;
        this.BuildPlaybook = function(section, parent) {
            _PlasticBug('PLAYBUILD_1:', 4, 'build');
            _PlasticBug(section, 4, 'build');
            _PlasticBug('PLAYBUILD_2: ', 4, 'build');
            _PlasticBug(parent, 4, 'build');
            if (_PlasticRuntime.root === undefined) { // Define "root" anchor element
                _PlasticRuntime.root = parent;
                // Initialize Root And Loading Classes
                $(_PlasticRuntime.root).addClass('plastic-root plastic-loading');
                _PlasticRuntime.imgbase = $('.plastic-root').css('background-image').replace(/^[^(]*\("|[^/]*$/g, '');
            };
            var parts = [];
            for (var part in section) { parts[parts.length] = part; };
            for (var cntPart = 0; cntPart < parts.length; cntPart++) {
                _PlasticBug('section/part: ' + section + '/' + parts[cntPart], 4, 'build');
                var typeRoot = section[parts[cntPart]].type.split('-')[0];
                var typeVariant = section[parts[cntPart]].type.split('-')[1];
                _PlasticBug('Build: ' + parts[cntPart] + ' ' + section[parts[cntPart]].type + ' ' + typeRoot + ' > ' + parent, 4, 'build');
                /////alert(parts[cntPart]);
                if (_PlasticRuntime.inventory[parts[cntPart]] !== undefined) {
                    throw new Error('Duplicate id found in playbook for: ' + parts[cntPart]);
                } else if (/^Plastic/i.test(parts[cntPart])) {
                    throw new Error('Reserved id found in playbook for: ' + parts[cntPart]);
                } else {
                    _PlasticRuntime.inventory[parts[cntPart]] = section[parts[cntPart]];
                    _PlasticRuntime.domnode[parts[cntPart]] = $(parent).append(
                        $('<div id="' + parts[cntPart] + '" class="Plastic ' + section[parts[cntPart]].type + ' pre-init build-' + (++buildOrder) + '" />')
                    );
                }
                _PlasticBug('Calling: jQuery(\'#' + parts[cntPart] + '\')[\'plastic' + typeRoot + '\'](\'' + typeVariant + '\');', 4, 'call');
                if (section[parts[cntPart]].children) {
                    var thisSection = section[parts[cntPart]].children;
                    var thisPart = '#' + parts[cntPart];
                    Plastic.BuildPlaybook(thisSection, thisPart);
                }
                _PlasticBug('Calling: jQuery(\'#' + parts[cntPart] + '\')[\'plastic' + typeRoot + '\'](\'' + typeVariant + '\');', 4, 'call');
                section.parent = parent; // For playbook tree traversal
                var thisPart = $('#' + parts[cntPart])['plastic' + typeRoot](
                    typeVariant, $.extend(section[parts[cntPart]].options, { index: section[parts[cntPart]].index, parent: parent }) );
                if ((section[parts[cntPart]]) && (section[parts[cntPart]].options) && (section[parts[cntPart]].options.datastore)) {
                    var pds = _PlasticRuntime.datastore;
                    if (pds[section[parts[cntPart]].options.datastore] !== undefined) {
                        // Bind by Component-Class?
                        if (typeof (thisPart.bindDatastore) === 'function') {
                            _PlasticBug('Binding to datastore: ' + section[parts[cntPart]].options.datastore, 4, 'build');
                            var namespace = (section[parts[cntPart]].options.namespace !== undefined) //->
                                ? section[parts[cntPart]].options.namespace : 'default';
                            thisPart.bindDatastore(pds[section[parts[cntPart]].options.datastore], namespace);
                        // Bind by Component-Type?
                        } else if ((thisPart.length) && (typeof (thisPart[0].bindDatastore) === 'function')) {
                            _PlasticBug('Binding to datastore: ' + section[parts[cntPart]].options.datastore, 4, 'build');
                            var namespace = (section[parts[cntPart]].options.namespace !== undefined) //->
                                ? section[parts[cntPart]].options.namespace : 'default';
                            thisPart[0].bindDatastore(pds[section[parts[cntPart]].options.datastore], namespace);
                        } else {
                            _PlasticBug('Auto-datastore binding disabled for: ' + parts[cntPart] + ' => ' + section[parts[cntPart]].options.datastore, 4, 'build');
                        }
                    }
                }
            }
        };
        this.SizeFrame = function(e) {
            var thisHeight = parseInt($(this).height());
            $(this).css('top', -(thisHeight));
            $(this).closest('.stack-tab-wrap').css('border-top-width', thisHeight);
        };
        this.Action = function(rowObject, action, fopts) {
            var retVal;
            var component = this['plastic' + this.isplastic];
            var datastore = ((this.plasticopts) && (this.plasticopts.datastore)) ? _PlasticRuntime.datastore[this.plasticopts.datastore] : null;
            var namespace = ((this.plasticopts) && (this.plasticopts.namespace)) ? this.plasticopts.namespace : 'default';
            var path = ((fopts) && (fopts.path)) ? fopts.path : null;
            var against = ((fopts) && (fopts.against)) ? fopts.against : null;
            switch (action) {
                case "create":
                    if (datastore) {
                        datastore.createRow(rowObject.key, component.rowsCreated, $.extend({}, fopts, { namespace: namespace }));
                    } else {
                        // Add Generalized Error Handler Here (FindMe!!)
                        throw new Error('Unable to locate datastore for to create row');
                    }
                    break;
                case "delete":
                    if (datastore) {
                        datastore.deleteRow(rowObject.key, component.rowsDeleted, $.extend({}, fopts, { namespace: namespace }));
                    } else {
                        // Add Generalized Error Handler Here (FindMe!!)
                        throw new Error('Unable to locate datastore for to delete key: ' + rowObject.key);
                    }
                    break;
                case "cut":
                    if (datastore) {
                        if (!(datastore.clipboard)) { datastore.clipboard = []; };
                        if (datastore.clipboard.length) { // May Support Multiple Clipboard Options In Future (FindMe!!)
                            var thisRow = datastore.clipboard[datastore.clipboard.length -1];
                            datastore.clipboard.splice(datastore.clipboard.length -1, 1);
                            datastore.updateRow(thisRow.key, [ { "status" : "deleting", "id" : datastore.nextSequence() }, //->
                                { "deleted" : null } ], component.rowsUpdated, $.extend({}, fopts, { namespace: namespace }));
                            ///datastore.invalidateCache(thisRow.key);
                        }
                        datastore.clipboard[datastore.clipboard.length] = rowObject;
                        datastore.deleteRow(rowObject.key, component.rowsDeleted, $.extend({}, fopts, { namespace: namespace }));
                    }
                    break;
                case "copy":
                    if (datastore) {
                        if (!(datastore.clipboard)) { datastore.clipboard = []; };
                        datastore.clipboard[datastore.clipboard.length] = rowObject;
                    }
                    break;
                case "paste":
                    if ((datastore) && (datastore.clipboard) && (datastore.clipboard.length)) {
                        datastore.createRow(rowObject.key, function(rowObjects, fopts) {
                            var isolated = ((rowObjects.length > 1) && (rowObjects[1].isolated)) ? rowObjects[1].isolated : null;
                            var key = ((rowObjects.length > 1) && (rowObjects[1].key)) ? rowObjects[1].key : null;
                            var parentKey = ((rowObjects.length > 1) && (rowObjects[1].parentKey)) ? rowObjects[1].parentKey : null;
                            var attributes = ((rowObjects.length > 1) && (rowObjects[1].attributes)) ? rowObjects[1].attributes : {};
                            var clipboard = ((rowObjects.length > 1) && (rowObjects[1].clipboard)) ? rowObjects[1].clipboard : {};
                            rowObjects[1] = $.extend(true, {}, datastore.clipboard[datastore.clipboard.length -1]);
                            rowObjects[1].isolated = isolated;
                            rowObjects[1].key = key;
                            rowObjects[1].parentKey = parentKey;
                            rowObjects[1].attributes = $.extend({}, rowObjects[1].attributes, clipboard);
                            // Propagate Paste Action To Children (FindMe!!)
                            // This May Have Clipboard Manager In Future (Multiple Cut/Paste Levels[FindMe!!])
                            datastore.clipboard.splice(datastore.clipboard.length -1, 1);
                            component.rowsCreated(rowObjects, fopts); // Original Created Target
                            ///datastore.updateRow(key, [ { "status" : "pasted", "id" : datastore.nextSequence() }, {} ], //->
                            ///    component.rowsCreated(rowObjects, fopts), // Original Created Target
                            ///    fopts);
                        }, fopts);
                    }
                    break;
                case "prev": // Alias of "reverse"
                case "reverse":
                    if ((datastore) && (path) && (path === '-')) { // Previous Datastore rowObject
                        var findPrevHop = function(thisRowObject) { // Roll this into Datastore Method (FindMe!!)
                            var prevHop = null;
                            thisRowObject = datastore.readCache(thisRowObject.prev);
                            if ((thisRowObject !== null) && (thisRowObject.firstChild)) {
                                while (thisRowObject.firstChild) {
                                    thisRowObject = datastore.readCache(thisRowObject.firstChild);
                                    var siblings = ((thisRowObject.siblings) && (typeof (thisRowObject.siblings) === 'function')) //->
                                        ? thisRowObject.siblings(true) : null;
                                    if (siblings !== null) {
                                        prevHop = (siblings.length === 0) ? thisRowObject.key : siblings[siblings.length -1];
                                        thisRowObject = datastore.readCache(prevHop, { namespace: namespace });
                                    } else {
                                        prevHop = null;
                                    }
                                }
                            } else if (thisRowObject !== null) {
                                prevHop = thisRowObject.key;
                            }
                            return prevHop;
                        };
                        var thisPrev = (against === '-') //->
                            ? (rowObject.prev !== null) //->
                                ? (rowObject.firstChild) //->
                                    ? findPrevHop(rowObject) //->
                                    : rowObject.prev //->
                                : rowObject.parentKey //->
                            : rowObject.prev;
                        // Generalize This Beyond view-tree (FindMe!!)
                        if (thisPrev !== null) {
                            $(this).trigger('rowactivate.plastic', { key: thisPrev } );
                        }
                    } else { // Previous Component In Stack
                    }
                    break;
                case "next": // Alias of "forward"
                case "forward":
                    if ((datastore) && (path) && (path === '-')) { // Next Datastore rowObject
                        var findNextHop = function(thisRowObject) { // Roll this into Datastore Method (FindMe!!)
                            var nextHop = null;
                            while (nextHop === null) {
                                if (thisRowObject === null) {
                                    break;
                                } else {
                                    nextHop = thisRowObject.next;
                                    thisRowObject = datastore.readCache(thisRowObject.parentKey, { namespace: namespace });
                                }
                            }
                            return nextHop;
                        };
                        var thisNext = (against === '-') //->
                            ? (rowObject.firstChild) //->
                                ? rowObject.firstChild //->
                                : (rowObject.next !== null) //->
                                    ? rowObject.next //->
                                    : findNextHop(rowObject) //->
                            : rowObject.next;
                        if (thisNext !== null) {
                            $(this).trigger('rowactivate.plastic', { key: thisNext } );
                        }
                    } else { // Next Component In Stack
                    }
                    break;
                case "security":
                    break;
                case "undo":
                    break;
                case "reload":
                    if (datastore) {
                        datastore.readRows(rowObject.key, function(rowObjects, fopts){
                            _PlasticBug(this, 4, 'comment');
                            //for (var cntRow = 1; cntRow < rowObjects.length; cntRow ++) {
                            //    datastore.forgetRow(rowObjects[cntRow].key, fopts);
                            //}
                            component.reloadChildren(rowObject.key, fopts);
                        }, $.extend({}, fopts, { namespace: namespace }));
                    } else {
                        // Add Generalized Error Handler Here (FindMe!!)
                        throw new Error('Unable to locate datastore to reload key: ' + rowObject.key);
                    }
                    break;
                case "clear":
                case "cancel":
                    if (datastore) {
                        datastore.forgetRow(rowObject.key, $.extend({}, fopts, { namespace: namespace }));
                        datastore.updateRow(rowObject.key, //->
                            [ { "status" : "clear", "id" : datastore.nextSequence() }, {} ], //->
                            component.rowsUpdated, $.extend({}, fopts, { namespace: namespace }));
                    } else {
                        // Add Generalized Error Handler Here (FindMe!!)
                        throw new Error('Unable to locate datastore to cancel key: ' + rowObject.key);
                    }
                    break;
                case "close":
                    break;
                case "commit": // Make Commits More Efficient (FindMe!!)
                    if (datastore) {
                        var keyset = ((fopts) && (fopts.keyset)) ? fopts.keyset : {};
                        keyset[rowObject.key] = rowObject.key;
                        _PlasticRuntime.system.commitpane.show();
                        datastore.commitRow([ { "status" : "commit", "id" : datastore.nextSequence() }, //->
                            rowObject ], component.rowsCommitted, $.extend({}, fopts, { keyset: keyset, namespace: namespace }));
                    } else {
                        // Add Generalized Error Handler Here (FindMe!!)
                        throw new Error('Unable to locate datastore to commit key: ' + rowObject.key);
                    }
                    break;
                default:
                    _PlasticBug('WARN: Plastic.Action action \'' + action + '\' unimplemented', 2);
                    break;
            }
            return retVal;
        /*
           NOTE: Todo stack will lose future (forward) actions with any action other than undo* and redo*
           NOTE: Some actions will define default tests to determine whether or not they should be allowed
        */
        };
        this.ActionTests = function(rowObject, action, fopts) {
            var retVal = [];
            var component = this['plastic' + this.isplastic];
            var datastore = ((this.plasticopts) && (this.plasticopts.datastore)) ? _PlasticRuntime.datastore[this.plasticopts.datastore] : null;
            var namespace = ((this.plasticopts) && (this.plasticopts.namespace)) ? this.plasticopts.namespace : 'default';
            var path = ((fopts) && (fopts.path)) ? fopts.path : null;
            var against = ((fopts) && (fopts.against)) ? fopts.against : null;
            fopts = $.extend({}, fopts, { namespace: namespace });
            switch (action) {
                case "create":
                    retVal[retVal.length] = ((path) || (against)) ? [ "cancreate", path, against, fopts ] : "cancreate";
                    break;
                case "read":
                    retVal[retVal.length] = ((path) || (against)) ? [ "canread", path, against, fopts ] : "canread";
                    break;
                case "update":
                    retVal[retVal.length] = ((path) || (against)) ? [ "canupdate", path, against, fopts ] : "canupdate";
                    break;
                case "delete":
                    retVal[retVal.length] = ((path) || (against)) ? [ "candelete", path, against, fopts ] : "candelete";
                    break;
                case "edit":
                    retVal[retVal.length] = ((path) || (against)) ? [ "canupdate", path, against, fopts ] : "canupdate";
                    break;
                case "branch":
                    break;
                case "hyperlink":
                    break;
                case "less":
                    retVal[retVal.length] = ((path) || (against)) ? [ "isless", path, against, fopts ] : "isless";
                    break;
                case "greater":
                    retVal[retVal.length] = ((path) || (against)) ? [ "isgreater", path, against, fopts ] : "isgreater";
                    break;
                case "like":
                    retVal[retVal.length] = ((path) || (against)) ? [ "islike", path, against, fopts ] : "islike";
                    break;
                case "equal":
                    retVal[retVal.length] = ((path) || (against)) ? [ "isequal", path, against, fopts ] : "isequal";
                    break;
                case "cut":
                    retVal[retVal.length] = "candelete";
                    break;
                case "copy":
                    retVal[retVal.length] = "canread";
                    break;
                case "paste":
                    retVal[retVal.length] = "not-ancestor";
                    retVal[retVal.length] = "cancreate";
                    retVal[retVal.length] = "canpaste";
                    break;
                case "reverse":
                case "prev":
                    retVal[retVal.length] = "canreverse";
                    break;
                case "forward":
                case "next":
                    retVal[retVal.length] = "canforward";
                    break;
                case "reload":
                    retVal[retVal.length] = "canreload";
                    break;
                case "clear":
                case "cancel":
                    retVal[retVal.length] = "dirty";
                    break;
                case "clearall":
                    break;
                case "reset":
                    break;
                case "close":
                    break;
                case "commit":
                    retVal[retVal.length] = "dirty";
                    retVal[retVal.length] = "not-error";
                    break;
                case "commitblock":
                    break;
                case "commitall":
                    break;
                case "security":
                    break;
                case "undo":
                    break;
                case "undoall":
                    break;
                case "redo":
                    break;
                case "redoall":
                    break;
                case "ping":
                    retVal[retVal.length] = "cancreate";
                    break;
            };
            return retVal;
        };
        this.Test = function(rowObject, test, fopts) {
            var retVal = false;
            var component = this['plastic' + this.isplastic];
            var actions = ((rowObject) && (rowObject.actions)) ? rowObject.actions : {};
            var flags = ((rowObject) && (rowObject.flags)) ? rowObject.flags : {};
            var datastore = ((this.plasticopts) && (this.plasticopts.datastore)) ? _PlasticRuntime.datastore[this.plasticopts.datastore] : null;
            var namespace = ((this.plasticopts) && (this.plasticopts.namespace)) ? this.plasticopts.namespace : 'default';
            fopts = $.extend({}, fopts, { namespace: namespace });
            if ((test instanceof Array) && (test.length >= 2)) {
                fopts = $.extend({}, fopts, (test.length > 2) ? { path: test[1], against: test[2] } : { path: test[1] } );
                test = test[0];
            }
            var action = undefined;
            var path = ((fopts) && (fopts.path)) ? fopts.path : null;
            var against = ((fopts) && (fopts.against)) ? fopts.against : null;
            // Match: path, against
            // Translate path = relational_path and against = expanded_against (FindMe!!)
            switch ((typeof test === 'string') ? test.replace(/^(!|not-)/, '') : 'default') {
                case "cancreate":
                    // Add check for isolated to disable this (FindMe!!)
                    action = 'create';
                    if (typeof (actions) === 'function') {
                        retVal = ((actions.call(datastore, rowObject, path, against)[action] === undefined) || //->
                            (actions.call(datastore, rowObject, path, against)[action]));
                    } else {
                        retVal = ((actions[action] === undefined) || (actions[action]));
                    }
                    retVal = ((retVal) && (!(rowObject.deleted)) && (!(rowObject.ancestorFlag('deleted'))));
                    break;
                case "canread":
                    action = 'read';
                    if (typeof (actions) === 'function') {
                        retVal = ((actions.call(datastore, rowObject, path, against)[action] === undefined) || //->
                            (actions.call(datastore, rowObject, path, against)[action]));
                    } else {
                        retVal = ((actions[action] === undefined) || (actions[action]));
                    }
                    break;
                case "canupdate":
                    action = 'update';
                    if (typeof (actions) === 'function') {
                        retVal = ((actions.call(datastore, rowObject, path, against)[action] === undefined) || //->
                            (actions.call(datastore, rowObject, path, against)[action]));
                    } else {
                        retVal = ((actions[action] === undefined) || (actions[action]));
                    }
                    break;
                case "candelete":
                    action = 'delete';
                    if (typeof (actions) === 'function') {
                        retVal = ((actions.call(datastore, rowObject, path, against)[action] === undefined) || //->
                            (actions.call(datastore, rowObject, path, against)[action]));
                    } else {
                        retVal = ((actions[action] === undefined) || (actions[action]));
                    }
                    retVal = ((retVal) && (!(rowObject.deleted)) && (!
                        ((rowObject.ancestorFlag) && (rowObject.ancestorFlag('deleted'))) ));
                    break;
                case "canclose":
                    break;
                case "isancestor":
                    break;
                case "isdescendant":
                    break;
                case "isless":
                    if ((rowObject) && (path) && (against)) {
                        var value = ((rowObject.attributes) && (rowObject.attributes[path])) //->
                            ? rowObject.attributes[path] //->
                            : rowObject[path] ? rowObject[path] : null;
                        retVal = ((value !== null) && (value < against));
                    } else {
                        retVal = false;
                    }
                    break;
                case "isgreater":
                    if ((rowObject) && (path) && (against)) {
                        var value = ((rowObject.attributes) && (rowObject.attributes[path])) //->
                            ? rowObject.attributes[path] //->
                            : rowObject[path] ? rowObject[path] : null;
                        retVal = ((value !== null) && (value > against));
                    } else {
                        retVal = false;
                    }
                    break;
                case "islike": // RegExp matcher logic
                    against = new RegExp(against);
                case "isequal":
                    // Translate path = relational_path and against = expanded_against (FindMe!!)
                    if ((rowObject) && (path) && (against)) {
                        var value = ((rowObject.attributes) && (rowObject.attributes[path])) //->
                            ? rowObject.attributes[path] //->
                            : rowObject[path] ? rowObject[path] : null;
                        retVal = (value === null) //->
                            ? false //->
                            : (against instanceof RegExp) ? (against.test(value)) : (value === against);
                    } else {
                        retVal = false;
                    }
                    break;
                case "doesexist":
                    retVal = ((rowObject) && (rowObject[path] !== undefined));
                    break;
                case "hasselection":
                    var thisGroup = (path) ? path.replace(/^@/, '') + '#selected' : null;
                    retVal = ((thisGroup) && (rowObject) && (rowObject.attributes) && (rowObject.attributes[thisGroup]));
                    break;
                case "selectionhas":
                    var thisGroup = (path) ? path.replace(/^@/, '') + '#selected' : null;
                    if ((thisGroup) && (rowObject) && (rowObject.attributes) && (rowObject.attributes[thisGroup])) {
                        for (var thisTest in rowObject.attributes[thisGroup]) {
                            var thisRow = $.extend({}, rowObject);
                            if (retVal = Plastic.Test(thisRow, against, { path: path, against: thisTest })) {
                                break; // One is enough
                            }
                        }
                    }
                    _PlasticBug(this, 4, 'comment');
                    break;
                case "type":
                    break;
                case "dirty":
                    retVal = ((rowObject) && (rowObject.dirty));
                    break;
                case "deleted":
                    retVal = ((rowObject) && (rowObject.deleted));
                    break;
                case "error":
                    retVal = ((rowObject) && (rowObject.error));
                    break;
                case "isolated":
                    retVal = ((rowObject) && (rowObject.isolated));
                    break;
                case "disabled":
                    retVal = ((rowObject) && //->
                        ( (rowObject.disabled) || ((rowObject.ancestorFlag) && (rowObject.ancestorFlag('disabled'))) ));
                    break;
                case "canpaste":
                    retVal = ((datastore) && (datastore.clipboard) && (datastore.clipboard.length) && //->
                              (datastore.clipboard[datastore.clipboard.length -1].parentKey) && //->
                              (rowObject) && (rowObject.key) && //->
                              (rowObject.key !== datastore.clipboard[datastore.clipboard.length -1].parentKey)); 
                    break;
                case "canreload":
                    retVal = true; // Add better test?? (FindMe!!)
                    break;
                case "canforward":
                    if ((datastore) && (path) && (path === '-')) { // Next Datastore rowObject
                        var findNextHop = function(thisRowObject) { // Roll this into Datastore Method (FindMe!!)
                            var nextHop = null;
                            while (nextHop === null) {
                                if (thisRowObject === null) {
                                    break;
                                } else {
                                    nextHop = thisRowObject.next;
                                    thisRowObject = datastore.readCache(thisRowObject.parentKey, fopts);
                                }
                            }
                            return nextHop;
                        };
                        var thisNext = ((against === '-') || ((against) && (rowObject[against]))) //->
                            ? (rowObject.firstChild) //->
                                ? rowObject.firstChild //->
                                : (rowObject.next !== null) //->
                                    ? rowObject.next //->
                                    : findNextHop(rowObject) //->
                            : rowObject.next;
                        // Generalize This Beyond view-tree (FindMe!!)
                        if (thisNext !== null) {
                            if ((against) && (rowObject[against])) {
                                var thisNextAgainst = datastore.readCache(thisNext, fopts)[against];
                                retVal = (thisNextAgainst === rowObject[against]);
                            } else {
                                retVal = true;
                            }
                        } else {
                            retVal = false;
                        }
                    } else { // Next Component In Stack
                    }
                    break;
                case "canreverse":
                    if ((datastore) && (path) && (path === '-')) { // Previous Datastore rowObject
                        var findPrevHop = function(thisRowObject) { // Roll this into Datastore Method (FindMe!!)
                            var prevHop = null;
                            thisRowObject = datastore.readCache(thisRowObject.prev);
                            if ((thisRowObject !== null) && (thisRowObject.firstChild)) {
                                while (thisRowObject.firstChild) {
                                    thisRowObject = datastore.readCache(thisRowObject.firstChild);
                                    var siblings = ((thisRowObject.siblings) && (typeof (thisRowObject.siblings) === 'function')) //->
                                        ? thisRowObject.siblings(true) : null;
                                    if (siblings !== null) {
                                        prevHop = (siblings.length === 0) ? thisRowObject.key : siblings[siblings.length -1];
                                        thisRowObject = datastore.readCache(prevHop);
                                    } else {
                                        prevHop = null;
                                    }
                                }
                            } else if (thisRowObject !== null) {
                                prevHop = thisRowObject.key;
                            }
                            return prevHop;
                        };
                        var thisPrev = ((against === '-') || ((against) && (rowObject[against]))) //->
                            ? (rowObject.prev !== null) //->
                                ? (rowObject.firstChild) //->
                                    ? findPrevHop(rowObject) //->
                                    : rowObject.prev //->
                                : rowObject.parentKey //->
                            : rowObject.prev;
                        // Generalize This Beyond view-tree (FindMe!!)
                        if (thisPrev !== null) {
                            if ((against) && (rowObject[against])) {
                                var thisPrevAgainst = datastore.readCache(thisPrev, fopts)[against];
                                retVal = (thisPrevAgainst === rowObject[against]);
                            } else {
                                retVal = true;
                            }
                        } else {
                            retVal = false;
                        }
                    } else { // Previous Component In Stack
                    }
                    break;
                case "canredo":
                    break;
                case "canundo":
                    break;
                case "cancommit":
                    break;
                default:
                    break;
            }
            return ((typeof (test) === 'string') && (/^(!|not-)/.test(test))) ? !retVal : retVal;
        /*
           NOTE: The opposite of any of the above tests can be accessed by prefixing the test name
                 with "not-" or "!"
        */
        };
        this.Tests = function(rowObject, tests, fopts) {
            var passFuncion, failFuncion;
            var passed = false; 
            var thisClosure = this;
            var thisRowObject = rowObject;
            var thisTests = tests;
            var thisOpts = fopts;
            var retFunction = function(){
                for (var cntTest = 0; cntTest < tests.length; cntTest ++) {
                    passed = Plastic.Test.call(thisClosure, thisRowObject, thisTests[cntTest], thisOpts);
                    if (!(passed)) { break; }; // One false is enough
                }
                if (passed) {
                    (typeof (passFuncion) === 'function') && passFuncion();
                } else {
                    (typeof (failFuncion) === 'function') && failFuncion();
                }
            };
            setTimeout(retFunction, 0);
            this.pass = function (thisFuncion) {
                _PlasticBug('PASS CALLED', 4, 'comment');
                passFuncion = thisFuncion;
                return this;
            };
            this.fail = function (thisFuncion) {
                _PlasticBug('FAIL CALLED', 4, 'comment');
                failFuncion = thisFuncion;
                return this;
            };
            return this;
        };
        var lossyFormUpdateTMO = {};
        this.LossyFormUpdate = function(e) {
            var thisEvent = e, self = this, form;
            e.stopPropagation();
            if (lossyFormUpdateTMO[e.target.id]) {
                clearTimeout(lossyFormUpdateTMO[e.target.id]);
                delete(lossyFormUpdateTMO[e.target.id]);
            }
            form = $(this).closest('.widget-form');
            lossyFormUpdateTMO[e.target.id] = //->
                setTimeout( function() { Plastic.FormUpdate.call(self, thisEvent, form) }, 300 );
            // Make ^ ^ Timeout Configurable?? (FindMe!!)
        };
        this.FormUpdate = function(e, form, fopts) {
            _PlasticBug('Plastic.FormUpdate(e); called', 4, 'function');
            e.stopPropagation();
            if (!form) { form = $(this).closest('.widget-form'); };
            var thisReplace = new RegExp('^' + form.attr('id') + '_');
            var key = $('#' + form.attr('id')).data('plastic-key');
            var source = ((form) && (form.length > 0) && (form[0].source) && (form[0].source.length > 0)) ? form[0].source[0] : undefined;
            var datastore = ((source) && (source.plasticopts) && (source.plasticopts.datastore)) //->
                ? source.plasticopts.datastore //->
                : ((form) && (form.length > 0) && (form[0].datastore)) //->
                    ? form[0].datastore //->
                    : undefined;
            var namespace = ((source) && (source.plasticopts) && (source.plasticopts.namespace)) //->
                ? source.plasticopts.namespace //->
                : ((source) && (source.namespace)) //->
                    ? source.namespace //->
                    : 'default';
            var path = ((form) && (form.length > 0) && (form[0].path)) ? form[0].path : undefined;
            var id = e.target.id;
            var dsid = id.replace(thisReplace, '');
            var value = (e.target.type === 'checkbox') ? e.target.checked //->
                : (e.target.type === 'number') ? parseFloat(e.target.value) : e.target.value;
            var thisds = _PlasticRuntime.datastore[datastore];
            var update = {};
            if (/^_GROUP__/.test(dsid)) { // Is Group Update??
                dsid = dsid.replace(/^_GROUP__/, '').replace(thisReplace, '');
                var thisIndex = dsid.replace(/^.*__/, '');
                dsid = dsid.replace(/__.*$/, '');
                var vHolder = value;
                value = {};
                value[thisIndex] = vHolder;
            }
            update[dsid] = value;
            if (!((e.type === 'keyup') && ($(e.target).prop('readonly')))) {
                // No Key-Up Changes Possible, Drop
                var retFunction = (source) ? source['plastic' + source.isplastic].rowsRead : function(rowObjects) {
                    var renderer = ((form) && (form.length > 0) && (form[0]));
                    renderer.update.call(renderer, [ { "datastore": datastore, "path": path }, rowObjects[1] ]);
                    _PlasticBug(this, 4, 'comment');
                };
                if ((fopts) && (fopts.item)) { update[dsid] = fopts.item.value; };
                thisds.updateRow(key, [ { "status" : "update", "id" : thisds.nextSequence() }, update ], //->
                    retFunction, { namespace: namespace });
                _PlasticBug('ID: ' + id + '(' + dsid + ')' + ' => ' + value, 4, 'comment');
                _PlasticBug('DATASTORE: ' + datastore + ' => ' + namespace, 4, 'comment');
            }
        };
        this.AutoComplete = function(input, retFunction) {
            _PlasticBug(this, 4, 'comment');
            var plastic = ((this.element) && (this.element.closest('.Plastic'))) ? this.element.closest('.Plastic') : null;
            var plasticopts = ((plastic) && (plastic.length) && (plastic[0].plasticopts)) ? plastic[0].plasticopts : null;
            var thisId = (plastic) ? this.element.attr('id').replace(new RegExp('^' + plastic.attr('id') + '_'), '') : null;
            var thisEmpty = [{ value: '[No Options Available]', 'class': 'plastic-autofill-empty' }];
            if ((plasticopts) && (plasticopts.fulfill) && (plasticopts.fulfill[thisId])) {
                var thisFulfill = plasticopts.fulfill[thisId];
                if (thisFulfill instanceof Array) {
                    retFunction((thisFulfill.length) ? thisFulfill : thisEmpty);
                } else if ((typeof (thisFulfill) === 'string') && //->
                    ($('#' + thisFulfill).length) && //->
                    ($('#' + thisFulfill)[0].fulfillList) && //->
                    (typeof ($('#' + thisFulfill)[0].fulfillList) === 'function')) {
                    var thisFulfillName = ((plasticopts.prettyNames) && (plasticopts.prettyNames[thisFulfill])) //->
                        ? plasticopts.prettyNames[thisFulfill] : thisFulfill;
                    thisEmpty[0].tooltip = 'Adjust available items in [' + thisFulfillName + '] to resolve';
                    var thisList = $('#' + thisFulfill)[0].fulfillList(this.term);
                    retFunction((thisList.length) ? thisList : thisEmpty);
                }
            } else {
                var tt = [];
                for (var cnt = 0; cnt < 200; cnt ++) {
                ///for (var cnt = 0; cnt < 10000; cnt ++) {
                    tt[tt.length] = '' + cnt;
                }
                retFunction(tt);
            }
        };
        this.SplitDown = function(e) {
                e.preventDefault();
                _PlasticBug('MOUSEDOWN', 4, 'comment');
                $('#plastic-split-wrap').css({ 'left': (e.pageX -100) + 'px', 'top': (e.pageY -100), 'z-index': '100000' });
                $('#plastic-split-wrap').data({ 'for' : $(this).attr('id'), 'direction': ($(e.target).hasClass('plastic-hsplit')) ? 'H' : 'V' });
        };
        this.SplitUp = function(e) {
            if (Plastic.SplitUpdate.call(this,$(this).data('direction'),e,$(this).data('for'))) {
                $(this).css({ 'left': (e.pageX -100) + 'px', 'top': (e.pageY -100), 'z-index': '-1' });
                $(this).removeData();
            }
        };
        this.SplitMove = function(e) {
            if (Plastic.SplitUpdate.call(this,$(this).data('direction'),e,$(this).data('for'))) {
                $(this).css({ 'left': (e.pageX -100) + 'px', 'top': (e.pageY -100) });
            }
        };
        this.SplitUpdate = function(d,e,f /* direction, event, for_target */ ) {
            var retVal = false;
            e.preventDefault();
            if (f !== undefined) {
                retVal = true;
                var splitter = $('#' + f);
                switch (d) {
                    case "H":
                        var thisOffset = e.pageX - splitter.offset().left;
                        var thisParent = splitter.parent();
                        var thisLeft = splitter.next();
                        thisParent.css('border-left-width', (parseInt(thisLeft.outerWidth() + splitter.outerWidth()) + thisOffset) + 'px');
                        thisLeft.outerWidth(thisLeft.outerWidth() + thisOffset);
                        break;
                    case "V":
                        var thisOffset = e.pageY - splitter.offset().top;
                        var thisParent = splitter.parent();
                        var thisLeft = splitter.next();
                        thisParent.css('border-top-width', (parseInt(thisLeft.outerHeight() + splitter.outerHeight()) + thisOffset) + 'px');
                        thisLeft.outerHeight(thisLeft.outerHeight() + thisOffset);
                        break;
                }
            }
            return retVal;
        };
        var cartState = {};
        this.CartUpdate = function() {
            var dirtyCount = this.dirtyCount();
            if (dirtyCount) {
                cartState[this.name] = dirtyCount;
                dirtyCount = 0;
            } else {
                delete (cartState[this.name]);
            }
            for (var thisDsName in cartState) {
                dirtyCount += cartState[thisDsName];
            }
            if (dirtyCount) { // Work on Internationalization (FindMe!!)
                dirtyCount += (dirtyCount === 1) ? ' item in cart' : ' items in cart';
                $('.plastic-system-cart').removeClass('plastic-system-cart-empty').attr('title', '[' + dirtyCount + '] Click to continue.');
            } else {
                $('.plastic-system-cart').addClass('plastic-system-cart-empty').attr('title', '[Empty]');
            }
        };
        var feedbackTMO = 0;
        var feedbackDecayTMO = {};
        this.FeedbackActivate = function(active, autoclose) {
            var command = ((autoclose) || (autoclose === undefined)) ? 'active' : 'active.noclose';
            if ((active) || (active === undefined)) {
                $('.plastic-system-feedback-frame').css({ 'display' : 'block' }).scrollTop(0);
                $('.plastic-system-feedback').animate({height: 400}, 400, 'swing', function(){
                    $('.plastic-system-feedback-control').css({ 'display' : 'block' });
                    $('.plastic-system-feedback').trigger(command);
                });
            } else {
                if (feedbackTMO) {
                    clearTimeout(feedbackTMO);
                    feedbackTMO = 0;
                }
                $('.plastic-system-feedback-control').css({ 'display' : 'none' });
                $('.plastic-system-feedback').animate({height: 0}, 400, 'swing', function(){
                    $('.plastic-system-feedback-frame').css({ 'display' : 'none' });
                    $('.plastic-system-feedback').trigger('inactive');
                });
            }
        };
        this.Feedback = function(message, type, key, name, fopts) {
            // Rework "name" logic to switch focus to error element (FindMe!!)
            var weight = { error: 5, warning: 4, question: 3, success: 2, information: 1, clear: 0 };
            var decayDefault = { error: 300, warning: 60, question: 0, success: 30, information: 15, clear: 0 };
            var dsname = (this.name) ? this.name : 'undefined';
            if (type === undefined) { type = "information"; };
            name = (name) ? name : 'undefined';
            key = (key) ? key : 'undefined';
            var decay = ((fopts) && (fopts.decay !== undefined)) ? fopts.decay : decayDefault[type]; // Seconds
            if (typeof (message) === 'string') { message = { name: message }; };
            var timestamp = (new Date()).toString();
            for (var thisIndex in message) {
                if ($('input[name=silenceall]').prop('checked')) {
                    if (!((fopts) && (fopts.breach))) {
                        _PlasticBug('Ignoring all messages: ' + message[thisIndex], 4, 'comment');
                        continue;
                    }
                } else if (($('input[name=silence' + type + ']').length) && //->
                    ($('input[name=silence' + type + ']').prop('checked'))) {
                    if (!((fopts) && (fopts.breach))) {
                        _PlasticBug('Ignoring ' + type + ' messages: ' + message[thisIndex], 4, 'comment');
                        continue;
                    }
                }
                var thisId = ((fopts) && (fopts.identifier)) //->
                    ? fopts.identifier //->
                    : 'PDMKFB_' + dsname + '_' + key.replace(/[^A-Z0-9]/ig, '_') + '_' + //->
                    name.replace(/[^A-Z0-9]/i, '_') + '_' + type + thisIndex;
                if (feedbackDecayTMO[thisId]) {
                    clearTimeout(feedbackDecayTMO[thisId]);
                    delete(feedbackDecayTMO[thisId]);
                }
                if ($('#' + thisId).length) { $('#' + thisId).remove(); };
                // Remember to only present the highest weight icon of messages (FindMe!!)
                $('.plastic-system-feedback-icontab').html('<img style="width:100%;height:100%;" src="' + //->
                    _PlasticRuntime.imgbase + 'plastic-' + type + '.png" />');
                $('.plastic-system-feedback-icontab').addClass('plastic-system-feedback-waiting');
                $('.plastic-system-feedback-frame') //->
                    .prepend($('<div class="plastic-system-feedback-message plastic-system-feedback-' + type + '" ' + //->
                    'id="' + thisId + '" title="Click to confirm and remove this message">' + //->
                    '<div class="plastic-system-feedback-timestamp">' + timestamp + '</div>' + //->
                    '<img class="plastic-message-icon-medium" src="' + _PlasticRuntime.imgbase + //->
                    'plastic-' + type + '.png" />' + //->
                    message[thisIndex].replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;') + '</div>'));
                if (type === 'question') { // Add option values for question
                    var thisButtonBar = '<div class="plastic-system-feedback-buttonbar">';
                    if ((fopts) && (fopts.buttons)) {
                        for (var thisButton = 0; thisButton < fopts.buttons.length; thisButton ++) {
                            thisButtonBar += '<button title="Click to answer \'' + fopts.buttons[thisButton] + '\'">' + //->
                                fopts.buttons[thisButton] + '</button>';
                        }
                    }
                    thisButtonBar += '</div>';
                    $('#' + thisId).append($(thisButtonBar));
                    $('#' + thisId).find('.plastic-system-feedback-buttonbar button').button();
                }
                if ((weight[type] >= 2) && (!($('input[name=icononly]').prop('checked')))) {
                    Plastic.FeedbackActivate(true);
                } else {
                    var throb = { big: { height: 48, width: 48 }, small: { height: 24, width: 24 } };
                    if (($('.plastic-system-feedback-icontab').hasClass('plastic-system-feedback-bottomleft')) || //->
                        ($('.plastic-system-feedback-icontab').hasClass('plastic-system-feedback-bottomright'))) {
                        throb.big.top   = -52;
                        throb.small.top = -28;
                    } else {
                        throb.big.bottom   = -52;
                        throb.small.bottom = -28;
                    }
                    if (!($('.plastic-system-feedback-icontab').hasClass('plastic-system-feedback-icontab-throbbing'))) {
                        $('.plastic-system-feedback-icontab').addClass('plastic-system-feedback-icontab-throbbing');
                        $('.plastic-system-feedback-icontab').animate(throb.big, 600, function(){
                            $('.plastic-system-feedback-icontab').animate(throb.small);
                            $('.plastic-system-feedback-icontab').removeClass('plastic-system-feedback-icontab-throbbing');
                        });
                    }
                }
                if (decay) {
                    feedbackDecayTMO[thisId] = setTimeout(function(){
                        $('#' + thisId).click(); // Remove Message
                    }, (decay * 1000) );
                }
            }
        };
        this.ResizeHandler = function() {
            _PlasticBug("Plastic.ResizeHandler(); called", 4, 'handler');
            var parentDims = {};
            if (_PlasticRuntime.root === "body") {
                // Try body-width in trigger (FindMe!!)
                parentDims = {
                    width: $(window).width() - (parseInt($('body').css('margin-left')) + parseInt($('body').css('margin-right')))
                   ,height: $(window).height() - (parseInt($('body').css('margin-top')) + parseInt($('body').css('margin-bottom')))
                };
                $('body').css(parentDims);
            }
            $('.plastic-pliable:visible', $(_PlasticRuntime.root)).each(function(){
                if (($(this).hasClass('plastic-width-auto')) || ($(this).hasClass('plastic-height-auto'))) {
                    $(this).resize();
                }
            });
            for (var node in _PlasticRuntime.inventory) {
                //$('#' + node).trigger('resize', parentDims);
                _PlasticBug('Plastic.ResizeHandler: #' + node, 4, 'comment');
                break;
            }
            $('.Plastic').removeClass('pre-init');
            $('.plastic-loading').removeClass('plastic-loading');
        };
        this.VarExpand = function(str, rowObject) {
            _PlasticBug('Plastic.VarExpand(str, rowObject); called:', 5, 'function');
            var retVal = str;
            var context = this;
            var toReplace = function(name){
                var replaceOnly;
                _PlasticBug('REGEX_NAME: ' + name, 5, 'comment');
                if (rowObject) {
                    // Re-Evaluate this Test and Replacement?? (FindMe!!)
                    if (/^[^ \}]+!/.test(name)) { // "Replacement-Only" Found
                        replaceOnly = name.replace(/^[^ \}]+!/, '');
                        name = name.replace(/!.*$/, '');
                    }
                    if ((/^:[^:]+:$/.test(name)) && (context) && (context.length) && //->
                        (context[0][name.replace(/^:|:$/g, '')]) && //->
                        (typeof (context[0][name.replace(/^:|:$/g, '')]) === 'string')) {
                        _PlasticBug('FOUND SPECIAL: ' + name, 5, 'comment');
                        return (replaceOnly !== undefined) ? '' : context[0][name.replace(/^:|:$/g, '')];
                    } else if ((rowObject['attributes'] !== undefined) && (rowObject['attributes'][name] !== undefined)) {
                        _PlasticBug('FOUND ATTR: ' + name, 5, 'comment');
                        return (replaceOnly !== undefined) ? '' : rowObject['attributes'][name];
                    } else if (rowObject[name] !== undefined) {
                        _PlasticBug('FOUND NAME: ' + name, 5, 'comment');
                        return (replaceOnly !== undefined) ? '' : rowObject[name];
                    } else if (replaceOnly !== undefined) {
                        return replaceOnly;
                    }
                }
                _PlasticBug('FOUND NOMATCH: ' + name, 5, 'comment');
                return '';
            };
            _PlasticBug('STRING_IN: ' + retVal, 5, 'comment');
            while (/%\{([^\{\}]+)\}/.test(retVal)) {
                _PlasticBug('PATTERN_MATCH: ' + retVal, 5, 'comment');
                retVal = retVal.replace(/%\{([^\{\}]+)\}/g, function(m,name){ return toReplace(name); });
                ///break; // Set Max Recursion Here?? (FindMe!!)
            }
            _PlasticBug('STRING_OUT: ' + retVal, 5, 'comment');
            return retVal;
        };
        this.Init = function() {
            /* NOTE: Even though this object (_PlasticRuntime) is used by many components internally,
                     it should not be leveraged by other modules or plugins as it is unsupported
                     and may change between releases without notice.
            */
            if (_PlasticRuntime.datastore === undefined) { _PlasticRuntime.datastore = {}; };
            if (_PlasticRuntime.inventory === undefined) { _PlasticRuntime.inventory = {}; };
            if (_PlasticRuntime.domnode === undefined) { _PlasticRuntime.domnode = {}; };
            if (_PlasticRuntime.todostack === undefined) { _PlasticRuntime.todostack = [ 0 ]; };
            if (_PlasticRuntime.system === undefined) { _PlasticRuntime.system = {}; };
            if (_PlasticRuntime.isInitialized === undefined) {
                var plasticInitializer = function() {
                    // Make sure more generalized than 'body' (FindMe!!)
                    $('body').addClass('plastic-loading');
                    //////////try {
                        ////////Plastic.BuildPlaybook({ Plastic_Main: { type: 'stack-stack', children: { _PlasticRuntime.playbook }}}, 'body');
                        Plastic.BuildPlaybook(_PlasticRuntime.playbook, 'body');
                        // Make Stack Hierarchy Visible and Flagged As "plastic-stack-active"
                        // Make sure this handler Does_Not_Call e.stopPropagation() or e.preventDefault()
                        $('.Plastic').on('activate.plastic', { active: 50 }, function(e, stack){
                            if (!((stack) && (stack.start !== undefined))) { stack = { start: 50 } };
                       //     if (e.target === this) { // Initial Target
                                var prevActive = $(this).data('plastic-active');
                                $(this).parents('.Plastic:first').children('.Plastic') //->
                                    .removeData('plastic-active') //->
                                    .removeClass('plastic-stack-active') //->
                                    .filter('.plastic-stack-child') //->
                                    .not('.plastic-visible-inactive').addClass('plastic-stack-hidden');
                                $(this).data('plastic-active', //->
                                    (prevActive !== undefined) ? prevActive : stack.start--) //->
                                    .addClass('plastic-stack-active');
                       //     } else { // Ancestors (Event Bubble)
                       //     }
                            if ((e.target !== this) && (this.activate) && (typeof (this.activate) === 'function')) {
                                ////e.stopPropagation();
                                this.activate(e.target, { active: prevActive });
                            }
                        });
                        $(_PlasticRuntime.root).on('contextmenu', '.ui-widget-overlay', function(e){
                            if (this === e.target) {
                                e.preventDefault();
                            }
                        });
                        $(_PlasticRuntime.root).on('click', 'span[activate]', function(){
                            // Make "activate" feature more flexible?? (FindMe!!)
                            var activate = $(this).attr('activate');
                            var closest = $(this).closest('.Plastic');
                            var caller = $(closest).data('plastic-key');
                            var source = ((closest) && (closest.length) && (closest[0].source)) ? closest[0].source : null;
                            $(source).trigger('rowactivate.plastic', { key: activate, caller: caller });
                        });
                        if (_PlasticRuntime.system.cart === undefined) {
                            _PlasticRuntime.system.cart = $('<div class="plastic-system-cart plastic-system-cart-empty" ' + //->
                                'id="PlasticDefaultSysCart" title="[Empty]"><span class="ui-icon ui-icon-cart" /></div>');
                            $(_PlasticRuntime.root).append(_PlasticRuntime.system.cart);
                            $('.plastic-system-cart-icontab, .plastic-system-cart') //->
                                .addClass('plastic-system-cart-topright');
                        }
                        _PlasticRuntime.system.cart.on('click', function(){
                            if (!($(this).hasClass('plastic-system-cart-empty'))) {
                                _PlasticRuntime.system.cart.list = $('<div class="plastic-system-cart-list" ">');
                                $(_PlasticRuntime.root).prepend(_PlasticRuntime.system.cart.list);
                                var cntItemGroup = 0;
                                var testCART = '<button onClick="$(this).parent().remove();">Del</button>';
                                testCART += '<button class="plastic-actionable" plastic-action="commitall">Save All</button>';
                                for (var thisDatastore in _PlasticRuntime.datastore) {
                                    if (_PlasticRuntime.datastore[thisDatastore].dirtyCount()) {
                                        var prettyNames = _PlasticRuntime.datastore[thisDatastore].option('prettyNames');
                                        testCART += '<div class="plastic-commitgroup-wrap">';
                                        testCART += '<label class="plastic-commitgroup-datastore"><b>Item Category:</b> ' + thisDatastore + '</label>';
                                        var thisDirtyList = _PlasticRuntime.datastore[thisDatastore].dirtyList();
                                        for (var cntDirty = 0; cntDirty < thisDirtyList.length; cntDirty ++) {
                                            cntItemGroup ++;
                                            testCART += '<fieldset class="plastic-field-group">' + //->
                                                '<legend class="plastic-field-group-legend">' + //->
                                                '  <input class="plastic-commitgroup-include" type="checkbox" ' + //->
                                                '      name="_Plastic_Commit__' + cntItemGroup + '" ' + //->
                                                '      id="_Plastic_Commit__' + cntItemGroup + '" checked>' + //->
                                                '  <label for="_Plastic_Commit__' + cntItemGroup + '" ' + //->
                                                '      class="plastic-legend-label">Include These Items (Set #' + cntItemGroup + ')?</label>' + //->
                                                '  <button class="plastic-actionable" plastic-action="commit">Save Now</button>' + //->
                                                '</legend>' + //->
                                                '<div class="plastic-commitgroup">';
                                            for (var thisDirty in thisDirtyList[cntDirty]) {
                                                if (JSON.stringify(thisDirtyList[cntDirty][thisDirty][0]) === undefined) {
                                                    _PlasticBug('UNDEFINED: ' + thisDirty + ' => ' + thisDirtyList[cntDirty][thisDirty][0], 2);
                                                } else {
                                                    var dateFormat = (_PlasticRuntime.datastore[thisDatastore]) //->
                                                        ? _PlasticRuntime.datastore[thisDatastore].option('dateFormat') //->
                                                        : 'yy-mm-dd';
                                                    var thisDirtyObj = thisDirtyList[cntDirty][thisDirty][0];
                                                    var thisCacheObj = thisDirtyList[cntDirty][thisDirty][1];
                                                    for (var thisItem in thisDirtyObj) {
                                                        var title = (thisDirtyObj[thisItem].qualifiedTitle) //->
                                                            ? thisDirtyObj[thisItem].qualifiedTitle : thisCacheObj[thisItem].qualifiedTitle;
                                                        if (thisDirtyObj[thisItem].deleted) {
                                                            testCART += '<div class="plastic-commitgroup-title">' + //->
                                                                'Deleted Item: <span class="plastic-deleted">' + title + '</span></div>';
                                                        } else {
                                                            if ((thisCacheObj[thisItem].isolated) || (thisDirtyObj[thisItem].isolated)) {
                                                                testCART += '<div class="plastic-commitgroup-title">New Item: ' + title + '</div>';
                                                            } else {
                                                                testCART += '<div class="plastic-commitgroup-title">Item: ' + title + '</div>';
                                                            }
                                                            testCART += '<table><tr><th>Selection Name</th><th>Original Value</th><th>New Value</th></tr>';
                                                            for (var thisChange in thisDirtyObj[thisItem].attributes) {
                                                                var thisLabel = ((prettyNames) && (prettyNames[thisChange])) //->
                                                                    ? prettyNames[thisChange] : thisChange;
                                                                var thisBefore = (thisDirtyObj[thisItem].attributes[thisChange] instanceof Date) //->
                                                                    ? $.datepicker.formatDate(dateFormat, thisCacheObj[thisItem].attributes[thisChange]) //->
                                                                    : thisCacheObj[thisItem].attributes[thisChange];
                                                                var thisAfter = (thisDirtyObj[thisItem].attributes[thisChange] instanceof Date) //->
                                                                    ? $.datepicker.formatDate(dateFormat, thisDirtyObj[thisItem].attributes[thisChange]) //->
                                                                    : thisDirtyObj[thisItem].attributes[thisChange];
                                                                if (thisAfter instanceof Object) {
                                                                    if (thisBefore === undefined) { thisBefore = {}; };
                                                                    for (var groupEl in thisAfter) {
                                                                        testCART += '<tr class="plastic-commitgroup-item">' + //->
                                                                            '<td class="plastic-commitgroup-item-name">' + thisLabel + '[' + groupEl  + ']:</td>' + //->
                                                                            '<td class="plastic-commitgroup-item-before">' + thisBefore[groupEl] + '</td>' + //->
                                                                            '<td class="plastic-commitgroup-item-after">' + thisAfter[groupEl] + '</td></tr>';
                                                                    }
                                                                } else {
                                                                    testCART += '<tr class="plastic-commitgroup-item">' + //->
                                                                        '<td class="plastic-commitgroup-item-name">' + thisLabel + ':</td>' + //->
                                                                        '<td class="plastic-commitgroup-item-before">' + thisBefore + '</td>' + //->
                                                                        '<td class="plastic-commitgroup-item-after">' + thisAfter + '</td></tr>';
                                                                }
                                                            }
                                                            for (var thisChange in thisDirtyObj[thisItem]) {
                                                                if ((thisChange !== undefined) && (thisChange !== 'attributes')) {
                                                                    var thisLabel = ((prettyNames) && (prettyNames[thisChange])) //->
                                                                        ? prettyNames[thisChange] : thisChange;
                                                                    var thisBefore = thisCacheObj[thisItem][thisChange];
                                                                    var thisAfter = thisDirtyObj[thisItem][thisChange];
                                                                    testCART += '<tr class="plastic-commitgroup-item">' + //->
                                                                        '<td class="plastic-commitgroup-item-name">' + thisLabel + ':</td>' + //->
                                                                        '<td class="plastic-commitgroup-item-before">' + thisBefore + '</td>' + //->
                                                                        '<td class="plastic-commitgroup-item-after">' + thisAfter + '</td></tr>';
                                                                }
                                                            }
                                                            testCART += '</table>';
                                                        }
                                                    }
                                                }
                                            }
                                            testCART += '</div></fieldset>';
                                        }
                                        testCART += '</div>';
                                    }
                                }
                                _PlasticRuntime.system.cart.list.html(testCART);
                                $('.plastic-commitgroup-wrap button').button();
                            }
                        });
                        // Add default SysFeedback Component if not defined in Playbook
                        if (_PlasticRuntime.system.feedback === undefined) {
                            _PlasticRuntime.system.feedback = $('<div class="plastic-system-feedback" ' + //->
                                'id="PlasticDefaultSysFeedback"><div class="plastic-system-feedback-control">Silence...&nbsp;' + //->
                                '<span title="Check to silence all messages">' + //->
                                '<label for="silenceall">All</label><input type="checkbox" name="silenceall"></span>' + //->
                                '<span title="Check to silence error messages">' + //->
                                '<label for="silenceerror">Errors</label><input type="checkbox" name="silenceerror"></span>' + //->
                                '<span title="Check to silence warning messages">' + //->
                                '<label for="silencewarning">Warnings</label><input type="checkbox" name="silencewarning"></span>' + //->
                                '<span title="Check to silence question messages">' + //->
                                '<label for="silencequestion">Questions</label><input type="checkbox" name="silencequestion"></span>' + //->
                                '<span title="Check to silence information messages">' + //->
                                '<label for="silenceinformation">Information</label><input type="checkbox" name="silenceinformation"></span>' + //->
                                '<span title="Check to silence success messages">' + //->
                                '<label for="silencesuccess">Success</label><input type="checkbox" name="silencesuccess"></span>' + //->
                                '<span title="Check to display messages as icon indicator only">' + //->
                                '<label for="icononly">Icon only?</label><input type="checkbox" name="icononly" checked></span>' + //->
                                '<span title="Check to confirm and remove all messages">' + //->
                                '<label for="confirmall">Confirm All</label><input type="checkbox" name="confirmall"></span>' + //->
                                '</div><div class="plastic-system-feedback-icontab" ' + //->
                                'title="Click to view waiting messages" />' + //->
                                '<div class="plastic-system-feedback-frame" /></div>');
                            $(_PlasticRuntime.root).append(_PlasticRuntime.system.feedback);
                            $('.plastic-system-feedback-icontab, .plastic-system-feedback') //->
                                .addClass('plastic-system-feedback-bottomright');
                        }
                        if (_PlasticRuntime.system.commitpane === undefined) {
                            var commitTM0 = 0, commitClasses = [ 'apng-level0' //->
                               ,'apng-level1', 'apng-level2', 'apng-level3', 'apng-level4', 'apng-level5'
                               ,'apng-level6', 'apng-level7', 'apng-level8', 'apng-level9', 'apng-level10'
                               ,'apng-level11', 'apng-level12', 'apng-level13', 'apng-level14', 'apng-level15'
                            ];
                            $.each(['show', 'hide'], function(index, name){ // Add triggers for show and hide
                                var origFunction = $.fn[name];
                                $.fn[name] = function(speed) {
                                    return origFunction.apply(this, arguments).trigger(name + '.plastic');
                                };
                            });
                            _PlasticRuntime.system.commitpane = $('<div class="plastic-commit-pane"><em>Please Wait...</em></div>');
                            $(_PlasticRuntime.root).append(_PlasticRuntime.system.commitpane);
                            var commitActive = function(){
                                if (commitTM0) { clearTimeout(commitTM0); commitTM0 = 0; };
                                commitClasses.push(commitClasses.shift()); // Revolve Classes
                                _PlasticRuntime.system.commitpane //->
                                    .removeClass(commitClasses.slice(0, commitClasses.length -1).join(' ')) //->
                                    .addClass(commitClasses[commitClasses.length -1]);
                                if (_PlasticRuntime.system.commitpane.is(':visible')) { setTimeout(commitActive, 100); };
                            };
                            _PlasticRuntime.system.commitpane.on('show.plastic', commitActive);
                        }
                        $(_PlasticRuntime.root).on('keyup', function(e){
                            if ((e.shiftKey) && (e.ctrlKey) && (e.keyCode == 70)) { // [Ctrl]-[Shift]-F
                                Plastic.FeedbackActivate(!($('.plastic-system-feedback').hasClass('plastic-system-feedback-active')), false);
                            }
                        });
                        $(_PlasticRuntime.root).on('mouseout', '.plastic-system-feedback-frame, .plastic-system-feedback-control', function(e){
                            if ((feedbackTMO) && (feedbackTMO < 0)) {
                                feedbackTMO = 0;
                                feedbackTMO = setTimeout(function(){ Plastic.FeedbackActivate(false); }, 1500);
                            }
                        });
                        $(_PlasticRuntime.root).on('mouseover mousemove', '.plastic-system-feedback-frame, .plastic-system-feedback-control', function(e){
                            if ((feedbackTMO) && (feedbackTMO > 0)) {
                                clearTimeout(feedbackTMO);
                                feedbackTMO = -feedbackTMO;
                            }
                        });
                        $(_PlasticRuntime.root).on('click', '.plastic-system-feedback-message', function(){
                            if (!($(this).hasClass('plastic-system-feedback-question'))) { // Questions Must Be Answered
                                var decayId = $(this).attr('id');
                                if (feedbackDecayTMO[decayId]) {
                                    clearTimeout(feedbackDecayTMO[decayId]);
                                    delete(feedbackDecayTMO[decayId]);
                                }
                                $(this).animate({ height: 0 }, function(){
                                    $(this).remove();
                                    if (!($('.plastic-system-feedback-message').length)) {
                                        $('.plastic-system-feedback-icontab').removeClass('plastic-system-feedback-waiting');
                                        Plastic.FeedbackActivate(false);
                                    }
                                });
                            }
                        });
                        $(_PlasticRuntime.root).on('click', '.plastic-system-feedback-icontab', function(){
                            Plastic.FeedbackActivate(true);
                        });
                        $(_PlasticRuntime.root).on('click', '.plastic-system-feedback-control span input', function(e){
                            if (!(e.originalEvent)) {
                                e.preventDefault();
                                $(this).prop('checked', (!($(this).prop('checked'))));
                            }
                            if ((e.target.name) && (e.target.name === "confirmall")) {
                                $(this).prop('checked', false);
                                $('.plastic-system-feedback-message:not(.plastic-system-feedback-question)').each(function(){
                                    var decayId = $(this).attr('id');
                                    if (feedbackDecayTMO[decayId]) {
                                        clearTimeout(feedbackDecayTMO[decayId]);
                                        delete(feedbackDecayTMO[decayId]);
                                    }
                                });
                                $('.plastic-system-feedback-message:not(.plastic-system-feedback-question)').fadeOut(400, function(){
                                    _PlasticBug(this, 4, 'function');
                                    $('.plastic-system-feedback-message').remove();
                                    $('.plastic-system-feedback-icontab').removeClass('plastic-system-feedback-waiting');
                                    Plastic.FeedbackActivate(false);
                                });
                            }
                        });
                        $(_PlasticRuntime.root).on('click', '.plastic-system-feedback-control span', function(e){
                            if (e.target.nodeName !== 'INPUT') {
                                $(this).find('input').trigger('click');
                            }
                        });
                        $(_PlasticRuntime.root).on('active.noclose', '.plastic-system-feedback', function(e){
                            // Do Something Here
                            $('.plastic-system-feedback').addClass('plastic-system-feedback-active');
                        });
                        $(_PlasticRuntime.root).on('active', '.plastic-system-feedback', function(e){
                            $('.plastic-system-feedback').addClass('plastic-system-feedback-active');
                            if (feedbackTMO) { clearTimeout(feedbackTMO); };
                            feedbackTMO = setTimeout(function(){ Plastic.FeedbackActivate(false); }, 5000); // Make configurable?? (FindMe!!)
                        });
                        $(_PlasticRuntime.root).on('inactive', '.plastic-system-feedback', function(e){
                            $('.plastic-system-feedback').removeClass('plastic-system-feedback-active');
                        });
                        ///Plastic.BuildPlaybook.call(_PlasticRuntime.playbook, 'body');
                        // Default "About" Menu Item
                    /*
                            $.contextMenu({
                            selector: 'body'
                           ///,ignore: 'plastic-field-data'
                           ,ignore: '.plastic-field-data:not([type=checkbox])'
                           ,build: function($trigger, e) {
                                return {
                                    callback: function(key, options) {
                                        // Do Something Cool Here!!
                                    }
                                   ,items: {
                                         PlasticAbout: { name: 'About: Plastic-Data Modeling Kit (PDMK)', icon: 'about' }
                                    }
                                };
                            }
                        });
                    */
                        // Bind Iframe Sizer Events To Plastic.SizeFrame (Move Somewhere Else?? [FindMe!!])
                        $('.stack-tab-sizer').each(function(){
                            var thisComponent = this;
                            var thisResizer = $(this).find('.stack-tab-sizeframe')[0];
                            (thisResizer.contentWindow || thisResizer).onresize = function(e) { Plastic.SizeFrame.call(thisComponent, e); };
                            Plastic.SizeFrame.call(thisComponent);
                        });
                        // Register handler for window resize event (FindMe!!)
                        $(window).resize(Plastic.ResizeHandler);
                        setTimeout( Plastic.ResizeHandler, 1000);
                        // Load throbbers for all plastic-stack-status of plastic-views (More Intuitive)
                        $('.plastic-view').each(function(){
                            var thisId = $(this).attr('id');
                            $('a.plastic-stack-status[href=#' + thisId + ']').addClass('plastic-component-loading');
                        });
                        $('.Plastic', _PlasticRuntime.root).trigger('initialize.plastic'); // Initialize Components
                        var isReady = function(){ // Poll for zero "plastic-loading" elements
                            if ($('.plastic-loading').length) {
                                setTimeout(isReady, 300); // Try again in 300ms
                            } else {
                                $.each(readyStack, function(index, retFunction){ // Make This Cooler?? (FindMe!!)
                                    if ((retFunction) && (retFunction.length > 1) && //->
                                        (typeof (retFunction[1]) === 'function')) {
                                        retFunction[1].call(retFunction[0]);
                                    }
                                });
                            }
                        };
                        setTimeout(isReady, 0); // Launch Plastic.ready() requests
                    ///} catch (e) {
                    ///    alert (e.message);
                    ///}
                };
                var reinitTMO, reinitializer = function() {
                    if (_PlasticRuntime.playbook !== undefined) {
                        plasticInitializer();
                    } else {
                        _PlasticBug.call(this, "No plastic playbook has been defined, polling.", 3);
                        _PlasticBug("No plastic playbook has been defined, polling.", undefined, undefined, 'info');
                        reinitTMO = setTimeout(reinitializer, 300); // Try again in short while
                    }
                };
                reinitTMO = setTimeout(reinitializer, 0);
            } else {
                throw new Error("Plastic already initialized");
            }
        };
    };
})(window, jQuery);

jQuery(window).load(function(){
    Plastic.Init();
});

