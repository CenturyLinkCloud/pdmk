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
/ Support Contact: plastic@centurylink.com
/
/ Created: 04 January, 2014
/ Last Updated: 17 December, 2016
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
    $.each(['show', 'hide'], function(index, name){ // Add triggers for show and hide
        var origFunction = $.fn[name];
        $.fn[name] = function(speed) {
            return origFunction.apply(this, arguments).trigger(name + '.plastic');
        };
    });
    // ** http://stepansuvorov.com/blog/2014/04/jquery-put-and-delete/ ** //
    // ** http://stackoverflow.com/questions/11793430/retry-a-jquery-ajax-request-which-has-callbacks-attached-to-its-deferred ** //
    $.each(['post', 'get', 'put', 'delete'], function(index, name){ // Add/ Replace CRUD functions for ajax calls
        $[name] = function( url, data, callback, type ) {
            if ($.isFunction( data )) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            var request = {
                url: url
               ,type: name.toUpperCase()
               ,dataType: type
               ,data: data
               ,success: function() {
                    Plastic.Authenticated.call(this);
                    if ($.isFunction( callback )) {
                        callback.apply(this, Array.prototype.slice.call(arguments));
                    }
                }
            },
            jqXHR = undefined,
            deferredFail = undefined,
            deferred = $.Deferred();
            deferredFail = function() {
                var args = Array.prototype.slice.call(arguments);
                var util = Plastic.Util('Authentication');
                if ((jqXHR.status === 401) && (deferredFail.fails++ < 10)) {
                    var rStatus = util.getStatus.call(jqXHR, request);
                    var aChallenge = util.getChallenge.call(jqXHR, request);
                    var thisMessage = ((request) && (request.headers) && (request.headers.Authorization)) //->
                        ? ((rStatus) && (rStatus.message)) //->
                            ? ((aChallenge) && (aChallenge.realm)) //->
                                ? rStatus.message.replace(/\.$/, '') + ': [ ' + aChallenge.realm + ' ]' //->
                                : rStatus.message //->
                            : ((aChallenge) && (aChallenge.realm)) //->
                                ? 'Credentials failed to access resource: [ ' + aChallenge.realm + ' ]' //->
                                : 'Credentials failed to access resource.' //->
                        : ((aChallenge) && (aChallenge.realm)) //->
                            ? 'Login credentials are requested for this application: [ ' + aChallenge.realm + ' ]' //->
                            : 'Login credentials are requested for this application';
                    Plastic.Feedback.call(this, '<span class="plastic-system-feedback-title">' + jqXHR.statusText  + //->
                        ':</span>' + thisMessage, 'warning', undefined, undefined, { decay: 10, force: true })
                    Plastic.Authenticate.call(jqXHR, request, function(fopts){
                        jqXHR = $.ajax(request);
                        jqXHR.then(deferred.resolve, deferredFail);
                    });
                } else {
                    deferred.rejectWith(jqXHR, args);
                }
            };
            deferredFail.fails = 0;
            jqXHR = $.ajax(request).done(deferred.resolve).fail(deferredFail);
            return deferred.promise(jqXHR);
        };
    });
})(jQuery);

(function (_,$) { /* window, jQuery */
    // Define Debugging Configuration and Handler
    _._PlasticRuntime = {};
    _._PlasticPrefs = $.extend({}, {
        BugPriority: 0
       ,BugCategory: /^none$/i
       ,AuthUserCookie: 'PDMK_USER'
       ,AuthUserPattern: /^.{8}.*$/
       ,AuthPassPattern: /^.{8}.*$/
       ,FeedbackIgnoreCookie: 'PDMK_FBIGNORE'
       ,FeedbackIgnore: /^()$/
       ,FeedbackIconCookie: 'PDMK_FBICON'
       ,FeedbackIconOnly: /^(information|success)$/
    }, _._PlasticPrefs);
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
        this.version = '1.0.0b1';
        this.release = 'Public Beta [Epoxy]';
        this.ready = function(retFunction) { readyStack.push([this, retFunction]); };
        this.Cookie = function(name, value, path, expire) { // Basic Cookie Management
            var retVal = undefined;
            if (name !== null) { // Name Flag To Ignore Cookies
                if (value !== undefined) { // Write
                    var thisCookie = name + '=' + value.replace(/;/g, '%3B');
                    thisCookie += (path !== undefined) //->
                        ? '; Path=' + path //->
                        : (_PlasticPrefs.CookieBase !== undefined) //->
                            ? '; Path=' + _PlasticPrefs.CookieBase //->
                            : '';
                    thisCookie += (expire !== undefined) ? '; Expires=' + new Date(expire).toUTCString() : '';
                    document.cookie = thisCookie;
                } else {
                    var cookies = document.cookie.split(/;\s+/);
                    for (var cntCookie = 0; cntCookie < cookies.length; cntCookie ++) {
                        var cPart = cookies[cntCookie].split(/=/);
                        var thisName = cPart.shift();
                        if (thisName === name) {
                            retVal = cPart.join('=').replace(/%3B/ig, ';');
                        }
                    }
                }
            }
            return retVal;
        };
        this.Authenticated = function(request, fopts) {
            $('.plastic-commit-pane').removeClass('plastic-not-authenticated').hide();
        };
        this.Authenticate = function(request, retFunction, fopts) {
            var jqXHR = this;
            var util = Plastic.Util('Authentication');
            var userTry = Plastic.Cookie(_PlasticPrefs.AuthUserCookie);
            $('#plastic-auth-user').val((userTry !== undefined) ? userTry : '');
            $('.plastic-commit-pane').addClass('plastic-not-authenticated').show();
            $('#plastic-auth-signon').one('click', function(){
                $('.plastic-commit-pane').removeClass('plastic-not-authenticated');
                if ((retFunction !== undefined) && (typeof (retFunction) === 'function')) {
                    var fopts = {};
                    var thisUser = $('#plastic-auth-user').val(), thisPass = $('#plastic-auth-pass').val();
                    Plastic.Cookie(_PlasticPrefs.AuthUserCookie, thisUser); // Cache As Session Cookie
                    ////$('#plastic-auth-pass').val(''); // Clear Previous Password?? (FindMe!!)
                    var aResponse = util.getResponse.call(jqXHR, request, thisUser, thisPass);
                    request.headers = { Authorization: aResponse.header };
                    retFunction.call(jqXHR, fopts);
                } else {
                    _PlasticBug('WARN: Invalid Plastic.Authenticate callback specified', 2);
                }
            });
        };
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
            var legal = {
                fns: [
                    'createRowHandler', 'readRowHandler', 'updateRowHandler', 'deleteRowHandler', //->
                    'commitRowHandler', 'searchRowHandler', 'authenticateHandler', //->
                    'securityContextHandler', 'syntaxRowHandler'
                ]
               ,opts: [
                    'anchor', 'commit', 'rowDefault', 'includeRoot', 'trimDelimiter', //->
                    'delimiter', 'rootRowObject', 'augment', 'type', 'attributes', //->
                    'selected', 'dateFormat', 'prettyNames'
                ]
            };
            for (var dsname in datastore) {
                if (dsname.substr(0, 1) === '_') { continue; }; // Skip Special-Use Datastores
                if (pds[dsname] === undefined) {
                    pds[dsname] = new PlasticDatastore(dsname, { data: datastore[dsname].data });
                    _PlasticBug('New PlasticDatastore created: ' + dsname, 4, 'comment');
                    for (var cntFn = 0; cntFn < legal.fns.length; cntFn ++) {
                        if (typeof (datastore[dsname][legal.fns[cntFn]]) === "function") {
                            pds[dsname][legal.fns[cntFn]] = datastore[dsname][legal.fns[cntFn]];
                            _PlasticBug('Custom ' + [legal.fns[cntFn]] + ' defined: ' + dsname, 4, 'comment');
                        } else if (('_default' in datastore) && (legal.fns[cntFn] in datastore['_default']) && //->
                                (typeof (datastore['_default'][legal.fns[cntFn]]) === "function")) {
                            pds[dsname][legal.fns[cntFn]] = datastore['_default'][legal.fns[cntFn]];
                            _PlasticBug('Custom ' + [legal.fns[cntFn]] + ' defined by default: ' + dsname, 4, 'comment');
                        }
                    }
                    for (var cntOpt = 0; cntOpt < legal.opts.length; cntOpt ++) {
                        if (legal.opts[cntOpt] in datastore[dsname]) {
                            pds[dsname].option(legal.opts[cntOpt], datastore[dsname][legal.opts[cntOpt]]);
                        } else if (('_default' in datastore) && (legal.opts[cntOpt] in datastore['_default'])) {
                            pds[dsname].option(legal.opts[cntOpt], datastore['_default'][legal.opts[cntOpt]]);
                        }
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
    // Enable qUnit Features if Libraries are Available
    if ($('#qunit').length === 0) {
        $('body').append($('<div id="qunit" /><div id="qunit-fixture" />'));
    }
                $(_PlasticRuntime.root).addClass('plastic-root plastic-loading');
                if ((document.all) || (/rv:11\./.test(navigator.userAgent))) { // wIErdness Fix :)
                    $(_PlasticRuntime.root).addClass('plastic-browser-msie');
                }
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
        this.Util = function(category) {
            var retVal = undefined;
            switch (category) {
                case 'Authentication':
                    retVal = {
                        _field_values: function(scheme, items, qStrings) {
                            var thisRet = {};
                            thisRet[scheme] = {};
                            for (var cntItems = 0; cntItems < items.length; cntItems ++) {
                                if (/^[A-Za-z0-9!#$%&'*+.^_`|~-]+=\1$/.test(items[cntItems])) {
                                    // Is Quoted String Pair
                                    thisRet[scheme][items[cntItems].replace(/=.*$/, '')] = //->
                                        qStrings.shift().replace(/\1/g, '"');
                                } else if (/^[A-Za-z0-9!#$%&'*+.^_`|~-]+=[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(items[cntItems])) {
                                    // Is Token Pair
                                    thisRet[scheme][items[cntItems].replace(/=.*$/, '')] = //->
                                        items[cntItems].replace(/^.*=/, '');
                                } else if ((items.length === 1) && (/^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(items[cntItems]))) {
                                    // Is Single Token Value, Special Key Of '>' Used
                                    thisRet[scheme]['>'] = items[cntItems];
                                } else {
                                    // Bad Item Value (FindMe!!)
                                }
                            }
                            if ('data' in thisRet[scheme]) {
                                try {
                                    var decoded = atob(thisRet[scheme].data); // Assume "atob" Exists Native or Is PollyFilled
                                    decoded = JSON.parse(decoded); // Assume Clean Base64 Decode
                                    delete (thisRet[scheme].data);
                                    for (var thisElem in decoded) {
                                        thisRet[scheme][thisElem] = decoded[thisElem];
                                    }
                                } catch (err) {
                                    _PlasticBug('WARN: Unable to parse auth options -- ' + err.message, 2);
                                }
                            }
                            return thisRet;
                        }
                       ,_field_parser: function(action, qStrings) {
                            var scheme = undefined, items = [], thisRet = undefined;
                            while (action.length) {
                                var thisPart = action.shift();
                                if (scheme === undefined) {
                                    scheme = thisPart;
                                } else {
                                    if ((items.length === 0) || (action.length === 0) || //->
                                        (/(,$|=)/.test(thisPart))) {
                                        items[items.length] = thisPart.replace(/,$/, '');
                                    } else { // NOTE: Must Process All Fields To Keep qStrings In Sync
                                        var values = retVal._field_values(scheme, items, qStrings);
                                        if (scheme === '|pdmk|') { // Make Configurable?? (FindMe!!)
                                            thisRet = values;
                                            break;
                                        }
                                        scheme = thisPart;
                                        items = [];
                                    }
                                }
                            }
                            if ((scheme === '|pdmk|') && (items.length)) { // Make Configurable?? (FindMe!!)
                                thisRet = retVal._field_values(scheme, items, qStrings);
                            }
                            return thisRet;
                        }
                       ,_hash: function(algorithm, bits, data) { // Wrapper for Current Hash Library (jsSHA)
                            var fopts = $.extend({}, { "shakeLen" : bits });
                            var hash = new jsSHA(algorithm, "TEXT");
                            hash.update(data);
                            return hash.getHash("HEX", fopts);
                        }
                       ,getChallenge: function(request){
                            var jqXHR = this;
                            var thisRet = undefined;
                            var qStrings = [];
                            var challenge = jqXHR.getResponseHeader('WWW-Authenticate');
                            // ASCII SOH Character Borrowed For Simplicity
                            // NOTE: Escaped-Quotes SHOULD Only Appear Within Real Quotes
                            challenge = challenge.replace(/\1/g, '').replace(/\\\"/g, '\1') //->
                                .replace(/"[^"]*"/g, function(match){
                                qStrings[qStrings.length] = match.replace(/^"|"$/g, '');
                                return '\1';
                            }).split(/[\s]+/); // Finally, Create Array Of Tokens
                            challenge = retVal._field_parser(challenge, qStrings);
                            thisRet = ((challenge) && (challenge['|pdmk|'])) ? challenge['|pdmk|'] : {};
                            return thisRet;
                        }
                       ,getResponse: function(request, user, pass){
                            var jqXHR = this;
                            var thisRet = undefined;
                            var aChallenge = retVal.getChallenge.call(jqXHR, request);
                            var aResponse = {};
                            aResponse.user = user;
                            aResponse.nonce = aChallenge.nonce;
                            aResponse.opaque = aChallenge.opaque;
                            aResponse.type = aChallenge.type;
                            var algorithms = (typeof (aChallenge.algorithms) === 'string') //->
                                ? aChallenge.algorithms.split('|') : [];
                            aResponse.aweight = -1; // Target Most Preferred Algorithm
                            while (algorithms.length) {
                                var thisAlg = algorithms.shift().toUpperCase();
                                var weight = 0;
                                switch (thisAlg) {
                                    case "SHAKE256": // Preferred Algorithms Above Lesser Preferred
                                        weight += 1;
                                    case "SHAKE128":
                                        weight += 1;
                                        aResponse.bitLength = 1024;
                                    case "SHA3-512":
                                        weight += 1;
                                    case "SHA-512":
                                        weight += 1;
                                    case "SHA3-384":
                                        weight += 1;
                                    case "SHA-384":
                                        weight += 1;
                                    case "SHA3-256":
                                        weight += 1;
                                    case "SHA-256":
                                        weight += 1;
                                    case "SHA3-224":
                                        weight += 1;
                                    case "SHA-224":
                                        weight += 1;
                                    case "SHA-1":
                                        weight += 1;
                                        if ((weight > 0) && (weight > aResponse.aweight)) {
                                            aResponse.algorithm = thisAlg;
                                            aResponse.aweight = weight;
                                        }
                                        break;
                                    default:
                                        aResponse.error = 'Unable to negotiate a secure algorithm for authenticating against server';
                                };
                            }
                            if ('algorithm' in aResponse) {
                                delete (aResponse.aweight); // No Longer Needed
                                aResponse.tokenRaw = [aResponse.algorithm, aResponse.bitLength, aResponse.user, aResponse.nonce, aResponse.algorithm, aResponse.bitLength, pass];
                                aResponse.token = retVal._hash(aResponse.algorithm, aResponse.bitLength, //->
                                    aResponse.user + ':' + aResponse.nonce + ':' + //->
                                    retVal._hash(aResponse.algorithm, aResponse.bitLength, pass));
                                try {
                                    var encoded = JSON.stringify(aResponse);
                                    encoded = btoa(encoded); // Assume "btoa" Exists Native or Is PollyFilled
                                    thisRet = { 'data' : aResponse, 'header' : '|pdmk| data="'+ encoded +'"' };
                                } catch (err) {
                                    _PlasticBug('WARN: Unable to parse auth options -- ' + err.message, 2);
                                }
                            } else {
                            }
                            return thisRet;
                        }
                       ,getStatus: function(request){
                            var jqXHR = this;
                            var thisRet = undefined;
                            try {
                                var thisStatus = JSON.parse(jqXHR.responseText);
                                thisRet = thisStatus.status;
                            } catch (err) { // Do something?? (FindMe!!)
                            }
                            return thisRet;
                        }
                    };
                    break;
                default:
                    retVal = {};
            };
            return retVal;
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
                            thisRowObject = datastore.readCache(thisRowObject.prev, fopts);
                            if ((thisRowObject !== null) && (thisRowObject.firstChild)) {
                                while (thisRowObject.firstChild) {
                                    thisRowObject = datastore.readCache(thisRowObject.firstChild, fopts);
                                    var siblings = ((thisRowObject.siblings) && (typeof (thisRowObject.siblings) === 'function')) //->
                                        ? thisRowObject.siblings(true) : null;
                                    if (siblings !== null) {
                                        prevHop = (siblings.length === 0) ? thisRowObject.key : siblings[siblings.length -1];
                                        thisRowObject = datastore.readCache(prevHop, $.extend({}, fopts, { namespace: namespace }));
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
                                    thisRowObject = datastore.readCache(thisRowObject.parentKey, $.extend({}, fopts, { namespace: namespace }));
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
                            thisRowObject = datastore.readCache(thisRowObject.prev, fopts);
                            if ((thisRowObject !== null) && (thisRowObject.firstChild)) {
                                while (thisRowObject.firstChild) {
                                    thisRowObject = datastore.readCache(thisRowObject.firstChild, fopts);
                                    var siblings = ((thisRowObject.siblings) && (typeof (thisRowObject.siblings) === 'function')) //->
                                        ? thisRowObject.siblings(true) : null;
                                    if (siblings !== null) {
                                        prevHop = (siblings.length === 0) ? thisRowObject.key : siblings[siblings.length -1];
                                        thisRowObject = datastore.readCache(prevHop, fopts);
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
                var thisStatus = (e.type === 'autocompleteselect') ? 'selectionupdate' : 'update';
                thisds.updateRow(key, [ { "status" : thisStatus, "id" : thisds.nextSequence() }, update ], //->
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
                    var thisReturnSet = [];
                    for (var cntFF = 0; cntFF < thisFulfill.length; cntFF ++) {
                        thisReturnSet[thisReturnSet.length] = {
                            'class' : (thisFulfill[cntFF] === this.term) ? 'plastic-autofill-selected' : 'plastic-autofill-item'
                           ,'value' : thisFulfill[cntFF]
                        };
                    }
                    retFunction((thisReturnSet.length) ? thisReturnSet : thisEmpty);
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
            } else { // For Testing Only, Clean This Up (FindMe!!)
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
            $('.plastic-system-feedback-iconwrap', _PlasticRuntime.system.feedback).each(function(){
                var type = $(this).attr('id').replace(/^plastic-feedback-/, '');
                if (!(/all$/.test(type))) { // Skip silenceall and iconall items
                    if (_PlasticPrefs.FeedbackIgnore.test(type)) { // Silence Messages??
                        $('.plastic-system-feedback-icon-tattoo', this).addClass('ui-icon ui-icon-volume-off');
                    } else if (_PlasticPrefs.FeedbackIconOnly.test(type)) { // Iconize Messages
                        $('.plastic-system-feedback-icon-tattoo', this).addClass('ui-icon ui-icon-minusthick');
                    } else { // Clear Previous Entries
                        $('.plastic-system-feedback-icon-tattoo', this) //->
                            .removeClass('ui-icon ui-icon-volume-off ui-icon-minusthick');
                    }
                }
            });
            if ((active) || (active === undefined)) {
                $('.plastic-system-feedback-frame').css({ 'display' : 'block' }).scrollTop(0);
                $('.plastic-system-feedback').animate({height: '80%'}, 400, 'swing', function(){
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
        // Update Cookie Based Feedback Prefs
        _._PlasticPrefs = $.extend({}, _._PlasticPrefs, {
            FeedbackIgnore : (this.Cookie(_._PlasticPrefs.FeedbackIgnoreCookie)) //->
                ? new RegExp(this.Cookie(_._PlasticPrefs.FeedbackIgnoreCookie)) : undefined
           ,FeedbackIconOnly : (this.Cookie(_._PlasticPrefs.FeedbackIconCookie)) //->
                ? new RegExp(this.Cookie(_._PlasticPrefs.FeedbackIconCookie)) : undefined
        });
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
                if (_PlasticPrefs.FeedbackIgnore instanceof RegExp) {
                    if (_PlasticPrefs.FeedbackIgnore.test(type)) {
                        if (!((fopts) && ((fopts.breach) || (fopts.force)))) {
                            _PlasticBug('Ignoring ' + type + ' messages: ' + message[thisIndex], 4, 'comment');
                            continue;
                        }
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
                if ((_PlasticPrefs.FeedbackIconOnly instanceof RegExp) && //->
                    (_PlasticPrefs.FeedbackIconOnly.test(type))) {
                    if ((fopts) && (fopts.force)) { // Force Popup
                        Plastic.FeedbackActivate(true);
                    } else { // Iconized Notification
                        _PlasticBug('Iconizing ' + type + ' messages: ' + message[thisIndex], 4, 'comment');
                        var throb = { big: { height: 48, width: 48 }, small: { height: 24, width: 24 } };
                        if (!($('.plastic-system-feedback-icontab').hasClass('plastic-system-feedback-icontab-throbbing'))) {
                            $('.plastic-system-feedback-icontab').addClass('plastic-system-feedback-icontab-throbbing');
                            $('.plastic-system-feedback-icontab').animate(throb.big, 600, function(){
                                $('.plastic-system-feedback-icontab').animate(throb.small);
                                $('.plastic-system-feedback-icontab').removeClass('plastic-system-feedback-icontab-throbbing');
                            });
                        }
                    }
                } else { // Activate Visual "Popup" Notification
                    Plastic.FeedbackActivate(true);
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
                                $(_PlasticRuntime.system.cart.list).on('click', '.plastic-actionable', function(e){
                                    if ($(this).attr('plastic-action') === 'commit') {
                                        var dsname = $(this).closest('.plastic-commitgroup-wrap') //->
                                            .find('.plastic-commitgroup-datastore').data('plastic-datastore');
                                        var datastore = (dsname) ? _PlasticRuntime.datastore[dsname] : null;
                                        var rowObjects = [];
                                        $(this).closest('.plastic-field-group').find('.plastic-commitgroup-item').each(function(){
                                            rowObjects[rowObjects.length] = datastore.readCache($(this).data('plastic-key'));
                                        });
                                        _PlasticRuntime.system.commitpane.show();
                                        var thisRetFunction = function(){ // Sweep Through Views And Update??(FindMe!!)
                                            _PlasticRuntime.system.commitpane.hide();
                                            $(_PlasticRuntime.system.cart.list).remove();
                                        };
                                        datastore.commitRow([ { "status" : "commit", "id" : datastore.nextSequence() }, //->
                                            rowObjects ], thisRetFunction, {});
                                    }
                                });
                                var cntItemGroup = 0;
                                var testCART = '<button onClick="$(this).parent().remove();">Close</button>';
                                testCART += '<button class="plastic-actionable" plastic-action="commitall">Save All</button>';
                                for (var thisDatastore in _PlasticRuntime.datastore) {
                                    if (_PlasticRuntime.datastore[thisDatastore].dirtyCount()) {
                                        var prettyNames = _PlasticRuntime.datastore[thisDatastore].option('prettyNames');
                                        testCART += '<div class="plastic-commitgroup-wrap">';
                                        testCART += '<label class="plastic-commitgroup-datastore" ' + //->
                                            'data-plastic-datastore="' + thisDatastore  + '">' + //->
                                            '<b>Item Category:</b> ' + thisDatastore + '</label>';
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
                                                                'Deleted Item: <span class="plastic-commitgroup-item plastic-deleted" ' + //->
                                                                'data-plastic-key="' + thisItem + '">' + title + '</span></div>';
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
                                                                        testCART += '<tr class="plastic-commitgroup-item" data-plastic-key="' + thisItem + '">' + //->
                                                                            '<td class="plastic-commitgroup-item-name">' + thisLabel + '[' + groupEl  + ']:</td>' + //->
                                                                            '<td class="plastic-commitgroup-item-before">' + thisBefore[groupEl] + '</td>' + //->
                                                                            '<td class="plastic-commitgroup-item-after">' + thisAfter[groupEl] + '</td></tr>';
                                                                    }
                                                                } else {
                                                                    testCART += '<tr class="plastic-commitgroup-item" data-plastic-key="' + thisItem + '">' + //->
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
                                                                    testCART += '<tr class="plastic-commitgroup-item" data-plastic-key="' + thisItem + '">' + //->
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
                                $('.plastic-commitgroup-wrap button, .plastic-system-cart-list>button').button();
                            }
                        });
                        // Add default SysFeedback Component if not defined in Playbook
                        if (_PlasticRuntime.system.feedback === undefined) {
                            _PlasticRuntime.system.feedback = $('<div class="plastic-system-feedback" ' + //->
                                'id="PlasticDefaultSysFeedback">' + //->
                                  '<div class="plastic-system-feedback-control">' + //->
                                    '<span class="plastic-system-feedback-control-title">- System Messages -</span>' + //->
                                    '<div class="plastic-system-feedback-iconbar">' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-silenceall" ' + //->
                                        'title="Click to toggle silence for all messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-all.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-error" ' + //->
                                        'title="Click to iconize error messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-error.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-warning" ' + //->
                                        'title="Click to iconize warning messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-warning.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-question" ' + //->
                                        'title="Click to iconize question messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-question.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-information" ' + //->
                                        'title="Click to iconize information messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-information.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-success" ' + //->
                                        'title="Click to iconize success messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-success.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                      '<div class="plastic-system-feedback-iconwrap" id="plastic-feedback-iconall" ' + //->
                                        'title="Click to toggle iconize for all messages">' + //->
                                        '<img class="plastic-system-feedback-icon" src="images/plastic-icon.png">' + //->
                                        '<div class="plastic-system-feedback-icon-tattoo" /></div>' + //->
                                  '</div>' + //->
                                '<span class="plastic-system-feedback-control-button" ' + //->
                                  'title="Check to confirm and remove all messages">Confirm All Messages</span>' + //->
                                '</div><div class="plastic-system-feedback-icontab" ' + //->
                                'title="Click to view waiting messages" />' + //->
                                '<div class="plastic-system-feedback-frame" /></div>');
                            $(_PlasticRuntime.root).append(_PlasticRuntime.system.feedback);
                            $('.plastic-system-feedback-icontab, .plastic-system-feedback') //->
                                .addClass('plastic-system-feedback-bottomright');
                        }
                        if (_PlasticRuntime.system.commitpane === undefined) {
                            var paneContent = //->
                                '<div class="plastic-commit-pane plastic-not-authenticated">' + //->
                                '  <div class="plastic-commit-bgimage" />' + //->
                                '  <em>Please Wait...</em>' + //->
                                '  <div class="plastic-login-frame">' + //->
                                '    <div class="plastic-login-icon"><img src="images/plastic-lock.png"></div>' + //->
                                '    <div class="plastic-login-title">System Login</div>' + //->
                                '    <div class="plastic-login-capslock">' + //->
                                '      <img src="images/plastic-warning.png" width="24" height="24">WARNING: Caps Lock on' + //->
                                '    </div>' + //->
                                '    <table width="490"><tbody>' + //->
                                '      <tr><td><label for="plastic-auth-user">Login Name:</label></td>' + //->
                                '      <td><input type="text" name="plastic-auth-user" id="plastic-auth-user"></td></tr>' + //->
                                '      <tr><td><label for="plastic-auth-pass">Password:</label></td>' + //->
                                '      <td><input type="password" name="plastic-auth-pass" id="plastic-auth-pass"></td></tr>' + //->
                                '      <tr><td colspan="2"><button id="plastic-auth-abort">Cancel</button>' + //->
                                '        <button id="plastic-auth-signon" disabled>Sign On</button></td></tr>' + //->
                                '    </tbody></table>' + //->
                                '  </div>' + //->
                                '  <div class="plastic-error-frame" />' + //->
                                '</div>';
                            _PlasticRuntime.system.commitpane = $(paneContent);
                            $(_PlasticRuntime.root).append(_PlasticRuntime.system.commitpane);
                            $('#plastic-auth-abort').button() // Decorate Cancel Button
                                .on('click', function(){
                                    $('.plastic-commit-pane').removeClass('plastic-not-authenticated') //->
                                        .addClass('plastic-login-error');
                                    if (_PlasticPrefs.HttpError401) {
                                        $('.plastic-error-frame').load(_PlasticPrefs.HttpError401);
                                    }
                                    $('.plastic-error-frame').animate({ height: '90%', width: '90%'}, 1200);
                                });
                            $('#plastic-auth-signon').button(); // Decorate Sign-On Button
                            var errorContents = '<center>' + //->
                                '<h1>Authentication Canceled</h1>' + //->
                                '<p>This application requires the user to be authenticated for access ' + //->
                                'but the authentication request was canceled.<br><br>' + //->
                                '<a href="javascript:window.history.go(0)">Click Here</a> to attempt authentication again<br><br>' + //->
                                'Or<br><br>' + //->
                                '<a href="javascript:window.close()">Close this page</a> to cancel the application login.</p>' + //->
                                '</center>';
                            $('.plastic-error-frame:first').html(errorContents);
                            _PlasticRuntime.system.commitpane.bind('keydown.plastic-commitpane', function(event){
                                // Prevent tabbing out of commit and login modals (borrowed from jqueryui/dialog)
                                // ** http://jqueryui.com/dialog/ ** //
                                if ( event.keyCode !== $.ui.keyCode.TAB ) {
                                    return;
                                }
                                var tabbables = $(':tabbable', this),
                                    first = tabbables.filter(':first'),
                                    last  = tabbables.filter(':last');
                                if (event.target === last[0] && !event.shiftKey) {
                                    first.focus(1);
                                    return false;
                                } else if (event.target === first[0] && event.shiftKey) {
                                    last.focus(1);
                                    return false;
                                }
                            });
                            _PlasticRuntime.system.commitpane.bind('keyup.plastic-commitpane', function(event){
                                // Manage Enabling, Disabling And Executing Buttons
                                if ((_PlasticPrefs.AuthUserPattern) && //->
                                    (_PlasticPrefs.AuthUserPattern.test($('#plastic-auth-user').val())) && //->
                                    (_PlasticPrefs.AuthPassPattern) && //->
                                    (_PlasticPrefs.AuthPassPattern.test($('#plastic-auth-pass').val()))) {
                                    $('#plastic-auth-signon').button('option', 'disabled', false);
                                } else {
                                    $('#plastic-auth-signon').button('option', 'disabled', true);
                                }
                                if ( event.keyCode === $.ui.keyCode.ENTER ) {
                                    if ($(event.target).attr('id') === 'plastic-auth-user') {
                                        $('#plastic-auth-pass').focus();
                                    } else if ($(event.target).attr('id') === 'plastic-auth-pass') {
                                        $('#plastic-auth-signon').click();
                                        $('#plastic-auth-pass').focus();
                                    }
                                } else if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
                                    $('#plastic-auth-abort').click();
                                } else if ( event.keyCode === $.ui.keyCode.CAPS_LOCK ) {
                                    $('.plastic-login-capslock').toggleClass('plastic-capslock-on');
                                } else if (/^[A-Za-z]$/.test( event.key )) { // Caps Lock Detection
                                    var capAction = (/^[A-Z]$/.test( event.key )) //->
                                        ? (event.shiftKey) //->
                                            ? 'removeClass' : 'addClass' //->
                                        : (event.shiftKey) //->
                                            ? 'addClass' : 'removeClass';
                                    $('.plastic-login-capslock')[capAction]('plastic-capslock-on');
                                }
                            });
                            _PlasticRuntime.system.commitpane.on('show.plastic', function(){
                                $('#plastic-auth-user').focus();
                            });
                            _PlasticRuntime.system.commitpane.on('hide.plastic', function(){
                                _PlasticRuntime.system.commitpane.unbind('keypress.plastic-commitpane');
                            });
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
                        $(_PlasticRuntime.system.feedback).on('mousedown', '.plastic-system-feedback-message', function(){
                            _PlasticRuntime.system.feedback[0].preFeedback = $(':focus');
                        });
                        $(_PlasticRuntime.system.feedback).on('click', '.plastic-system-feedback-message', function(){
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
                                if (_PlasticRuntime.system.feedback[0].preFeedback) {
                                    _PlasticRuntime.system.feedback[0].preFeedback.focus();
                                    delete(_PlasticRuntime.system.feedback[0].preFeedback);
                                }
                            }
                        });
                        $(_PlasticRuntime.root).on('click', '.plastic-system-feedback-icontab', function(){
                            Plastic.FeedbackActivate(true);
                        });
                        $(_PlasticRuntime.system.feedback).on('click', '.plastic-system-feedback-iconwrap', function(e){
                            var thisTattoo = $('.plastic-system-feedback-icon-tattoo', this);
                            var thisType = $(this).attr('id').replace(/^plastic-feedback-/, '');
                            if ((thisType === 'silenceall') || (thisType === 'iconall')) {
                                var thisDoA = (thisType === 'silenceall') //-> Delete Or Add??
                                    ? $('.plastic-system-feedback-icon-tattoo', $(this).parent()).is('.ui-icon-volume-off') //->
                                    : $('.plastic-system-feedback-icon-tattoo', $(this).parent()).is('.ui-icon-minusthick');
                                var thisIconSet = (thisType === 'silenceall') //->
                                    ? $(this).nextAll('.plastic-system-feedback-iconwrap:not(:last)') //->
                                    : $(this).prevAll('.plastic-system-feedback-iconwrap:not(:last)');
                                thisIconSet.each(function(){
                                    var childTattoo = $('.plastic-system-feedback-icon-tattoo', this);
                                    var childType = $(this).attr('id').replace(/^plastic-feedback-/, '');
                                    if (thisDoA) { // Delete Or Add??
                                        childTattoo.removeClass('ui-icon ui-icon-volume-off ui-icon-minusthick') //->
                                    } else {
                                        childTattoo.removeClass('ui-icon-volume-off ui-icon-minusthick') //->
                                            .addClass( //->
                                                (thisType === 'silenceall') //->
                                                    ? 'ui-icon ui-icon-volume-off' //->
                                                    : 'ui-icon ui-icon-minusthick' //->
                                            );
                                    }
                                });
                            } else {
                                if (!(thisTattoo.hasClass('ui-icon'))) { // No Tattoo
                                    // Toggle Icon-Only
                                    thisTattoo.addClass('ui-icon ui-icon-minusthick');
                                    $(this).attr('title', 'Click to silence ' + thisType  + ' messages');
                                } else if (thisTattoo.hasClass('ui-icon-minusthick')) { // Icon Only
                                    // Toggle Silent
                                    thisTattoo.removeClass('ui-icon-minusthick').addClass('ui-icon-volume-off');
                                    $(this).attr('title', 'Click to enable ' + thisType  + ' messages');
                                } else if (thisTattoo.hasClass('ui-icon-volume-off')) { // Silent
                                    // Reset To Standard Feedback
                                    thisTattoo.removeClass('ui-icon ui-icon-minusthick ui-icon-volume-off');
                                    $(this).attr('title', 'Click to iconize ' + thisType  + ' messages');
                                }
                            }
                            var thisIgnoreList = [], thisIconList = [];
                            // Find Ignore List
                            $('.ui-icon-volume-off', $(this).parent()).closest('.plastic-system-feedback-iconwrap').each(function(){
                                thisIgnoreList[thisIgnoreList.length] = $(this).attr('id').replace(/^plastic-feedback-/, '');
                            });
                            // Find Icon List
                            $('.ui-icon-minusthick', $(this).parent()).closest('.plastic-system-feedback-iconwrap').each(function(){
                                thisIconList[thisIconList.length] = $(this).attr('id').replace(/^plastic-feedback-/, '');
                            });
                            _PlasticPrefs.FeedbackIgnore = new RegExp('^(' + thisIgnoreList.join('|') + ')$');
                            _PlasticPrefs.FeedbackIconOnly = new RegExp('^(' + thisIconList.join('|') + ')$');
                            // Save Prefs In Cookie
                            var expire = new Date();
                            expire.setYear(expire.getYear() + 1901); // Set Expiration One Year Out
                            Plastic.Cookie(_PlasticPrefs.FeedbackIgnoreCookie, //->
                                _PlasticPrefs.FeedbackIgnore.source, undefined, expire);
                            Plastic.Cookie(_PlasticPrefs.FeedbackIconCookie, //->
                                _PlasticPrefs.FeedbackIconOnly.source, undefined, expire);
                        });
                        $(_PlasticRuntime.system.feedback).on('click', '.plastic-system-feedback-control-button', function(e){
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

