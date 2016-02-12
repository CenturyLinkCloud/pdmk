//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/
/ Program: "PlasticDatastore.js" => Plastic Data Modeling Kit [pdmk]
/                                   Datastore Object Support
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
/* PlasticDatastore Object Definition */

/*
   Synthesized DataStore Types:
      * Array:          Creates Simple Datastore From Array
      * Augment:        Secondary Datastore which is fetched Upon-Access to Primary
                        (Requires DataStore Relationships)
      * Function:       Similar to Query except DataStore backed by mathmatical
                        or programatic function
      * Hybrid:         Virtualizes 2 or More Datastore Objects as Single DataStore
                        (Requires DataStore Relationships)
      * Query:          Creates Temporary Datastore Based on Variables (Will be 
                        re-created even with identical query)
      * Scratch:        Creates unique Datastore which will be destroyed when no longer required
*/

var _cache;
function PlasticDatastore(name, fopts) {
    var self = this;
    self.name = (name) ? name : 'unnamed';
    var data = ((fopts) && (fopts.data)) ? fopts.data : null;
    var sequence = 0;
    var cache = {};
    var dirty = {};
    var _dirtyCount;
    var error = {};
    var sorted = {};
    //dirty['D63E5D17-1044-3DA0-B950-2B63B892D421'] = { dirty : true };
    var flags = {};
    var cacheSize = 0;
    var lru = [null, null];
    var rootNodeKey = null;
    var parent = null;
    var _commitDefaults = { crud: [ 'c', 'r', 'u', 'd' ] };
    var _fullColumns = 'parentKey,key,title,qualifiedTitle,tooltip,type,deleted,dirty,disabled,error,hidden,isolated,next,prev';
    var _dsKeys = [ 'actions', 'ancestorFlag', 'attributes', 'deleted', //->
                    'dirty', 'disabled', 'selected', 'error', 'firstChild', 'isolated', 'lastChild', 'key', //->
                    'next', 'parentKey', 'prev', 'qualifiedTitle', 'sortIndex', 'title', //->
                    'tooltip', 'type', 'hidden' ];
    var _dsIgnore = { actions: 1, parent: 1, children: 1, siblings: 1, ancestorFlag: 1, sortIndex: 1, next: 1, prev: 1, firstChild: 1, lastChild: 1 };
    var _noSecurityContext = null;
    var _securityContext = {};
    var opts = {
        "default": { m_currentIndex: 0 }
       ,rowDefault: null
       ,augment: null
       ,dateFormat : 'yy-mm-dd'
       ,commit: _commitDefaults
       ,attributes : _fullColumns
       ,selected: _fullColumns
       ,securityContext: _noSecurityContext
       ,rootAnchor: null
       ,rootTitle: 'Root'
       ,rootRowObject: null
       ,anchor: 'left'
       ,delimiter: '/'
       ,trimDelimiter: false
       ,includeRoot: false
    };
    var views = { "default" : [] }; // Bound framework views
    this.option = function _PlasticDatastore_option(name, value) {
        var retVal;
        if (typeof (name) === 'string') {
            if (arguments.length === 1) {
                switch (name) {
                    case "securityContext":
                        retVal = (opts[name] !== undefined) ? JSON.parse(opts[name]) : undefined;
                        break;
                    case "rowDefault":
                        if (opts[name] !== undefined) {
                            retVal = (typeof(opts[name]) === 'function') ? opts[name].call(self) : opts[name];
                        } else {
                            retVal = undefined;
                        }
                        break;
                    default:
                        retVal = (opts[name] !== undefined) ? opts[name] : undefined;
                        break;
                }
            } else {
                switch (name) {
                    case "type":
                        switch (value) {
                            case undefined:
                                break;
                            case "array":
                                rootNodeKey = (opts.rootRowObject) //->
                                    ? opts.rootRowObject.key //->
                                    : (rootNodeKey) //->
                                        ? rootNodeKey //->
                                        : "_FAUXROOT_";
                                // Build Root rowObject
                                if (opts.rootRowObject) { // Pull in from Data
                                    var baseRowObject = {
                                        parentKey: null //->
                                       ,type: 'root' //->
                                       ,prev: null //->
                                       ,next: null //->
                                       ,children: null //->
                                       ,firstChild: null //->
                                       ,actions: null //->
                                       ,ancestorFlag: self._ancestorFlag //->
                                       ,parent: self._parent //->
                                       ,siblings: self._siblings //->
                                       ,dirty: null //->
                                       ,error: null //->
                                       ,deleted: null //->
                                       ,disabled: false //->
                                       ,selected: null //->
                                       ,hidden: null //->
                                       ,isolated: null //->
                                       ,sortIndex: {} //->
                                    };
                                    cache[rootNodeKey] = $.extend({}, baseRowObject, //->
                                        {qualifiedTitle: opts.rootRowObject.title}, opts.rootRowObject, {
                                        attributes: $.extend({}, self.option('rowDefault'), opts.rootRowObject.attributes)
                                    });
                                } else { // Generate rootRowObject
                                    cache[rootNodeKey] = { //->
                                        key: rootNodeKey //->
                                       ,parentKey: null //->
                                       ,title: opts.rootTitle //->
                                       ,qualifiedTitle: (opts.includeRoot === false) //->
                                            ? opts.delimiter //->
                                            : (opts.anchor === 'left') //->
                                                ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                                       ,tooltip: (opts.includeRoot == false) //->
                                            ? opts.delimiter //->
                                            : (opts.anchor === 'left') //->
                                                ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                                       ,type: 'root' //->
                                       ,prev: null //->
                                       ,next: null //->
                                       ,children: null //->
                                       ,firstChild: null //->
                                       ,actions: null //->
                                       ,ancestorFlag: self._ancestorFlag //->
                                       ,parent: self._parent //->
                                       ,siblings: self._siblings //->
                                       ,dirty: null //->
                                       ,error: null //->
                                       ,deleted: null //->
                                       ,disabled: false //->
                                       ,selected: null //->
                                       ,hidden: null //->
                                       ,isolated: null //->
                                       ,sortIndex: {} //->
                                       ,attributes: $.extend({}, self.option('rowDefault')) //->
                                    };
                                }
                                var procRow = function(thisData, parentKey) {
                                    var prevKey = null;
                                    var pQualifiedTitle = (cache[parentKey].qualifiedTitle === opts.delimiter) //->
                                        ? '' : cache[parentKey].qualifiedTitle;
                                    for (var thisElem = 0; thisElem < thisData.length; thisElem ++) {
                                        if (thisData[thisElem] instanceof Array) {
                                            procRow(thisData[thisElem], prevKey);
                                        } else {
                                            var thisRowObject = {
                                                key: (thisData[thisElem].key !== undefined) //->
                                                    ? thisData[thisElem].key //->
                                                    : (opts.anchor === 'left') //->
                                                        ? parentKey + opts.delimiter + thisData[thisElem] //->
                                                        : thisData[thisElem] + opts.delimiter + parentKey //->
                                               ,parentKey: parentKey //->
                                               ,title: thisData[thisElem] //->
                                               ,qualifiedTitle: (opts.anchor === 'left') //->
                                                    ? pQualifiedTitle + opts.delimiter + thisData[thisElem] //->
                                                    : thisData[thisElem] + opts.delimiter + pQualifiedTitle //->
                                               ,tooltip: (opts.anchor === 'left') //->
                                                    ? pQualifiedTitle + opts.delimiter + thisData[thisElem] //->
                                                    : thisData[thisElem] + opts.delimiter + pQualifiedTitle //->
                                               ,type: 'folder' //->
                                               ,prev: prevKey //->
                                               ,next: null //->
                                               ,children: null //->
                                               ,firstChild: null //->
                                               ,actions: null //->
                                               ,ancestorFlag: self._ancestorFlag //->
                                               ,parent: self._parent //->
                                               ,siblings: self._siblings //->
                                               ,dirty: null //->
                                               ,error: null //->
                                               ,deleted: null //->
                                               ,disabled: false //->
                                               ,selected: null //->
                                               ,hidden: null //->
                                               ,isolated: null //->
                                               ,sortIndex: {} //->
                                               ,attributes: $.extend({}, self.option('rowDefault')) //->
                                            };
                                            if (typeof(thisData[thisElem]) === 'object') {
                                                var attributes = thisData[thisElem].attributes;
                                                if (thisData[thisElem].title === undefined) {
                                                    throw new Error('Missing required object key \'title\'.');
                                                } else {
                                                    thisRowObject.key = (thisData[thisElem].key !== undefined) //->
                                                        ? thisData[thisElem].key //->
                                                        : (opts.anchor === 'left') //->
                                                            ? parentKey + opts.delimiter + thisData[thisElem].title //->
                                                            : thisData[thisElem].title + opts.delimiter + parentKey;
                                                    thisRowObject.title = thisData[thisElem].title;
                                                    thisRowObject.qualifiedTitle = (thisData[thisElem].qualifiedTitle === undefined) //->
                                                        ? (opts.anchor === 'left') //->
                                                            ? pQualifiedTitle + opts.delimiter + thisData[thisElem].title //->
                                                            : thisData[thisElem].title + opts.delimiter + pQualifiedTitle //->
                                                        : thisData[thisElem].qualifiedTitle;
                                                    thisRowObject.tooltip = (thisData[thisElem].tooltip === undefined) //->
                                                        ? (opts.anchor === 'left') //->
                                                            ? pQualifiedTitle + opts.delimiter + thisData[thisElem].title //->
                                                            : thisData[thisElem].title + opts.delimiter + pQualifiedTitle //->
                                                        : thisData[thisElem].tooltip;
                                                    thisRowObject.type = (thisData[thisElem].type === undefined) //->
                                                        ? 'folder'
                                                        : thisData[thisElem].type;
                                                    $.extend(thisRowObject.attributes, attributes);
                                                }
                                            }
                                            cache[thisRowObject.key] = thisRowObject;
                                            if ((parentKey) && (!(cache[parentKey].firstChild))) {
                                                // Fix firstChild and sorting Logic (FindMe!!)
                                                cache[parentKey].firstChild = thisRowObject.key;
                                                cache[parentKey].children = []; // Rework this (FindMe!!)
                                                /////cache[parentKey].next = thisRowObject.key; (FindMe!!)
                                            }
                                            if (prevKey) { cache[prevKey].next = thisRowObject.key; };
                                            prevKey = thisRowObject.key;
                                        }
                                    }
                                }
                                procRow(data, rootNodeKey);
                                break;
                            case "augment":
                                rootNodeKey = (rootNodeKey) ? rootNodeKey : "_FAUXROOT_"; // Immutable
                                break;
                            case "query":
                                rootNodeKey = (rootNodeKey) ? rootNodeKey : "_FAUXROOT_"; // Immutable
                                this.query = function _PlasticDatastore_query(){
                                    // Fill in logic for "priming" query-based-datastore (FindMe!!)
                                    var date = new Date();
                                    var key = "PDMK_" + date.getTime() + "." + date.getMilliseconds();
                                };
                                break;
                        }
                        break;
                    case "attributes":
                        var baseAttrList = _fullColumns.split(',');
                        var baseAttributes = {};
                        for (var cntBase = 0; cntBase < baseAttrList.length; cntBase ++) {
                            baseAttributes[baseAttrList[cntBase]] = cntBase;
                        }
                        var newAttributes = value.split(',');
                        var newAttrList = baseAttrList;
                        for (var cntAttr = 0; cntAttr < newAttributes.length; cntAttr ++) {
                            if (baseAttributes[newAttributes[cntAttr]] === undefined) {
                                newAttrList[newAttrList.length] = newAttributes[cntAttr];
                            }
                        }
                        opts[name] = newAttrList.join(',');
                        break;
                    case "securityContext":
                        var thisSecurityContext = JSON.stringify(value);
                        if (thisSecurityContext !== opts[name]) {
                            var contextData = { cache: {}, dirty: {} };
                            var hasDirty = 0;
                            for (var thisDirty in dirty) { hasDirty += 1; break; };
                            if (hasDirty) { // Invalidate Previous Security-Context's Cache
                                if ((_securityContext[opts[name]] !== undefined) && (_securityContext[opts[name]] !== null)) {
                                    jQuery.extend(contextData.cache, _securityContext[opts[name]].cache);
                                    jQuery.extend(contextData.dirty, _securityContext[opts[name]].dirty);
                                }
                                for (var thisDirty in dirty) {
                                    contextData.dirty[thisDirty] = dirty[thisDirty];
                                    contextData.cache[thisDirty] = cache[thisDirty];
                                }
                                _securityContext[opts[name]] = contextData;
                            }
                            if (_securityContext[thisSecurityContext] === undefined) { // New Context
                                // Switch Into New Context
                                cache = {}, dirty = {};
                                _securityContext[thisSecurityContext] = { cache: {}, dirty: {} };
                            } else { // Switch To Previous Copy
                                cache = jQuery.extend({}, _securityContext[thisSecurityContext].cache);
                                dirty = jQuery.extend({}, _securityContext[thisSecurityContext].dirty);
                            }
                            // Switch Into New Context
                            opts[name] = thisSecurityContext;
                        }
                        break;
                    case "anchor":
                        opts[name] = ((value === 'left') || (value === 'right')) ? value : 'left'
                        break;
                    case "commit":
                        opts[name] = jQuery.extend({}, _commitDefaults, value);
                        break;
                    case "delimiter":
                        opts[name] = (typeof (value) === 'string') ? value.substr(0,1) : '/';
                        break;
                    case "rowDefault":
                        // Add checks here?? (FindMe!!)
                        opts[name] = value;
                        break;
                    case "rootTitle":
                        // http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
                        var delimiterTest = new RegExp(opts.delimiter.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, //->
                            '\\$1').replace(/\x08/g, '\\x08')); 
                        // Maybe add warning if delimiterTest fails? (FindMe!!)
                        if (opts['rootRowObject']) { value = opts['rootRowObject'].title; };
                        opts[name] = ((typeof (value) === 'string') && (!(delimiterTest.test(value)))) ? value : opts[name];
                        break;
                    case "rootRowObject":
                        opts[name] = value;
                        opts['rootTitle'] = opts[name].title;
                        break;
                    case "includeRoot":
                        opts[name] = ((value === true) || (value === false)) ? value : false;
                        break;
                    default:
                        opts[name] = value;
                }
            }
        }
        return retVal;
    };
    _cache = cache;
    this.root = function _PlasticDatastore_root(){ return rootNodeKey; };
    this.namespaces = function _PlasticDatastore_namespaces() {
        var retVal = [];
        for (var thisNS in views) {
            retVal[retVal.length] = thisNS;
        }
        return retVal;
    }
    this.bindView = function _PlasticDatastore_bindView() {
        _PlasticBug("bindView(PlasticDatastore[, Namespace]); called", 4, 'function');
        if ((arguments.length == 0) || (!(arguments[0] instanceof Object))) {
            _PlasticBug("Usage: this.bindDatastore(PlasticDatastore[, Namespace]);", undefined, undefined, 'warn');
        }
        var namespace = (arguments.length == 2) ? arguments[1] : "default";
        if (views[namespace] === undefined) { views[namespace] = []; };
        views[namespace][views[namespace].length] = arguments[0];
        _PlasticBug(arguments[0], 4, 'state');
    };
    this.requestSecurityContextHandler = null;
    this.requestSecurityContext = function _PlasticDatastore_requestSecurityContext(retFunction) {
        var thisReturnFunction = function(context){
            if ((retFunction) && (typeof (retFunction) === 'function')) {
                retFunction.call(this, context);
            } else {
                _PlasticBug('WARN: retFunction not properly defined for requestSecurityContext', 2);
            }
        };
        if ((this.requestSecurityContextHandler) && (typeof (this.requestSecurityContextHandler) === 'function')) {
            this.requestSecurityContextHandler.call(this, thisReturnFunction);
        } else {
            thisReturnFunction.call(this, {});
        }
    };
    this.nextSequence = function _PlasticDatastore_nextSequence() { return ++sequence; };
    this.getGenericRowObject = function _PlasticDatastore_getGenericRowObject(key, parentkey, defaults, fopts) {
        var date = new Date();
        var thisParentkey = (parentkey) ? parentkey : null;
        var thisName = (this.name) ? this.name : self.name;
        var thisKey = (key) //->
            ? key : "PDMK-" + this.name + '-' + date.getTime() + "." + date.getMilliseconds();
        var baseObject = { "disabled" : false, "hidden" : false, "type" : "folder", //->
            "key" : thisKey, "parentKey" : thisParentkey, "title" : undefined, "qualifiedTitle" : undefined, "tooltip" : undefined, //->
            "dirty" : null, "error" : null, "deleted" : null, "selected": null, "isolated" : true, "children" : null, //->
            "ancestorFlag" : this._ancestorFlag, "parent" : this._parent, "siblings" : this._siblings, //->
            "prev" : undefined, "next" : undefined, "firstChild" : undefined, //->
            "actions" : this._actions, "sortIndex" : {}, "attributes" : {} };
        if (defaults) {
            var thisDirty = null;
            for (var thisElement in defaults) {
                if (thisElement in baseObject) {
                    if ((fopts) && (fopts.merge)) {
                        baseObject[thisElement] = defaults[thisElement];
                    } else {
                        if (thisDirty === null) { thisDirty = {}; };
                        thisDirty[thisElement] = defaults[thisElement];
                    }
                } else {
                    if ((fopts) && (fopts.merge)) {
                        baseObject.attributes[thisElement] = defaults[thisElement];
                    } else {
                        if (thisDirty === null) { thisDirty = {}; };
                        if (!(thisDirty.attributes)) { thisDirty.attributes = {}; };
                        baseObject.attributes[thisElement] = undefined;
                        thisDirty.attributes[thisElement] = defaults[thisElement];
                    }
                }
            }
            if ((baseObject.dirty) || (thisDirty)) {
                baseObject.dirty = $.extend({}, baseObject.dirty, thisDirty);
            }
        }
        return baseObject;
    };
    this._safeRowReturn = function _PlasticDatastore__safeRowReturn(rowObject) {
        return ((rowObject) && (rowObject.length === 2) && (rowObject[1] === null)) //->
            ? [ jQuery.extend(rowObject[0], {'status' : 'empty'}) ] : rowObject;
    };
    this.readRowHandler = null;
    this.readRow = function _PlasticDatastore_readRow( /* [parentkey,] key, retFunction, fopts */ ) {
        var isParent    = ((arguments.length > 2) && (typeof (arguments[2]) === 'function'));
        var parentkey   = (isParent) ? arguments[0] : null;
        var key         = (isParent) ? arguments[1] : arguments[0];
        var retFunction = (isParent) ? arguments[2] : arguments[1];
        var fopts       = (isParent) ? arguments[3] : arguments[2];
        var datastore = this;
        _PlasticBug('readRow(key, retFunction); called', 4, 'function');
        var retVal = 0;
        if ((key) || (key === null)) { // undefined different than null
            var tryCache = (parentkey === null) //->
                    ? (key === null) //->
                        ? ((opts) && (opts.rootAnchor)) //->
                            ? opts.rootAnchor : rootNodeKey //->
                        : key //->
                    : (key === null) //->
                        ? (this.readCache(parentkey).firstChild) //->
                            ? this.readCache(parentkey).firstChild //->
                            : null //->
                        : key;
            var cached = (tryCache) ? this.readCache(tryCache, fopts) : undefined;
            if (cached) {
                if ((retFunction) && (typeof (retFunction) == 'function')) {
                    retFunction( [ jQuery.extend({}, fopts, { "status" : "cached", "id" : this.nextSequence() }), cached ], fopts );
                } else {
                    _PlasticBug('WARN: retFunction not properly defined for readRow', 2);
                }
            } else {
                key = ((key === null) && (tryCache)) ? tryCache : key;
                var thisReadRowContext = function(context) {
                    if (this.readRowHandler) {
                        this.readRowHandler.call(datastore, parentkey, key, function(rowObjects, fopts) {
                            _PlasticBug('readRowHandler(key, rowObjects); called', 4, 'function');
                            var thisKey = key;
                            if ((rowObjects.length === 0) || (rowObjects[0].status === 'empty')) {
                                _PlasticBug('Calling retFunction', 4, 'call');
                                retFunction([ jQuery.extend(rowObjects[0], { "id" : self.nextSequence() }) ], fopts);
                                _PlasticBug('Called retFunction', 4, 'call');
                            } else if ((rowObjects.length === 0) || (rowObjects[0].status === 'error')) {
                                // Flag row with error (FindMe!!)
                            } else {
                                // Special Case - Prime The Datastore
                                if (thisKey === null) { thisKey = rowObjects[1].key; };
                                if ((parentkey === null) && (rootNodeKey === null)) { rootNodeKey = thisKey; };
                                for (var cntRows = 1; cntRows < rowObjects.length; cntRows++) {
                                    self.cacheRow(rowObjects[cntRows].key, $.extend( //->
                                        self.getGenericRowObject(rowObjects[cntRows].key, parentkey), //->
                                        rowObjects[cntRows]), fopts);
                                }
                                _PlasticBug('Calling retFunction', 4, 'call');
                                //var cachedRow = self.readCache(thisKey, fopts);
                                //if (cachedRow === null) {
                                //    retFunction([ jQuery.extend({}, fopts, { "status" : "empty", "id" : self.nextSequence() })], fopts);
                                //} else {
                                    retFunction(self._safeRowReturn( //->
                                        [ jQuery.extend({}, fopts, { "status" : "live", "id" : self.nextSequence() }), //->
                                            self.readCache(thisKey, fopts) ]), fopts);
                                //}
                                _PlasticBug('Called retFunction', 4, 'call');
                            }
                        }, fopts);
                    }
                }
                if (opts.securityContext === null) {
                    self.requestSecurityContext.call(this, function(context){
                        self.option.call(this, 'securityContext', context);
                        thisReadRowContext.call(this, context);
                    });
                } else {
                    thisReadRowContext.call(this, opts.securityContext);
                }
            }
        } else {
            _PlasticBug('WARN: invalid key provided to readRow', 2);
        }
        return retVal;
    };
    this.createRowHandler = null;
    this.createRow = function _PlasticDatastore_createRow( parentkey, retFunction, fopts ) {
        var datastore = this;
        var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
        var retVal = 0;
        _PlasticBug('createRow(key, retFunction); called', 4, 'function');
        if ((parentkey === null) && (rootNodeKey !== null)) { parentkey = rootNodeKey; };
        var date = new Date();
        var key = "PDMK-" + this.name + '-' + date.getTime() + "." + date.getMilliseconds();
////       ,rootAnchor: null
////       ,rootTitle: 'Root'
////       ,rootRowObject: null
////       ,anchor: 'left'
////       ,delimiter: '/'
////       ,trimDelimiter: false
////       ,includeRoot: false
        var pCache = this.readCache(parentkey, fopts);
        var pQualifiedTitle = (pCache.qualifiedTitle === opts.delimiter) //->
            ? '' : pCache.qualifiedTitle;
        var baseObject = this.getGenericRowObject(key, parentkey, $.extend({}, {
            'title' : '(New)'
           ,qualifiedTitle: (parentkey === null) //->
                ? (opts.includeRoot === false) //->
                    ? opts.delimiter //->
                    : (opts.anchor === 'left') //->
                        ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                : (opts.anchor === 'left') //->
                    ? pQualifiedTitle + opts.delimiter + '(New)' //->
                    : '(New)' + opts.delimiter + pQualifiedTitle //->
           ,tooltip: (parentkey === null) //->
                ? (opts.includeRoot == false) //->
                    ? opts.delimiter //->
                    : (opts.anchor === 'left') //->
                        ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                : (opts.anchor === 'left') //->
                    ? pQualifiedTitle + opts.delimiter + '(New)' //->
                    : '(New)' + opts.delimiter + pQualifiedTitle //->
        }, datastore.option('rowDefault')));
        //var baseObject = { "disabled" : false, "hidden" : false, "type" : "folder", //->
        //    "key" : key, "parentKey" : parentkey, "title" : undefined, "qualifiedTitle" : undefined, "tooltip" : undefined, //->
        //    "dirty" : null, "error" : null, "deleted" : null, "selected": null, "isolated" : true, "children" : null, //->
        //    "ancestorFlag" : this._ancestorFlag, "parent" : this._parent, "siblings" : this._siblings, //->
        //    "actions" : null, "sortIndex" : {}, "attributes" : {} };
        var rowObject = [ { "status" : "creating", "id" : self.nextSequence() }, baseObject, fopts ];
        ////var rowObject = [ { "status" : "creating", "id" : self.nextSequence() }, //->
        ////    { "disabled" : false, "hidden" : false, "type" : "folder", //->
        ////    "key" : key, "parentKey" : parentkey, "title" : "(New)", "qualifiedTitle" : "(New)", "tooltip" : "(New)", //->
        ////    "dirty" : null, "error" : null, "deleted" : null, "selected": null, "isolated" : true, "children" : null, //->
        ////    "ancestorFlag" : this._ancestorFlag, "parent" : this._parent, "siblings" : this._siblings, //->
        ////    "actions" : null, "sortIndex" : {}, "attributes" : {} } ];
        // Find default "prev" and update its "next"
        if ((this.readCache(parentkey, fopts)) && (this.readCache(parentkey, fopts).lastChild)) {
            var thisPrev = this.readCache(parentkey, fopts).lastChild;
            if (sorted[namespace] === undefined) { sorted[namespace] = {} };
            if (sorted[namespace][thisPrev] === undefined) { sorted[namespace][thisPrev] = {} };
            if (sorted[namespace][parentkey] === undefined) { sorted[namespace][parentkey] = {} };
            sorted[namespace][thisPrev].next = key;
            sorted[namespace][parentkey].lastChild = key;
            baseObject.prev = thisPrev;
            baseObject.next = null;
        ///rowObject['_owner'] = this;
        ///rowObject['_updated'] = new Date();
        }
        var rowCreator = function (rowObject, fopts) {
            if (cache[key]) {
                _PlasticBug('WARN: key provided to rowCreator already exists', 2);
            } else if (rowObject.length < 2) {
                _PlasticBug('WARN: rowObject provided to rowCreator is invalid', 2);
            } else {
                self.cacheRow(key, baseObject, fopts); //// cache[key] = baseObject;
                if (cache[key].dirty) { // Has Dirty-Data
                    dirty[key] = cache[key].dirty;
                    cache[key].dirty = null;
                }
            }
            var thisUpdate = {};
            var attributes = this.option('attributes').split(/,/);
            var initial = {};
            if (rowObject[0].initial) {
                var initialList = rowObject[0].initial.split(/,/); 
                for (var cntInit = 0; cntInit < initialList.length; cntInit ++) {
                    initial[initialList[cntInit]] = 1;
                }
            }
            for (var cntAttr = 0; cntAttr < attributes.length; cntAttr ++) {
                var thisAttr = attributes[cntAttr];
                if (_dsIgnore[thisAttr]) { continue; };
                if ((rowObject[1].attributes) && (rowObject[1].attributes[thisAttr] !== undefined)) {
                    thisUpdate[thisAttr] = rowObject[1].attributes[thisAttr];
                    if (baseObject.attributes[thisAttr] === undefined) {
                        baseObject.attributes[thisAttr] = (initial[thisAttr] !== undefined) //->
                            ? thisUpdate[thisAttr] : undefined;
                    }
                } else if (rowObject[1][thisAttr] !== undefined) {
                    thisUpdate[thisAttr] = rowObject[1][thisAttr];
                }
            }
            this.updateRow(key, [ { "status" : "creating", "id" : self.nextSequence() }, thisUpdate ], retFunction, fopts);
        };
        if (this.createRowHandler) {
            _PlasticBug('this.createRowHandler(datastore, parentRowObject, rowObject, retFunction); calling', 4, 'call');
            retVal = this.createRowHandler.call(datastore, self.readCache(parentkey, fopts), rowObject, rowCreator, fopts);
            _PlasticBug('this.createRowHandler(datastore, parentRowObject, rowObject, retFunction); called', 4, 'call');
        } else {
            retVal = rowCreator.call(this, rowObject, fopts);
        }
        return retVal;
    };
    this.updateRowHandler = null;
    this.updateRow = function updateRow( key, update, retFunction, fopts ) {
        _PlasticBug('updateRow(key, update, retFunction); called', 4, 'function');
        var retVal = 0;
        var datastore = this;
        // Define Handler Objects
        var rowObject = (cache[key]) ? [ { "status" : "update", "id" : datastore.nextSequence() }, jQuery.extend({}, cache[key]) ] : null;
        var rowDirty = (dirty[key]) ? jQuery.extend({}, dirty[key]) : {};
        var rowError = (error[key]) ? jQuery.extend({}, error[key]) : {};
        var rowUpdater = function (rowObject, rowDirty, rowError, update, fopts) {
            _PlasticBug('PlasticDatastore.rowUpdater(rowObject, rowDirty, rowError, update); called', 4, 'function');
            var name, cntName, deleted;
            var attributes = undefined;
            if ((rowObject) && (rowObject.length > 0)) {
                ///_dirtyCount -= 1;
                delete (dirty[key]);
                delete (error[key]);
                _PlasticBug('DIRTY1: ' + JSON.stringify(rowDirty), 4, 'comment');
                attributes = (rowDirty.attributes) ? rowDirty.attributes : null;
                delete (rowDirty.attributes);
                if ((update) && (update.length > 1)) {
                    if (update[0].status === 'augmenting') {
                        // Make Safe?? (FindMe!!)
                        jQuery.extend(cache[key].attributes, update[1]);
                    } else {
                        // Check For Special Metadata Fields
                        if (update[0].status === 'metadataupdate') {
                            for (var name in update[1]) {
                                if (/#selected/.test(name)) { // GroupRow Selection Data
                                    if (update[1][name] === null) {
                                        delete (rowObject[1].attributes[name]);
                                    } else {
                                        rowObject[1].attributes[name] = update[1][name];
                                    }
                                    delete (update[1][name]);
                                } else if (/#deleted/.test(name)) { // GroupRow Deletion Data
                                    // Remove Deleted Items Not In "cache" Object (FindMe!!)
                                    if (update[1][name] === null) {
                                        delete (rowObject[1].attributes[name]);
                                    } else {
                                        var thisTest = new RegExp(name.replace(/#deleted/, '_'));
                                        ////rowObject[1].attributes[name] = jQuery.extend({}, rowObject[1].attributes[name], update[1][name]);
                                        if (!(rowObject[1].attributes[name])) { rowObject[1].attributes[name] = {}; };
                                        for (var deleted in update[1][name]) {
                                            if (update[1][name][deleted] === null) {
                                                for (var cntName in rowObject[1].attributes) {
                                                    if (thisTest.test(cntName)) { // Belongs to Group
                                                        ///delete (rowObject[1].attributes[name][deleted]);
                                                        delete (update[1][name][deleted]);
                                                        delete (attributes[name][deleted]);
                                                        // Confirm This Logic -Qunit (FindMe!!)
                                                        /////if (rowObject[1].attributes[cntName][deleted]) {
                                                        /////}
                                                        var thisAttrCopy = attributes[name];
                                                        delete (attributes[name]);
                                                        for (var thisAttrCheck in thisAttrCopy) {
                                                            attributes[name] = thisAttrCopy; // At Least One Deleted Item Found
                                                            break;
                                                        }
                                                        break;
                                                    }
                                                }
                                            } else if (update[1][name][deleted]) {
                                                for (var cntName in rowObject[1].attributes) {
                                                    if (thisTest.test(cntName)) { // Belongs to Group
                                                        //if ((cache[key]) && (cache[key].attributes) && (cache[key].attributes[cntName]) && //->
                                                        //    (cache[key].attributes[cntName][deleted] === undefined) && //->
                                                        //    (attributes[cntName] !== undefined)) {
                                                        if ((cache[key]) && (cache[key].attributes) && (cache[key].attributes[cntName]) && //->
                                                            (cache[key].attributes[cntName][deleted] === undefined) && //->
                                                            (attributes) && (attributes[cntName] !== undefined)) {
                                                            var thisGroupDelete = attributes[cntName];
                                                            delete (update[1][name][deleted]);
                                                            delete (rowObject[1].attributes[name.replace(/#deleted$/, '#selected')][deleted]);
                                                            delete (attributes[cntName]);
                                                            delete (thisGroupDelete[deleted]);
                                                                ///throw PlasticError(); (FindMe!!)
                                                            for (var thisGroupIndex in thisGroupDelete) {
                                                                attributes[cntName] = thisGroupDelete; // At Least One Deleted Item Found
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    ////delete (update[1][name]);
                                }
                            }
                        }
                        // Run through attributes keys (Attributes should supercede non-attribute data)
                        for (var name in rowObject[1].attributes) {
                            if ((update[1][name] !== undefined) && (update[1][name] !== rowObject[1].attributes[name])) {
                                if (!(attributes)) { attributes = {}; };
                                if ((rowObject[1].attributes[name] !== null) && (rowObject[1].attributes[name] instanceof Date)) {
                                    if (jQuery.datepicker.formatDate(opts.dateFormat, rowObject[1].attributes[name]) !== update[1][name]) {
                                        attributes[name] = $.datepicker.parseDate(opts.dateFormat, update[1][name]);
                                    } else if (update[1][name] !== undefined) {
                                        if (attributes) { delete (attributes[name]); };
                                    }
                                } else if ((rowObject[1].attributes[name] !== null) && //->
                                    (typeof (rowObject[1].attributes[name]) === 'object') && (typeof (update[1][name]) === 'object')) {
                                    _PlasticBug(rowObject[1].attributes[name], 4, 'comment');
                                    var shouldCleanup = false;
                                    for (var thisElement in update[1][name]) {
                                        if (update[1][name][thisElement] !== undefined) {
                                            shouldCleanup = false;
                                            if ((update[1][name][thisElement] === null) && //->
                                                (rowObject[1].attributes[name][thisElement] === undefined)) {
                                                shouldCleanup = true;
                                            } else if (update[1][name][thisElement] !== rowObject[1].attributes[name][thisElement]) {
                                                if (attributes[name] === undefined) { attributes[name] = {}; };
                                                attributes[name][thisElement] = update[1][name][thisElement];
                                            } else {
                                                shouldCleanup = true;
                                            }
                                            if ((shouldCleanup) && (attributes[name])) {
                                                delete (attributes[name][thisElement]);
                                                // Clear Attribute If Empty
                                                var oldAttrName = attributes[name];
                                                delete (attributes[name]);
                                                for (var thisAttrName in oldAttrName) {
                                                    attributes[name] = oldAttrName;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    attributes[name] = ((typeof (update[1][name]) === 'object') && (!(update[1][name] instanceof Date))) //->
                                        ? jQuery.extend({}, attributes[name], update[1][name]) :  update[1][name];
                                    _PlasticBug(attributes[name], 4, 'comment');
                                }
                            } else if (update[1][name] !== undefined) {
                                if (attributes) { delete (attributes[name]); };
                            }
                        }
                    }
                    _PlasticBug('DIRTY2: ' + JSON.stringify(attributes), 4, 'comment');
                    // Run through base rowObject keys
                    for (var cntName = 0; cntName < _dsKeys.length; cntName ++) {
                        name = _dsKeys[cntName];
                        if ((name === 'dirty') || (name === 'error') || (name === 'attributes') || (_dsIgnore[name])) { continue; };
                        if (rowObject[1][name] !== undefined) {
                            if ((update[1][name] !== undefined) && (update[1][name] === rowObject[1][name])) {
                                if (rowDirty[name] !== undefined) {
                                    delete (rowDirty[name]);
                                }
                            } else if (update[1][name] !== undefined) {
                                rowDirty[name] = update[1][name];
                            }
                        } else if (update[1][name] !== undefined) {
                            rowDirty[name] = update[1][name];
                        }
                    }
                }
                for (var name in rowError) {
                    if (rowError[name] === null) { // Remove from errors
                        delete(rowError[name]);
                        continue;
                    }
                    error[key] = rowError;
                    for (var name in rowError) { // Move This To Include Clearing Feedback (FindMe!!)
                        Plastic.Feedback.call(this, rowError[name], 'warning', key, name, fopts);
                    }
                }
                for (var name in rowDirty) {
                    if ((name === 'dirty') || (name === 'error') || (name === 'attributes') || (_dsIgnore[name])) { continue; }; // Pick up attributes
                    //rowDirty.dirty = jQuery.extend({}, rowDirty);
                    dirty[key] = rowDirty;
                    ///dirty[key].attributes = attributes;
                    _PlasticBug('DIRTY3: ' + JSON.stringify(dirty[key]), 4, 'comment');
                    break;
                }
                if (attributes) {
                    for (var name in attributes) {
                        if (!(dirty[key])) { dirty[key] = {}; };
                        dirty[key].attributes = attributes;
                        break;
                    }
                    //dirty[key].dirty = jQuery.extend({}, dirty[key]);
                }
                if ((retFunction) && (typeof (retFunction) == 'function')) {
                    _PlasticBug('Calling retFunction', 4, 'function');
                    var newRowObject = [{ "status" : (update[0].status === 'clear') ? update[0].status : "updated", //->
                        "id" : self.nextSequence() }, self.readCache(key, fopts)];
                    var todoCursor = _PlasticRuntime.todostack[0];
                    _PlasticRuntime.todostack[_PlasticRuntime.todostack.length] = [newRowObject, datastore, fopts];
                    if ((rowObject.length > 1) && (rowObject[1].isolated) && (update) && (update.length > 1) && (update[1].deleted)) {
                        delete (cache[key]);
                        delete (dirty[key]);
                        delete (error[key]);
                    }
                    retFunction(newRowObject, fopts);
                    _PlasticBug('Called retFunction', 4, 'call');
                }
                Plastic.CartUpdate.call(this);
            } else {
                _PlasticBug('WARN: invalid key provided to updateRow', 2);
            }
            return retVal;
        };
        if (update[0].status === 'creategrouprow') { // Create Row For Attributes Category "groups"
            var newUpdate = {};
            var groupname = ((update.length > 1) && (update[1].groupname)) ? update[1].groupname : null;
            var groupindex = ((update.length > 1) && (update[1].groupindex !== undefined)) ? update[1].groupindex : null;
            var groupPattern = new RegExp('^' + groupname + '_');
            if ((rowObject) && (rowObject.length > 1) && (rowObject[1].attributes)) {
                for (var thisName in rowObject[1].attributes) {
                    if (groupPattern.test(thisName)) { // Belongs to this group
                        newUpdate[thisName] = {};
                        newUpdate[thisName][groupindex] = "(NEW)";
                    }
                }
                update[1] = newUpdate;
            }
        } else if (update[0].status === 'selectionupdate') { // Update Selection Array (Object)
            if (update.length > 1) {
                for (var thisAttr in update[1]) {
                }
            }
            _PlasticBug(this, 4, 'comment');
        }
        if (this.updateRowHandler) {
            _PlasticBug('this.updateRowHandler(datastore, rowObject, rowDirty, rowError, update, retFunction); calling', 4, 'call');
            retVal = this.updateRowHandler.call(datastore, rowObject, rowDirty, rowError, update, rowUpdater, fopts);
            _PlasticBug('this.updateRowHandler(datastore, rowObject, rowDirty, rowError, update, retFunction); called', 4, 'call');
        } else {
            retVal = rowUpdater.call(this, rowObject, rowDirty, rowError, update, fopts);
        }
        return retVal;
    };
    this.deleteRowHandler = null;
    this.deleteRow = function(key, retFunction, fopts) {
        _PlasticBug('deleteRow(key, retFunction); called', 4, 'function');
        var retVal = 0;
        if (cache[key]) { // Row exists in cache
            this.updateRow(key, [ { "status" : "deleting", "id" : self.nextSequence() }, { "deleted" : true } ], retFunction, fopts);
        } else {
            _PlasticBug('WARN: invalid key provided to updateRow', 2);
        }
        return retVal;
    };
    this.parent = function _PlasticDatastore_parent(newParent) {
        _PlasticBug('parent(newParent); called', 4, 'function');
        if (arguments.length) {
             parent = newParent;
        }
        return parent;
    };
    this.readRows = function _PlasticDatastore_readRows( /* [parentkey,] key, retFunction, fopts */ ) {
        var isParent    = ((arguments.length > 2) && (typeof (arguments[2]) === 'function'));
        var parentkey   = (isParent) ? arguments[0] : null;
        var key         = (isParent) ? arguments[1] : arguments[0];
        var retFunction = (isParent) ? arguments[2] : arguments[1];
        var fopts       = (isParent) ? arguments[3] : arguments[2];
        _PlasticBug('readRows(key, retFunction); called', 4, 'function');
        _PlasticBug(arguments, 4, 'comment');
        var thisRowObjects = [jQuery.extend({}, fopts, { "status" : "cached", "id" : this.nextSequence() })];
        var cntRecursion = 0;
        var buildRows = function(rowObject, fopts) {
            cntRecursion ++;
            if ((rowObject) && (rowObject.length === 2)) {
                thisRowObjects[thisRowObjects.length] = rowObject[1];
                ///var next = ((fopts) && (fopts.forceRootExpanded) && //-> // Fix This JW?? (FindMe!!)
                ///    (self.root() === rowObject[1].key) && (rowObject[1].firstChild)) //->
                ///        ? rowObject[1].firstChild : rowObject[1].next;
                var next = rowObject[1].next;
                if (next === null) {
                    if ((retFunction) && (typeof (retFunction) === 'function')) {
                        _PlasticBug('Calling readRows retFunction', 4, 'call');
                        retFunction(thisRowObjects, fopts);
                        _PlasticBug('Called readRows retFunction', 4, 'call');
                    } else {
                        _PlasticBug('WARN: retFunction not properly defined for readRows', 2);
                    }
                } else {
                    if ((cntRecursion % 500) === 0) { // Throttle Recursion Loops via Async-Events //-JW
                        setTimeout( function(){ self.readRow(parentkey, next, buildRows, fopts); }, 0);
                    } else {
                        self.readRow(parentkey, next, buildRows, fopts);
                    }
                }
            } else if ((rowObject.length === 0) || (rowObject[0].status === 'empty')) {
                _PlasticBug('Calling readRows retFunction', 4, 'call');
                _PlasticBug(rowObject, 4, 'comment');
                retFunction(rowObject, fopts);
                _PlasticBug('Called readRows retFunction', 4, 'call');
            } else {
                throw new Error('Bad rowObjects[] found in datastore.readRows.');
            }
        };
        this.readRow(parentkey, key, buildRows, fopts);
    };
    this.createRows = function _PlasticDatastore_createRows(index, rowObjects) {
        _PlasticBug('createRows(index, rowObjects); called', 4, 'function'); //UNIMP
    };
    this.updateRows = function(rowObjects) {
        _PlasticBug('updateRows(rowObjects); called', 4, 'function'); //UNIMP
    };
    this.deleteRows = function(rowObjects) {
        _PlasticBug('deleteRows(rowObjects); called', 4, 'function'); //UNIMP
    };
    this.commitRowHandler = null;
    this.commitRow = function _PlasticDatastore_commitRow(rowObjects, retFunction, fopts ) {
        _PlasticBug('commitRow(rowObjects, retFunction); called', 4, 'function');
        var datastore = this;
        var thisRetFunction = function(rowObjects, fopts){
            var keyset = ((fopts) && (fopts.keyset)) ? fopts.keyset : {};
            for (var cntRow = 1; cntRow < rowObjects.length; cntRow ++) {
                if (keyset[rowObjects[cntRow].key]) {
                    delete(keyset[rowObjects[cntRow].key]); // Clear from keyset
                    if (cache[rowObjects[cntRow].key]) {
                        if (rowObjects[cntRow].error) { // rowObject In-Error, Do Not Commit!
                        } else {
                            if (rowObjects[cntRow].deleted) { // Actually Remove This rowObject
                                delete(rowObjects[cntRow].dirty);
                                rowObjects[cntRow].deleted = true;
                                rowObjects[cntRow].isolated = true;
                                // Clean-up sorted[namespace][key] here! (FindMe!!)
                                delete(cache[rowObjects[cntRow].key]);
                                delete(dirty[rowObjects[cntRow].key]);
                            } else {
                                delete(dirty[rowObjects[cntRow].key]); // Clear Dirty-cache for "key"
                                for (var thisAttr in rowObjects[cntRow].dirty) { // Roll dirty into rowObject
                                    if ((rowObjects[cntRow].attributes) && (thisAttr in rowObjects[cntRow].attributes)) {
                                        rowObjects[cntRow].attributes[thisAttr] = rowObjects[cntRow].dirty[thisAttr];
                                    } else if ((!(thisAttr in _dsIgnore)) && (thisAttr in rowObjects[cntRow])) {
                                        rowObjects[cntRow][thisAttr] = rowObjects[cntRow].dirty[thisAttr];
                                    }
                                }
                                delete (rowObjects[cntRow].dirty); // Nuke dirty
                                for (var thisAttr in rowObjects[cntRow].attributes) { // Roll rowObjects[cntRow].attributes into cache
                                    if ((cache[rowObjects[cntRow].key]) && (cache[rowObjects[cntRow].key].attributes) && //->
                                        (thisAttr in rowObjects[cntRow].attributes)) {
                                        cache[rowObjects[cntRow].key].attributes[thisAttr] = rowObjects[cntRow].attributes[thisAttr];
                                    }
                                }
                                for (var thisAttr in rowObjects[cntRow]) { // Roll rowObjects[cntRow] into cache
                                    if (thisAttr === 'attributes') { continue; };
                                    if ((cache[rowObjects[cntRow].key]) && (!(thisAttr in _dsIgnore)) && //->
                                        (thisAttr in cache[rowObjects[cntRow].key])) {
                                        cache[rowObjects[cntRow].key][thisAttr] = rowObjects[cntRow][thisAttr];
                                    }
                                }
                                cache[rowObjects[cntRow].key].isolated = null;
                                rowObjects[cntRow].isolated = null;
                                rowObjects[cntRow].dirty = null;
                            }
                        }
                        //var attributes = rowObjects[cntRow].attributes;
                        //delete (rowObjects[cntRow].attributes);
                        //for (var thisAttr in rowObjects[cntRow].dirty) {
                        //    if (thisAttr === 'attributes') {
                        //    }
                        //}
                    }
                }
            }
            retFunction.call(datastore, rowObjects, fopts);
            Plastic.CartUpdate.call(datastore);
        };
        if ((this.commitRowHandler) && (typeof (this.commitRowHandler) === 'function')) {
            this.commitRowHandler.call(datastore, rowObjects, thisRetFunction, fopts);
        } else {
            thisRetFunction.call(datastore, rowObjects, fopts);
        }
    };
    this.forgetRow = function(key, fopts) {
        _PlasticBug('forgetRow(key); called', 4, 'function');
        delete(dirty[key]);
        ///delete(cache[key]); // Clear Cache Based On FOpts (FindMe!!)
        Plastic.CartUpdate.call(this);
    };
    this.readCache = function(key, fopts) {
        ///////_PlasticBug('readCache(key); called', 4, 'function');
        //this._lruBottom(key);
        var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
        var parentkey = ((cache[key]) && ('parentKey' in cache[key])) ? cache[key].parentKey : undefined;
        var pCache = ((parentkey) && (cache[parentkey])) ? this.readCache(parentkey, fopts) : {};
        var pQualifiedTitle = (pCache.qualifiedTitle === opts.delimiter) //->
            ? '' : pCache.qualifiedTitle;
        var thisTitle = (cache[key]) //->
            ? ((dirty[key]) && (dirty[key].title)) //->
                ? dirty[key].title //-> 
                : cache[key].title //->
            : '(New)';
        var titled = {}; /* $.extend({}, {
            qualifiedTitle: (parentkey === null) //->
                ? (opts.includeRoot === false) //->
                    ? opts.delimiter //->
                    : (opts.anchor === 'left') //->
                        ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                : (opts.anchor === 'left') //->
                    ? pQualifiedTitle + opts.delimiter + thisTitle //->
                    : thisTitle + opts.delimiter + pQualifiedTitle //->
           ,tooltip: (parentkey === null) //->
                ? (opts.includeRoot == false) //->
                    ? opts.delimiter //->
                    : (opts.anchor === 'left') //->
                        ? opts.delimiter + opts.rootTitle : opts.rootTitle + opts.delimiter //->
                : (opts.anchor === 'left') //->
                    ? pQualifiedTitle + opts.delimiter + thisTitle //->
                    : thisTitle + opts.delimiter + pQualifiedTitle //->
        }, {
            qualifiedTitle: (cache[key]) ? cache[key].qualifiedTitle : undefined
           ,tooltip: (cache[key]) ? cache[key].tooltip : undefined
        }); */
        var dirtyKey = jQuery.extend({}, dirty[key]);
        var dirtyAttr = (dirtyKey.attributes) ? jQuery.extend({}, dirtyKey.attributes) : {};
        delete (dirtyKey.attributes);
        delete (dirtyKey.key);
        var sortedKey = ((sorted[namespace]) && (sorted[namespace][key])) ? sorted[namespace][key] : {};
        var retVal = (cache[key]) //->
            ? jQuery.extend({}, cache[key], dirtyKey, titled, sortedKey) //->
            : ((fopts) && (fopts.safe)) ? {} : null;
        if (retVal) {
            retVal.attributes = ((cache[key]) && (cache[key].attributes)) //->
                ? jQuery.extend({}, cache[key].attributes, dirtyAttr) : jQuery.extend({}, dirtyAttr);
            for (var thisAttr in retVal.attributes) {
                if ((cache[key]) && (cache[key].attributes) && (cache[key].attributes[thisAttr] !== undefined) && //->
                    (typeof (cache[key].attributes[thisAttr]) === 'object') && (dirtyAttr[thisAttr] !== undefined)) {
                    // Treat Date Fields Properly (Dates are Objects too)
                    retVal.attributes[thisAttr] = ((cache[key].attributes[thisAttr] instanceof Date) || (dirtyAttr[thisAttr] instanceof Date)) //->
                        ? dirtyAttr[thisAttr] : jQuery.extend({}, cache[key].attributes[thisAttr], dirtyAttr[thisAttr]);
                }
            }
            retVal.error = (error[key]) ? error[key] : null;
            var dirtyObj = jQuery.extend({}, dirtyKey, dirtyAttr);
            if (dirtyObj) {
                for (var name in dirtyObj) {
                    retVal.dirty = dirtyObj;
                    break;
                }
            }
        }
        return retVal;
    };
    this.cacheRow = function _PlasticDatastore_cacheRow(key, rowObject, fopts) {
        _PlasticBug('cacheRow(key, rowObject); called', 4, 'function');
        _PlasticBug('CACHE: ' + key, 4, 'comment');
        var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
        rowObject['_owner'] = this;
        rowObject['_updated'] = new Date();
        var parentkey = ('parentKey' in rowObject) ? rowObject.parentKey : undefined;
        var pCache = ((parentkey) && (cache[parentkey])) ? this.readCache(parentkey, fopts) : {};
        if (cache[key]) { // Update
            jQuery.extend(cache[key], rowObject); // Merge data replacing from right
        } else {
            if (!(rowObject["ancestorFlag"])) { rowObject["ancestorFlag"] = this._ancestorFlag; };
            if (!(rowObject["children"])) { rowObject["children"] = this._children; };
            if (!(rowObject["parent"])) { rowObject["parent"] = this._parent; };
            if (!(rowObject["siblings"])) { rowObject["siblings"] = this._siblings; };
            if ((opts.augment) && (rowObject["augment"] === undefined)) {
                var hasrun = false;
                rowObject["augment"] = function (preRowObject, retFunction, fopts) {
                    if (hasrun) {
                        retFunction(preRowObject, fopts);
                    } else {
                        hasrun = true;
                        if (_PlasticRuntime.datastore[opts.augment[0]]) {
                            // Namespace handoff needs Work?? (FindMe!!)
                            _PlasticRuntime.datastore[opts.augment[0]].readRow(preRowObject[1].key, function(rowObject, fopts) {
                                ///_PlasticRuntime.datastore[opts.augment[0]].updateRow(preRowObject[1].key, //->
                                if ((rowObject) && (rowObject.length > 1)) { // Rows to Augment With
                                    self.updateRow(preRowObject[1].key, //->
                                        [ { "status" : "augmenting", "id" : self.nextSequence() }, //->
                                        rowObject[1].attributes ], retFunction, fopts)
                                } else {
                                    retFunction(preRowObject, fopts);
                                }
                            }, { namespace: 'default' });
                        }
                    }
                    _PlasticBug(this, 4, 'comment');
                }
            }
            cacheSize += 1;
            cache[key] = rowObject;
        }
        if (!(sorted[namespace])) { sorted[namespace] = {}; };
        if (!(sorted[namespace][key])) { sorted[namespace][key] = {} };
        $.each(['firstChild', 'prev', 'next', 'lastChild'], function(index, thisSort) {
            if ((thisSort in cache[key]) && (cache[key][thisSort] !== undefined)) {
                sorted[namespace][key][thisSort] = cache[key][thisSort];
                delete(cache[key][thisSort]);
            } else {
                var lastChild = ((pCache) && (pCache.lastChild)) ? pCache.lastChild : undefined;
                switch (thisSort) {
                    case 'firstChild':
                    case 'lastChild':
                        sorted[namespace][key][thisSort] = null;
                        break;
                    case 'prev':
                    case 'next':
                        if (parentkey === null) {
                            sorted[namespace][key].prev = null;
                            sorted[namespace][key].next = null;
                        } else if ((lastChild) && (sorted[namespace]) && (sorted[namespace][lastChild])) {
                            sorted[namespace][key].prev = lastChild;
                            sorted[namespace][key].next = null;
                            sorted[namespace][lastChild].next = key;
                            sorted[namespace][parentkey].lastChild = key;
                        } else if ((pCache) && (sorted[namespace]) && (sorted[namespace][parentkey])) {
                            sorted[namespace][key].prev = null;
                            sorted[namespace][key].next = null;
                            sorted[namespace][parentkey].firstChild = key;
                            sorted[namespace][parentkey].lastChild = key;
                        }
                        break;
                }
            }
        });
        //this._lruBottom(key);
    };
    this._actions = function _PlasticDatastore__actions(flag, path, against) {
        var retVal = {};
        if ((path) && (/^(parentKey|key|qualifiedTitle|tooltip|deleted|dirty|disabled|isolated|error|hidden|isolated|next|prev)$/.test(path))) {
            retVal['create'] = retVal['update'] = retVal['delete'] = false;
        }
        return retVal;
    };
    this._ancestorFlag = function _PlasticDatastore__ancestorflag(flag, fopts) {
        var parent = (this.parentKey) ? self.readCache(this.parentKey, fopts) : null;
        return ((!this[flag]) && (parent)) ? parent.ancestorFlag(flag, fopts) : !!this[flag];
    };
    this._children = function _PlasticDatastore__children(keys, fopts) {
        var thisIterator;
        var retVal = [];
        var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
        fopts = $.extend({}, fopts, { namespace: namespace });
        if (this.firstChild) {
            thisIterator = self.readCache(this.firstChild, fopts);
            if (thisIterator === null) {
                retVal[retVal.length] = undefined;
            } else {
                retVal[retVal.length] = (keys) ? thisIterator.key : thisIterator;
                while (thisIterator.next !== null) {
                    thisIterator = self.readCache(thisIterator.next, fopts);
                    retVal[retVal.length] = (keys) ? thisIterator.key : thisIterator;
                }
            }
        }
        return (retVal.length) ? retVal : null;
    };
    this._parent = function _PlasticDatastore__parent(key, fopts) {
        return (!(this.parentKey)) ? null : (key) ? self.readCache(this.parentKey, fopts).key : self.readCache(this.parentKey, fopts);
    };
    this._siblings = function _PlasticDatastore__siblings(keys, fopts) {
        var thisIterator = this;
        var retVal = [];
        _PlasticBug(this, 4, 'comment');
        while (thisIterator.prev !== null) {
            thisIterator = self.readCache(thisIterator.prev, fopts);
            retVal[retVal.length] = (keys) ? thisIterator.key : thisIterator;
        }
        retVal = retVal.reverse();
        thisIterator = this;
        while (thisIterator.next !== null) {
            thisIterator = self.readCache(thisIterator.next, fopts);
            retVal[retVal.length] = (keys) ? thisIterator.key : thisIterator;
        }
        return retVal;
    };
    this._cacheShow = function _PlasticDatastore__cacheShow(fopts) {
        for (var key in cache) {
            var prev = (cache[key]['prev']) ? cache[key]['prev'] : 'null';
            var next = (cache[key]['next']) ? cache[key]['next'] : 'null';
            _PlasticBug('CACHE: ' + key + ' => ' + prev + '/' + next, 4, 'comment');
        }
        _PlasticBug('ROOT_KEY: ' + rootNodeKey, 4, 'comment');
        _PlasticBug('CACHE_SIZE: ' + cacheSize, 4, 'comment');
    };
    this.dirtyCount = function _PlasticDatastore_dirtyCount() {
        var thisDirtyCount = 0;
        for (var thisItem in dirty) { thisDirtyCount ++; };
        for (var thisItem in cache) { if (cache[thisItem].isolated) { thisDirtyCount ++; } }; // Make More Efficient?? (FindMe!!)
        return thisDirtyCount; // Make More Efficient With '_dirtyCount' (FindMe!!)
    };
    this.dirtyList = function _PlasticDatastore_dirtyList() {
        var dirtyArray = [];
        var compatible = ((this.option('commit')) && (this.option('commit').compatible)) //->
            ? this.option('commit').compatible : null;
        var crud = ((this.option('commit')) && (this.option('commit').crud)) //->
            ? this.option('commit').crud : null;
        if (compatible) {
            var compatibleCrud = function(inArray) { // Return Indices For "c" "r" "u" "d"
                var retVal = [];
                if (inArray instanceof Array) {
                    for (var cntElement = 0; cntElement < inArray.length; cntElement ++) {
                        for (var thisItem in inArray[cntElement][0]) {
                            var type = ((inArray[cntElement][0][thisItem].deleted) || //->
                                (inArray[cntElement][1][thisItem].deleted)) //->
                                    ? "d" //->
                                    : ((inArray[cntElement][0][thisItem].isolated) || //->
                                        (inArray[cntElement][1][thisItem].isolated)) //->
                                        ? "c" //->
                                        : "u"; // No "r" Values Will Be Returned
                            retVal[cntElement] = type;
                            break; // Catch Unexpected Multiple Keys??(FindMe!!)
                        }
                    }
                } else {
                    _PlasticBug('WARN: Input is not an Array Object', 2);
                }
                return retVal;
            };
            var compatibleSort = function() { // Order-By Deletes, Creates, Updates
                var compare = { 'deleted' : [], 'isolated' : [] };
                for (var thisArg = 0; thisArg <= 1; thisArg ++) {
                    for (var thisCompare in compare) {
                        for (var thisKey in arguments[thisArg][0]) {
                            compare[thisCompare][thisArg] = (arguments[thisArg][0][thisKey][thisCompare]) //->
                                ? arguments[thisArg][0][thisKey][thisCompare]
                                : (arguments[thisArg][1][thisKey][thisCompare]) //->
                                    ? arguments[thisArg][1][thisKey][thisCompare] //->
                                    : null;
                            break;
                        }
                    }
                }
                var retVal = (compare.deleted[0])    //[...1:Left Deleted?]->
                    ? (compare.deleted[1])           //[1Y.2:Right Deleted?]->
                        ? 0                          //[2Y..:Keep Position]->
                        : -1                         //[2N..:Position Deleted First]->
                    : (compare.isolated[0])          //[1N.3:Left Isolated?]->
                        ? (compare.deleted[1])       //[3Y.4:Right Deleted?]->
                            ? +1                     //[4Y..:Position Deleted First]->
                            : (compare.isolated[1])  //[4N.5:Right Isolated?]->
                                ? 0                  //[5Y..:Keep Position]->
                                : -1                 //[5N..:Position Isolated First]->
                        : ((compare.deleted[1]) ||   //[3N.6:Right Deleted? Or ...]->
                            (compare.isolated[1]))   //[....:... Isolated?]->
                            ? +1                     //[6Y..:Position Update Second]->
                            : 0                      //[6N..:Keep Position];
                return retVal;      
            };
            var compatibleObj = {}, compatibleJump = {};
            for (var thisItem in dirty) {
                for (var cntCompatible = 0; cntCompatible < compatible.length; cntCompatible ++) {
                    var thisCompatible = ((cache) && (cache[thisItem])) //->
                        ? ((dirty[thisItem].attributes) && (dirty[thisItem].attributes[compatible[cntCompatible]] !== undefined)) //->
                            ? dirty[thisItem].attributes[compatible[cntCompatible]] //->
                            : (dirty[thisItem][compatible[cntCompatible]] !== undefined) //->
                                ? dirty[thisItem][compatible[cntCompatible]] //->
                                : ((cache[thisItem].attributes) && (cache[thisItem].attributes[compatible[cntCompatible]] !== undefined)) //->
                                    ? cache[thisItem].attributes[compatible[cntCompatible]] //->
                                    : (cache[thisItem][compatible[cntCompatible]] !== undefined) //->
                                        ? cache[thisItem][compatible[cntCompatible]] //->
                                        : null
                        : null;
                    if (thisCompatible) { // Compatible Attribute Found
                        if (compatibleObj[compatible[cntCompatible]] === undefined) {
                            compatibleObj[compatible[cntCompatible]] = {};
                        }
                        if (compatibleObj[compatible[cntCompatible]][thisCompatible] === undefined) {
                            compatibleObj[compatible[cntCompatible]][thisCompatible] = [];
                        }
                        compatibleObj[compatible[cntCompatible]][thisCompatible][ //->
                            compatibleObj[compatible[cntCompatible]][thisCompatible].length //->
                        ] = thisItem;
                        if (compatibleJump[thisItem] === undefined) { compatibleJump[thisItem] = []; }; 
                        // Track Compatible Attributes For Quick Comparison
                        compatibleJump[thisItem][compatibleJump[thisItem].length] = //->
                            [ compatibleObj[compatible[cntCompatible]][thisCompatible], compatible[cntCompatible], thisCompatible ];
                    }
                }
            }
            var already = {}, thisCommitGroup = [];
            for (var thisItem in dirty) {
                if (already[thisItem]) { continue; }; // Skip Already Grouped Items
                if (compatibleJump[thisItem] !== undefined) {
                    var maxMatched = -1, matchedIndex = -1;
                    for (var cntJump = 0; cntJump < compatibleJump[thisItem].length; cntJump ++) {
                        if (compatibleJump[thisItem][cntJump][0].length > maxMatched) {
                            maxMatched = compatibleJump[thisItem][cntJump][0].length;
                            matchedIndex = cntJump;
                        }
                    }
                    if (maxMatched >= 0) {
                        for (var cntItem = 0; cntItem < compatibleJump[thisItem][matchedIndex][0].length; cntItem ++) {
                            var groupedItem = compatibleJump[thisItem][matchedIndex][0][cntItem];
                            if (already[groupedItem]) { continue; }; // Skip Already Grouped Items
                            already[groupedItem] = true;
                            var thisCached = {};
                            thisCached[groupedItem] = jQuery.extend({}, cache[groupedItem]);
                            var thisDirty = {};
                            thisDirty[groupedItem] = jQuery.extend({}, dirty[groupedItem]);
                            thisCommitGroup[thisCommitGroup.length] = [ thisDirty, thisCached ];
                        }
                        thisCommitGroup.sort(compatibleSort);
                        if ((0) && (crud)) { // Compatible Crud Values Defined?
                            var prevCrud = undefined;
                            var crudVal = compatibleCrud(thisCommitGroup);
                            var thisCrudCommitGroup = [];
                            for (var cntItem = 0; cntItem < thisCommitGroup.length; cntItem ++) {
                                if (((prevCrud === undefined) || (crudVal[cntItem] === prevCrud)) && //->
                                    (cntItem < (thisCommitGroup.length -1))) {
                                    thisCrudCommitGroup[thisCrudCommitGroup.length] = thisCommitGroup[cntItem];
                                } else {
                                    if (thisCrudCommitGroup.length) {
                                        dirtyArray[dirtyArray.length] = thisCrudCommitGroup;
                                    }
                                    thisCrudCommitGroup = [];
                                    thisCrudCommitGroup[thisCrudCommitGroup.length] = thisCommitGroup[cntItem];
                                    if (cntItem === (thisCommitGroup.length -1)) { // Capture Last Group
                                        if (thisCrudCommitGroup.length) {
                                            dirtyArray[dirtyArray.length] = thisCrudCommitGroup;
                                        }
                                    }
                                }
                                prevCrud = crudVal[cntItem];
                            }
                        } else {
                            dirtyArray[dirtyArray.length] = thisCommitGroup;
                        }
                        thisCommitGroup = [];
                    }
                } else { // No Matches??
                    if (already[thisItem]) { continue; }; // Skip Already Grouped Items
                    already[thisItem] = true;
                    var thisCached = {};
                    thisCached[groupedItem] = jQuery.extend({}, cache[groupedItem]);
                    var thisDirty = {};
                    thisDirty[groupedItem] = jQuery.extend({}, dirty[groupedItem]);
                    dirtyArray[dirtyArray.length] = [ [ thisDirty, thisCached ] ];
                }
            }
        } else {
            for (var thisItem in dirty) {
                var thisCached = {};
                thisCached[thisItem] = jQuery.extend({}, cache[thisItem]);
                var thisDirty = {};
                thisDirty[thisItem] = jQuery.extend({}, dirty[thisItem]);
                dirtyArray[dirtyArray.length] = [ [ thisDirty, thisCached ] ];
            }
        }
        return dirtyArray;
    };
    this._loadedAttrs = function _PlasticDatastore__loadedAttrs(asString) {
        var retVal = [], attrs = {};
        for (var key in cache) {
            for (var thisAttr in cache[key]) {
                if (typeof (cache[key][thisAttr]) !== 'function') {
                    attrs['+' + thisAttr] = (attrs['+' + thisAttr] === undefined) ? 1 : attrs[thisAttr] + 1;
                }
            }
            if (cache[key].attributes) {
                for (var thisAttr in cache[key].attributes) {
                    attrs[thisAttr] = (attrs[thisAttr] === undefined) ? 1 : attrs[thisAttr] + 1;
                }
            }
        }
        for (var thisAttr in attrs) {
            retVal[retVal.length] = thisAttr;
        }
        _PlasticBug(attrs, 2, 'comment');
        retVal.sort();
        return (asString) ? retVal.join(',') : retVal;
    };
    this._dirtyObj = function _PlasticDatastore__dirtyObj() {
        _PlasticBug(dirty, 4, 'debug');
    };
    this._errorObj = function _PlasticDatastore__errorObj() {
        _PlasticBug(error, 4, 'debug');
    };
    this._cacheObj = function _PlasticDatastore__cacheObj() {
        _PlasticBug(cache, 4, 'debug');
    };
    this._lruShow = function _PlasticDatastore__lruShow() {
        for (var key in cache) {
            if (key !== 'null') {
                var thisBot = ((cache[key]['_lru']) && (cache[key]['_lru'][0])) ? cache[key]['_lru'][0] : 'null';
                var thisTop = ((cache[key]['_lru']) && (cache[key]['_lru'][1])) ? cache[key]['_lru'][1] : 'null';
                _PlasticBug('LRU: ' + key + ' => ' + thisBot + '/' + thisTop, 4, 'comment');
            }
        }
        _PlasticBug('LRU_BOT: ' + (lru[0] !== null) ? lru[0] : 'null', 4, 'comment');
        _PlasticBug('LRU_TOP: ' + (lru[1] !== null) ? lru[1] : 'null', 4, 'comment');
    };
    this._lruBottom = function _PlasticDatastore__lruBottom(key) {
        // Move cached row to bottom of LRU stack
        var bottom = (lru[0]) ? lru[0] : null;
        var top    = (lru[1]) ? lru[1] : null;
        if ((key !== null) && (cache[key])) { // Valid key and in cache ??
            if (cache[key]['_lru'] === undefined) { cache[key]['_lru'] = []; };
            if ((cache[key]['_lru']) && (cache[key]['_lru'].length)) { // Already in lru stack
                if ((cache[key]['_lru'][0]) && (cache[cache[key]['_lru'][0]])) {
                    if ((cache[key]['_lru'][1]) && (cache[cache[key]['_lru'][1]])) { // Both links exist
                        cache[cache[key]['_lru'][0]]['_lru'][1] = cache[cache[key]['_lru'][1]];
                        cache[cache[key]['_lru'][1]]['_lru'][0] = cache[cache[key]['_lru'][0]];
                    } else { // Only bottom link exists, at top of stack
                        lru[1] = cache[key]['_lru'][0];
                    } 
                } else if ((cache[key]['_lru'][1]) && (cache[cache[key]['_lru'][1]])) {
                    // Only top link exists, at bottom of stack already
                    _PlasticBug('INFO: at bottom of lru stack already: ' + key, 3);
                }
            }
            if ((bottom) && (cache[bottom])) {
                cache[bottom]['_lru'][0] = key;
                cache[key]['_lru'] = [];
                cache[key]['_lru'][1] = bottom;
            }
            cache[key]['_lru'][0] = null;
            lru[0] = key;
        } else {
            _PlasticBug('WARN: _lruBottom key not found in cache', 2);
        }
    };
}


