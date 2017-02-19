//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/
/ Program: "PlasticView.js" => Plastic Data Modeling Kit [pdmk]
/                              View Component Support
/ Author: John R B Woodworth <John.Woodworth@CenturyLink.com>
/
/ Support Contact: plastic@centurylink.com
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
/* PlasticView jQuery Plugin */

(function($){
    $.fn.plasticview = function() {
        //var opts = $.extend({}, {}, fopts);
        var self = this;
        var viewargs = arguments;
        var view = {};
        var sortFocusTMO = {};
        var datastore = {};
        this.bindDatastore = function _plasticview_bindDatastore() {
            _PlasticBug("bindDatastore(PlasticDatastore[, Namespace]); called", 4, 'function');
            _PlasticBug(this, 4, 'comment');
            if (arguments.length == 0) { _PlasticBug("Usage: this.bindDatastore(PlasticDatastore[, Namespace]);", undefined, undefined, 'warn'); };
            var namespace = (arguments.length == 2) ? arguments[1] : "default";
            datastore[namespace] = arguments[0];
            datastore[namespace].bindView(this, namespace);
            if ((this[0]) && (this[0].initialize) && (typeof (this[0].initialize) === 'function')) {
                this[0].initialize(datastore[namespace], { namespace: namespace });
            }
        };
        if (viewargs[0] == "tree") {
            this.views = function() {
                for (var name in view) {
                    _PlasticBug("VIEW: " + name, 4, 'comment');
                }
            };
        }
        this.rowsCreated = function(rowObjects, fopts) {
            _PlasticBug('rowsCreated(rowObjects); called', 4, 'function');
            rowObjects[0] = $.extend(rowObjects[0], { "status" : "created" } );
            return self.rowsRead(rowObjects, fopts); // Make Cooler?? (FindMe!!)
        };
        this.rowsRead = function _plasticview_rowsRead(rowObjects, fopts) {
            _PlasticBug('rowsRead(rowObjects); called', 4, 'function');
            _PlasticBug(rowObjects, 5, 'comment');
            for (var name in view) {
                _PlasticBug('VIEW: ' + name, 4, 'comment');
                _PlasticBug(view[name], 4, 'comment');
                switch (view[name][0].plasticcomponent) {
                    case "tree":
                        var thisTree = view[name].dynatree("getTree");
                        var viewId = thisTree.$tree.attr('id');
                        var thisTreeRoot = view[name].dynatree("getRoot");
                        var prevEnable = thisTree.enableUpdate(false);
                        var delayedExpands = [];
                        if ((rowObjects.length === 0) || (rowObjects[0].status === 'empty')) {
                            _PlasticBug(rowObjects, 4, 'comment');
                            if ((rowObjects.length) && (rowObjects[0].parentKey)) {
                                // May need work (FindMe!!)
                                var parentnode = thisTree.getNodeByKey(rowObjects[0].parentKey);
                                parentnode.data.isLazy = false;
                                parentnode.setLazyNodeStatus(DTNodeStatus_Ok);
                                _PlasticBug(parentnode.getChildren(), 4, 'comment');
                            }
                        ////////} else if (rowObjects[0].status === 'commit') { // PlaceHolder?? (FindMe!!)
                        } else {
                            for (var cntRow = 1; cntRow < rowObjects.length; cntRow++) {
                                var rowObject = rowObjects[cntRow];
                                _PlasticBug('PARENTKEY: ' + rowObject.parentKey, 4, 'comment');
                                var parentnode = thisTree.getNodeByKey(rowObject.parentKey);
                                parentnode = (parentnode) ? parentnode : thisTreeRoot;
                                var baseRow = { "title" : rowObject.title, "key" : rowObject.key, "tooltip" : rowObject.tooltip, "isFolder" : true, "isLazy" : true };
                                if ((rowObject.children === null) || //->
                                    ((typeof (rowObject.children) === 'function') && (rowObject.children() === null))) {
                                    baseRow['isLazy'] = false;
                                }
                                if ((self[0].plasticopts) && (self[0].plasticopts.types) && (rowObject.type) && //->
                                    (self[0].plasticopts.types[rowObject.type]) && (self[0].plasticopts.types[rowObject.type].length)) {
                                    // Make type regex match (FindMe!!)
                                    baseRow.isFolder = (self[0].plasticopts.types[rowObject.type][0] === 'folder');
                                }
//if (rowObjects[0].status === 'created') {
//    if (!(parentnode.isExpanded())) { parentnode.expand(); };
//}
                                var node = thisTree.getNodeByKey(rowObject.key);
                                if (node) { // Add Wrapper Function? (FindMe!!)
                                    _PlasticBug('TITLE1: ' + node.data.rowObject.title, 4, 'comment');
                                    if ((rowObjects[cntRow].isolated) && (rowObjects[cntRow].deleted)) {
                                        node.remove();
                                        if ((rowObjects[cntRow].key) && ($('.Plastic').plasticKeyFilter(rowObjects[cntRow].key).length)) {
                                            var thisWidget = $('.Plastic').plasticKeyFilter(rowObjects[cntRow].key);
                                            if ((thisWidget) && (thisWidget.length) && (thisWidget[0].disable) && //->
                                                (typeof (thisWidget[0].disable) === 'function')) {
                                                thisWidget[0].disable(true);
                                            }
                                        }
                                    } else {
                                        node.data.rowObject = rowObjects[cntRow];
                                        node.data.title = node.data.rowObject.title;
                                        node.data.tooltip = node.data.rowObject.tooltip;
                                        if ((rowObjects[0].status) && //->
                                            ((rowObjects[0].status === 'updated') || (rowObjects[0].status === 'clear') || //->
                                            (rowObjects[0].status === 'commit'))) {
                                            var renderer = (rowObjects[0].status === 'clear') ? 'render' : 'update';
                                            // Leverage fopts to make this more general? (FindMe!!)
                                            if ((rowObjects[cntRow].key) && ($('.Plastic').plasticKeyFilter(rowObjects[cntRow].key).length)) {
                                                var thisWidget = $('.Plastic').plasticKeyFilter(rowObjects[cntRow].key);
                                                // _PlasticRuntime.inventory[thisWidget[0].id].options.layout (For Regex Subst [FindMe!!])
                                                if ((thisWidget) && (thisWidget.length) && (thisWidget[0][renderer]) && //->
                                                    (typeof (thisWidget[0][renderer]) === 'function')) {
                                                    thisWidget[0][renderer]([ { source: self, "status" : rowObjects[0].status }, rowObjects[cntRow] ]);
                                                }
                                            }
                                        }
                                        if (viewId in sortFocusTMO) { clearTimeout(sortFocusTMO[viewId]); delete(sortFocusTMO[viewId]); };
                                        var sortFocus = function() {
                                            parentnode.sortChildren(); // Sort By "sortIndex" of namespace (FindMe!!)
                                            node.render();
                                            var activeLi = node.span;
                                            view[name].animate({
                                                scrollTop: $(activeLi).offset().top - view[name].offset().top + view[name].scrollTop() - 20
                                            }, 'slow');
                                            _PlasticBug('TITLE2: ' + node.data.rowObject.title, 4, 'comment');
                                        };
                                        sortFocusTMO[viewId] = setTimeout( sortFocus, 50 );
                                    }
                                } else {
                                    if (rowObjects[0].status === 'created') {
                                        if (!(parentnode.isExpanded())) { parentnode.expand(); };
                                        node = parentnode.addChild(baseRow);
                                        node.data.rowObject = rowObjects[cntRow];
                                        parentnode.sortChildren(); // Sort By "sortIndex" of namespace (FindMe!!)
                                        node.activate();
                                        var activeNode = node.span;
                                        ////$(activeNode).trigger('rowactivate.plastic');
                                        if (viewId in sortFocusTMO) { clearTimeout(sortFocusTMO[viewId]); delete(sortFocusTMO[viewId]); };
                                        var sortFocus = function() {
                                            view[name].animate({
                                                scrollTop: $(activeNode).offset().top - view[name].offset().top + view[name].scrollTop() - 20
                                            }, 'slow');
                                        };
                                        sortFocusTMO[viewId] = setTimeout( sortFocus, 50 );
                                        ///if (!(parentnode.isExpanded())) { parentnode.expand(); };
                                    } else { ////if (rowObjects[0].status !== 'cached') { // Null node cached rowObjects cannot exist
                                        node = parentnode.addChild(baseRow);
                                        if ((rowObjects[cntRow].firstChild !== null) && //->
                                            (rowObjects[cntRow].firstChild === rowObjects[cntRow].lastChild)) {
                                            delayedExpands[delayedExpands.length] = node;
                                        }
                                        node.data.rowObject = rowObjects[cntRow];
                                    }
                                }
                                if ((view[name][0].plasticopts) && (view[name][0].plasticopts._hasDefault)) {
                                    var toActivate = view[name][0].plasticopts._hasDefault;
                                    if ((typeof (toActivate) === 'string') && //->
                                        (rowObject.key === view[name][0].plasticopts._hasDefault)) {
                                        delete (view[name][0].plasticopts._hasDefault);
                                        $(self).trigger('rowactivate.plastic', { key: toActivate });
                                ///    } else if (typeof (toActivate) === 'object') {
                                ///        var activeName;
                                ///        for (var thisName in toActivate) { activeName = thisName; break; };
                                ///        if ((rowObject[activeName] !== undefined) && //->
                                ///            (rowObject[activeName] === toActivate[activeName])) {
                                ///            delete (view[name][0].plasticopts._hasDefault);
                                ///            $(self).trigger('rowactivate.plastic', toActivate);
                                ///        }
                                    }
                                }
                            }
                        }
                        thisTree.enableUpdate(prevEnable);
                        if (delayedExpands.length) {
                            $.each(delayedExpands, function(){
                                this.expand();
                            });
                        }
                    //    $('.plastic-treenode-summary.plastic-unpainted:visible').each(function(){
                    //    ////$('.plastic-treenode-summary:visible').each(function(){
                    //        ////$(this).sparkline('html', $(this).data('sparkopts')).removeClass('plastic-unpainted');
                    //        var node = $(this).data('node');
                    //        var context = this;
                    //        $(context).removeClass('plastic-unpainted');
                    //        setTimeout(function(){
                    //            $(context).sparkline($(node).data('sparkvalues'), //->
                    //                $(node).data('sparkopts'));
                    //                ///$(node).data('sparkopts')).removeClass('plastic-unpainted');
                    //            var canvas = $('.plastic-treenode-summary', node.span).children('canvas');
                    //    ///        var shapegroup = $(node.li).find('group:first').parent().children(':first');
                    //            if (canvas.length) {
                    //                $(node).data('canvas', canvas);
                    //    ///        } else if (shapegroup.length) {
                    //    ///            $(node).data('shapegroup', shapegroup);
                    //            }
                    //        ///}, 1);
                    //        }, Math.floor((Math.random() * 500) + 501));
                    //        ////$(this).sparkline($(node).data('sparkvalues'), $(node).data('sparkopts')).removeClass('plastic-unpainted');
                    //    });
                        self.trigger('expanded.plastic');
                        if (!(view[name].find('.dynatree-loading').length)) { // No More Loading
                            $('a.plastic-stack-status[href=#' + name + ']').removeClass('plastic-component-loading');
                        }
                        break;
                    case "list":
                        _PlasticBug(this, 4, 'comment');
                        self[0].PlasticAjaxProc(rowObjects, fopts);
                        // Bind this to datatables "loading" pane (FindMe!!)
                        $('a.plastic-stack-status[href=#' + name + ']').removeClass('plastic-component-loading');
                        break;
                    default:
                        break;
                }
                
                //thisTree.redraw();
            }
        };
        this.rowsUpdated = function(rowObjects, fopts) {
            _PlasticBug('rowsUpdated(rowObjects); called', 4, 'function');
            return self.rowsRead(rowObjects, fopts); // Make Cooler?? (FindMe!!)
        };
        this.rowsDeleted = function(rowObjects, fopts) {
            _PlasticBug('rowsDeleted(rowObjects); called', 4, 'function');
            return self.rowsRead(rowObjects, fopts); // Make Cooler?? (FindMe!!)
        };
        this.rowsCommitted = function(rowObjects, fopts) {
            _PlasticBug('rowsCommitted(rowObjects); called', 4, 'function');
            _PlasticRuntime.system.commitpane.hide(); // Stop Animation and Block (FindMe!!)
            return self.rowsRead(rowObjects, fopts); // Make Cooler?? (FindMe!!)
        };
        this.reloadChildren = function(key, fopts) {
            // Remove dynatree specific handling (FindMe!!)
            $(this).dynatree('getTree').getNodeByKey(key).reloadChildren();
        };
        this.activateRow = function(target, fopts) {
            var thisId = $(this).attr('id');
            var thisComponent = ((self) && (self.length) && (self[0].plasticcomponent)) //->
                ? self[0].plasticcomponent : undefined;
            switch (thisComponent) {
                case "tree":
                    var node = $.ui.dynatree.getNode(target);
                    if (node) { node.activateSilently(); };
                    break;
                case "list":
                    var table = $('#' + thisId + '_list').DataTable();
                    $(target.closest('tr')).find('input:first').trigger('click', { silent: true });
                    break;
                default:
                    _PlasticBug('WARN: activateRow() unhandled for view-' + thisComponent, 2);
                    break;
            }
        };
        this.getRowObjectFor = function(target, fopts) {
            var retVal = undefined;
            var thisId = $(this).attr('id');
            var thisComponent = ((self) && (self.length) && (self[0].plasticcomponent)) //->
                ? self[0].plasticcomponent : undefined;
            switch (thisComponent) {
                case "tree":
                    var node = $.ui.dynatree.getNode(target);
                    retVal = ((node) && (node.data) && (node.data.rowObject)) ? node.data.rowObject : {};
                    break;
                case "list":
                    var table = $('#' + thisId + '_list').DataTable();
                    var cell = (target.closest('td')) ? table.cell(target.closest('td')) : undefined;
                    var row = (cell) ? cell.index().row : undefined;
                    var header = ((cell) && (cell.settings())) //->
                        ? cell.settings()[0].aoColumns[cell.index().column].data : undefined;
                    retVal = (row !== undefined) ? $.extend({}, table.row( row ).data().rowObject, { '#selected' : header }) : {};
                    break;
                default:
                    retVal = {};
                    _PlasticBug('WARN: getRowObjectFor() unhandled for view-' + thisComponent, 2);
                    break;
            }
            return retVal;
        };
        // Define various "view" constructors here
        this._make = {
            tree: function _plasticview__make_tree(fopts){
                var thisId = $(this).attr('id');
                var expandLevel = ((fopts) && (fopts.forceRootExpanded)) ? 2 : null;
                var dsname = ((fopts) && (fopts.datastore)) ? fopts.datastore : null;
                var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
                var datastore = ((dsname) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                var prettyNames = ((fopts) && (datastore)) //->
                    ? $.extend({}, datastore.option('prettyNames'), fopts.prettyNames) : {};
                $(this).resize(function (e){
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    _PlasticBug('resize(); called:', 4, 'function');
                    _PlasticBug('TREE: ', 4, 'comment');
                    _PlasticBug($(this), 4, 'comment');
                    _PlasticBug($(this).parent(), 4, 'comment');
                    $(this).outerHeight($(this).parent().height() - $(this).parent().children('ul:first').outerHeight());
                });
                $(this).on('initialize.plastic', function (e) {
                    if (e.target === this) { // Direct events only
                        e.stopPropagation(); // Prevent this event bubbling to parents
                        var fopts = ((this) && (this.plasticopts)) ? this.plasticopts : {};
                        // Make dsname, datastore and namespace common for this "self" object (FindMe!!)
                        var dsname = (fopts.datastore) ? fopts.datastore : null;
                        var datastore = ((dsname) && (_PlasticRuntime.datastore[dsname])) //->
                            ? _PlasticRuntime.datastore[dsname] : null; 
                        var rowsRead = function() {
                            self.rowsRead.apply(self, arguments);
                            if ((self.length) && (self[0].plasticopts)) {
                                if (self[0].plasticopts.autoExpand) {
                                    self.dynatree('getRoot').visit(function(node){
                                        node.expand(true);
                                    });
                                }
                            }
                        };
                        if ((fopts) && (fopts.defaultTarget) && (_PlasticRuntime.inventory[fopts.defaultTarget]) && //->
                            (_PlasticRuntime.inventory[fopts.defaultTarget].options) && //->
                            (_PlasticRuntime.inventory[fopts.defaultTarget].options.isDefault)) {
                            fopts._hasDefault = _PlasticRuntime.inventory[fopts.defaultTarget].options.isDefault;
                        }
                        if (datastore) { datastore.readRows(null, null, rowsRead, fopts); };
                    }
                });
                $(this).addClass('plastic-scroll-container');
                $(this).on('click', '.plastic-treenode-state.plastic-disabled', function(e){
                    // Propagate Expand/ Collapse Clicks For Disabled Nodes
                    if (e.clientX < ($(this).offset().left + 20)) {
                        $(this).parent().children(':first').trigger('click');
                    }
                });
                $(this).on('activated.plastic expanded.plastic', function(){
                    ////$('.plastic-treenode-summary:visible').each(function(){
                    $('.plastic-treenode-summary.plastic-unpainted:visible').each(function(){
                        var node = $(this).data('node');
                        var context = this;
                        ///$(this).sparkline($(node).data('sparkvalues'), $(node).data('sparkopts')).removeClass('plastic-unpainted');
                        setTimeout(function(){
                            $(context).sparkline($(node).data('sparkvalues'), //->
                                $(node).data('sparkopts')).removeClass('plastic-unpainted');
                                var canvas = $('.plastic-treenode-summary', node.span).children('canvas');
                        ///        var shapegroup = $(node.li).find('group:first').parent().children(':first');
                                if (canvas.length) {
                                    $(node).data('canvas', canvas);
                        ///        } else if (shapegroup.length) {
                        ///            $(node).data('shapegroup', shapegroup);
                                }
                        }, Math.floor((Math.random() * 500) + 501));
                    });
                });
                $(this).on('rowactivate.plastic', function(e, xtra){
                    var mytree = $(this).dynatree("getTree");
                    var node = ((xtra) && (xtra.key)) //->
                        ? mytree.getNodeByKey(xtra.key) //->
                        : $.ui.dynatree.getNode(e.target);
                    self._activateFramework.call(node, e, xtra);
                });
                return $(this).dynatree({
                    title: 'TreeRoot_' + thisId
                   ,key: 'TreeRoot_' + thisId
                   ,clickFolderMode: 1
                   ,minExpandLevel: expandLevel
                   ,onExpand: function(flag, node) {
                        if (flag) {
                            self.trigger('expanded.plastic');
                        } else if (self[0].plasticopts.resetOnCollapse) {
                            node.removeChildren();
                        }
                    }
                   ,onLazyRead: function(node){
                        $('a.plastic-stack-status[href=#' + thisId + ']').addClass('plastic-component-loading');
                        self._appendFramework.call(node);
                    }
                   ,onDblClick: function(node, e, xtra){
                        self._activateFramework.call(node, e, xtra);
                    }
                   ,onClick: function(node, e, xtra){
                        if (node.isActive()) {
                            if (node.getEventTargetType(e) === "title") {
                                if ((viewargs) && (viewargs.length > 1) && (viewargs[1].activateOnClick !== undefined)) {
                                    if (viewargs[1].activateOnClick) {
                                        self._activateFramework.call(node, e, xtra);
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else { // Default Action (Intuitive)
                                    self._activateFramework.call(node, e, xtra);
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                   ,onActivate: function(node, e, xtra){
                        if ((viewargs) && (viewargs.length > 1) && (viewargs[1].activateOnClick !== undefined)) {
                            if (viewargs[1].activateOnClick) {
                                self._activateFramework.call(node, e, xtra);
                            }
                        } else { // Default Action (Intuitive)
                                self._activateFramework.call(node, e, xtra);
                        }
                    }
                   ,onSelect: function(node){
                        self._selectFramework.call(node);
                    }
                   ,onCreate: function(node){
                        if ((node) && (node.data) && (node.data.rowObject)) {
                            if ((fopts) && (fopts.summary) && (fopts.summary.map)) {
                                var tooltipValueLookups = { names: {} };
                                var sliceColors = [];
                                var sparkopts = {
                                    type: 'pie'
                                   ,tooltipChartTitle: fopts.summary.map.title
                                   ,sliceColors: sliceColors
                                   ///,sliceColors: ['#cc3333','#33cc33','#3333cc']
                                   ,tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{color:names}} ({{percent.1}}%)'
                                   ,tooltipValueLookups: tooltipValueLookups
                                   ///,tooltipValueLookups: { names: {'#cc3333':'Free', '#33cc33':'Used', '#3333cc':'Open'} }
                                };
                                var cntValue = 0, values = [];
                                for (var thisSumAttr in fopts.summary.map) {
                                    if (typeof (fopts.summary.map[thisSumAttr]) === 'string') {
                                        tooltipValueLookups.names[fopts.summary.map[thisSumAttr]] = (prettyNames[thisSumAttr]) //->
                                            ? prettyNames[thisSumAttr] : thisSumAttr;
                                        sliceColors[cntValue] = fopts.summary.map[thisSumAttr];
                                    } else {
                                        for (var thisSumAttrName in fopts.summary.map[thisSumAttr]) {
                                            tooltipValueLookups.names[thisSumAttrName] = fopts.summary.map[thisSumAttr][thisSumAttrName];
                                            sliceColors[cntValue] = thisSumAttrName;
                                        }
                                    }
                                    values[cntValue] = node.data.rowObject.attributes[thisSumAttr];
                                    cntValue ++;
                                }
                                var newstatus = $('<span class="plastic-treenode-summary" />');
                                newstatus.data('node', node);
                                ////$(node).data('sparkopts', sparkopts).data('status', newstatus);
                                $(node).data({'sparkvalues' : values, 'sparkopts' : sparkopts, 'status' : newstatus});
                                ////$(node).data('sparkopts', sparkopts).data('sparkvalues', values).data('status', newstatus);
                                ////newstatus.sparkline(values, sparkopts);
                            }
                        }
                    }
                   ,onRender: function(node){
                        ///////_PlasticBug('RENDER');
                        if ((node) && (node.data) && (node.data.rowObject)) {
                            if ((node.data.rowObject.deleted) || (node.data.rowObject.ancestorFlag('deleted'))) {
                                $(node.span).addClass('plastic-deleted').find('a').addClass('plastic-deleted');
                            }
                            if (node.data.rowObject.dirty) {
                                $(node.span).addClass('plastic-dirty');
                            }
                            if (node.data.rowObject.error) {
                                $(node.span).addClass('plastic-error');
                            }
                            if (node.data.rowObject.isolated) {
                                $(node.span).addClass('plastic-isolated');
                            }
                            if ((node.data.rowObject.disabled) || (node.data.rowObject.ancestorFlag('disabled'))) {
                                $(node.span).addClass('plastic-disabled');
                                $(node.span).append('<div class="plastic-treenode-state plastic-disabled" />');
                            }
                            if ((fopts) && (fopts.types) && (node.data.rowObject.type) && //->
                                (fopts.types[node.data.rowObject.type]) && (fopts.types[node.data.rowObject.type].length > 1)) {
                                $(node.span).addClass(fopts.types[node.data.rowObject.type][1]);
                            }
                            if ($(node).data('status')) {
                                var thisStatus = $(node).data('status');
                                var canvas = $(node).data('canvas');
                                var shapegroup = $(node).data('shapegroup');
                                $('.dynatree-icon', $(node.span)).after(thisStatus);
                                if (canvas) {
                                    if ($('canvas', thisStatus).length === 0) {
                                        $(thisStatus).append(canvas);
                                    }
                                } else if (shapegroup) {
                                    if ($('shapegroup', thisStatus).length === 0) {
                                        $(node.span).append(shapegroup);
                                    }
                                } else {
                                    thisStatus.addClass('plastic-unpainted');
                                }
                            }
                            //if ((fopts) && (fopts.summary) && (fopts.summary.map)) {
                            //    var sparkopts = {
                            //        type: 'pie'
                            //       ,tooltipChartTitle: fopts.summary.map.title
                            //       ,sliceColors: ['#cc3333','#33cc33','#3333cc']
                            //       ,tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{color:names}} ({{percent.1}}%)'
                            //       ,tooltipValueLookups: { names: {'#cc3333':'Free', '#33cc33':'Used', '#3333cc':'Open'} }
                            //    };
                            //    var cntValue = 0, values = [];
                            //    for (var thisSumAttr in fopts.summary.map) {
                            //        values[cntValue] = node.data.rowObject.attributes[thisSumAttr];
                            //        cntValue ++;
                            //    }
                            //    $('.dynatree-icon', $(node.span)).after($('<span class="plastic-treenode-summary plastic-unpainted" values="' + //->
                            //        values.join(',') + '" />').data('sparkopts', sparkopts));
                            //    $('.plastic-treenode-summary.plastic-unpainted:visible').sparkline('html', sparkopts).removeClass('plastic-unpainted');
                            //    //$(node.span).append('<span>X</span>');
                            //}
//
                            if ((fopts) && (fopts.renderAppend)) {
                                var anames = [];
                                for (var cntRend = 0; cntRend < fopts.renderAppend.length; cntRend ++) {
                                    for (var rname in fopts.renderAppend[cntRend]) {
                                        if ((node.data.rowObject.attributes) && (node.data.rowObject.attributes[rname])) {
                                            var title = $(node.span).find('a:first');
                                            title.text( title.text() + Plastic.VarExpand(fopts.renderAppend[cntRend][rname], node.data.rowObject) );
                                        }
                                    }
                                }
                            }
//
                        }
                    }
                });
            }
           ,list: function _plasticview__make_list(fopts){
                var thisId = $(this).attr('id');
                var activeRow = null;
                var ajaxStack = {};
                var keyRow = {};
                $(this).children('.Plastic').each(function(){ // Extend "flattened" option to children
                    if (this.plasticopts) {
                        this.plasticopts._ = $.extend({}, this.plasticopts._, { flatten: true });
                    }
                });
                // Embed datastore and namespace to make more efficient (FindMe!!)
                var dsname = ((fopts) && (fopts.datastore)) ? fopts.datastore : null;
                var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
                var datastore = ((dsname) && _PlasticRuntime.datastore[dsname]) ? _PlasticRuntime.datastore[dsname] : null;
                $(this).on('draw.dt', function(){
                    var scrollHead = $(this).find('.dataTables_scrollHead:first');
                    var headerHeight = (parseInt(scrollHead.outerHeight())) ? parseInt(scrollHead.outerHeight()) : 25;
                    $(this).find('.dataTables_scroll:first').css('border-top-width', headerHeight + 'px');
                    scrollHead.css('top', '-' + headerHeight + 'px');
                });
                $(this).resize(function (e){
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    _PlasticBug('resize(); called:', 4, 'function');
                    _PlasticBug('LIST: ', 4, 'comment');
                    _PlasticBug($(this), 4, 'comment');
                    _PlasticBug($(this).parent(), 4, 'comment');
                    $(this).outerHeight($(this).parent().height() - $(this).parent().children('ul:first').outerHeight());
                });
                this.PlasticAjaxProc = function _plasticview_plasticAjaxProc(rowObjects, fopts) {
                    var ajaxId = ((rowObjects) && (rowObjects.length) && rowObjects[0].ajaxid) ? rowObjects[0].ajaxid : 0;
                    if ((ajaxId) && (ajaxStack) && (ajaxStack[ajaxId])) {
                        var recordsTotal = 0, recordsFiltered = 0;
                        if ((ajaxStack[ajaxId].retFunction) && (typeof (ajaxStack[ajaxId].retFunction) === 'function')) {
                            if (rowObjects.length > 1) {
                                var data = [], records = {};
                                if (datastore) {
                                    var fullColumns = datastore.option('attributes').split(',');
                                    var recordIndex = 0;
                                    for (var cntRecord = 0;  cntRecord < (rowObjects.length -1); cntRecord ++) {
                                        recordsTotal ++;
                                    if (rowObjects[cntRecord +1].hidden) { continue; };
                                        recordsFiltered ++;
                                    if ((cntRecord >= ajaxStack[ajaxId].data.start) && //->
                                        (cntRecord < ajaxStack[ajaxId].data.start + 45)) { // Make Smarter (FindMe!!)
                                        data[recordIndex] = {};
                                        data[recordIndex].rowObject = $.extend({}, rowObjects[cntRecord +1]);
                                        for (var cntCol = 0; cntCol < fullColumns.length; cntCol ++) {
                                            if ((rowObjects[cntRecord +1]) && (rowObjects[cntRecord +1].attributes)) {
                                                var thisColName = fullColumns[cntCol];
                                                data[recordIndex][thisColName] = (rowObjects[cntRecord +1].attributes[thisColName] !== undefined) //->
                                                    ? rowObjects[cntRecord +1].attributes[thisColName] : rowObjects[cntRecord +1][thisColName];
                                            }
                                        }
                                        keyRow[rowObjects[cntRecord +1]['key']] = recordIndex;
                                        recordIndex ++;
                                    }
                                    }
                                    records['draw'] = ajaxId;
                                    records['recordsTotal'] = rowObjects.length;
                                    records['recordsFiltered'] = rowObjects.length;
                                    records['data'] = data;
                                    ///var scrollPosition = this.plasticview.getScrollDetails();
                                    ajaxStack[ajaxId].retFunction(records);
                                    ///this.plasticview.setScrollDetails( scrollPosition );
                                }
                            }
                        }
                    } else {
                        //if ((rowObjects) && (rowObjects.length > 1) && (rowObjects[1].dirty)) {
                        if ((rowObjects) && (rowObjects.length > 1)) {
                            if (datastore) {
                                var fullColumns = datastore.option('attributes').split(',');
                                var table = $(this).find('.plastic-scroll-container .dataTable:first').DataTable();
                                var needsRedraw = 0;
                                var needsActivation = -1;
                                var makeActive = undefined;
                                for (var cntRow = 1; cntRow < rowObjects.length; cntRow ++) {
                                    if (rowObjects[0].status === 'created') {
                                        var thisRow = {};
                                        for (var cntCol = 0; cntCol < fullColumns.length; cntCol ++) {
                                            if ((rowObjects[cntRow]) && (rowObjects[cntRow].attributes)) {
                                                var thisColName = fullColumns[cntCol];
                                                thisRow[thisColName] = (rowObjects[cntRow].attributes[thisColName] !== undefined) //->
                                                    ? rowObjects[cntRow].attributes[thisColName] : rowObjects[cntRow][thisColName];
                                            }
                                        }
                                        thisRow.rowObject = rowObjects[cntRow];
                                        keyRow[thisRow.key] = table.row()[0].length;
                                        table.row.add(thisRow);
                                        needsRedraw += 1; // Consolidate Calls to Draw
                                    } else {
                                        var row = keyRow[rowObjects[cntRow].key];
                                        if (row !== undefined) {
                                            var data = table.row(row).data();
                                            for (var cntCol = 0; cntCol < fullColumns.length; cntCol ++) {
                                                if ((rowObjects[cntRow]) && (rowObjects[cntRow].attributes)) {
                                                    var thisColName = fullColumns[cntCol];
                                                    data[thisColName] = (rowObjects[cntRow].attributes[thisColName] !== undefined) //->
                                                        ? rowObjects[cntRow].attributes[thisColName] : rowObjects[cntRow][thisColName];
                                                }
                                            }
                                            data.rowObject = rowObjects[cntRow];
                                            table.row(row);
                                            needsRedraw += 1; // Consolidate Calls to Draw
                                            if ((activeRow) && (rowObjects[cntRow].key === activeRow)) {
                                                needsActivation = cntRow;
                                                makeActive = row;
                                            }
                                        }
                                    }
                                }
                                if (needsRedraw) { // Table Redraw required
                                    var scrollPosition = this.plasticview.getScrollDetails();
                                    table.draw();
                                    this.plasticview.setScrollDetails( scrollPosition );
                                }
                                if (needsActivation >= 0) { // Row Activation Required
                                    $(table.row(makeActive).node()).addClass('plastic-view-list-selected') //->
                                        .find('td:first input:first').prop('checked', true);
                                    var renderer = 'update'; // Support 'render' Here?? (FindMe!!)
                                    if ((rowObjects[needsActivation].key) && ($('.Plastic').plasticKeyFilter(rowObjects[needsActivation].key).length)) {
                                        var thisWidget = $('.Plastic').plasticKeyFilter(rowObjects[needsActivation].key);
                                        // _PlasticRuntime.inventory[thisWidget[0].id].options.layout (For Regex Subst [FindMe!!])
                                        if ((thisWidget) && (thisWidget.length) && (thisWidget[0][renderer]) && //->
                                            (typeof (thisWidget[0][renderer]) === 'function')) {
                                            thisWidget[0][renderer]([ { source: self, "status" : rowObjects[0].status }, rowObjects[needsActivation] ]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                this.PlasticAjax = function _plasticview_plasticajax(data ,retFunction, settings) {
                    _PlasticBug(this, 4, 'comment');
                    var retVal = {};
                    var ttt = fopts;
                    var thisAjaxStack = parseInt(data.draw);
                    if (ajaxStack[thisAjaxStack] === undefined) {
                        ajaxStack[thisAjaxStack] = {};
                        ajaxStack[thisAjaxStack].data = data;
                        ajaxStack[thisAjaxStack].retFunction = retFunction;
                        ajaxStack[thisAjaxStack].settings = settings;
                        if (datastore) {
                            datastore.readRows(null, null, self.rowsRead, { namespace: namespace, ajaxid: thisAjaxStack, flatten: true });
                        } else { // Add to SysFeedback??? (FindMe!!)
                            _PlasticBug('WARN: Undefined datastore found', 2);
                        }
                    }
                    return retVal;
                };
                this._getRowData = function _plasticview__getRowData() {
                    var table = $(this).closest('.plastic-view-list-base').dataTable();
                    //var row = table.fnGetPosition($(this).closest('tr'));
                    var row = table.fnGetPosition($(this).parent()[0])[0];
                    return table.api().row( row ).data();
                };

                $(this).on('click', '.plastic-view-list-selector', function(e, data){
                    e.stopPropagation(); // Prevent Checkbox Cycling (FindMe!!)
                    var checked = (e.originalEvent) //->
                        ? ($(this).prop('checked')) ? true : false //->
                        : ($(this).prop('checked')) ? false : true;
                    if ($(this).attr('type') === 'radio') {
                        $(this).closest('tr').siblings().removeClass('plastic-view-list-selected');
                        checked = true; // Radio always selected on click
                    }
                    if (checked) {
                        $(this).closest('tr').addClass('plastic-view-list-selected');
                        activeRow = ((self.length) && (self[0]._getRowData)) ? self[0]._getRowData.call(this).key : null;
                    } else {
                        $(this).closest('tr').removeClass('plastic-view-list-selected');
                    }
                    var component = $(this).closest('.Plastic.view-list');
                    var compId = (component) ? component.attr('id') : null;
                    var dsname = ((component) && (component.length) && (component[0].plasticopts)) ? component[0].plasticopts.datastore : null;
                    var namespace = ((component) && (component.length) && (component[0].plasticopts)) ? component[0].plasticopts.namespace : 'default';
                    var datastore = ((component) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                /*    if (datastore) {
                        // Roll This into function?? (FindMe!!)
                        var selected = group + '#selected';
                        var thisUpdate = {};
                        thisUpdate[selected] = null;
                        var table = $(this).closest('.plastic-field-group-table').dataTable();
                        $(this).closest('.plastic-field-group-table').find('.plastic-field-group-selected').each(function(){
                            var row = table.fnGetPosition(this);
                            if (thisUpdate[selected] === null) { thisUpdate[selected] = {} };
                            thisUpdate[selected][row] = true;
                        });
                        datastore.updateRow( key, [{ status: "metadataupdate" }, thisUpdate ], source.rowsUpdated, { namespace: namespace });
                    }
                */
                    //this.data = self[0]._getRowData.call(this.closest('tr'));
                    this.data = self[0]._getRowData;
                    if ((data) && (data.silent)) {
                        // Do Something Here?? (FindMe!!)
                    } else {
                        $(this).closest('.Plastic.view-list')[0].plasticview._activateFramework.call(this, //->
                            undefined, { target: $(this).closest('.Plastic.plastic-view') });
                    }
                });
                $(this).on('mouseup', '.plastic-view-list-base.dataTable td.plastic-list-flagbox', function(e){
                    if (e.target === this) {
                        $(this).children('.plastic-view-list-selector').click();
                    }
                });




                $(this).on('mouseover', '.plastic-view-list-base.dataTable td:not(.plastic-list-flagbox):not(.dataTables_empty)', function(e){
                    var table = $(this).closest('.plastic-view-list-base').DataTable();
                    var cell = table.cell($(this).closest('td'));
                    var row = (cell) ? cell.index().row : undefined;
                    var rowObject = (row !== undefined) ? table.row( row ).data().rowObject : {};
                    var column = (cell) ? cell.index().column : undefined;
                    var header = ((cell) && (cell.settings())) //->
                        ? cell.settings()[0].aoColumns[cell.index().column].data : undefined;
                    if (cell) {
                        var manageClass = (Plastic.Test.call(self, rowObject, 'canupdate', { path: header })) //->
                            ? 'removeClass' : 'addClass';
                        $($(this).closest('td'))[manageClass]('plastic-disabled');
                    }
                });
                $(this).on('mouseup', '.plastic-view-list-base.dataTable td:not(.plastic-list-flagbox):not(.dataTables_empty)', function(e){
                    if ((e.button !== 2) && //->
                        (!($(this).find('.plastic-view-list-edit').length)) && //->
                        (!($(this).closest('tr').hasClass('plastic-deleted')))) {
                        var compId = $(this).closest('.Plastic.view-list').attr('id');
                        var table = $(this).closest('.plastic-view-list-base').DataTable();
                        var cell = table.cell(this.closest('td'));
                        var row = (cell) ? cell.index().row : undefined;
                        var rowObject = (row !== undefined) ? table.row( row ).data().rowObject : {};
                        var column = (cell) ? cell.index().column : undefined;
                        var header = ((cell) && (cell.settings())) //->
                            ? cell.settings()[0].aoColumns[cell.index().column].data : undefined;
                        if ($(this).find('.plastic-checkable-icon').length) {
                            if (Plastic.Test.call(self, rowObject, 'canupdate', { path: header })) {
                                $(this).find('.plastic-checkable-icon').toggleClass('ui-icon-blank').toggleClass('ui-icon-check');
                            }
                            // Update values (FindMe!!)
                        } else {
                            if (Plastic.Test.call(self, rowObject, 'canupdate', { path: header })) {
                                $(this).closest('tr').find('input.plastic-view-list-selector:first').click();
                                if ($('div[plastic-sub-component=' + compId + ']').length) { // Is a SubComponent
                                    var thisSuperComponent = $('div[plastic-sub-component=' + compId + ']').closest('.Plastic');
                                    if ((thisSuperComponent) && (thisSuperComponent.length) && (thisSuperComponent[0].plasticopts) && //->
                                        (thisSuperComponent[0].plasticopts.fulfill) && (thisSuperComponent[0].plasticopts.fulfill[header])) {
                                    } else { // Basic Text Editor
                                        $(this).html('<input name="' + compId + '_' + header + '__' + row + '" ' + //->
                                            'id="' + compId + '_' + header + '__' + row + '" ' + //->
                                            'type="text" class="plastic-view-list-edit" value="' + $(this).text() + '">')
                                        $(this).find('.plastic-view-list-edit').focus().select();
                                    }
                                } else {
                                    $(this).html('<input name="' + compId + '_' + header + '__' + row + '" ' + //->
                                        'id="' + compId + '_' + header + '__' + row + '" ' + //->
                                        'type="text" class="plastic-view-list-edit" value="' + $(this).text() + '">')
                                    $(this).find('.plastic-view-list-edit').focus().select();
                                }
                            }
                        }
                    }
                });
                var newTable = '<table class="plastic-view-list-base" id="' + thisId + '_list" width="100%"><thead><tr><th>&nbsp;</th>';
                var newColumnTd = '<td>&nbsp;</td>';
                var fullColumns = [];
                var prettyNames = {};
                var thisInclude = [];
                var allColsButFlag = [];
                if ((fopts) && (fopts.datastore)) {
                    $.extend(prettyNames,_PlasticRuntime.datastore[fopts.datastore].option('prettyNames'));
                    fullColumns = _PlasticRuntime.datastore[fopts.datastore].option('attributes').split(',');
                    thisInclude = ((fopts) && (fopts.include)) ? fopts.include.split(/,/) : _PlasticRuntime.datastore[fopts.datastore].option('selected').split(',');
                }
                var thisIncludeObj = {};
                for (var cntInc = 0; cntInc < thisInclude.length; cntInc ++) { thisIncludeObj[thisInclude[cntInc]] = cntInc; };
                if ((fopts) && (fopts.prettyNames)) {
                    $.extend(prettyNames, fopts.prettyNames);
                }
                var invisibleTargets = [];
                var columns = ['plasticFlags'];
                var thisNameLabel;
                for (var cntCol = 0; cntCol < fullColumns.length; cntCol ++) {
                    thisNameLabel = (prettyNames[fullColumns[cntCol]] !== undefined) ? prettyNames[fullColumns[cntCol]] : fullColumns[cntCol];
                    newTable += '<th>' + thisNameLabel + '</th>';
                    columns[columns.length] = { data: fullColumns[cntCol] };
                    newColumnTd += '<td>&nbsp;</td>';
                    allColsButFlag[allColsButFlag.length] = (allColsButFlag.length +1);
                    if (thisIncludeObj[fullColumns[cntCol]] === undefined) { invisibleTargets[invisibleTargets.length] = (cntCol + 1); };
                }
                //newTable += '</tr></thead><tbody><tr>' + newColumnTd + </tr></tbody</table>';
                newTable += '</tr></thead><tbody></tbody</table>';
                $(this).append($(newTable));
                       var thisType = 'radio';
                //        if ((thisField) && (widgetargs) && (widgetargs.length) && //->
                //            (widgetargs[1].groupOptions) && (widgetargs[1].groupOptions[thisField]) && //->
                //            ((widgetargs[1].groupOptions[thisField].multiselect) || (widgetargs[1].groupOptions[thisField].gang))) {
                //            thisType = 'checkbox';
                //            $(this).find('th span:first').css('display', 'inline');
                //        }

                $(this).on('initialize.plastic', function (e) {
                    if (e.target === this) { // Direct events only
                        $(this).children('table:first').dataTable({
                            processing: true
                           ,serverSide: true
                           ,ajax: this.PlasticAjax
                           ,columnDefs: [
                                {
                                    "class": 'plastic-list-flagbox'
                                   ,orderable: false
                                   ,render: function() {
                                        var thisChecked = (/\[.*S.*\]/.test(arguments[0])) ? ' checked' : '';
                                        return '<input class="plastic-view-list-selector" name="' + //->
                                            thisId + '_select" type="' + thisType + '"' + thisChecked + '>';
                                    }
                                   ,targets: 0
                                }
                               ,{
                                    render: function(data, type, row, meta) {
                                        var retVal = data;
                                        if (typeof (retVal) === 'boolean') {
                                            retVal = '<span class="plastic-checkable-icon ui-icon ui-icon-' + ((retVal) ? 'check' : 'blank') + '"></span>';
                                        }
                                    /*
                                        if ((row.rowObject) && (row.rowObject.dirty)) {
                                            if (meta.settings.aoColumns[meta.col].data) {
                                            }
                                        }
                                    */
                                        return retVal;
                                    }
                                   ,targets: allColsButFlag
                                }
                               ,{   "visible": false,  "targets": invisibleTargets }
                            ]
                           ,rowCallback: function(row, data) {
                                if ((data) && (data.rowObject)) {
                                    if (data.rowObject.deleted) { $(row).addClass('plastic-deleted'); };
                                    if (data.rowObject.dirty) { $(row).addClass('plastic-dirty'); };
                                    if (datastore) {
                                        var selected = datastore.option('selected');
                                        // Target Deleted/ Dirty Columns (FindMe!!)
                                        $(row).children('td').each(function(){
                                        });
                                    }
                                }
                            }
                           ,order: [ 1, 'asc' ]
                           ,paging: false
                           ,searching: false
                           ,info: false
                           ,scrollX: true
                           ,scrollY: '100%'
                           ,scrollCollapse: false
                           ,deferRender: true
                           ,dom: 'frtiS'
                           ,columns: columns
                        });
                        $(this).find('.dataTables_scrollBody').addClass('plastic-scroll-container');
                    }
                });
                return $(this);
            }
        };
        this._appendFramework = function _plasticview__appendFramework() {
            _PlasticBug("_appendFramework(node); called", 5, 'function');
            _PlasticBug(this.data.title, 5, 'comment');
            ////this.setLazyNodeStatus( DTNodeStatus_Loading );
            var namespace = ((viewargs) && (viewargs.length > 1) && (viewargs[1].namespace)) ? viewargs[1].namespace : 'default';
//JOB
            datastore[namespace].readRows(this.data.key, null, self.rowsRead, { namespace: namespace });
            _PlasticBug(this.data.rowObject.key, 5, 'comment');
        };
        this._activateFramework = function _plasticview__activateFramework(event, xtra) {
            _PlasticBug("_activateFramework(); called", 4, 'function');
            var targetName = ((xtra) && (xtra.target)) ? xtra.target : self[0];
            var thisTarget = self._findTarget(targetName);
            var namespace = ((viewargs) && (viewargs.length > 1) && (viewargs[1].namespace)) ? viewargs[1].namespace : 'default';
            _PlasticBug(thisTarget, 4, 'comment');
            // See if Tests Are Required to Allow Row Activation
            var canActivate = true;
            if ((viewargs) && (viewargs.length > 1) && (viewargs[1].allowIf)) {
                var tests = viewargs[1].allowIf;
                for (var cntTest = 0; cntTest < tests.length; cntTest ++) {
                    canActivate = Plastic.Test.call(targetName, this.data.rowObject, tests[cntTest], viewargs[1]);
                    if (!(canActivate)) { break; }; // One false is enough
                }
            }
            var renderer = function (target) {
                var thisPath = ((xtra) && (xtra.path)) ? xtra.path : undefined;
                var thisCaller = ((xtra) && (xtra.caller)) ? xtra.caller : undefined;
                var thisDatastore = ((this.data) && (this.data.datastore)) ? this.data.datastore : undefined;
                var thisSource = (thisDatastore === undefined) ? self : undefined;
                // Make This Generic For All Views (FindMe!!)
                if ((target[0].render) && (typeof (target[0].render) === 'function')) {
                    ///var render = target[0].render;
                    var data = (this.data) ? (typeof (this.data) === 'function') ? this.data() : this.data : null;
                    if (data) {
                        if ((data.rowObject.augment) && (typeof (data.rowObject.augment) === 'function')) {
                            $('#PlasticHSplit_MainLayout').css({ 'cursor' : 'wait' });
                            $(target).css({ 'cursor' : 'wait' });
                            data.rowObject.augment.call(datastore, [ { "source" : thisSource, "datastore": thisDatastore, "path": thisPath }, //->
                                data.rowObject ], function (newRowObject, fopts) {
                                data.rowObject = newRowObject[1];
                                target[0].render([ { "source" : thisSource, "datastore": thisDatastore, //->
                                    "path": thisPath, "caller": thisCaller }, newRowObject[1] ]);
                                $('.plastic-actionable').trigger('actiontest.plastic');
                                $('#PlasticHSplit_MainLayout').css({ 'cursor' : 'auto' });
                                $(target).css({ 'cursor' : 'auto' });
                            }, { namespace: namespace });
                        } else { // Optimize This "If" Block?? (FindMe!!)
                            target[0].render([ { "source" : thisSource, "datastore": thisDatastore, //->
                                "path": thisPath, "caller": thisCaller }, data.rowObject ]);
                            $('.plastic-actionable').trigger('actiontest.plastic');
                        }
                    }
                }
            };

            if (canActivate) { // Render Row Target
                if ((xtra) && (xtra.path)) { // Alternate Datastore Path??
                    if ((self) && (self.length > 0) && (self[0].plasticopts) && (self[0].plasticopts.datastore)) {
                        _PlasticBug(self[0].plasticopts.datastore, 4, 'comment');
                        // Refactor Relation Logic ?? (FindMe!!)
                        var relation = xtra.path.split(/\//);
                        if (relation.length === 2) { // Outside This Datastore
                            var destRelative = relation[0].split(/:/);
                            destRelative[0] = 'domain';
                            if ((destRelative[0].length > 0) && destRelative[0] !== self[0].plasticopts.datastore) {
                                if (_PlasticRuntime.datastore[destRelative[0]] !== undefined) {
                                    var thisds = _PlasticRuntime.datastore[destRelative[0]];
                                    var thisKey = this.data.rowObject.key;
                                    var thisKey = 'AC95E430-459F-3FCF-916B-D9A05769EE73';
                                    thisds.readRow(thisKey, function(thisRowObject) {
                                        var thisData = { data: {} };
                                        thisData.data.rowObject = thisRowObject[1];
                                        thisData.data.datastore = destRelative[0];
                                        renderer.call(thisData, thisTarget);
                                    }, { namespace: 'default' });
                                } else {
                                    Plastic.Feedback.call(this, 'Unable to activate item: "' + this.data.rowObject.qualifiedTitle + //->
                                        '" (Invalid Datastore)', 'error', this.data.key);
                                }
                            } else {
                                _PlasticBug('WARN: Same datastore relation currently unsupported', 2);
                            }
                        } else {
                            _PlasticBug('WARN: Same datastore relation currently unsupported', 2);
                        }
                    } else {
                        Plastic.Feedback.call(this, 'Unable to activate item: "' + this.data.rowObject.qualifiedTitle + //->
                            '" (Undefined Datastore)', 'error', this.data.key);
                    }
                } else {
                    this.activateSilently && this.activateSilently();
                    renderer.call(this, thisTarget);
                }
            } else {
                _PlasticBug(this, 4, 'comment');
                Plastic.Feedback.call(this, 'Unable to activate item: "' + this.data.rowObject.qualifiedTitle + '" (Permission Denied)', 'information', this.data.key);
            }
            ////////retFunction.call(this);
            //Plastic.Tests.call(targetName, this.data.rowObject, 'canread', { namespace: 'default' }) {
            //}
        };
        this._selectFramework = function _plasticview__selectFramework() {
            _PlasticBug("_selectFramework(); called", 4, 'function');
            _PlasticBug(this.data.rowObject, 4, 'comment');
            
        };
        this._findTarget = function _plasticview__findTarget(source) {
            _PlasticBug("_findTarget(source); called", 4, 'function');
            var target = ((source.plasticopts) && (source.plasticopts['defaultTarget'])) //->
                ? source.plasticopts['defaultTarget'] : source;
            if (target['jquery'] === undefined) { // Not jQuery reference
                ///if (_PlasticRuntime['inventory'][target]) { // Check runtime details
                if ($('#' + target).length) { // Last Resort ??
                    target = $('#' + target);
                }
            }
            return target;
        };
        this.getScrollDetails = function _plasticview_getScrollDetails() {
            _PlasticBug(this, 4, 'comment');
            var retVal = [];
            if ($(this).hasClass('plastic-scroll-container')) {
                var thisTop = $(this).scrollTop();
                var thisLeft = $(this).scrollLeft();
                retVal[retVal.length] = [ this, { top: thisTop, left: thisLeft } ];
            }
            $(this).find('.plastic-scroll-container').each(function(){
                var thisTop = $(this).scrollTop();
                var thisLeft = $(this).scrollLeft();
                retVal[retVal.length] = [ this, { top: thisTop, left: thisLeft } ];
            });
            return (retVal.length) ? retVal : undefined;
        };
        this.setScrollDetails = function _plasticview_setScrollDetails(details) {
            _PlasticBug(this, 4, 'comment');
            if (details) {
                for (var cntContainer = 0; cntContainer < details.length; cntContainer ++) {
                    $(details[cntContainer][0]).scrollTop(details[cntContainer][1].top);
                    $(details[cntContainer][0]).scrollLeft(details[cntContainer][1].left);
                }
            }
        };
        this.resize = function _plasticview_resize() {
            _PlasticBug('resize(); called:', 4, 'function');
        };
        return this.each(function(item) {
            var thisId = $(this).attr('id');
            _PlasticBug('BUILD: ' + thisId, 4, 'build');
            _PlasticBug(viewargs, 4, 'build');
            var viewopts = (viewargs.length >= 2) ? viewargs[1] : {};
            if ((viewargs[0]) && (self._make[viewargs[0]] !== undefined)) {
                 _PlasticBug('THISID: ' + thisId, 4, 'build');
                view[thisId] = self._make[viewargs[0]].call(this, viewopts);
                view[thisId][0].plasticopts = viewopts;
                view[thisId][0].plasticview = self; // Find Cleaner Way??(FindMe!!)
                view[thisId][0].plasticcomponent = viewargs[0];
                view[thisId][0].isplastic = 'view';
                var wasRender = view[thisId][0].render;
                view[thisId][0].render = function _view_render_wrap(rowObjects) { // Stuff Data
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    $(this).data('plastic-row', rowObjects[1]);
                    $(this).data('plastic-key', rowObjects[1].key);
                    if ((wasRender) && (typeof (wasRender) === 'function')) {
                        wasRender.call(this, rowObjects);
                    }
                };
                module('PlasticView');
                test('Find required (view) methods for: ' + viewargs[0] + ' => ' + thisId, function() {
                    ok(typeof (self.rowsCreated) === 'function', 'Found (rowsCreated) method'); /*-##QUNIT##-*/
                    ok(typeof (self.rowsRead) === 'function', 'Found (rowsRead) method'); /*-##QUNIT##-*/
                    ok(typeof (self.rowsUpdated) === 'function', 'Found (rowsUpdated) method'); /*-##QUNIT##-*/
                    ok(typeof (self.rowsDeleted) === 'function', 'Found (rowsDeleted) method'); /*-##QUNIT##-*/
                    ok(typeof (self.resize) === 'function', 'Found (resize) method'); /*-##QUNIT##-*/
                    ok(typeof (self.getRowObjectFor) === 'function', 'Found (getRowObjectFor) method'); /*-##QUNIT##-*/
                });  
                // Horizontal splitter support - Roll this common?? (FindMe!!)
                if ((viewopts) && (viewopts['defaultwidth'])) {
                    view[thisId].outerWidth(viewopts['defaultwidth']);
                    view[thisId].addClass('plastic-width-manual');
                } else if ((viewopts) && (viewopts['fixedwidth'])) {
                    view[thisId].outerWidth(viewopts['fixedwidth']);
                    view[thisId].addClass('plastic-width-fixed');
                } else {
                    view[thisId].addClass('plastic-width-auto');
                }
                // Vertical splitter support - Roll this common?? (FindMe!!)
                if ((viewopts) && (viewopts['defaultheight'])) {
                    view[thisId].outerHeight(viewopts['defaultheight']);
                    view[thisId].addClass('plastic-height-manual');
                } else if ((viewopts) && (viewopts['fixedheight'])) {
                    view[thisId].outerHeight(viewopts['fixedheight']);
                    view[thisId].addClass('plastic-height-fixed');
                } else {
                    view[thisId].addClass('plastic-height-auto');
                }
                view[thisId].resize(function(){
                    _PlasticBug('resize(); called:', 4, 'function');
                });
            } else {
                view[thisId] = $(this).append($('<div class="plastic-undefined-component">Undefined View: ' + viewargs[0] + '</div>'));
            }
            view[thisId].addClass('plastic-view');
        });
    };
    $.fn.plasticview.render = function _plasticview_render(){
    };
    $.fn.plasticview.treeview = function() { // Testing
        _PlasticBug('PlasticTreeView', 4, 'comment');
    };
})( jQuery );

function PlasticTreeView() {
    var sequence = 0;
    var opts = {
        "storeName" : null
    };
    this.options = function _PlasticView_options() {
    };
    this.rowsRead = function _PlasticView_rowsRead() {
        
    };
}
 
/*
$(document).ready(function(){
    $("#treetest1").dynatree({
       "rootVisible" : true
      ,"title" : "Namespace"
      ,"key" : "Namespace"
    });
});
*/

