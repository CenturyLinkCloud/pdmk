//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/
/ Program: "PlasticStack.js" => Plastic Data Modeling Kit [pdmk]
/                               Stack Component Support
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
/* PlasticStack jQuery Plugin */

(function($){
    $.fn.plasticstack = function(fopts) {
        //var opts = $.extend({}, {}, fopts);
        var self = this;
        var stackargs = arguments;
        var widget = {};
        var stack = {};
        var stackLevel = 0;
        /*
        this.bindView = function _plasticstack_bindView() {
            _PlasticBug("bindView(PlasticView[, Namespace]); called", 4, 'function');
            _PlasticBug(this, 4, 'comment');
            if (arguments.length == 0) { _PlasticBug("Usage: this.bindView(PlasticView[, Namespace]);", undefined, undefined, 'warn'); };
            var namespace = (arguments.length == 2) ? arguments[1] : "default";
            view[namespace] = arguments[0];
            view[namespace].bindWidget(this, namespace);
            view[namespace].readRow(0);
        }
        this.rowsRead = function(rowObjects) {
            _PlasticBug('rowsRead(rowObjects); called', 4, 'function');
            for (var name in view) {
                _PlasticBug(view[name], 4, 'comment');
                var thisTree = view[name].dynatree("getTree");
                var thisTreeRoot = view[name].dynatree("getRoot");
                var prevEnable = thisTree.enableUpdate(false);
                for (var cntRow = 1; cntRow < rowObjects.length; cntRow++) {
                    var rowObject = rowObjects[cntRow];
                    thisTreeRoot.addChild({ "title" : rowObject.title, "key" : rowObject.key, "isFolder" : true, "isLazy" : true });
                }
                thisTree.enableUpdate(prevEnable);
            }
        };
        */
        // Define various "stack" constructors here
        this._make = {
            tab: function _plasticstack__make_tab(fopts){
                _PlasticBug('_make_tab(); called', 4, 'function');
                var toPrepend = '';
                var thisTabStack = this;
                thisTabStack.activate = function _plasticstack_tab_activate(target, fopts) {
                    $(this).tabs('select', $(target).closest('.plastic-tab-child', self).attr('id') );
                };
                $(this).children().each(function(){
                    this.parent = thisTabStack;
                    var thisId = ($(this).hasClass('plastic-layout')) ? $(this).attr('for') || $(this).attr('id') : $(this).attr('id');
                    //toPrepend += '<li><a href="#PlasticWrap' + $(this).attr('id') + '">' + $(this).attr('id') + '</a></li>';
                    var thisTab = ((fopts) && (fopts['prettyNames']) && (fopts['prettyNames'][thisId])) //->
                        ? fopts['prettyNames'][thisId] : thisId;
                    toPrepend += '<li><a class="plastic-stack-status" ' + //->
                        'href="#' + thisId + '">' + thisTab + '</a></li>';
                    $(this).addClass('plastic-tab-child'); // Fix plastic-component-loading bit (FindMe!!)
                });
                //$(this).children().wrap(function(){
                //    return '<div id="PlasticWrap' + $(this).attr('id') + '"></div>';
                //});
                $(this).prepend($('<div class="stack-tab-sizer"><iframe class="stack-tab-sizeframe plastic-sizeframe" /><ul>' + toPrepend + '</ul></div>'));
                $(this).children().wrapAll('<div class="stack-tab-wrap" />');
                $(this).resize(function(e){ // Roll this into a common resize function? (FindMe!!)
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    _PlasticBug('TTAABB: ', 4, 'comment');
                    _PlasticBug($(this), 4, 'comment');
                    ///$(this).outerHeight($(this).parent().height());
                    $(this).outerHeight( ((arguments.length > 1) && (arguments[1].height)) ? arguments[1].height : $(this).parent().height());
                    $(this).children('.Plastic').each(function (){
                        _PlasticBug($(this), 4, 'comment');
                        $(this).triggerHandler('resize');
                    });
                });
                return $(this).tabs({
                    title: "PlasticTabStack"
                   ,beforeLoad: function( event, ui ) { // Move To appendFramework?? (FindMe!!)
                        ui.jqXHR.error(function() {
                        ui.panel.html(
                            "Couldn't load this tab. We'll try to fix this as soon as possible. " +
                            "If this wouldn't be a demo." );
                        });
                    }
                   ,show: function(event, ui) {
                        $(ui.panel).trigger('activated.plastic');
                    }
                });
            }
           ,hsplit: function _plasticstack__make_hsplit(fopts) {
                _PlasticBug('_make_hsplit(); called', 4, 'function');
                var thisId = $(this).attr('id');
                $(this).children().addClass('plastic-visible-inactive');
                $(this).on('mousedown', '.plastic-hsplit', Plastic.SplitDown);
                if (!($('#plastic-split-wrap').length)) {
                    $('body').prepend($('<div id="plastic-split-wrap" class="Plastic plastic-hsplit-wrap plastic-vsplit-wrap pre-init" />'));
                    $('#plastic-split-wrap').on('mousemove', Plastic.SplitMove);
                    $('#plastic-split-wrap').on('mouseup', Plastic.SplitUp);
                }
		_PlasticBug('HHHHHHH', 4, 'comment');
                $(this).addClass('plastic-split-horizontal');
                var thisLeftChild = $(this).children('.Plastic:first');
                var thisRightSiblings = thisLeftChild.nextAll('.Plastic');
                while (thisRightSiblings.length) {
                    var thisLeftWidth = '100%';
                    if (thisLeftChild.hasClass('plastic-width-fixed')) {
                        thisLeftWidth = parseInt(thisLeftChild.outerWidth()) + 'px';
                    } else if (thisLeftChild.hasClass('plastic-width-manual')) {
                        thisLeftChild.parent().prepend('<div id="psplit_' + thisLeftChild.attr('id') + '" class="plastic-hsplit" />');
                        thisLeftChild.css('margin-right', parseInt(thisLeftChild.prev().outerWidth()) + 'px');
                        thisLeftWidth = parseInt(thisLeftChild.outerWidth() + thisLeftChild.prev().outerWidth()) + 'px';
                    }
                    thisLeftChild.css({ 'left': 'unset', 'right': '100%' });
                    thisLeftChild.parent().css('border-left', 'solid transparent ' + thisLeftWidth);
                    $('<div class="plastic-hsplit-child" data-level="' + stackLevel + '">') //->
                        .appendTo(thisLeftChild.parent()).append(thisRightSiblings);
                    thisLeftChild = thisLeftChild.next().children('.Plastic:first');
                    thisRightSiblings = thisLeftChild.nextAll('.Plastic');
                }
                ///throw new Error('ALT!');
                _PlasticBug('ALT!!', 0, 'comment');
                $(this).resize(function(e){
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    $(this).parent().triggerHandler('resize');
                });
                $(this).parent().resize(function(e){
                    return true;
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    if (e.target === this) { // Minimize bubbling recursion
                        var fullWidth = $(this).outerWidth();
                        var autoWidth = 0;
                        $(this).children('.stack-hsplit').children('div.plastic-hsplit').each(function(){
                            _PlasticBug('WIDTH-SPLIT: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                            
                        });
                        $(this).children('.stack-hsplit').children('div.plastic-width-fixed').each(function(){
                            _PlasticBug('WIDTH-FIXED: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                        });
                        $(this).children('.stack-hsplit').children('div.plastic-width-manual').each(function(){
                            _PlasticBug('WIDTH-MANUAL: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                        });
                        if (fullWidth > 0) { // Still room to stretch
                            autoWidth = (fullWidth / $(this).children('.stack-hsplit').children('div.plastic-width-auto').length);
                            $(this).children('.stack-hsplit').children('div.plastic-width-auto').each(function(){
                                $(this).outerWidth(autoWidth);
                                _PlasticBug('WIDTH-AUTO: ' + $(this).outerWidth(), 4, 'comment');
                                _PlasticBug($(this), 4, 'comment');
                            });
                            if ($(this).parent()[0].tagName == 'BODY') { // Top Element
                                $(this).height(
                                    $(window).height() - (parseInt($('body').css('margin-top')) + parseInt($('body').css('margin-bottom')))
                                );
                            } else {
                                $(this).height(
                                    parseInt($(this).parent().css('margin-top')) + parseInt($(this).parent().css('margin-bottom'))
                                );
                            }
                        }
                        //$(this).children('.stack-hsplit').children('.plastic-hsplit, .plastic-hsplit-child:not(:eq(0))').each(function(){
                        _PlasticBug($(this).children('.stack-hsplit'), 4, 'comment');
                        $(this).children('.stack-hsplit').each(function(){ // Each 'stack-hsplit' child
                            $(this).children('.plastic-hsplit, .plastic-hsplit-child').each(function(){ // Each 'plastic-hsplit' element
                                _PlasticBug('DD', 4, 'comment');
                                _PlasticBug($(this), 4, 'comment');
                                _PlasticBug($(this).prevAll('.plastic-hsplit:first'), 4, 'comment');
                                _PlasticBug($(this).prevAll('.plastic-hsplit-child:first'), 4, 'comment');
                                var toLeft = ($(this).hasClass('plastic-hsplit-child')) ? $(this).prevAll('.plastic-hsplit:first') : $(this).prevAll('.plastic-hsplit-child:first');
                                if (toLeft.length) { // Skip Leftmost Child Element (No Adjustment required)
                                    var marginLeft = parseInt(toLeft.css('margin-left')) + toLeft.outerWidth();
                                    _PlasticBug($(toLeft), 4, 'comment');
                                    _PlasticBug('LEFT: ' + marginLeft, 4, 'comment');
                                    _PlasticBug('TAG1: ' + $(this)[0].tagName, 4, 'comment');
                                    $(this).css('margin-left', marginLeft + 'px');
                                }
                                if (($(this).hasClass('plastic-hsplit-child'))) { $(this).triggerHandler('resize'); };
                            });
                        });
                    }
                });
                return $(this);
            }
           ,vsplit: function _plasticstack__make_vsplit(fopts) {
                _PlasticBug('_make_vsplit(); called', 4, 'function');
                var thisId = $(this).attr('id');
                $(this).children().addClass('plastic-visible-inactive');
                $(this).on('mousedown', '.plastic-vsplit', Plastic.SplitDown);
                if (!($('#plastic-split-wrap').length)) {
                    $('body').prepend($('<div id="plastic-split-wrap" class="Plastic plastic-hsplit-wrap plastic-vsplit-wrap pre-init" />'));
                    $('#plastic-split-wrap').on('mousemove', Plastic.SplitMove);
                    $('#plastic-split-wrap').on('mouseup', Plastic.SplitUp);
                }
		_PlasticBug('VVVVVVV', 4, 'comment');
                $(this).addClass('plastic-split-vertical');
                var thisLeftChild = $(this).children('.Plastic:first');
                var thisRightSiblings = thisLeftChild.nextAll('.Plastic');
                while (thisRightSiblings.length) {
                    var thisLeftHeight = '100%';
                    if (thisLeftChild.hasClass('plastic-height-fixed')) {
                        thisLeftHeight = parseInt(thisLeftChild.outerHeight()) + 'px';
                    } else if (thisLeftChild.hasClass('plastic-height-manual')) {
                        thisLeftChild.parent().prepend('<div id="psplit_' + thisLeftChild.attr('id') + '" class="plastic-vsplit" />');
                        thisLeftChild.css('margin-bottom', parseInt(thisLeftChild.prev().outerHeight()) + 'px');
                        thisLeftHeight = parseInt(thisLeftChild.outerHeight() + thisLeftChild.prev().outerHeight()) + 'px';
                    }
                    thisLeftChild.css({ 'top': 'unset', 'bottom': '100%' });
                    thisLeftChild.parent().css('border-top', 'solid transparent ' + thisLeftHeight);
                    $('<div class="plastic-vsplit-child" data-level="' + stackLevel + '">') //->
                        .appendTo(thisLeftChild.parent()).append(thisRightSiblings);
                    thisLeftChild = thisLeftChild.next().children('.Plastic:first');
                    thisRightSiblings = thisLeftChild.nextAll('.Plastic');
                }
                ///throw new Error('ALT!');
                _PlasticBug('ALT!!', 0, 'comment');
                $(this).resize(function(e){
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    $(this).parent().triggerHandler('resize');
                });
                $(this).parent().resize(function(e){
                    return true;
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    if (e.target === this) { // Minimize bubbling recursion
                        var fullWidth = $(this).outerWidth();
                        var autoWidth = 0;
                        $(this).children('.stack-hsplit').children('div.plastic-hsplit').each(function(){
                            _PlasticBug('WIDTH-SPLIT: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                            
                        });
                        $(this).children('.stack-hsplit').children('div.plastic-width-fixed').each(function(){
                            _PlasticBug('WIDTH-FIXED: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                        });
                        $(this).children('.stack-hsplit').children('div.plastic-width-manual').each(function(){
                            _PlasticBug('WIDTH-MANUAL: ' + $(this).outerWidth(), 4, 'comment');
                            fullWidth -= $(this).outerWidth();
                        });
                        if (fullWidth > 0) { // Still room to stretch
                            autoWidth = (fullWidth / $(this).children('.stack-hsplit').children('div.plastic-width-auto').length);
                            $(this).children('.stack-hsplit').children('div.plastic-width-auto').each(function(){
                                $(this).outerWidth(autoWidth);
                                _PlasticBug('WIDTH-AUTO: ' + $(this).outerWidth(), 4, 'comment');
                                _PlasticBug($(this), 4, 'comment');
                            });
                            if ($(this).parent()[0].tagName == 'BODY') { // Top Element
                                $(this).height(
                                    $(window).height() - (parseInt($('body').css('margin-top')) + parseInt($('body').css('margin-bottom')))
                                );
                            } else {
                                $(this).height(
                                    parseInt($(this).parent().css('margin-top')) + parseInt($(this).parent().css('margin-bottom'))
                                );
                            }
                        }
                        //$(this).children('.stack-hsplit').children('.plastic-hsplit, .plastic-hsplit-child:not(:eq(0))').each(function(){
                        _PlasticBug($(this).children('.stack-hsplit'), 4, 'comment');
                        $(this).children('.stack-hsplit').each(function(){ // Each 'stack-hsplit' child
                            $(this).children('.plastic-hsplit, .plastic-hsplit-child').each(function(){ // Each 'plastic-hsplit' element
                                _PlasticBug('DD', 4, 'comment');
                                _PlasticBug($(this), 4, 'comment');
                                _PlasticBug($(this).prevAll('.plastic-hsplit:first'), 4, 'comment');
                                _PlasticBug($(this).prevAll('.plastic-hsplit-child:first'), 4, 'comment');
                                var toLeft = ($(this).hasClass('plastic-hsplit-child')) ? $(this).prevAll('.plastic-hsplit:first') : $(this).prevAll('.plastic-hsplit-child:first');
                                if (toLeft.length) { // Skip Leftmost Child Element (No Adjustment required)
                                    var marginLeft = parseInt(toLeft.css('margin-left')) + toLeft.outerWidth();
                                    _PlasticBug($(toLeft), 4, 'comment');
                                    _PlasticBug('LEFT: ' + marginLeft, 4, 'comment');
                                    _PlasticBug('TAG1: ' + $(this)[0].tagName, 4, 'comment');
                                    $(this).css('margin-left', marginLeft + 'px');
                                }
                                if (($(this).hasClass('plastic-hsplit-child'))) { $(this).triggerHandler('resize'); };
                            });
                        });
                    }
                });
                return $(this);
            }
           ,stack: function _plasticstack__make_stack(fopts) {
                var thisStackStack = this;
                ///thisStackStack.activate = function _plasticstack_this_activate(index) {
                ///    $(this).children().removeClass('plastic-stack-active').addClass('plastic-stack-hidden');
                ///    $(this).children('#' + index).removeClass('plastic-stack-hidden').addClass('plastic-stack-active');
                ///};
                $(this).children().each(function(index){
                    this.parent = thisStackStack;
                    if (index) {
                    ///$(this).addClass((index) ? 'plastic-stack-hidden' : 'plastic-stack-active' );
                        $(this).addClass('plastic-stack-hidden');
                    } else {
                        var maxActive = $('.plastic-stack-active').plasticDataSorter('plastic-active') //->
                            .last().data('plastic-active');
                        if (maxActive === undefined) { maxActive = 49; };
                        $(this).addClass('plastic-stack-active').data('plastic-active', ++maxActive);
                    }
                });
                $(this).resize(function(e){
                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
                    $(this).outerHeight($(this).parent().height());
                    $(this).children('.Plastic').each(function(){
                        $(this).triggerHandler('resize');
                    });
                });
                return $(this);
            }
        };
        this._appendFramework = function _plasticstack__appendFramework() {
            _PlasticBug("_appendFramework(); called", 4, 'function');
        };
        return this.each(function(item) {
            var thisId = $(this).attr('id');
            _PlasticBug('BUILD: ' + thisId, 4, 'build');
            stackLevel ++;
            var stackopts = (stackargs.length >= 2) ? stackargs[1] : {};
            if ((stackargs[0]) && (self._make[stackargs[0]] !== undefined)) {
                stack[thisId] = self._make[stackargs[0]].call(this, stackopts);
                stack[thisId][0].plasticopts = stackopts;
                stack[thisId][0].plasticstack = self; // Find Cleaner Way??(FindMe!!)
                stack[thisId][0].plasticcomponent = stackargs[0];
                stack[thisId][0].isplastic = 'stack';
                // Horizontal splitter support - Roll this common?? (FindMe!!)
                if ((stackopts) && (stackopts['defaultwidth'])) {
                    stack[thisId].outerWidth(stackopts['defaultwidth']);
                    stack[thisId].addClass('plastic-width-manual');
                } else if ((stackopts) && (stackopts['fixedwidth'])) {
                    stack[thisId].outerWidth(stackopts['fixedwidth']);
                    stack[thisId].addClass('plastic-width-fixed');
                } else {
                    stack[thisId].addClass('plastic-width-auto');
                }
                // Vertical splitter support - Roll this common?? (FindMe!!)
                if ((stackopts) && (stackopts['defaultheight'])) {
                    stack[thisId].outerHeight(stackopts['defaultheight']);
                    stack[thisId].addClass('plastic-height-manual');
                } else if ((stackopts) && (stackopts['fixedheight'])) {
                    stack[thisId].outerHeight(stackopts['fixedheight']);
                    stack[thisId].addClass('plastic-height-fixed');
                } else {
                    stack[thisId].addClass('plastic-height-auto');
                }
            } else {
                stack[thisId] = $(this).append($('<div class="plastic-undefined-component">Undefined Stack: ' + stackargs[0] + '</div>'));
            }
            stack[thisId].addClass('plastic-stack').children('.Plastic').addClass('plastic-stack-child');
        });
    };
    $.fn.plasticstack.tabstack = function() { // Testing
        _PlasticBug('PlasticTabStack', 4, 'comment');
    };
})( jQuery );

