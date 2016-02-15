//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/
/ Program: "PlasticWidget.js" => Plastic Data Modeling Kit [pdmk]
/                                Widget Component Support
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
/* PlasticWidget jQuery Plugin */

(function($){
    $.fn.plasticwidget = function(fopts) {
        //var opts = $.extend({}, {}, fopts);
        var self = this;
        var widgetargs = arguments;
        var widget = {};
        var obRef = this;
        var view = {};
        this._register = function _plasticwidget_register(rowObject) { // Still Needed?? (FindMe!!)
            _PlasticBug('_plasticwidget_register(rowObject); called');
        };
        this._varExpand = Plastic.VarExpand; // Expand inline variables with data from row
        // Define various "widget" constructors here
        this._make = {
            form: function _plasticwidget__make_form(fopts){
                $(this).on('change', '.plastic-field-data:focus', Plastic.FormUpdate);
                $(this).on('keyup', '.plastic-field-data:focus, .plastic-field-group-edit:focus', Plastic.LossyFormUpdate);
                $(this).on('datechange', '.plastic-field-data', Plastic.LossyFormUpdate);
                $(this).on('mousedown', '.plastic-field-group-manage', function(){ $(this).addClass('plastic-field-group-pressed'); });
                $(this).on('mouseup', '.plastic-field-group-manage', function(){ $(this).removeClass('plastic-field-group-pressed'); });
                $(this).on('click', '.plastic-field-group-selector', function(e){
                    e.stopPropagation(); // Prevent Checkbox Cycling (FindMe!!)
                    var checked = (e.originalEvent) //->
                        ? ($(this).prop('checked')) ? true : false //->
                        : ($(this).prop('checked')) ? false : true;
                    if ($(this).attr('type') === 'radio') {
                        $(this).closest('tr').siblings().removeClass('plastic-field-group-selected');
                        checked = true; // Radio always selected on click
                    }
                    if (checked) {
                        $(this).closest('tr').addClass('plastic-field-group-selected');
                    } else {
                        $(this).closest('tr').removeClass('plastic-field-group-selected');
                    }
                    var formWidget = $(this).closest('.Plastic.widget-form');
                    var formId = (formWidget) ? formWidget.attr('id') : null;
                    var group = (formWidget) ? $(this).closest('.plastic-field-group').attr('id').replace(new RegExp(formId + '_'), '') : null;
                    var source = (formWidget) ? formWidget[0].source : null;
                    var dsname = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.datastore : null;
                    var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                    var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                    var key = (formWidget) ? formWidget.data('plastic-key') : null;
                    if (datastore) {
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
                    ////$(this).closest('.plastic-field-group').find('.plastic-actionable').trigger('actiontest.plastic');
                });
                $(this).on('mouseup', '.plastic-field-group-table.dataTable td.plastic-grid-flagbox', function(e){
                    if (e.target === this) {
                        $(this).children('.plastic-field-group-selector').click();
                    }
                });
                $(this).on('click', 'th.plastic-grid-flagbox>span>input', function(e){
                    e.stopPropagation(); // Prevent Checkbox Cycling (FindMe!!)
                    var checked = (e.originalEvent) //->
                        ? ($(this).prop('checked')) ? true : false //->
                        : ($(this).prop('checked')) ? false : true;
                    $(this).closest('.plastic-field-group-table').find('.plastic-field-group-selector:not(:last)').each(function(){
                        if (checked) {
                            $(this).closest('tr').addClass('plastic-field-group-selected');
                        } else {
                            $(this).closest('tr').removeClass('plastic-field-group-selected');
                        }
                        $(this).prop('checked', checked);
                    });
                    $(this).closest('.plastic-field-group-table').find('.plastic-field-group-selector:last').prop('checked', !(checked)).trigger('click');
                });
                $(this).on('mouseup', '.plastic-field-group-table.dataTable th.plastic-grid-flagbox', function(e){
                    if (e.target === this) {
                        $(this).find('span>input').click();
                    }
                });
                $(this).on('keydown', 'input.plastic-field-group-selector', function(e){
                    if ((e.keyCode === 9) && (!(e.shiftKey))) { // Tab To Next Field
                        e.preventDefault();
                        $(this).closest('td').next().trigger('mouseup');
                    } else if ((e.keyCode === 9) && (e.shiftKey) && ($(this).closest('tr').prev('tr').children('td').length)) {
                        // Add New Class To Clean This Logic Up?? (FindMe!!)
                        if (!($(this).closest('tr').prev('tr').hasClass('plastic-deleted'))) {
                            e.preventDefault();
                            $(this).closest('tr').prev().children('td:last').trigger('mouseup');
                        }
                    }
                });
                $(this).on('keydown', '.plastic-field-group-table.dataTable td:not(.plastic-grid-flagbox):not(.dataTables_empty)', function(e){
                    if ((e.keyCode === 9) && (!(e.shiftKey)) && ($(this).next().length)) { // Tab To Next Field
                        e.preventDefault();
                        $(this).next().trigger('mouseup');
                    } else if ((e.keyCode === 9) && (e.shiftKey) && (!($(this).prev().hasClass('plastic-grid-flagbox')))) {
                        e.preventDefault();
                        $(this).prev().trigger('mouseup');
                    }
                });
                $(this).on('mouseup', '.plastic-field-group-table.dataTable td:not(.plastic-grid-flagbox):not(.dataTables_empty)', function(){
                    if (!($(this).find('.plastic-field-group-edit').length) && //->
                        (!($(this).closest('tr').hasClass('plastic-deleted')))) {
                        var formId = $(this).closest('.widget-form').attr('id');
                        var table = $(this).closest('.plastic-field-group-table').dataTable();
                        var rowId = table.dataTable().fnGetPosition(this)[0];
                        var colIndex = table.dataTable().fnGetPosition(this)[2];
                        var colId = table.parent().find('th').eq(colIndex).attr('id');
                        $(this).html('<input name="' + formId + '__GROUP__' + colId + '__' + rowId + '" ' + //->
                            'id="' + formId + '__GROUP__' + colId + '__' + rowId + '" ' + //->
                            'type="text" class="plastic-field-group-edit" value="' + $(this).text() + '">')
                        $(this).find('.plastic-field-group-edit').focus().select();
                    }
                });
                $(this).on('keyup', '.plastic-field-group-table.dataTable td input', function(e){
                    var table = $(this).closest('.plastic-field-group-table').dataTable();
                    ///var rowId = table.dataTable().fnGetPosition($(this).parent()[0])[0];
                    var rowId = table.fnGetPosition($(this).parent()[0])[0];
                    ///var colIndex = table.dataTable().fnGetPosition($(this).parent()[0])[2];
                    var colIndex = table.fnGetPosition($(this).parent()[0])[2];
                    var colId = table.parent().find('th').eq(colIndex).attr('id');
                    ///table.api().data()[rowId][colIndex] = $(this).find('.plastic-field-group-edit').val();
                    table.api().data()[rowId][colIndex] = $(this).val();
                    ///table.fnUpdate($(this).find('.plastic-field-group-edit').val(), rowId, colIndex, 0, 0);
                    ///table.fnUpdate($(this).val(), rowId, colIndex, 0, 0);
                    
                    //alert(colIndex + ' => ' + colId + ' => ' + table.api().data()[rowId][colIndex]);
                    /////table.api().cells({ row: rowId, column: colIndex }).invalidate();
                    ///table.api().sort();
                    if (e.keyCode === 13) { // Enter Pressed?
                        $(this).closest('.plastic-field-group-table.dataTable td').html($(this).val());
                    }
                });
                $(this).on('focusout', '.plastic-field-group-edit', function(){
                    $(this).closest('.plastic-field-group-table.dataTable td').html($(this).val());
                });
                $(this).on('click', '.plastic-field-group-delete, .plastic-subcomponent-delete', function(){
                    if (!($(this).hasClass('plastic-action-disabled'))) {
                        var formWidget = $(this).closest('.Plastic.widget-form');
                        var formId = (formWidget) ? formWidget.attr('id') : null;
                        var groupname = (formWidget) ? $(this).closest('.plastic-field-group').attr('id').replace(new RegExp(formId + '_'), '') : null;
                        var source = (formWidget) ? formWidget[0].source : null;
                        var dsname = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.datastore : null;
                        var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                        var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                        var key = (formWidget) ? formWidget.data('plastic-key') : null;
                        if (datastore) {
                            // Roll This into function?? (FindMe!!)
                            var deleted = groupname + '#deleted';
                            var thisUpdate = {};
                            thisUpdate[deleted] = null;
                            var table = $(this).closest('.plastic-field-group').find('.plastic-field-group-table').dataTable();
                            $(this).closest('.plastic-field-group').find('.plastic-field-group-selected').each(function(){
                                var row = table.fnGetPosition(this);
                                if (thisUpdate[deleted] === null) { thisUpdate[deleted] = {}; };
                                thisUpdate[deleted][row] = true;
                            });
                            datastore.updateRow( key, [{ status: "metadataupdate" }, thisUpdate ], source.rowsUpdated, { namespace: namespace });
                        }
                    }
                });
                $(this).on('click', '.plastic-field-select', function(){
                    $(this).autocomplete('close');
                });
                $(this).on('click', '.plastic-field-dropdown', function(){
                    if (!($(this).children('div:first').hasClass('plastic-disabled'))) {
                        if ($(this).prev('input').autocomplete('widget').is(':visible')) {
                            $(this).prev('input').autocomplete('close');
                        } else {
                            $('*[autocomplete]').autocomplete('close'); // Close any open autocompletes
                            $(this).prev('input').autocomplete('search','');
                        }
                    }
                });
                $(this).on('click', '.plastic-subcomponent-create', function(){
                    // Use this event to un-delete selected elements which are deleted (FindMe!!)
                    if (!($(this).hasClass('plastic-action-disabled'))) {
                        var formWidget = $(this).closest('.Plastic.widget-form');
                        var formId = (formWidget) ? formWidget.attr('id') : null;
                        var thisSubcomponent = $('#' + $(this).closest('.plastic-subcomponent').attr('plastic-sub-component') );
                        if ((thisSubcomponent) && (thisSubcomponent.length) && (thisSubcomponent[0].isplastic === 'view')) {
                            var dsname = ((thisSubcomponent[0].plasticopts) && (thisSubcomponent[0].plasticopts.datastore)) //->
                                ? thisSubcomponent[0].plasticopts.datastore : null;
                            var datastore = ((dsname) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                            if (datastore) {
                                datastore.createRow('csts-datastore-root-key-user', thisSubcomponent[0].plasticview.rowsCreated, { namespace: 'default' });
                                _PlasticBug(this, 4, 'comment');
                            }
                        }
                    }
                });
                $(this).on('click', '.plastic-field-group-create', function(){
                    // Use this event to un-delete selected elements which are deleted (FindMe!!)
                    if (!($(this).hasClass('plastic-action-disabled'))) {
                        var formWidget = $(this).closest('.Plastic.widget-form');
                        var formId = (formWidget) ? formWidget.attr('id') : null;
                        var groupname = (formWidget) ? $(this).closest('.plastic-field-group').attr('id').replace(new RegExp(formId + '_'), '') : null;
                        var source = (formWidget) ? formWidget[0].source : null;
                        var dsname = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.datastore : null;
                        var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                        var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                        var key = (formWidget) ? formWidget.data('plastic-key') : null;
                        if (datastore) {
                            var table = $(this).parent().next().find('.plastic-field-group-table').dataTable();
                            // Undelete Deleted If Selected
                            if ($(this).closest('.plastic-field-group').find('.plastic-field-group-selected.plastic-deleted').length) {
                                var deleted = groupname + '#deleted';
                                var thisUpdate = {};
                                thisUpdate[deleted] = null;
                                $(this).closest('.plastic-field-group').find('.plastic-field-group-selected').each(function(){
                                    var row = table.fnGetPosition(this);
                                    _PlasticBug(row, 4, 'comment');
                                    if ($(this).hasClass('plastic-deleted')) {
                                        if (thisUpdate[deleted] === null) { thisUpdate[deleted] = {}; };
                                        thisUpdate[deleted][row] = null;
                                    }
                                    datastore.updateRow( key, [{ status: "metadataupdate" }, thisUpdate ], source.rowsUpdated, { namespace: namespace });
                                });
                            } else { // Otherwise, Create "(NEW)" Blank Row
                                var cols = ((table.api().columns().length) && (table.api().columns()[0].length)) ? table.api().columns()[0].length : 0;
                                if (cols) {
                                    var thisNewRow = [];
                                    for (var cntNewRow = 0; cntNewRow < cols; cntNewRow ++) {
                                        thisNewRow[cntNewRow] = (cntNewRow) ? '(NEW)' : '&nbsp;' ;
                                    }
                                    table.api().row.add(thisNewRow).draw();
                                    _PlasticBug('LOG', 4, 'comment');
                                    $(this).parent().next().find('.plastic-field-group-table.dataTable td').each(function() {
                                        if ($(this).text() === '(NEW)') {
                                            $(this).trigger('mouseup');
                                            return false;
                                        }
                                    });
                                    datastore.updateRow(key, //->
                                        [{ status: 'creategrouprow' }, { groupname: groupname, groupindex: (table.api().data().length -1) }], //->
                                        source.rowsUpdated, { namespace: namespace });
                                }
                            }
                            _PlasticBug(key, 4, 'comment');
                        }
                        //$(this).parent().next().find('.plastic-field-group-table').DataTable().draw(false);
                    }
                });
                $(this).on('actiontest.plastic', '.plastic-field-group-manage', function(){
                    var subComponent = ($(this).closest('fieldset').hasClass('plastic-subcomponent-field')) //->
                        ? $('#' + $(this).closest('.plastic-subcomponent').attr('plastic-sub-component')) : null;
                    var formId = ($(this).closest('.widget-form').length) ? $(this).closest('.widget-form').attr('id') : null;
                    var rowId = ($('#' + formId).data('plastic-key')) ? $('#' + formId).data('plastic-key') : null;
                    if (subComponent) {
                        var datastore = ((subComponent.length) && (subComponent[0].plasticopts) && //->
                            (subComponent[0].plasticopts.datastore)) ? subComponent[0].plasticopts.datastore : null;
                        var namespace = ((datastore) && (subComponent[0].plasticopts.namespace)) //->
                            ? subComponent[0].plasticopts.namespace : 'default';
                        if (_PlasticRuntime.datastore[datastore]) {
                            var thisButton = this;
                            // Optimize logic to enable/ disable "Actions" (FindMe!!)
                            _PlasticRuntime.datastore[datastore].readRow(null, function(rowObject){
                                var source = (subComponent[0].isplastic === 'view') //->
                                    ? subComponent[0].plasticview //->
                                    : ((formId) && ($('#' + formId)[0].source)) //->
                                        ? $('#' + formId)[0].source : null;
                                if ((source) && (source.length)) {
                                    if ($(thisButton).hasClass('plastic-subcomponent-create')) {
                                        Plastic.Tests.call(source[0], rowObject[1], [ //->
                                            'cancreate' //->
                                                ])
                                                .pass(function(){
                                                    $(thisButton).removeClass('plastic-action-disabled');
                                                    $(thisButton).attr('title', $(thisButton).data('title'));
                                                })
                                                .fail(function() {
                                                    $(thisButton).addClass('plastic-action-disabled');
                                                    $(thisButton).data('title', $(thisButton).attr('title')).attr('title', '[Disabled]');
                                                });
                                    } else if ($(thisButton).hasClass('plastic-subcomponent-delete')) {
                                        Plastic.Tests.call(source[0], rowObject[1], [ //->
                                            'candelete' //->
                                                ])
                                                .pass(function() {
                                                    $(thisButton).removeClass('plastic-action-disabled');
                                                    $(thisButton).attr('title', $(thisButton).data('title'));
                                                })
                                                .fail(function() {
                                                    $(thisButton).addClass('plastic-action-disabled');
                                                    $(thisButton).data('title', $(thisButton).attr('title')).attr('title', '[Disabled]');
                                                });
                                    }
                                }
                            });
                        }
                    } else {
                        var groupName = ($(this).closest('.plastic-field-group').length) //->
                            ? $(this).closest('.plastic-field-group').attr('id').replace(new RegExp(formId + '_'), '') : null;
                        var source = ((formId) && ($('#' + formId)[0].source)) //->
                            ? $('#' + formId)[0].source : null;
                        var datastore = ((source) && (source.length) && (source[0].plasticopts) && (source[0].plasticopts.datastore)) //->
                            ? source[0].plasticopts.datastore : null;
                        var namespace = ((source) && (source.length) && (source[0].plasticopts) && (source[0].plasticopts.namespace)) //->
                            ? source[0].plasticopts.namespace : 'default';
                        if ((rowId) && (source) && (source.length) && (_PlasticRuntime.datastore[datastore])) {
                            var thisButton = this;
                            // Optimize logic to enable/ disable "Actions" (FindMe!!)
                            _PlasticRuntime.datastore[datastore].readRow(rowId, function(rowObject){
                                if ((rowObject) && (rowObject.length > 1)) {
                                    var flagObj = $('#' + formId + '_' + groupName) //->
                                        .find('.plastic-field-group-table.dataTable').DataTable().columns('0').data();
                                    if ($(thisButton).hasClass('plastic-field-group-create')) {
                                        Plastic.Tests.call(source[0], rowObject[1], [ //->
                                            [ 'cancreate', '@' + groupName ]
                                                ])
                                                .pass(function(){
                                                    $(thisButton).removeClass('plastic-action-disabled');
                                                    $(thisButton).attr('title', $(thisButton).data('title'));
                                                })
                                                .fail(function() {
                                                    $(thisButton).addClass('plastic-action-disabled');
                                                    $(thisButton).data('title', $(thisButton).attr('title')).attr('title', '[Disabled]');
                                                });
                                    } else if ($(thisButton).hasClass('plastic-field-group-delete')) {
                                        Plastic.Tests.call(source[0], rowObject[1], [ //->
                                           /// [ 'hasselection', '@' + groupName ]
                                            [ 'selectionhas', '@' + groupName, 'candelete' ]
                                           ///,[ 'candelete', '@' + groupName ]
                                           ,[ 'not-flag', '@' + groupName, 'i']
                                                ])
                                                .pass(function() {
                                                    $(thisButton).removeClass('plastic-action-disabled');
                                                    $(thisButton).attr('title', $(thisButton).data('title'));
                                                })
                                                .fail(function() {
                                                    $(thisButton).addClass('plastic-action-disabled');
                                                    $(thisButton).data('title', $(thisButton).attr('title')).attr('title', '[Disabled]');
                                                });
                                    }
                                }
                            }, { namespace: namespace });
                        }
                    }
                });
                $(this).on('actiontest.plastic', '.plastic-field-group-editor', function(){
                        var formWidget = $(this).closest('.Plastic.widget-form');
                        var formId = (formWidget) ? formWidget.attr('id') : null;
                        var groupname = (formWidget) ? $(this).closest('.plastic-field-group').attr('id').replace(new RegExp(formId + '_'), '') : null;
                        var source = (formWidget) ? formWidget[0].source : null;
                        var dsname = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.datastore : null;
                        var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                        var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                        var key = (formWidget) ? formWidget.data('plastic-key') : null;
                    var table = $(this).closest('.plastic-field-group').find('.plastic-field-group-table:eq(0)').dataTable();
                    _PlasticBug(this, 4, 'comment');
                    if (table.find('.plastic-field-group-selected').length) {
                        var selected = table.find('.plastic-field-group-selected');
                        var editor = this;
                        datastore.readRow(key, function(rowObject){
                            _PlasticBug(this, 4, 'comment');
                            var thisRow = table.fnGetPosition(selected[0]);
                            $(editor).find('.plastic-field-group-edit-data').each(function(){
                                var thisEditColumn = $(this).attr('id').replace(new RegExp('^' + formId + '_' + groupname + '_GROUPEDIT_'), '');
                                if ((rowObject) && (rowObject.length > 1) && (rowObject[1].attributes) && //->
                                    (rowObject[1].attributes[thisEditColumn]) && (rowObject[1].attributes[thisEditColumn][thisRow])) {
                                    $(this).val(rowObject[1].attributes[thisEditColumn][thisRow]);
                                }
                                _PlasticBug(this, 4, 'comment');
                            });
                            if ($(selected[0]).hasClass('plastic-deleted')) {
                                $(editor).find('th:first').text('Entry was Deleted');
                                $(editor).find('td.plastic-field-group-edit-value, .plastic-field-group-edit-data').addClass('plastic-deleted plastic-disabled');
                                $(editor).find('td input').prop('readonly', true);
                            } else {
                                $(editor).find('th:first').text('Update Or Delete Entry');
                                $(editor).find('td.plastic-field-group-edit-value, .plastic-field-group-edit-data').removeClass('plastic-deleted plastic-disabled');
                                $(editor).find('td input').prop('readonly', false);
                            }
                        }, { namespace: namespace });
                    } else { // Nothing Selected, Readonly Condition Set
                        $(this).find('th:first').text('Read Only');
                        $(this).find('.plastic-field-group-edit-data').val('').addClass('plastic-disabled');
                        $(this).find('.plastic-field-group-edit-data').prop('readonly', true);
                    }
                });
                var thisForm = this;
                //if (this.children.length) {
                //    thisForm = $(this).append($('<div class="plastic-form-wrapper" />'))[0];
                //    this.render = function _plasticwidget_form_wrapper_render(rowObjects) {
                //        thisForm.render.call(this, rowObjects);
                //    }
                //}
                // Create render function for this widget (to be rendered on the fly based on rowObjects)
                thisForm.render = function _plasticwidget_form_render(rowObjects) {
                    self._register.call(this, rowObjects);
                    var cntRow, cntCol, thisRow, thisId, thisFlag, thisFlagArgv, //->
                        thisName, thisNameLabel, thisValue, thisColSpanRemain, thisColSpan, //->
                        thisDate, thisDirty, thisError, thisRegex, thisReplace, thisReMod, thisSuffix, focusId;
                    var newDates = [];
                    var columnSpan = 0;
                    ////this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    ////this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    ////this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    ////$(this).data('plastic-row', rowObjects[1]);
                    ////$(this).data('plastic-key', rowObjects[1].key);
                    var thisTable = '';
                    var dsname = ((this.source) && (this.source.length) && (this.source[0].plasticopts) && //->
                        (this.source[0].plasticopts.datastore)) ? this.source[0].plasticopts.datastore : null;
                    var datastore = ((dsname) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                    ///var prettyNames = ((fopts) && (datastore)) ? $.extend({}, datastore.option('prettyNames'), fopts.prettyNames) : {};
                    var prettyNames = (datastore) //-> 
                        ? $.extend({}, datastore.option('prettyNames'), (fopts) ? fopts.prettyNames : {})
                        : ((fopts) && (fopts.prettyNames)) ? fopts.prettyNames : {};
                    // Freeze SubComponents
                    var subComponents = self._subComponentsFreeze.call(this);
                    $(this).html(''); // Clear previous render
                    if ((fopts) && (fopts['title'])) {
                        thisTable += '<div class="plastic-form-title">' + self._varExpand(fopts['title'], rowObjects[1]) + '</div>';
                    }
                    if ((fopts) && (fopts['description'])) {
                        thisTable += '<div class="plastic-form-description">' + self._varExpand(fopts['description'], rowObjects[1]) + '</div>';
                    }
                    if ((fopts) && (fopts['help']) && (fopts['help']['_inlinepre'])) {
                        thisTable += '<div class="plastic-form-inlinehelp">' + self._varExpand(fopts['help']['_inlinepre'], rowObjects[1]) + '</div>';
                    }
                    thisTable += '<table class="plastic-form-data"><tbody>';
                    if ((fopts) && (fopts['layout'])) {
                        // Find Max Column Values For Auto-ColSpanning
                        for (var cntRow = 0; cntRow < fopts['layout'].length; cntRow++) {
                            for (var cntCol = 0; cntCol < fopts['layout'][cntRow].length; cntCol++) {
                                columnSpan = Math.max(columnSpan, fopts['layout'][cntRow].length);
                            }
                        }
                        // Begin Main Row Builder Loop
                        for (var cntRow = 0; cntRow < fopts['layout'].length; cntRow++) {
                            thisRow = '<tr>';
                            // Check for Section Separator
                            if ((fopts['layout'][cntRow].length === 1) && (fopts['layout'][cntRow][0] === '---------')) {
                                thisRow += '<td colspan="' + (columnSpan * 2) + '"><hr></td></tr>';
                                thisTable += thisRow;
                                continue;
                            }
                            for (var cntCol = 0; cntCol < fopts['layout'][cntRow].length; cntCol++) {
                                thisColSpanRemain = (columnSpan - fopts['layout'][cntRow].length);
                                thisName = fopts['layout'][cntRow][cntCol];
                                thisFlag = thisRegex = thisReplace = thisReMod = '';
                                if ((thisName.length >= 1) && (/^[@#{>]/.test(thisName.charAt(0)))) {
                                    thisFlag += thisName.charAt(0);
                                    thisName = thisName.replace(/^./, '');
                                    if (thisName.indexOf(':') >= 0) {
                                        thisFlagArgv = thisName.replace(/^[^:]*:/, '').split(',');
                                        thisName = thisName.substr(0, thisName.indexOf(':'));
                                    }
                                } else {
                                    thisFlagArgv = undefined;
                                }
                                if (thisName.indexOf('.') > -1) { // Has RegExp search/replace pattern
                                    var sReplace = thisName.substr(thisName.indexOf('.') +1, thisName.length - thisName.indexOf('.'));
                                    thisName = thisName.substr(0, thisName.indexOf('.'));
                                    _PlasticBug('REPLACE: ' + thisName + ' => ' + sReplace, 4, 'comment');
                                    var esc = sReplace.match(/\\./g); // Capture Escape Sequences
                                    var part = sReplace.split(/\\./);
                                    var cntSlash = 0;
                                    for (var cntPart = 0; cntPart < part.length; cntPart++) {
                                        while (part[cntPart].indexOf('/') > -1) { // Slash Found
                                            cntSlash += 1;
                                            _PlasticBug('REPLACE_P0: ' + cntSlash, 4, 'comment');
                                            if (cntSlash < 3) {
                                                thisRegex += part[cntPart].substr(0, part[cntPart].indexOf('/'));
                                            } else {
                                                thisReplace += part[cntPart].substr(0, part[cntPart].indexOf('/'));
                                            //} else {
                                            //    thisReMod += part[cntPart].substr(0, part[cntPart].indexOf('/'));
                                            }
                                            _PlasticBug('REPLACE_P1: ' + thisRegex + '@@' + thisReplace + ' ' + part[cntPart], 4, 'comment');
                                            part[cntPart] = part[cntPart].substr(part[cntPart].indexOf('/') +1, part[cntPart].length - part[cntPart].indexOf('/'));
                                            _PlasticBug('REPLACE_P2: ' + thisRegex + '@@' + thisReplace + ' ' + part[cntPart], 4, 'comment');
                                        }
                                        thisRegex += ((esc) && (esc[cntPart])) ? esc[cntPart] : '';
                                        _PlasticBug('REPLACE_1: ' + part[cntPart] + ' ' + cntSlash, 4, 'comment');
                                        _PlasticBug('REPLACE_2: ' + thisRegex + ' => ' + thisReplace, 4, 'comment');
                                    }
                                }
                                thisError = ((rowObjects[1]) && (rowObjects[1].error) && (rowObjects[1].error[thisName] !== undefined)) //->
                                    ? ' plastic-error' : '';
                                thisDirty = ((rowObjects[1]) && (rowObjects[1].dirty) && (rowObjects[1].dirty[thisName] !== undefined)) //->
                                    ? ' plastic-dirty' : '';
                                thisId = $(this).attr('id') + '_' + thisName;
                                thisNameLabel = ((prettyNames) && (prettyNames[thisName])) //->
                                    ? self._varExpand(prettyNames[thisName], rowObjects[1]) : thisName;
                                if (focusId === undefined) { // First element gets focus?? (FindMe!!)
                                    focusId = thisId;
                                }
                                // Add Regex to make this safe (FindMe!!)
                                if (fopts['help']) {
                                    if (fopts['help']['_base']) {
                                        if (fopts['help'][thisName]) {
                                            thisName = '<a href="' + fopts['help']['_base'] + //->
                                                self._varExpand(fopts['help'][thisName], rowObjects[1]) + '">' + thisName + '</a>';
                                        } else {
                                            thisName = '<a href="' + fopts['help']['_base'] + thisName + '">' + thisName + '</a>';
                                        }
                                    }
                                }
                                _PlasticBug('FORM_BUILD: ' + fopts['layout'][cntRow][cntCol] + ' : ' + thisName, 4, 'comment');
                                if ((thisFlag) && (/@/.test(thisFlag))) { // Process Special "Group" Flag
                                    var thisButtons = '&nbsp;&nbsp;' + //->
                                        '<div class="plastic-field-group-manage plastic-field-group-delete plastic-actionable plastic-action-disabled"' + //->
                                        ' data-title="Click to remove selected item(s)" title="[Disabled]" />' + //->
                                        '<div class="plastic-field-group-manage plastic-field-group-create plastic-actionable plastic-action-disabled"' + //->
                                        ' data-title="Click to add new or undelete selected item(s)" title="[Disabled]" />';
                                    ///alert (thisName + ' => ' + thisFlag);
                                    var thisTest = new RegExp('^' + thisName + '_');
                                    var groupHeaderRow = '';
                                    var groupHeaders = [];
                                    var groupLabels = [];
                                    thisRow += '<td colspan="4">'; // Fix This Quick (FindMe!!)
                                    thisRow += '<fieldset class="plastic-field-group" name="' + thisId + '" id="' + thisId + '">';
                                    thisRow += '<legend class="plastic-field-group-legend">' + thisNameLabel + ':' + thisButtons + '</legend>';
                                    thisRow += '<div class="plastic-field-group-wrapper">';
                                    thisRow += '<table class="plastic-field-group-table" id="' + thisId + '_DT">';
                                    if ((thisFlagArgv) && (thisFlagArgv.length)) { // Use Parameters from Playbook
                                        for (var cntGroupCol = 0; cntGroupCol < thisFlagArgv.length; cntGroupCol ++) {
                                            groupHeaders[groupHeaders.length] = thisName + '_' + thisFlagArgv[cntGroupCol];
                                        }
                                    ///} else if () { // Grab From DataStore?? (FindMe!!)
                                    } else { // Build From Attributes (Last Resort)
                                        for (var thisAttr in rowObjects[1].attributes) {
                                            if (thisTest.test(thisAttr)) {
                                                groupHeaders[groupHeaders.length] = thisAttr;
                                            }
                                        }
                                    }
                                    if (groupHeaders.length) {
                                        for (var cntGroupCol = 0; cntGroupCol < groupHeaders.length; cntGroupCol ++) {
                                            groupLabels[cntGroupCol]  = '<th id="' + $(this).attr('id') + '_' + groupHeaders[cntGroupCol] + '">'
                                            /////groupLabels[cntGroupCol]  = '<th id="' + groupHeaders[cntGroupCol] + '">'
                                            groupLabels[cntGroupCol] += ((fopts['prettyNames']) && (fopts['prettyNames'][groupHeaders[cntGroupCol]])) //->
                                                ? self._varExpand(fopts['prettyNames'][groupHeaders[cntGroupCol]], rowObjects[1])
                                                : groupHeaders[cntGroupCol].replace(thisTest, '');
                                            groupLabels[cntGroupCol] += '</th>'
                                        }
                                        groupHeaderRow = '<thead><tr><th>' + //->
                                            '<span class="plastic-field-group-control "id="' + $(this).attr('id') + '_CTL' +'">' + //->
                                            '<input type="checkbox" title="Click to (de)select all"></span>' + //->
                                            '</th>' + groupLabels.join('') + '</tr></thead>';
                                    }
                                    thisRow += groupHeaderRow;
                                    thisRow += '<tbody>';
                                    var cntGroupRow = 0;
                                    while ("FOREVER") { // Loop Through Existing Row Data
                                        var groupDataFound = 0;
                                        ///var thisGroupRow = '<tr><td class="plastic-grid-flagbox">&nbsp;</td>';
                                        var thisClassSet = [], thisFlags = '';
                                        if ((rowObjects[1].attributes[thisName + '#selected']) && //->
                                            (rowObjects[1].attributes[thisName + '#selected'][cntGroupRow])) {
                                            thisClassSet[thisClassSet.length] = 'plastic-field-group-selected';
                                            thisFlags += 'S';
                                        }
                                        if ((rowObjects[1].attributes[thisName + '#deleted']) && //->
                                            (rowObjects[1].attributes[thisName + '#deleted'][cntGroupRow])) {
                                            thisClassSet[thisClassSet.length] = 'plastic-deleted';
                                            thisFlags += 'D';
                                        }
                                        var thisRowClass = (thisClassSet.length) ? ' class="' + thisClassSet.join(" ") + '"' : '';
                                        var thisGroupRow = '<tr' + thisRowClass + '><td>&nbsp;[' + thisFlags + ']</td>';
                                        thisClassSet = []; // Reset for Column Classes
                                        var thisColClass = '';
                                        for (var cntGroupCol = 0; cntGroupCol < groupHeaders.length; cntGroupCol ++) {
                                            if ((rowObjects[1].attributes) && (rowObjects[1].attributes[groupHeaders[cntGroupCol]]) && //>
                                                (rowObjects[1].attributes[groupHeaders[cntGroupCol]][cntGroupRow])) {
                                                if ((rowObjects[1].dirty) && (rowObjects[1].dirty[groupHeaders[cntGroupCol]]) && //->
                                                    (rowObjects[1].dirty[groupHeaders[cntGroupCol]][cntGroupRow])) {
                                                    thisClassSet[thisClassSet.length] = 'plastic-dirty';
                                                }
                                                if ((rowObjects[1].error) && (rowObjects[1].error[groupHeaders[cntGroupCol]]) && //->
                                                    (rowObjects[1].error[groupHeaders[cntGroupCol]][cntGroupRow])) {
                                                    thisClassSet[thisClassSet.length] = 'plastic-error';
                                                }
                                                thisColClass = (thisClassSet.length) ? ' class="' + thisClassSet.join(" ") + '"' : '';
                                                thisGroupRow += '<td' + thisColClass + '>' + rowObjects[1].attributes[groupHeaders[cntGroupCol]][cntGroupRow] + '</td>';
                                                groupDataFound += 1;
                                            } else {
                                                thisGroupRow += '<td>&nbsp;</td>';
                                            }
                                        }
                                        thisGroupRow += '</tr>';
                                        cntGroupRow ++;
                                        if (!(groupDataFound)) { break; };
                                        thisRow += thisGroupRow;
                                    }
                                    thisRow += '</tbody></table></div>';
                                    if ((fopts) && (fopts.groupOptions) && (fopts.groupOptions[thisName]) && //->
                                        (fopts.groupOptions[thisName].gang)) {
                                        thisRow += '<div class="plastic-field-group-message">';
                                        thisRow += '<img class="plastic-message-icon-small" src="images/plastic-information.png" />';
                                        thisRow += 'NOTE: Selected rows will be edited as a collection (gang operation)';
                                        thisRow += '</div>';
                                    }
                                    if ((fopts) && (fopts.groupOptions) && (fopts.groupOptions[thisName]) && //->
                                        (fopts.groupOptions[thisName].editor)) {
                                        var thisEditor = fopts.groupOptions[thisName].editor;
                                        var groupColSpan = 0;
                                        for (var thisEditRow = 0; thisEditRow < thisEditor.length; thisEditRow ++) {
                                            groupColSpan = Math.max(groupColSpan, thisEditor[thisEditRow].length);
                                        }
                                        var thisEditTable = '<div class="plastic-field-group-editor plastic-actionable"><table>';
                                        thisEditTable += '<thead><tr><th colspan="' + (groupColSpan * 2)  + '">Readonly</th></tr></thead><tbody>';
                                        for (var thisEditRow = 0; thisEditRow < thisEditor.length; thisEditRow ++) {
                                            thisEditTable += '<tr>';
                                            for (var thisEditCol = 0; thisEditCol < thisEditor[thisEditRow].length; thisEditCol ++) {
                                                var thisPrettyName = ((widgetargs) && (widgetargs.length > 1) && (widgetargs[1].prettyNames) && //->
                                                    (widgetargs[1].prettyNames[thisEditor[thisEditRow][thisEditCol]])) //->
                                                    ? widgetargs[1].prettyNames[thisEditor[thisEditRow][thisEditCol]] //->
                                                    : ((fopts) && (fopts.prettyNames) && (fopts.prettyNames[thisEditor[thisEditRow][thisEditCol]])) //->
                                                        ? fopts.prettyNames[thisEditor[thisEditRow][thisEditCol]] : thisEditor[thisEditRow][thisEditCol];
                                                var thisTableColValue = thisEditor[thisEditRow][thisEditCol];
                                                thisEditTable += '<td class="plastic-field-group-edit-label">' + //->
                                                    '<label for="' + thisId + '_GROUPEDIT_' + thisTableColValue + '">' + thisPrettyName + ':</label></td>';
                                                thisEditTable += '<td class="plastic-field-group-edit-value">' + //->
                                                    '<input type="text" class="plastic-field-group-edit-data" ' + //->
                                                    'id="' + thisId + '_GROUPEDIT_' + thisTableColValue + '"></td>';
                                            }
                                            thisEditTable += '</tr>';
                                        }
                                        thisEditTable += '</tbody></table></div>';
                                        thisRow += thisEditTable;
                                    }
                                    thisRow += '</fieldset>';
                                    thisRow += '</td>';
                                    thisRow += '</tr>';
                                    continue;
                                } else if ((thisFlag) && (/>/.test(thisFlag))) { // Process Special "SubComponent" Flag
                                    ///alert('> SubComponent');
                                    thisRow += '</tr></tbody></table>';
                                    var iefix = ($.browser.msie) ? ' iefix' : '';
                                    var thisButtons = '&nbsp;&nbsp;' + //->
                                        '<div class="plastic-field-group-manage plastic-subcomponent-delete plastic-actionable plastic-action-disabled"' + //->
                                        ' data-title="Click to remove selected item(s)" title="[Disabled]" />' + //->
                                        '<div class="plastic-field-group-manage plastic-subcomponent-create plastic-actionable plastic-action-disabled"' + //->
                                        ' data-title="Click to add new or undelete selected item(s)" title="[Disabled]" />';
                                    thisColSpan = (thisColSpanRemain > 0) ? ' colspan="' + ((thisColSpanRemain * 2) + 2) + '"' : '';
                                    thisRow += '<div class="plastic-subcomponent" ' + //->
                                        'plastic-sub-component="' + thisName + '"' + thisColSpan + '>';
                                    thisRow += '<fieldset class="plastic-subcomponent-field' + iefix + '" name="' + thisId + '" id="' + thisId + '">';
                                    thisRow += '<legend class="plastic-subcomponent-legend">' + thisNameLabel + ':' + thisButtons + '</legend>';
                                    thisRow += '</fieldset></div>';
                                    thisRow += '<table class="plastic-form-data"><tbody><tr>';
                                    continue;
                                }
                                //thisColSpanRemain --;
                                thisRow += '<td class="plastic-field-label"><label for="' + thisId + '">' + thisNameLabel + ':</label></td>'
                                thisSuffix = ((fopts['suffix']) && (fopts['suffix'][thisName])) //->
                                    ? '</td><td class="plastic-field-suffix">' + self._varExpand(fopts['suffix'][thisName], rowObjects[1]) : '';
                                thisColSpan = (thisColSpanRemain > 0) ? ' colspan="' + ((thisColSpanRemain * 2) + 1) + '"' : '';
                                if ((rowObjects[1]) && (rowObjects[1]['attributes']) && //-> // Pass boolean values cleanly
                                    (rowObjects[1]['attributes'][thisName] !== null) && //->
                                    (typeof (rowObjects[1]['attributes'][thisName]) == 'boolean')) {
                                    _PlasticBug('BOOLEAN_FOUND: ' + thisName, 4, 'comment');
                                    thisValue = (rowObjects[1]['attributes'][thisName]) ? ' checked' : '';;
                                    thisRow += '<td class="plastic-field-value' + thisDirty + thisError + '"' + thisColSpan + '>' + //->
                                        '<input class="plastic-field-boolean plastic-field-data' + thisDirty + thisError + '" ' + //->
                                        'type="checkbox" name="' + thisId + '" id="' + thisId + '"' + thisValue + '>' + thisSuffix + '</td>';
                                } else { // Expand values
                                    // Do Regex replacement here (FindMe!!)
                                    thisValue = self._varExpand('%{' + thisName + '}', rowObjects[1]);
                                    if (thisRegex.length) {
                                        thisValue = (thisReMod.length) //->
                                            ? thisValue.replace(new RegExp(thisRegex), thisReplace) //->
                                            : thisValue.replace(new RegExp(thisRegex, thisReMod), thisReplace);
                                        _PlasticBug('REPLACE: ' + thisReMod, 4, 'comment');
                                    }
                                    if ((fopts['fulfill']) && (fopts['fulfill'][thisName])) {
                                        thisRow += '<td class="plastic-field-value' + thisDirty + thisError + '"' + thisColSpan + '>' + //->
                                            '<div class="plastic-field-wrap"><input class="plastic-field-select plastic-field-data' + thisDirty + thisError + '" ' + //->
                                            'type="text" name="' + thisId + '" id="' + thisId + '" value="' + thisValue + '" readonly>' + thisSuffix + //->
                                            '<div class="plastic-field-dropdown"><div class="plastic-field-dropdown-state" /></div></div></td>';
                                    } else if ((fopts['cast']) && (fopts['cast'][thisName])) {
                                        // Move to select/case ?? (FindMe!!)
                                        if (typeof fopts['cast'][thisName] == 'function') { // Functions not allowed in JSON, Drop this (FindMe!!)
                                        } else if (fopts['cast'][thisName] == 'stringbool') {
                                            thisValue = (thisValue == 'false') ? '' : ' checked';
                                            thisRow += '<td class="plastic-field-value' + thisDirty + thisError + '"' + thisColSpan + '>' + //->
                                                '<input class="plastic-field-boolean plastic-field-data' + thisDirty + thisError + '" ' + //->
                                                'type="checkbox" name="' + thisId + '" id="' + thisId + '"' + thisValue + '>' + thisSuffix + '</td>';
                                        }
                                    } else {
                                        var thisType = 'text';
                                        if ((rowObjects[1]) && (rowObjects[1]['attributes']) && //-> // Pass date values cleanly
                                            (rowObjects[1]['attributes'][thisName]) && //->
                                            (rowObjects[1]['attributes'][thisName] instanceof Date)) {
                                            newDates[newDates.length] = [ '#' + thisId, rowObjects[1]['attributes'][thisName] ];
                                            thisDate = ' plastic-field-date';
                                            thisType = 'date';
                                        } else {
                                            thisDate = '';
                                            if ((rowObjects[1]) && (rowObjects[1]['attributes']) && //-> // Pass numeric values cleanly
                                                (rowObjects[1]['attributes'][thisName] !== undefined) && //->
                                                (typeof (rowObjects[1]['attributes'][thisName]) === 'number')) {
                                                thisType = 'number';
                                            }
                                        }
                                        if ((thisFlag) && ((/#/.test(thisFlag)) || (/{/.test(thisFlag)))) { // TextArea Flag Found??
                                            var tallField = (/{/.test(thisFlag)) ? ' plastic-field-tall' : '';
                                            thisRow += '<td class="plastic-field-value' + thisDirty + thisError + '"' + thisColSpan + '>' + //->
                                                '<textarea class="plastic-field-text plastic-field-data' + tallField + //->
                                                thisDate + thisDirty + thisError + '" ' + //->
                                                'type="' + thisType + '" name="' + thisId + '" id="' + thisId + '">' + //->
                                                thisValue + '</textarea>' + thisSuffix + '</td>';
                                        } else {
                                            thisRow += '<td class="plastic-field-value' + thisDirty + thisError + '"' + thisColSpan + '>' + //->
                                                '<input class="plastic-field-text plastic-field-data' + thisDate + thisDirty + thisError + '" ' + //->
                                                'type="' + thisType + '" name="' + thisId + '" id="' + thisId + '" value="' + thisValue + '">' + //->
                                                thisSuffix + '</td>';
                                        }
                                    }
                                }
                            }
                            thisRow += '</tr>';
                            thisTable += thisRow;
                            if ((fopts['help']) && (fopts['help']['$' + thisName])) {
                                thisTable += '<tr><td colspan="2" class="plastic-field-help">' + //->
                                    self._varExpand(fopts['help']['$' + thisName], rowObjects[1]) + '</td></tr>';
                            }
                        }
                        ///if ((this.parent) && (this.parent.activate) && //->
                        ///    (typeof (this.parent.activate) === 'function')) {
                        ///    this.parent.activate($(this).attr('id'));
                        ///}
                    }
                    thisTable += '</tbody></table>';
                    if ((fopts) && (fopts['help']) && (fopts['help']['_inline'])) {
                        thisTable += '<div class="plastic-form-inlinehelp">' + self._varExpand(fopts['help']['_inline'], rowObjects[1]) + '</div>';
                    }
                    $(this).html($(thisTable));
                    if ((newDates) && (newDates.length)) {
                        for (var cntDate = 0; cntDate < newDates.length; cntDate ++) {
                            var dateFormat = ((this.source) && (this.source.length) && (this.source[0].plasticopts) && //->
                                (this.source[0].plasticopts.datastore) && //->
                                (_PlasticRuntime.datastore[this.source[0].plasticopts.datastore].option('dateFormat'))) //->
                                ? _PlasticRuntime.datastore[this.source[0].plasticopts.datastore].option('dateFormat') : 'yy-mm-dd';
                            $(newDates[cntDate][0]).attr({ readonly: true, original: newDates[cntDate][1].toString() });
                            $(newDates[cntDate][0]).datepicker({
                                changeMonth: true
                               ,changeYear: true
                               ,dateFormat: dateFormat
                           ///    ,showOn: 'both' // Format This Nice (FindMe!!)
                           ///    ,buttonImage: "/_DHCP/cxm/images/calendar.gif"
                           ///    ,buttonImageOnly: true
                               ,beforeShowDay: function(date) {
                                    var dClass = '';
                                    var original = new Date($(this).attr('original'));
                                    var current = $(this).datepicker('getDate');
                                    if ((current) && (current.setHours(0,0,0,0) !== original.setHours(0,0,0,0))) {
                                        dClass = (date.setHours(0,0,0,0) === original.setHours(0,0,0,0)) ? 'plastic-deleted' : '';
                                    }
                                    return [true, dClass, ""];
                                }
                               ,onSelect: function (value, date) {
                                    $(this).trigger('datechange', { from: 'datepicker' }); // Not Quite Working Yet (FindMe!!)
                                }
                            });
                            $(newDates[cntDate][0]).datepicker('setDate', newDates[cntDate][1]);
                            // Focus Function Needs To Acknowledge '.plastic-disabled' Class
                            $(newDates[cntDate][0]).off('focus');
                            // Roll This Common?? (FindMe!!)
                            $(newDates[cntDate][0]).on('focus', function(e){
                                if (!($(this).hasClass('plastic-disabled'))) {
                                    $.datepicker._showDatepicker.apply(this, arguments);
                                }
                            });
                        }
                    }
                    $(this).find('.plastic-field-group-wrapper').each(function(){
                        $(this).width($(this).closest('.Plastic.widget-form').innerWidth() * .92);
                    });
                    ///$('.plastic-field-group-table').dataTable({ scrollY: 300, paging: false, searching: false });
                    $(this).find('.plastic-field-group-table').each(function(){
                        var thisTable = $(this).closest('.plastic-field-group').attr('id');
                        var thisField = (thisTable) ? thisTable.replace(new RegExp('^' + $(self).attr('id') + '_'), '') : null;
                        var thisType = 'radio';
                        if ((thisField) && (widgetargs) && (widgetargs.length) && //->
                            (widgetargs[1].groupOptions) && (widgetargs[1].groupOptions[thisField]) && //->
                            ((widgetargs[1].groupOptions[thisField].multiselect) || (widgetargs[1].groupOptions[thisField].gang))) {
                            thisType = 'checkbox';
                            $(this).find('th span:first').css('display', 'inline');
                        }
                        $(this).dataTable({
                            columnDefs: [ {
                                "class": 'plastic-grid-flagbox'
                               ,orderable: false
                               ,render: function() {
                                    var thisChecked = (/\[.*S.*\]/.test(arguments[0])) ? ' checked' : '';
                                    return '<input class="plastic-field-group-selector" name="' + //->
                                        thisTable + '_select" type="' + thisType + '"' + thisChecked + '>';
                                }
                               ,targets: 0
                            } ]
                           ,order: [ 1, 'asc' ]
                           //,scrollY: '300px'
                           //,scrollCollapse: true
                           ,paging: false
                           ,searching: false
                           ,info: false 
                           //,jQueryUI: true
                        });
                    });
                    // Render Subcomponents
                    self._subComponentsThaw.call(this, subComponents, rowObjects, 'render');
                    // Add autocomplete "dropdown" features to "select" inputs
                    $(this).find('.plastic-field-select').each(function(){
                        $(this).autocomplete({
                            minLength: 0
                           ,source: Plastic.AutoComplete
                           ,select: function(e, ui){
                                Plastic.FormUpdate.call(this, e, self, ui);
                            }
                        }).data('autocomplete')._renderItem = function(ul, item) {
                            var itemMarkup = ((item['class']) && (/plastic-autofill-empty/.test(item['class']))) //->
                                ? '<div><span>' + item.label + '</span></div>' : '<a><span>' + item.label + '</span></a>';
                            var itemTooltip = (item.tooltip) //->
                                ? item.tooltip //->
                                : ((item['class']) && (/plastic-autofill-selected/.test(item['class']))) //->
                                ? item.label + ' [selected]' : item.label;
                            return $( '<li></li>' )
                                .data( 'item.autocomplete', item )
                                .append( itemMarkup )
                                .addClass( item['class'] )
                                .attr( 'title', itemTooltip )
                                .appendTo( ul );
                        };
                    });
                    $(this).scrollTop(0); // Scroll form to top before switching focus
                    thisForm.disable(undefined, rowObjects[1], {});
                    $('#' + focusId).focus().select(); // Switch focus to form element
                    // DataTable Bug Work-Around?? (FindMe!!)
                    $(this).find('.plastic-field-group .plastic-field-group-table tr').each(function(){
                        $(this).find('th:eq(1)').triggerHandler('click');
                    });
                    if ((rowObjects.length > 1) && (rowObjects[1].deleted)) { thisForm.disable(true); };
                };
                ///PlasticUnit.call(this, 'PlasticWidget', 'Render Defined', function() {
                /*
                module('PlasticWidget');
                test('Render Defined: ' + self.attr('id'), function() {
                    ///ok(typeof (component.render) === 'function', 'Render Found: ');
                    ok(typeof (self[0].render) === 'function', 'Render Found: ');
                });
                */
                // Create update function for this widget (to be updated on the fly based on rowObject updates)
                thisForm.update = function _plasticwidget_form_update(rowObjects) {
                    var formId = $(this).attr('id');
                    var thisReplace = new RegExp('^' + formId + '_');
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    $(this).data('plastic-row', rowObjects[1]);
                    if ((rowObjects.length > 1) && (rowObjects[1].deleted)) { thisForm.disable(true); };
                    // Freeze SubComponents
                    var subComponents = self._subComponentsFreeze.call(this);
                    ///$(this).find('.plastic-field-value input, .plastic-field-value textarea, input.plastic-field-group-edit').each(function(){
                    $(this).find('.plastic-field-value input, .plastic-field-value textarea, input.plastic-field-group-edit').each(function(){
                        var thisIndex = undefined;
                        var thisName = $(this).attr('id').replace(thisReplace, '');
                        if (/^_GROUP__/.test(thisName)) { // Group Grid Update
                            thisIndex = thisName.replace(/^.*__/, '');
                            thisName = thisName.replace(/^_GROUP__/, '').replace(thisReplace, '').replace(/__.*$/, '');
                        }
                        var table = $(this).closest('.plastic-field-group').find('.plastic-field-group-table').dataTable();
                        var column = $('#' + formId + '_' + thisName).index();
                        var groupTarget = $(table.api().row(thisIndex).node()).children('td').eq(column);
                        if ((rowObjects[1].dirty) && (rowObjects[1].dirty[thisName] !== undefined)) {
                            if (thisIndex !== undefined) {
                                if (rowObjects[1].dirty[thisName][thisIndex]) {
                                    groupTarget.addClass('plastic-dirty');
                                    // Not Quite Right (FindMe!!)
                                    groupTarget.siblings().not('.plastic-grid-flagbox').addClass('plastic-dirty');
                                } else {
                                    groupTarget.removeClass('plastic-dirty');
                                }
                            } else {
                                $(this).addClass('plastic-dirty').closest('.plastic-field-value').addClass('plastic-dirty');
                            }
                        } else {
                            if (thisIndex !== undefined) {
                                groupTarget.removeClass('plastic-dirty');
                            } else {
                                $(this).removeClass('plastic-dirty').closest('.plastic-field-value').removeClass('plastic-dirty');
                            }
                        }
                        if ((rowObjects[1].error) && (rowObjects[1].error[thisName] !== undefined)) {
                            if (thisIndex !== undefined) {
                                groupTarget.addClass('plastic-error');
                            } else {
                                $(this).addClass('plastic-error').closest('.plastic-field-value').addClass('plastic-error');
                            }
                        } else {
                            if (thisIndex !== undefined) {
                                groupTarget.removeClass('plastic-error');
                            } else {
                                $(this).removeClass('plastic-error').closest('.plastic-field-value').removeClass('plastic-error');
                            }
                        }
                    });
                    // Clean Up Any Isolated and Deleted Rows
                    $(this).find('.plastic-field-group-selected').each(function(){
                        // Is This Nested "each" Required?? (FindMe!!)
                        $(this).find('td:eq(1)').each(function(){
                            var thisName = $(this).closest('.plastic-field-group').attr('id').replace(thisReplace, '');
                            var table = $(this).closest('.plastic-field-group').find('.plastic-field-group-table').dataTable();
                            if ($(table).find('thead>tr>th:eq(1)').length) {
                                var colName = $(table).find('thead>tr>th:eq(1)').attr('id').replace(thisReplace, '');
                                var row = table.fnGetPosition(this)[0];
                                if ((rowObjects) && (rowObjects.length > 1) && (rowObjects[1].attributes) && //->
                                    (rowObjects[1].attributes[colName]) && (rowObjects[1].attributes[colName][row] === undefined)) {
                                    table.fnDeleteRow(row);
                                }
                            }
                        });
                    });
                    // Check Ganged Group Items For Conflicts
                    $(this).find('.plastic-field-group').each(function(){
                        if ($(this).find('.plastic-field-group-selected').length > 1) {
                            var thisGroup = $(this).attr('id').replace(thisReplace, '');
                            // Look for Gang Conflicts??
                            if ((widgetargs) && (widgetargs.length > 1) && (widgetargs[1].groupOptions) && //->
                                (widgetargs[1].groupOptions[thisGroup]) && (widgetargs[1].groupOptions[thisGroup].gang)) {
                                var conflict = {};
                                var makeConflictDialog = [];
                                var thisGang = widgetargs[1].groupOptions[thisGroup].gang;
                                var isConflict = false;
                                var table = $(this).closest('.plastic-field-group').find('.plastic-field-group-table').dataTable();
                                var rawCols = $(this).find('thead:eq(0)>tr>');
                                for (var cntGangCol = 0; cntGangCol < thisGang.length; cntGangCol ++) {
                                    for (var cntRawCol = 1; cntRawCol < rawCols.length; cntRawCol ++) {
                                        var thisColCompare = $(rawCols[cntRawCol]).attr('id').replace(thisReplace, '');
                                        if (thisColCompare === thisGang[cntGangCol]) {
                                            $(this).find('.plastic-field-group-selected').each(function(){
                                                if (conflict[thisColCompare] === undefined) { conflict[thisColCompare] = {}; };
                                                conflict[thisColCompare][table.api().row(this).data()[cntRawCol]] = true;
                                                ///alert(thisColCompare + ' => ' + cntRawCol);
                                            });
                                        }
                                    }
                                }
                                _PlasticBug(conflict, 4, 'comment');
                                // Process Gang Conflicts
                                for (var thisToProc in conflict) {
                                    var cntChoices = 0;
                                    var conflictIndex = makeConflictDialog.length;
                                    var thisNameLabel = ((widgetargs[1].prettyNames) && (widgetargs[1].prettyNames[thisToProc])) //->
                                        ? widgetargs[1].prettyNames[thisToProc] : thisToProc;
                                    makeConflictDialog[conflictIndex] = '<tr><td class="plastic-gang-conflict-label">' + //->
                                        '<label for="conflict_' + thisToProc + '">' + thisNameLabel + ':</label></td>' + //->
                                        '<td><select name="conflict_' + thisToProc + '" id="conflict_' + thisToProc + '">';
                                    for (var thisChoice in conflict[thisToProc]) {
                                        cntChoices ++;
                                        makeConflictDialog[conflictIndex] += '<option>' + thisChoice + '</option>';
                                    }
                                    makeConflictDialog[conflictIndex] += '</select></td></tr>';
                                    if (cntChoices > 1) {
                                        isConflict = true;
                                    } else {
                                        makeConflictDialog.splice(conflictIndex);
                                    }
                                }
                                if (isConflict) { // Gang Conflicts Found, Resolve
                                    if (!($('.plastic-field-group-gang-conflict').length)) {
                                        $(_PlasticRuntime.root).append($('<div class="plastic-field-group-gang-conflict" />'));
                                        $('.plastic-field-group-gang-conflict').dialog({
                                            autoOpen: false
                                           ,modal: true
                                           ,title: 'Resolve Conflicts?'
                                           ,width: 540
                                           ,height: 350
                                           ,close: function() {
                                                table.find('tr:first>th input').prop('checked', true).click(); // Deselect all
                                                $('.plastic-field-group-gang-conflict').remove();
                                            }
                                           ,buttons: {
                                                Close: function() {
                                                    table.find('tr:first>th input').prop('checked', true).click(); // Deselect all
                                                    $('.plastic-field-group-gang-conflict').dialog('close');
                                                }
                                               ,Accept: function() {
                                                    var toUpdate = [];
                                                    var rawCols = table.find('thead:eq(0)>tr>');
                                                    for (var cntRawCol = 1; cntRawCol < rawCols.length; cntRawCol ++) {
                                                        var thisColCompare = $(rawCols[cntRawCol]).attr('id').replace(thisReplace, '');
                                                        if ($(this).find('#conflict_' + thisColCompare).length) {
                                                            var thisColVal = $(this).find('#conflict_' + thisColCompare).val();
                                                            table.find('.plastic-field-group-selected').each(function(){
                                                                var thisRow = table.dataTable().fnGetPosition(this);
                                                                /////$(this).closest('.plastic-field-group-table.dataTable td').html($(this).val());
                                                                ///table.api().data()[thisRow][cntRawCol] = $(this).find('td').eq(cntRawCol).text();
                                                                table.api().data()[thisRow][cntRawCol] = thisColVal;
                                                                $(this).find('td').eq(cntRawCol).text(thisColVal);
                                                                toUpdate[toUpdate.length] = $(this).find('td').eq(cntRawCol)[0];
                                                            });
                                                            _PlasticBug(this, 4, 'comment');
                                                        }
                                                    }
                                                    for (var cntUpdates = 0; cntUpdates < toUpdate.length; cntUpdates ++) {
                                                        $(toUpdate[cntUpdates]).trigger('mouseup').find('input').trigger('keyup').trigger('focusout');
                                                    }
                                                    $('.plastic-field-group-gang-conflict').dialog('close');
                                                }
                                            }
                                        });
                                    }
                                    var conflictForm = '<img class="plastic-message-icon-large" style="float:left;" src="images/plastic-question.png" />';
                                    conflictForm += '<div class="plastic-field-group-title">The selected rows contain incompatible values. ';
                                    conflictForm += 'Confirm the dropdown menus provided below contain expected values for each column.<br><br>';
                                    conflictForm += 'Proceed?</div>';
                                    conflictForm += '<table class="plastic-field-group-gang-dialog">';
                                    conflictForm += makeConflictDialog.join('');
                                    conflictForm += '</table>';
                                    var conflictNote = '<div class="plastic-field-group-message">';
                                    conflictNote += '<img class="plastic-message-icon-small" src="images/plastic-information.png" />';
                                    conflictNote += 'NOTE: Closing this form will deselect all rows to remove the conflict';
                                    conflictNote += '</div>';
                                    $('.plastic-field-group-gang-conflict').html(conflictForm);
                                    if ($('.plastic-field-group-gang-conflict').nextAll('.ui-dialog-buttonpane').find('.plastic-field-group-message').length) {
                                    } else {
                                        $('.plastic-field-group-gang-conflict').nextAll('.ui-dialog-buttonpane').prepend(conflictNote);
                                    }
                                    $('.plastic-field-group-gang-conflict').dialog('open');
                                    $('.plastic-field-group-gang-conflict').scrollTop(0);
                                } else {
                                }
                            }
                        }
                    });
                    if (rowObjects[1].attributes) {
                        for (var thisAttr in rowObjects[1].attributes) {
                            if (/#deleted/.test(thisAttr)) {
                                var table = $('#' + formId + '_' + thisAttr.replace(/#deleted$/, '') + '_DT').dataTable();
                                for (var thisIndex in rowObjects[1].attributes[thisAttr]) {
                                    var groupTarget = $(table.api().row(thisIndex).node());
                                    groupTarget.addClass('plastic-deleted plastic-forestall');
                                }
                            }
                        }
                        // Remove plastic-deleted class from all other tr group elements
                        $(this).find('tr.plastic-deleted').each(function(){
                            if (!($(this).hasClass('plastic-forestall'))) {
                                $(this).removeClass('plastic-deleted');
                            } else {
                                $(this).removeClass('plastic-forestall');
                            }
                        });
                    }
                    // Update Subcomponents
                    self._subComponentsThaw.call(this, subComponents, rowObjects, 'update');
/*
                    $(this).find('.plastic-subcomponent').each(function(){
                        var component = $('#' + $(this).attr('plastic-sub-component'));
                        if ((component) && (component.length) && (component[0].update) && //->
                            (typeof (component[0].update) === 'function')) {
                            component[0].update(rowObjects);
                        }
                    });
*/
                };
                // Create update function for this widget (to be updated on the fly based on rowObject updates)
                this.disable = function _plasticwidget_form_disable(disable, rowObject, fopts) {
                    var thisId = $(this).attr('id');
                    var thisReplace = new RegExp('^' + thisId + '_');
                    var source = ((this.source) && (this.source.length)) ? this.source[0] : null;
                    if (rowObject) {
                        $(this).find('.plastic-field-value input').each(function(){
                            var controlId = $(this).attr('id').replace(thisReplace, '');
                            var response = Plastic.Test.call(source, rowObject, 'canupdate', { path: controlId });
                            var type = $(this).attr('type');
                            if ((type === 'radio') || (type === 'checkbox')) {
                                $(this).prop('disabled', !response);
                            } else {
                                if ($(this).hasClass('plastic-field-select')) {
                                    $(this)[(response) ? 'removeClass' : 'addClass']('plastic-disabled');
                                    $(this).next().children('div:first')[(response) ? 'removeClass' : 'addClass']('plastic-disabled');
                                } else {
                                    $(this).prop('readonly', !response)[(response) ? 'removeClass' : 'addClass']('plastic-disabled');
                                }
                            }
                        });
                    } else {
                        $(this).find('.plastic-field-value input').each(function(){
                            var type = $(this).attr('type');
                            if ((type === 'radio') || (type === 'checkbox')) {
                                $(this).prop('disabled', !disable);
                            } else {
                                if ($(this).hasClass('plastic-field-select')) {
                                    $(this)[(disable) ? 'removeClass' : 'addClass']('plastic-disabled');
                                    $(this).next().children('div:first')[(disable) ? 'addClass' : 'removeClass']('plastic-disabled');
                                } else {
                                    $(this).prop('readonly', disable)[(disable) ? 'addClass' : 'removeClass']('plastic-disabled');
                                }
                            }
                        });
                    }
                };
///                $(this).resize(function (e){
///                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
///                    $(this).outerHeight($(this).parent().height());
///                });
                return $(this);
            }
           ,context: function _plasticwidget__make_context(fopts){
                var thisSelector = ((fopts) && (fopts.parent)) ? fopts.parent + ' *' : 'body';
                var thisType = ((fopts) && (fopts.type)) ? fopts.type : '.*';
                var thisPreReq = ((fopts) && (fopts.prereq)) ? fopts.prereq : undefined;
                var items = {};
                for (var menu in fopts.menu) {
                    if (fopts.menu[menu].separator) {
                        items['Plasticmenu-' + menu + '-separator'] = '---------';
                    }
                    var icon = (fopts.menu[menu].icon) //->
                        ? fopts.menu[menu].icon //->
                        : (fopts.menu[menu].action) //->
                            ? fopts.menu[menu].action //->
                            : undefined;
                    items['Plasticmenu-' + menu] = { name: menu, icon: icon, //->
                        target: fopts.menu[menu].target, action: fopts.menu[menu].action //->
                       ,path: fopts.menu[menu].path, against: fopts.menu[menu].against //->
                       ,test: fopts.menu[menu].test, testappend: fopts.menu[menu].testappend //->
                       ,hideIf: fopts.menu[menu].hideIf, disableIf: fopts.menu[menu].disableIf };
                }
                $.contextMenu({
                    selector: thisSelector 
                   ,type: thisType
                   ,prereq: thisPreReq
                   ,builder: true
                   ,build: function($trigger, e, retFunction) {
                        // this callback is executed every time the menu is to be shown
                        // its results are destroyed every time the menu is hidden
                        // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
                        var target = e.target; // Weed this out (FindMe!!)
                        var plastic = $(e.target).closest('.Plastic')[0];
                        var component = plastic['plastic' + plastic.isplastic];
                        var rowObject = {};
                        if (component.getRowObjectFor) {
                            rowObject = component.getRowObjectFor(e.target);
                        } else {
                            _PlasticBug('MISSING_FEATURE: \'getRowObjectFor\' => ' + plastic.isplastic, undefined, undefined, 'error');
                        }
                        ////if ((component) && (component.activateRow)) { component.activateRow(e.target); };
                        var actions = ((rowObject) && (rowObject.actions)) ? rowObject.actions : {};
                        var filteredItems = {};
                        var alreadySeparator = false;
                        for (var thisItem in items) {
                            var enabled = true;
                            var tests = [];
                            if ((items[thisItem].test) && (items[thisItem].test.length)) { // Overrides Built-In Tests
                                tests = items[thisItem].test;
                            } else {
                                if ((items[thisItem]) && (items[thisItem].action)) {
                                    tests = Plastic.ActionTests.call(self.parent()[0], rowObject, items[thisItem].action, items[thisItem]);
                                }
                            }
                            if (items[thisItem].testappend) { // Additional Tests In Playbook
                                for (var cntTest = 0; cntTest < items[thisItem].testappend.length; cntTest ++) {
                                    tests[tests.length] = items[thisItem].testappend[cntTest];
                                }
                            }
                            for (var cntTest = 0; cntTest < tests.length; cntTest ++) {
                                enabled = Plastic.Test.call(self.parent()[0], rowObject, tests[cntTest], items[thisItem]);
                                if (!(enabled)) { break; }; // One false is enough
                            }
                            items[thisItem].disabled = !enabled;
                            if ((enabled) && (items[thisItem].disableIf)) {
                                var shouldDisable = true;
                                for (var cntTest = 0; cntTest < items[thisItem].disableIf.length; cntTest ++) {
                                    shouldDisable = Plastic.Test.call(self.parent()[0], rowObject, items[thisItem].disableIf[cntTest], items[thisItem]);
                                    if (!(shouldDisable)) { break; }; // One false is enough
                                }
                                if (shouldDisable) { items[thisItem].disabled = true; };
                            }
                            if (items[thisItem].hideIf) {
                                var shouldHide = true;
                                for (var cntTest = 0; cntTest < items[thisItem].hideIf.length; cntTest ++) {
                                    shouldHide = Plastic.Test.call(self.parent()[0], rowObject, items[thisItem].hideIf[cntTest], items[thisItem]);
                                    if (!(shouldHide)) { break; }; // One false is enough
                                }
                                if (shouldHide) { continue; };
                            }
                            if ((typeof (items[thisItem]) === 'string') && (alreadySeparator)) { continue; };
                            filteredItems[thisItem] = items[thisItem];
                            alreadySeparator = (!(!(typeof (items[thisItem]) === 'string')));
                        }
                        var retVal = {
                            callback: function(key, options) {
                                var m = "clicked: " + key;
                                _PlasticBug(m, 4, 'comment'); 
                                _PlasticBug(options, 4, 'comment');
                                if ((options.items) && (options.items[key]) && (options.items[key].action)) {
                                    ////alert('ACTION: ' + options.items[key].action);
                                    Plastic.Action.call(self.parent()[0], rowObject, options.items[key].action, options.items[key]);
                                    if (options.items[key].action === "ping") { // Roll into "action" handler routines
                                        $(span).addClass('plastic-ping');
                                        //setTimeout( function(){ $(span).removeClass('plastic-ping'); }, 5000); // To restrictive (FindMe!!)
                                        $(span).animate({ "border-width" : "10px" }, 1000, function(){
                                            $(span).animate({ "border-width" : ".1px" }, 1000, function(){
                                                $(span).removeClass('plastic-ping');
                                            });
                                        });
                                    }
                                    if ((options.items) && (options.items[key]) && (options.items[key].target)) {
                                        ////alert('ACTIONTARGET: ' + options.items[key].target);
                                        $(target).trigger('rowactivate.plastic', { target: options.items[key].target, path: options.items[key].path });
                                    }
                                } else if ((options.items) && (options.items[key]) && (options.items[key].target)) {
                                    ///alert('TARGET: ' + options.items[key].target);
                                    //$(target).trigger('dblclick', { target: options.items[key].target, path: options.items[key].path });
                                    $(target).trigger('rowactivate.plastic', { target: options.items[key].target, path: options.items[key].path });
                                } else {
                                    alert('DEFAULTTARGET: ');
                                    $(target).trigger('rowactivate.plastic', { path: options.items[key].path });
return true;
                                }
                            }
                           ///,items: items
                           ,items: filteredItems
                        };
                        if ((retFunction) && (typeof (retFunction) === 'function')) {
                            retFunction(retVal);
                        } else {
                            return false;
                        }
                    }
                });
                this.render = function _plasticwidget_context_render(){};
                this.update = function _plasticwidget_context_update(){};
                return $(this).addClass('plastic-transient');
            }
           ,buttonbar: function _plasticwidget__make_buttonbar(fopts){
                var thisId = $(this).attr('id');
                self._scrollAnimate = function(){
                    var thisAfter = $(this).closest('.widget-buttonbar').find('.plastic-buttonbar-after');
                    var thisRight = thisAfter.offset().left + thisAfter.outerWidth();
                    var lastButton = $(this).closest('.widget-buttonbar').find('.plastic-buttonbar-child:visible:last');
                    var lastRight = parseInt(lastButton.offset().left + lastButton.outerWidth());
                    if ($(this).hasClass('plastic-buttonbar-before')) {
                        if ($(this).next().scrollLeft()) {
                            $(this).next().scrollLeft($(this).next().scrollLeft() -5);
                        } else {
                            if (lastRight >= thisRight) {
                                $(this).next().next().show(); // Enable "after"
                            }
                            $(this).hide();
                        }
                    } else if ($(this).hasClass('plastic-buttonbar-after')) {
                        var prevScrollLeft = $(this).prev().scrollLeft();
                        $(this).prev().scrollLeft($(this).prev().scrollLeft() +5);
                        if ($(this).prev().scrollLeft()) {
                            $(this).prev().prev().show(); // Enable "before"
                            if (lastRight <= thisRight) {
                                $(this).hide();
                            }
                        }
                    }
                };
                $(this).on('click', '.plastic-buttonbar-link', function(e){
                    e.preventDefault();
                    $(this).blur();
                    alert($(this).attr('href'));
                });
                $(this).on('mouseover', '.plastic-buttonbar-before, .plastic-buttonbar-after', function(){
                    var context = this;
                    if (!(parseInt($(this).data('timer')))) {
                        $(this).addClass('plastic-buttonbar-scrolling');
                        $(this).data('timer', setInterval( function(){ self._scrollAnimate.call(context); }, 20));
                    }
                });
                $(this).on('mouseout', '.plastic-buttonbar-before, .plastic-buttonbar-after', function(){
                    clearInterval(parseInt($(this).data('timer')));
                    $(this).removeData('timer');
                    $(this).removeClass('plastic-buttonbar-scrolling');
                });
                $(this).on('mousewheel DOMMouseScroll', '.plastic-buttonbar-slide-wrap', function(e){
                    // ** http://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery ** //
                    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) { // Up
                        var before = $('.plastic-buttonbar-before:visible', self);
                        if (parseInt(before.data('simtimer'))) {
                            clearTimeout(parseInt(before.data('simtimer')));
                            before.removeData('simtimer');
                        }
                        before.trigger('mouseover');
                        before.data('simtimer', setTimeout( function(){ before.trigger('mouseout') }, 150));
                    } else { // Down
                        var after = $('.plastic-buttonbar-after:visible', self);
                        if (parseInt(after.data('simtimer'))) {
                            clearTimeout(parseInt(after.data('simtimer')));
                            after.removeData('simtimer');
                        }
                        after.trigger('mouseover');
                        after.data('simtimer', setTimeout( function(){ after.trigger('mouseout') }, 150));
                    }
                });
                $(this).on('actiontest.plastic', '.plastic-actionable:visible', function(e){
                    var active = $('.plastic-stack-active').plasticDataSorter('plastic-active').last();
                    var key = $(active).data('plastic-key');
                    var source = (active.length) ? active[0].source : null;
                    var dsname = ((source) && (source.length) && (source[0].plasticopts) && //->
                        (source[0].plasticopts.datastore)) ? source[0].plasticopts.datastore : null;
                    var datastore = (dsname) ? _PlasticRuntime.datastore[dsname] : null;
                    var rowObject = active.data('plastic-row');
                    if ((fopts) && (fopts.buttons)) {
                        for (var thisButton in fopts.buttons) {
                            var enabled = true, tests = [];
                            var button = $('#' + thisId + '_' + thisButton);
                            if (key) {
                                if (rowObject) {
                                    tests = Plastic.ActionTests.call(source[0], rowObject, fopts.buttons[thisButton].action, fopts.buttons[thisButton]);
                                    for (var cntTest = 0; cntTest < tests.length; cntTest ++) {
                                        enabled = Plastic.Test.call(source[0], rowObject, tests[cntTest], fopts.buttons[thisButton]);
                                        if (!(enabled)) { break; }; // One false is enough
                                    }
                                    button.button( (enabled) ? 'enable' : 'disable' );
                                    if (fopts.buttons[thisButton].hideIf) {
                                        var shouldHide = true;
                                        for (var cntTest = 0; cntTest < fopts.buttons[thisButton].hideIf.length; cntTest ++) {
                                            shouldHide = Plastic.Test.call(source[0], rowObject, fopts.buttons[thisButton].hideIf[cntTest], fopts.buttons[thisButton]);
                                            if (!(shouldHide)) { break; }; // One false is enough
                                        }
                                        if (shouldHide) {
                                            button.hide();
                                        } else {
                                            button.show();
                                        }
                                    } else {
                                        button.show();
                                    }
                                } else {
                                    button.button('disable');
                                }
                            } else {
                                button.button('disable');
                            }
                        }
                    }
                    $(this).find('.plastic-buttonbar-slide-wrap').scrollLeft(0); // Remember Vertical ButtonBars(FindMe!!)
                    self._scrollAnimate.call($(this).closest('.widget-buttonbar').find('.plastic-buttonbar-before'));
                });
                $(this).append($('<div class="plastic-buttonbar-wrap">' + //->
                    '<div class="plastic-buttonbar-before" />' + //->
                    '<div class="plastic-buttonbar-slide-wrap">' + //->
                    '<div class="plastic-buttonbar-slider plastic-actionable" />' + //->
                    '</div><div class="plastic-buttonbar-after" /></div>'));
                if ((fopts) && (fopts.buttons)) {
                    var buttons = '', buttonOpts = {};
                    $(this).addClass( (fopts.type === 'vertical') ? 'plastic-buttonbar-vertical' : 'plastic-buttonbar-horizontal' );
                    for (var thisButton in fopts.buttons) {
                        buttons += '<div class="plastic-buttonbar-child">' + //->
                            '<button class="plastic-buttonbar-button" id="' + thisId + '_' + thisButton + '" disabled>' + //->
                            thisButton + '</button>' + //->
                            '</div>';
                        buttonOpts[thisId + '_' + thisButton] = fopts.buttons[thisButton];
                    }
                    $('.plastic-actionable', this).append($(buttons));
                    $('.plastic-buttonbar-child .plastic-buttonbar-button', this).button().hide() //->
                        .click(function(e){
                        $(this).button('disable');
                        // Roll This DataCollection Into Function (FindMe!!!)
                        var active = $('.plastic-stack-active').plasticDataSorter('plastic-active').last();
                        var key = active.data('plastic-key');
                        var source = (active.length) ? active[0].source : null;
                        var dsname = ((source) && (source.length) && (source[0].plasticopts) && //->
                            (source[0].plasticopts.datastore)) ? source[0].plasticopts.datastore : null;
                        var datastore = (dsname) ? _PlasticRuntime.datastore[dsname] : null;
                        var rowObject = active.data('plastic-row');
                        var bopts = buttonOpts[$(this).attr('id')];
                        Plastic.Action.call(source[0], rowObject, bopts.action, bopts);
                        $(this).removeClass('ui-state-hover').blur();
                    });
                }
                this.render = function _plasticwidget_buttonbar_render(){};
                this.update = function _plasticwidget_buttonbar_update(){};
                return $(this);
            }
           ,breadcrumb: function _plasticwidget__make_breadcrumb(fopts){
                this._nextAncestor = function(node){
                    var parent = ((node) && (node[0].plasticopts) && //->
                        (node[0].plasticopts.crumb) && (node[0].plasticopts.crumb.parent)) //->
                            ? $('#' + node[0].plasticopts.crumb.parent) //->
                            : $(node).parents('.Plastic:first');
                    return (parent.length) ? parent : undefined;
                };
                self._scrollAnimate = function(){
                    if ($(this).hasClass('plastic-breadcrumb-before')) {
                        if ($(this).next().scrollLeft()) {
                            $(this).next().next().show(); // Enable "after"
                            $(this).next().scrollLeft($(this).next().scrollLeft() -5);
                        } else {
                            $(this).hide();
                        }
                    } else if ($(this).hasClass('plastic-breadcrumb-after')) {
                        var prevScrollLeft = $(this).prev().scrollLeft();
                        $(this).prev().scrollLeft($(this).prev().scrollLeft() +5);
                        if ($(this).prev().scrollLeft()) {
                            $(this).prev().prev().show(); // Enable "before"
                            if ($(this).prev().scrollLeft() === prevScrollLeft) {
                                $(this).hide();
                            }
                        }
                    }
                };
                $(this).on('click', '.plastic-breadcrumb-link', function(e){
                    e.preventDefault();
                    $(this).blur();
                    alert($(this).attr('href'));
                });
                $(this).on('mouseover', '.plastic-breadcrumb-before, .plastic-breadcrumb-after', function(){
                    var context = this;
                    if (!(parseInt($(this).data('timer')))) {
                        $(this).addClass('plastic-breadcrumb-scrolling');
                        $(this).data('timer', setInterval( function(){ self._scrollAnimate.call(context); }, 20));
                    }
                });
                $(this).on('mouseout', '.plastic-breadcrumb-before, .plastic-breadcrumb-after', function(){
                    clearInterval(parseInt($(this).data('timer')));
                    $(this).removeData('timer');
                    $(this).removeClass('plastic-breadcrumb-scrolling');
                });
                $(this).on('mousewheel DOMMouseScroll', '.plastic-breadcrumb-slide-wrap', function(e){
                    // ** http://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery ** //
                    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) { // Up
                        var after = $('.plastic-breadcrumb-after:visible', self);
                        if (parseInt(after.data('simtimer'))) {
                            clearTimeout(parseInt(after.data('simtimer')));
                            after.removeData('simtimer');
                        }
                        after.trigger('mouseover');
                        after.data('simtimer', setTimeout( function(){ after.trigger('mouseout') }, 150));
                    } else { // Down
                        var before = $('.plastic-breadcrumb-before:visible', self);
                        if (parseInt(before.data('simtimer'))) {
                            clearTimeout(parseInt(before.data('simtimer')));
                            before.removeData('simtimer');
                        }
                        before.trigger('mouseover');
                        before.data('simtimer', setTimeout( function(){ before.trigger('mouseout') }, 150));
                    }
                });
                $(this).on('actiontest.plastic', function(){
                    var thisAncestor, crumbLinks = '';
                    var active = $('.plastic-stack-active').plasticDataSorter('plastic-active').last();
                    if (active.length) {
                        var crumbs = [ active ];
                        while (thisAncestor = this._nextAncestor(crumbs[crumbs.length -1])) {
                            crumbs[crumbs.length] = thisAncestor;
                        };
                        $.each(crumbs, function(index){
                            // Remember To Expand Variables (FindMe!!)
                            if ((this[0].plasticopts) && (this[0].plasticopts.crumb) && //->
                                (this[0].plasticopts.crumb.title)) {
                                if (index) {
                                    crumbLinks = '&nbsp;&gt;&nbsp;<a class="plastic-breadcrumb-link" href="#' + //->
                                        this.attr('id') + '">' + this[0].plasticopts.crumb.title.replace(/\n/, ' ') + '</a>' + crumbLinks;
                                } else {
                                    crumbLinks = '&nbsp;&gt;&nbsp;' + this[0].plasticopts.crumb.title + crumbLinks;
                                }
                            } else if ((this[0].plasticopts) && (this[0].plasticopts.title)) {
                                if (index) {
                                    crumbLinks = '&nbsp;&gt;&nbsp;<a class="plastic-breadcrumb-link" href="#' + //->
                                        this.attr('id') + '">' + this[0].plasticopts.title + '</a>' + crumbLinks;
                                } else {
                                    crumbLinks = '&nbsp;&gt;&nbsp;' + this[0].plasticopts.title.replace(/<br[ \/]*>/, ' ') + crumbLinks;
                                }
                            } else {
                                if (index) {
                                    crumbLinks = '&nbsp;&gt;&nbsp;<a class="plastic-breadcrumb-link" href="#' + //->
                                        this.attr('id') + '">' + this.attr('id') + '</a>' + crumbLinks;
                                } else {
                                    crumbLinks = '&nbsp;&gt;&nbsp;' + this.attr('id') + crumbLinks;
                                }
                            }
                        });
                        $('.plastic-breadcrumb-before, .plastic-breadcrumb-after', this).hide();
                        $('.plastic-breadcrumb-slider', this).html(crumbLinks);
                        $('.plastic-breadcrumb-slide-wrap', this).scrollLeft(5000);
                        if ($('.plastic-breadcrumb-slide-wrap', this).scrollLeft()) {
                            $('.plastic-breadcrumb-before', this).show();
                        }
                    }
                });
                $(this).append($('<div class="plastic-breadcrumb-before">...</div>' + //->
                    '<div class="plastic-breadcrumb-slide-wrap"><div class="plastic-breadcrumb-slider" /></div>' + //->
                    '<div class="plastic-breadcrumb-after">...</div>')).addClass('plastic-actionable');
                return $(this);
            }
           ,dialog: function _plasticwidget__make_dialog(fopts){
                var thisId = $(this).attr('id');
                var buttons = {};
                if (fopts) {
                    $(this).attr({
                        title: (fopts.title) ? fopts.title : 'Untitled'
                    });
                    if ($(this).children(':not(.plastic-transient)').length === 0) { // Non-transient children??
                        $(this).append($('<div id="' + thisId + '_content" class="plastic-dialog-content" />'));
                    }
                    for (var thisButton in fopts.buttons) {
                        buttons[thisButton] = function(e){
                            var active = $('.plastic-stack-active').plasticDataSorter('plastic-active').last();
                            var clicked = $(e.target).text(); // Use attribute?? (FindMe!!)
                            self.closest('.ui-dialog').find('button').each(function(){
                                if ($(this).text() === clicked) {
                                    $(this).removeClass('ui-state-hover ui-state-active').blur() //->
                                        .button('option', 'disabled', true);
                                    return false;
                                }
                            });
                            Plastic.Action.call(active[0].source[0], active.data('plastic-row'), //->
                                fopts.buttons[clicked].action, fopts.buttons[clicked]);
                            ///////$(e.target).button('option', 'disabled', true); // Disable button until action tests are run
                            // Close if asked to
                            if (fopts.buttons[clicked].close) { self.dialog('close'); };
                        };
                        //$(buttons[thisButton]).data('plastic-name', thisButton);
                    }
                }
                $(this).dialog({
                    autoOpen: false
                   ,modal: true
                   ,resizable: true
                   ,minHeight: ((fopts) && fopts.fixedheight) ? fopts.fixedheight : 300
                   ,maxHeight: ((fopts) && fopts.fixedheight) ? fopts.fixedheight : undefined
                   ,minWidth: ((fopts) && fopts.fixedwidth) ? fopts.fixedwidth : 350
                   ,maxWidth: ((fopts) && fopts.fixedwidth) ? fopts.fixedwidth : undefined
                   ,height: (fopts) ? fopts.fixedheight : undefined 
                   ,width: (fopts) //->
                        ? (fopts.defaultwidth) //->
                            ? fopts.defaultwidth //->
                            : (fopts.fixedwidth) //->
                                ? fopts.fixedwidth //->
                                : undefined 
                        : undefined 
                   ,open: function(event, ui) {
                        if ($(this).hasClass('plastic-width-auto')) {
                            $(this).dialog('option', 'width', $(_PlasticRuntime.root).width());
                        }
                        if ($(this).hasClass('plastic-height-auto')) {
                            $(this).dialog('option', 'height', $(_PlasticRuntime.root).height());
                        }
                        $(this).dialog('option', 'position', { of: $(_PlasticRuntime.root) });
                        $('.plastic-lowprofile', $(this).closest('.ui-dialog')).trigger('profileshow.plastic');
                        $('.plastic-actionable', $(this).closest('.ui-dialog')).trigger('actiontest.plastic');
                        // Disable all buttons until their state has been validated
                        $(this).closest('.ui-dialog').find('button').each(function(){
                            $(this).button('option', 'disabled', true);
                        });
                    }
                   ,close: function(event, ui){
                        $(this).find('.plastic-stack-active').add(this) //->
                            .removeClass('plastic-stack-active').removeData('plastic-active');
                        $('.plastic-lowprofile', $(this).closest('.ui-dialog')).trigger('profilehide.plastic');
                        $('.plastic-actionable:visible').trigger('actiontest.plastic');
                    }
                   ,focus: function(event, ui) {
                        $('.plastic-actionable', $(this).closest('ui-dialog')).trigger('actiontest.plastic');
                    }
                   ,buttons: buttons
                });
                // Actionable ActionTest Handler
                $(this).on('hosttitle.plastic', function(e, data){
                    $(self).dialog('option', 'title', data.title);
                });
                $(this).closest('.ui-dialog').on('actiontest.plastic', '.plastic-actionable:visible', function(e){
                    var buttonName = $(this).text(); // Find better method?? (FindMe!!)
                    //if ($(':visible', self).length) { // Dialog is visible
                        if ((self) && (self.length) && (self[0].plasticopts) && (self[0].plasticopts.buttons) && //->
                            (self[0].plasticopts.buttons[buttonName])) {
                            var active = $('.plastic-stack-active').plasticDataSorter('plastic-active').last();
                            var button = self[0].plasticopts.buttons[buttonName];
                            var tests = Plastic.ActionTests.call(active[0].source[0], active.data('plastic-row'), //->
                                button.action, { path: button.path, against: button.against });
                            // Add Appended/ Overridden Tests Here? (FindMe!!)
                            var thisButton = this;
                            if (tests.length) {
                                Plastic.Tests.call(active[0].source[0], active.data('plastic-row'), tests, //->
                                    { path: button.path, against: button.against }) //->
                                    .pass(function(){
                                        $(thisButton).button('option', 'disabled', false);
                                    })
                                    .fail(function() {
                                        $(thisButton).button('option', 'disabled', true);
                                    });
                            } else { // Check PlayBook for Default ?? (FindMe!)
                                $(thisButton).button('option', 'disabled', false);
                            }
                        ///Plastic.ActionTests.call(self[0].source, self[0].rowObject, 'prev',{against: '-'})
                        ////$(this).button('option', 'disabled', true);
                        }
                    //}
                });
                $(this).closest('.ui-dialog').find('.ui-dialog-buttonset button.ui-button').addClass('plastic-actionable');
                this.render = function _plasticwidget_dialog_render(rowObjects){
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    this.rowObject = ((rowObjects) && (rowObjects.length > 1)) ? rowObjects[1] : undefined;
                    if ((fopts) && (rowObjects) && (rowObjects.length > 1)) {
                        if (fopts.defaultheight !== undefined) {
                            $(self).dialog('option', 'height', fopts.defaultheight);
                        }
                        if (fopts.defaultwidth !== undefined) {
                            $(self).dialog('option', 'width', fopts.defaultwidth);
                        }
                        if (fopts.title !== undefined) {
                            $(self).dialog('option', 'title', self._varExpand(fopts.title, rowObjects[1]));
                        }
                        if (fopts.message !== undefined) {
                            $(self).find('.plastic-dialog-content').html(self._varExpand(fopts.message, rowObjects[1]));
                        }
                    }
                    $(self).dialog('option', 'position', { my: 'center', at: 'center', of: '.plastic-root' });
                    $(self).dialog('open');
                    $(self).children('.plastic-stack').trigger('resize');
                }
                this.update = function _plasticwidget_dialog_update(){};
                $(this).resize(function(e){ // Resize Handler
                    e.stopPropagation();
                    if ($(this).hasClass('plastic-width-auto')) {
                        $(this).dialog('option', 'width', $(_PlasticRuntime.root).width());
                    }
                    if ($(this).hasClass('plastic-height-auto')) {
                        $(this).dialog('option', 'height', $(_PlasticRuntime.root).height());
                    }
                    $(this).dialog('option', 'position', { of: $(_PlasticRuntime.root) });
                });
                this.activate = function _plasticwidget_dialog_activate(target, fopts) {
                    var active = ((fopts) && (fopts.active)) ? fopts.active : undefined;
                    if (!(active)) {
                        self.dialog('open');
                    }
                };
                return $(this).addClass('plastic-pliable plastic-elevated plastic-title-host').data('plastic-offset', 10);
            //    return $(this).dialog({
            //        autoOpen: true
            //       ,title: 'Resolve Conflicts?'
            //    });
            }
           ,search: function _plasticwidget__make_search(fopts){
                var patterns = null;
                if ((fopts) && (fopts.patterns)) {
                    patterns = {};
                    for (var thisPattern in fopts.patterns) {
                        patterns[thisPattern] = {};
                        patterns[thisPattern].start = new RegExp('^'+fopts.patterns[thisPattern].start); 
                        patterns[thisPattern].match = new RegExp('^'+fopts.patterns[thisPattern].match + '((?=\\s+)|$)'); 
                        patterns[thisPattern].balance = fopts.patterns[thisPattern].balance;
                        patterns[thisPattern].title = ((fopts.patterns[thisPattern].example) && (fopts.patterns[thisPattern].example.title)) //->
                            ? fopts.patterns[thisPattern].example.title : thisPattern;
                        patterns[thisPattern].example = fopts.patterns[thisPattern].example;
                        patterns[thisPattern].interactive = fopts.patterns[thisPattern].interactive;
                    }
                }
                ///$(this).on('keyup', '.plastic-search-text', function(e) {
                ///    _PlasticBug(this, 4, 'comment');
                ///    if (e.keyCode === 13) { // Enter pressed, simulate click
                ///        e.stopPropagation();
                ///        $(self).find('.plastic-search-button').click();
                ///    }
                ///});
                $(this).on('click', '.plastic-search-button', function(e) {
                    var thisSearchHelp = $(this).closest('.plastic-search-wrap').find('.plastic-search-help');
                    if (thisSearchHelp.hasClass('plastic-search-help-active')) {
                        $(this).closest('.plastic-search-wrap').removeClass('plastic-search-active');
                        $(this).closest('.plastic-search-wrap').find('.plastic-search-help').removeClass('plastic-search-help-active');
                        $(this).closest('.plastic-search-wrap').css('width', '100%');
                    }
                    if ((fopts) && (fopts.defaultTarget)) {
                        var target = self._findTarget(fopts.defaultTarget);
                        target[0].render([{},{}]);
                    }
                });
                $(this).on('dblclick', '.plastic-search-text', function() {
                    var thisSearchHelp = $(this).closest('.plastic-search-wrap').find('.plastic-search-help');
                    if (thisSearchHelp.hasClass('plastic-search-help-active')) {
                        $(this).closest('.plastic-search-wrap').removeClass('plastic-search-active');
                        $(this).closest('.plastic-search-wrap').find('.plastic-search-help').removeClass('plastic-search-help-active');
                        $(this).closest('.plastic-search-wrap').css('width', '100%');
                    } else {
                        $('.plastic-search-wrap').removeClass('plastic-search-active').css('width', '100%');
                        $('.plastic-search-help').removeClass('plastic-search-help-active');
                        $(this).closest('.plastic-search-wrap').addClass('plastic-search-active');
                        $(this).closest('.plastic-search-wrap').outerWidth($(this).closest('.Plastic.widget-search').width());
                        $(this).closest('.plastic-search-wrap').animate({ width: $(_PlasticRuntime.root).innerWidth() }, function(){
                            thisSearchHelp.addClass('plastic-search-help-active');
                            thisSearchHelp.fadeIn();
                        });
                    }
                });
                //$(this).on('focusout', '.plastic-search-text', function() {
                //    $(this).closest('.plastic-search-wrap').find('.plastic-search-help').removeClass('plastic-search-help-active');
                //    $(this).closest('.plastic-search-wrap').outerWidth($(this).closest('.Plastic.widget-search').width());
                //});
                $(this).on('click', '.plastic-search-text span', function() {
                    var thisWrap = $(this).closest('.plastic-search-wrap');
                    var lastTermName = $(this).attr('type');
                    thisWrap.find('.plastic-search-text span').removeClass('plastic-search-balance plastic-search-unbalanced');
                    _PlasticBug(this, 4, 'comment');
                    thisWrap.find('.plastic-search-help-section').removeClass('plastic-search-help-section-active');
                    thisWrap.find('.plastic-search-help-section[type="' + lastTermName + '"]') //->
                        .addClass('plastic-search-help-section-active');
                    if ((patterns[lastTermName]) && (patterns[lastTermName].interactive)) {
                        thisWrap.find('.plastic-search-help-content-instructions').hide();
                        thisWrap.find('.plastic-search-help-content-interactive').html(patterns[lastTermName].interactive);
                    } else {
                        thisWrap.find('.plastic-search-help-content-instructions').show();
                        thisWrap.find('.plastic-search-help-content-interactive').html('');
                    }
                    thisWrap.find('.plastic-search-text span').removeClass('plastic-search-selected');
                    $(this).addClass('plastic-search-selected');
                    var balanceTest = function(balance, value) {
                        if ((balance.length) && (balance.length < 2)) { return 0; };
                        var isLeft  = (balance[0].test) ? balance[0].test(value) : (balance[0] === value);
                        var isRight = (balance[1].test) ? balance[1].test(value) : (balance[1] === value);
                        return (isLeft) ? 1 : (isRight) ? -1 : 0;
                    };
                    if ((lastTermName) && (patterns[lastTermName]) && (patterns[lastTermName].balance)) {
                        var balanceMove = undefined;
                        var balance = [];
                        var cntBalance = 0;
                        var thisBalance = this;
                        var thisIndex = -1;
                        thisWrap.find('.plastic-search_' + lastTermName).each(function(){
                            cntBalance += balanceMove = balanceTest(patterns[lastTermName].balance, $(this).text());
                            if (this === thisBalance) { thisIndex = balance.length; };
                            balance[balance.length] = [ cntBalance, this, balanceMove ];
                        });
                        if (thisIndex > -1) {
                            var matched = undefined;
                            switch (balanceTest(patterns[lastTermName].balance, $(this).text())) {
                                case -1:
                                    for (var cntFind = (thisIndex -1); cntFind >= 0; cntFind --) {
                                        if ((balance[cntFind][2] !== balance[thisIndex][2]) && (balance[cntFind][0] === (balance[thisIndex][0] +1))) {
                                            matched = balance[cntFind][1];
                                            break;
                                        }
                                    }
                                    break;
                                case  1:
                                    for (var cntFind = (thisIndex +1); cntFind < balance.length; cntFind ++) {
                                        if ((balance[cntFind][2] !== balance[thisIndex][2]) && (balance[cntFind][0] === (balance[thisIndex][0] -1))) {
                                            matched = balance[cntFind][1];
                                            break;
                                        }
                                    }
                                    break;
                                default:
                                    $(this).addClass('plastic-search-unbalanced');
                                    break;
                            }
                            if (matched) {
                                $(matched).addClass('plastic-search-balance');
                            } else {
                                $(this).addClass('plastic-search-unbalanced');
                            }
                        }
                    }
                });
                $(this).on('click', '.plastic-search-help-content-interactive span, .plastic-search-help-content-instructions span', function() {
                    var thisWrap = $(this).closest('.plastic-search-wrap');
                    var selectedTerm = thisWrap.find('.plastic-search-selected');
                    if ((selectedTerm.length) && ($(this).attr('replace'))) {
                        selectedTerm.text(selectedTerm.text().replace(new RegExp($(this).attr('replace')), $(this).text()));
                        selectedTerm.trigger('click');
                    } else if ($(this).attr('search')) {
                        thisWrap.find('.plastic-search-text').html($(this).attr('search')).focus().trigger('keyup');
                    }
                });
                $(this).on('keydown', '.plastic-search-text', function(e) {
                        e.stopPropagation();
                });
                $(this).on('keyup', '.plastic-search-text', function() {
                    var wasMiss = true, isComplete = false, terms = [], tnodes = [], hits = [];
                    var thisWrap = $(this).closest('.plastic-search-wrap');
                    ///$(this).removeClass('plastic-search-text-error');
                    var thisText = $(this).text();
                    if ($.trim(thisText).length === 0) {
                        $(this).text(''); // Clean-up any stray spans
                        thisWrap.find('.plastic-search-button').addClass('plastic-disabled');
                    } else {
                        thisWrap.find('.plastic-search-button').removeClass('plastic-disabled');
                        if (/^\s+/.test(thisText)) { // Stray Text At Beginning Of Search
                            thisText = thisText.replace(/^\s+/, function(hitTerm){
                                tnodes[tnodes.length] = hitTerm;
                                terms[terms.length] = [ null, 'leading_whitespace' ];
                                return '';
                            });
                        }
                        while (thisText.length) {
                            wasMiss = true, isComplete = false;
                            for (var thisPattern in patterns) {
                                if ((patterns[thisPattern].match.test(thisText))) {
                                    wasMiss = false;
                                    _PlasticBug('PATTERN_MATCH: ' + thisPattern, 4, 'comment');
                                    _PlasticBug('PATTERN_STRING1: \'' + thisText + '\'', 4, 'comment');
                                    // Pattern Delimiter Found??
                                    if (/($|^\s+)/.test(thisText.replace(patterns[thisPattern].match, ''))) {
                                        // Remove for next pattern match
                                        thisText = thisText.replace(patterns[thisPattern].match, function(hitTerm){
                                            terms[terms.length] = [ hitTerm, thisPattern ];
                                            _PlasticBug(this, 4, 'comment');
                                            return '';
                                        }).replace(/^\s+/, function(hitSpace){ tnodes[tnodes.length] = hitSpace; return ''; });
                                    } else {
                                        isComplete = true;
                                    }
                                    _PlasticBug('PATTERN_STRING2: \'' + thisText + '\'', 4, 'comment');
                                    ///$(this).addClass('plastic-search-text-error');
                                    break;
                                }
                            }
                            if (wasMiss) {
                                hits = [];
                                for (var thisPattern in patterns) {
                                    if ((patterns[thisPattern].start.test(thisText))) {
                                        isComplete = true;
                                        hits[hits.length] = thisPattern;
                                        _PlasticBug('PATTERN_START: ' + thisPattern, 4, 'comment');
                                        _PlasticBug('PATTERN_STRING3: \'' + thisText + '\'', 4, 'comment');
                                        //break;
                                    }
                                }
                                terms[terms.length] = [ thisText, 'incomplete' ];
                            }
                            if ((wasMiss) || (isComplete)) { break; };
                        }
                        (wasMiss) ? $(this).addClass('plastic-search-text-error') : $(this).removeClass('plastic-search-text-error');
                        if (terms.length) {
                            _PlasticBug(this, 4, 'comment');
                            thisWrap.find('.plastic-search-help-section') //->
                                .removeClass('plastic-search-help-section-active');
                            var lastTermName = terms[terms.length -1][1];
                            if (hits.length) {
                                for (var cntHit = 0; cntHit < hits.length; cntHit ++) {
                                    thisWrap.find('.plastic-search-help-section[type="' + hits[cntHit] + '"]') //->
                                        .addClass('plastic-search-help-section-active');
                                }
                            } else {
                                thisWrap.find('.plastic-search-help-section[type="' + lastTermName + '"]') //->
                                    .addClass('plastic-search-help-section-active');
                                if ((patterns[lastTermName]) && (patterns[lastTermName].interactive)) {
                                    thisWrap.find('.plastic-search-help-content-instructions').hide();
                                    thisWrap.find('.plastic-search-help-content-interactive').html(patterns[lastTermName].interactive);
                                } else {
                                    thisWrap.find('.plastic-search-help-content-instructions').show();
                                    thisWrap.find('.plastic-search-help-content-interactive').html('');
                                }
                            }
                            var sel = rangy.getSelection();
                            var fNode = sel.focusNode;
                            var fOffset = ($(fNode).hasClass('plastic-search-text')) ? 0 : sel.focusOffset;
                            var fullCount = fOffset;
                            var span = $(fNode).parent();
                            _PlasticBug('SPAN:', 4, 'comment');
                            _PlasticBug(span, 4, 'comment');
                            _PlasticBug('COLLAPSED: ' + sel.getRangeAt(0).collapsed, 4, 'comment');
                            if (sel.getRangeAt(0).collapsed) { // Easy Mapping
                                //if (!(span.hasClass('plastic-search-text'))) {
                                    _PlasticBug('NOT: .plastic-search-text', 4, 'comment');
                                    $(this).contents().each(function(){
                                        if (this.nodeType === this.TEXT_NODE) { // Include Length
                                            if (this === fNode) { return false; };
                                            fullCount += this.length;
                                            _PlasticBug('FFC: (TEXT)' + fullCount, 4, 'comment');
                                        } else {
                                            if ($(this).contents()[0] === fNode) { return false; };
                                            fullCount += $(this).text().length;
                                            _PlasticBug('FFC: (NOT)' + fullCount, 4, 'comment');
                                        }
                                    });
                                //}
                                _PlasticBug('EFC: ' + fullCount, 4, 'comment');
                                var newData = '';
                                for (var cntTerm = 0; cntTerm < terms.length; cntTerm ++) {
                                    var thisText = (cntTerm < tnodes.length) ? tnodes[cntTerm].replace(/\s/g, '&nbsp;') : '';
                                    var title = ((patterns[terms[cntTerm][1]]) && (patterns[terms[cntTerm][1]].title)) //->
                                        ? patterns[terms[cntTerm][1]].title : (terms[cntTerm][1] === 'incomplete') //->
                                            ? 'Incomplete Search Term' : terms[cntTerm][1];
                                    if (terms[cntTerm][0] === null) {
                                        newData += thisText;
                                    } else {
                                        newData += '<span class="plastic-search_' + terms[cntTerm][1] + //->
                                            '" type="' + terms[cntTerm][1] + '" title="' + title + '">' + //->
                                            terms[cntTerm][0].replace(/\s/g, '&nbsp;') + '</span>' + thisText;
                                    }
                                }
                                $(this).html(newData);
                                _PlasticBug('FC: ' + fullCount, 4, 'comment');
                                var cntNode = 0;
                                $(this).contents().each(function(){
                                    _PlasticBug('CNTNODE: ' + cntNode, 4, 'comment');
                                    if (this.nodeType === this.TEXT_NODE) { // Include Length
                                        _PlasticBug('TEXT_NODE: (' + fullCount + ') ' + this.length, 4, 'comment');
                                        fullCount -= this.length;
                                        if (fullCount <= 0) {
                                            var position = this.length + fullCount;
                                            _PlasticBug('HIT: ' + position, 4, 'comment');
                                            var range = rangy.createRange();
                                            range.setEnd(this, position);
                                            range.setStart(this, position);
                                            $(this).focus();
                                            sel.setSingleRange(range);
                                            return false;
                                        }
                                    } else {
                                        _PlasticBug('Not TEXT_NODE: (' + fullCount + ') ' + $(this).text().length, 4, 'comment');
                                        fullCount -= $(this).text().length;
                                        if (fullCount <= 0) {
                                            var position = $(this).text().length + fullCount;
                                            _PlasticBug('HIT: ' + position, 4, 'comment');
                                            var range = rangy.createRange();
                                            range.setEnd($(this).contents()[0], position);
                                            range.setStart($(this).contents()[0], position);
                                            $(this).focus();
                                            sel.setSingleRange(range);
                                            $(this).trigger('click');
                                            return false;
                                        }
                                    }
                                    cntNode ++;
                                });
                            }
                            _PlasticBug('SEL: ' + sel.rangeCount, 4, 'comment');
                        } else {
                            thisWrap.find('.plastic-search-help-content-instructions').show();
                            thisWrap.find('.plastic-search-help-content-interactive').html('');
                        }
                    }
                });
                var thisSelector = ((fopts) && (fopts.parent)) ? fopts.parent + ' *' : 'body';
                var searchFrame = //->
                    '<div class="plastic-search-wrap">' + //->
                    '  <div class="plastic-search-left">' + //->
                    '    <div class="plastic-search-text" contenteditable="true" spellcheck="false" ' + //->
                    '        title="Enter search here (Double-Click to toggle search assistant)." />' + //->
                    '    </div>' + //->
                    '  <div class="plastic-search-right">' + //->
                    '    <div class="plastic-search-button plastic-disabled">Search</div>' + //->
                    '  </div>' + //->
                    '  <div class="plastic-search-help">' + //->
                    '    <div class="plastic-search-help-title">Searchbar Assistant: This pane provides context-aware assistance for your search.</div>' + //->
                    '    <div class="plastic-search-help-content">' + //->
                    '      <div class="plastic-search-help-content-instructions"></div>' + //->
                    '      <div class="plastic-search-help-content-interactive"></div>' + //->
                    '      <div class="plastic-search-help-content-examples"></div>' + //->
                    '    </div>' + //->
                    '  </div>' + //->
                    '</div>';
                $(this).append($(searchFrame));
                var exampleData = '';
                for (var thisPattern in patterns) {
                    if (patterns[thisPattern].example) {
                        if (patterns[thisPattern].example.title) {
                            exampleData += '<div class="plastic-search-help-section" type="' + thisPattern + '">' + //->
                                patterns[thisPattern].example.title + ':<br>';
                            if (patterns[thisPattern].example.sample) {
                                exampleData += '<div class="plastic-search-help-example">' + patterns[thisPattern].example.sample + '</div>';
                            }
                            if (patterns[thisPattern].example.hint) {
                                exampleData += '<div class="plastic-search-help-hint">HINT: ' + patterns[thisPattern].example.hint + '</div>';
                            }
                            exampleData += '</div>';
                        }
                    }
                }
                $(this).find('.plastic-search-help>.plastic-search-help-content>.plastic-search-help-content-examples').html(exampleData);
                if ((fopts) && (fopts.help)) {
                    if (fopts.help['default']) {
                        $(this).find('.plastic-search-help>.plastic-search-help-content>.plastic-search-help-content-instructions').html(fopts.help['default']);
                    }
                } else {
                }
///                $(this).resize(function (e){
///                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
///                    // Make More Generic (FindMe!!)
///                    $(this).outerHeight($(this).parent().height() - $(this).parent().children('ul:first').outerHeight());
///                });
                this.render = function _plasticwidget_search_render(){};
                this.update = function _plasticwidget_search_update(){};
                return $(this);
            }
           ,resultset: function _plasticwidget__make_resultset(fopts){
                var thisId = $(this).attr('id');
                this.render = function _plasticwidget_resultset_render(){
                };
                return $(this);
            }
           ,filterlist: function _plasticwidget__make_filterlist(fopts) {
                var startTime, endTime;
                var thisId = $(this).attr('id');
                var thisWidget = this;
                var dsname = ((fopts) && (fopts.datastore)) ? fopts.datastore : null;
                // Switch away from "default" (FindMe!!)
                var namespace = ((fopts) && (fopts.namespace)) ? fopts.namespace : 'default';
                var datastore = _PlasticRuntime.datastore[dsname];
                var listItems = {};
                var listHierarchy = [];
                var listSelected = {};
                var _updateSelected = function _plasticwidget__make_filterlist__updateSelected(was, selected, update, selectIndices) {
                    if (selectIndices === undefined) {
                        selectIndices = [];
                        for (var thisIndex in listSelected) { selectIndices[Math.abs(parseInt(listSelected[thisIndex]))] = thisIndex; };
                    }
                    $(this).removeClass('ui-state-active plastic-dirty');
                    if (was) {
                        $(this).removeAttr('plastic-filterlist-selected') //->
                            .find('span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
                        $(this).appendTo($(this).closest('.plastic-filterlist-wrap').find('.plastic-filterlist-complete div'));
                        if ((listSelected) && (listSelected[$(this).text()] !== undefined)) {
                            if (/^-/.test(listSelected[$(this).text()])) {
                                update[selected][Math.abs(parseInt(listSelected[$(this).text()]))] = null;
                            } else {
                                //update[selected][listSelected[$(this).text()]] = '-- ' + thisId + '<' + $(this).text() + '> --';
                                update[selected][listSelected[$(this).text()]] = //->
                                    '<span class="plastic-filterlist-deselected" data-text="' + $(this).text() + '">undefined</span>';
                            }
                        }
                    } else {
                        $(this).attr('plastic-filterlist-selected', true) //->
                            .find('span.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                        $(this).appendTo($(this).closest('.plastic-filterlist-wrap').find('.plastic-filterlist-selected div'));
                        if ((listSelected) && (listSelected[$(this).text()] !== undefined)) {
                            update[selected][Math.abs(parseInt(listSelected[$(this).text()]))] = $(this).text();
                        } else {
                            var lastIndex = 0;
                            for (var thisIndex = 0; thisIndex < selectIndices.length; thisIndex ++) {
                                if (selectIndices[thisIndex] === undefined) {
                                    update[selected][thisIndex] = $(this).text();
                                    listSelected[$(this).text()] = '-' + (thisIndex);
                                    lastIndex = -1;
                                    break;
                                } else {
                                    lastIndex = Math.max(lastIndex, thisIndex);
                                }
                            }
                            if (lastIndex > -1) {
                                update[selected][lastIndex +1] = $(this).text();
                                listSelected[$(this).text()] = '-' + (lastIndex +1);
                            }
                        }
                    }
                };
                var _toggleActive = function _plasticwidget__make_filterlist__toggleActive(e) {
                    // nodeName === 'SPAN' XOR e.type === 'dblclick'
                    if ((e.target.nodeName === 'SPAN') ? (!(e.type === 'dblclick')) : (e.type === 'dblclick')) {
                        e.stopPropagation();
                        e.preventDefault();
                        var thisSelected = ((fopts) && (fopts.selected)) ? fopts.selected : null;
                        var thisUpdate = {};
                        thisUpdate[thisSelected] = {};
                        _updateSelected.call(this, $(this).closest('ul').hasClass('plastic-filterlist-selected'), //->
                            thisSelected, thisUpdate);
                        // Update Datastore With Selection Changes
                        var source = (thisWidget) ? thisWidget.source : null;
                        if ((source) && (source.length)) {
                            var key = (thisId) ? $('#' + thisId).data('plastic-key') : null;
                            var dsname = source[0].plasticopts.datastore;
                            var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                            var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                            if (datastore) {
                                datastore.updateRow( key, [{ "status": "selectionupdate", "id": datastore.nextSequence() }, //->
                                    thisUpdate ], source.rowsUpdated, { namespace: namespace });
                            }
                        }
                        thisWidget.adjustWidth();
                    }
                };
                $(this).on('dblclick', '.plastic-filterlist-selected li, .plastic-filterlist-complete li', _toggleActive);
                $(this).on('mouseover', '.plastic-filterlist-selected li, .plastic-filterlist-complete li', function() {
                    $(this).addClass('ui-state-active');
                });
                $(this).on('mouseout', '.plastic-filterlist-selected li, .plastic-filterlist-complete li', function() {
                    $(this).removeClass('ui-state-active');
                });
                $(this).on('click', 'span.plastic-filterlist-select', function(e) {
                    _toggleActive.call($(this).closest('li'), e);
                });
                $(this).on('click', '.plastic-filterlist-undochanges span', function(e) {
                    thisWidget.resetSelected();
                });
                $(this).on('click', '.plastic-filterlist-refreshall span', function(e) {
                    thisWidget.adjustSorting();
                });
                $(this).on('click', '.plastic-filterlist-selectall span, .plastic-filterlist-deselectall span', function(e) {
                    var thisSelected = ((fopts) && (fopts.selected)) ? fopts.selected : null;
                    var thisUpdate = {};
                    thisUpdate[thisSelected] = {};
                    var selectIndices = [];
                    for (var thisIndex in listSelected) { selectIndices[Math.abs(parseInt(listSelected[thisIndex]))] = thisIndex; };
                    $(thisWidget).find('.plastic-filterlist-complete li, .plastic-filterlist-selected li').removeClass('plastic-dirty');
                    if ($(this).parent().hasClass('plastic-filterlist-selectall')) {
                        var thisAppendTo = $(thisWidget).find('.plastic-filterlist-selected div');
                        $(thisWidget).find('.plastic-filterlist-complete li').not(':hidden').each(function(){
                            _updateSelected.call(this, false, thisSelected, thisUpdate);
                            $(this).find('.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                            $(this).appendTo(thisAppendTo);
                        });
                        ///$(thisWidget).find('.plastic-filterlist-selected .ui-icon') //->
                        ///    .removeClass('ui-icon-plus').addClass('ui-icon-minus');
                        ///$(thisWidget).find('.plastic-filterlist-selected li:not([plastic-filterlist-selected=true])').addClass('plastic-dirty');
                        $(thisWidget).find('.plastic-filterlist-search input').val('').trigger('keyup');
                    } else {
                        var thisAppendTo = $(thisWidget).find('.plastic-filterlist-complete div');
                        $(thisWidget).find('.plastic-filterlist-selected li').each(function(){
                            _updateSelected.call(this, true, thisSelected, thisUpdate);
                            $(this).find('.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
                            $(this).appendTo(thisAppendTo);
                        });
                        ///$(thisWidget).find('.plastic-filterlist-complete .ui-icon') //->
                        ///    .removeClass('ui-icon-minus').addClass('ui-icon-plus');
                        ///$(thisWidget).find('.plastic-filterlist-complete li[plastic-filterlist-selected=true]').addClass('plastic-dirty');
                    }
                    // Update Datastore With Selection Changes
                    var source = (thisWidget) ? thisWidget.source : null;
                    if ((source) && (source.length)) {
                        var key = (thisId) ? $('#' + thisId).data('plastic-key') : null;
                        var dsname = source[0].plasticopts.datastore;
                        var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                        var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                        if (datastore) {
                            datastore.updateRow( key, [{ "status": "selectionupdate", "id": datastore.nextSequence() }, //->
                                thisUpdate ], source.rowsUpdated, { namespace: namespace });
                        }
                    }
                    thisWidget.adjustWidth();
                });
                $(this).on('click', '.plastic-filterlist-search span.ui-icon-cancel', function(e) {
                    $(this).parent().find('input:first').val('').trigger('keyup');
                });
                $(this).on('keyup', '.plastic-filterlist-search input', function(e) {
                    if ((e.key === 'Esc') || ($.trim($(this).val()).length === 0)) {
                        $(this).val('');
                        $(this).parent().prev('span').removeClass('ui-icon-cancel').addClass('ui-icon-search');
                        $(this).closest('.plastic-filterlist-wrap').find('.plastic-filterlist-complete li').show();
                    } else {
                        $(this).parent().prev('span').removeClass('ui-icon-search').addClass('ui-icon-cancel');
                        $(this).closest('.plastic-filterlist-wrap').find('.plastic-filterlist-complete li').hide();
                        $(this).closest('.plastic-filterlist-wrap') //->
                            .find('.plastic-filterlist-complete li:contains("' + $.trim($(this).val()) + '")').show();
                    }
                });
                var leftLabel = ((fopts) && (fopts.filterTitle)) ? fopts.filterTitle : 'Available Options';
                var rightLabel = ((fopts) && (fopts.title)) ? fopts.title : 'Selected Options';
                $(this).removeData('plastic-key');
                var thisFilterDiv = '';
                thisFilterDiv += '<div id="' + thisId + '_wrap" class="plastic-filterlist-wrap">';
                thisFilterDiv += '  <div id="' + thisId + '_left" class="plastic-filterlist-left">';
                thisFilterDiv += '    <div class="plastic-filterlist-top">';
                thisFilterDiv += '      <label class="plastic-filterlist-title">' + leftLabel + ':</label>';
                thisFilterDiv += '      <div class="plastic-filterlist-undochanges"><span class="ui-icon ui-icon-trash" title="Undo Changes" /></div>';
                thisFilterDiv += '      <div class="plastic-filterlist-deselectall"><span class="ui-icon ui-icon-minus" title="Deselect All" /></div>';
                thisFilterDiv += '    </div>';
                thisFilterDiv += '    <div class="plastic-filterlist-bottom">';
                thisFilterDiv += '      <ul class="plastic-filterlist-selected"><div/></ul>';
                thisFilterDiv += '    </div>';
                thisFilterDiv += '  </div>';
                thisFilterDiv += '  <div id="' + thisId + '_right" class="plastic-filterlist-right">';
                thisFilterDiv += '    <div class="plastic-filterlist-top">';
                thisFilterDiv += '      <label class="plastic-filterlist-title">' + rightLabel + ':</label>';
                thisFilterDiv += '      <div class="plastic-filterlist-selectall"><span class="ui-icon ui-icon-plus" title="Select All" /></div>';
                thisFilterDiv += '      <div class="plastic-filterlist-refreshall"><span class="ui-icon ui-icon-refresh" title="Refresh Sorting" /></div>';
                thisFilterDiv += '      <div class="plastic-filterlist-searchwrap">';
                thisFilterDiv += '        <div class="plastic-filterlist-search">';
                thisFilterDiv += '          <span class="ui-icon ui-icon-search"></span>';
                thisFilterDiv += '          <div><input type="text" name="' + thisId + '_search"></div>';
                thisFilterDiv += '        </div>';
                thisFilterDiv += '      </div>';
                thisFilterDiv += '    </div>';
                thisFilterDiv += '    <div class="plastic-filterlist-bottom">';
                thisFilterDiv += '      <ul class="plastic-filterlist-complete"><div/></ul>';
                thisFilterDiv += '    </div>';
                thisFilterDiv += '  </div>';
                thisFilterDiv += '</div>';
                $(this).append($(thisFilterDiv));
///                $(this).resize(function (e){
///                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
///                    // Make More Generic (FindMe!!)
///                    $(this).outerHeight($(this).parent().height() - $(this).parent().children('ul:first').outerHeight());
///                    thisWidget.adjustWidth();
///                });
                this.fulfillList = function(selected){
                    _PlasticBug(this, 4, 'comment');
                    var retVal = [];
                    for (var thisItem in listItems) {
                        if ((listSelected[listItems[thisItem]] !== undefined) && //->
                            (/^[0-9-]/.test(listSelected[listItems[thisItem]]))) {
                            var thisClass = ((selected) && (listItems[thisItem] === selected)) //->
                                ? 'plastic-autofill-selected' : 'plastic-autofill-item';
                            retVal[retVal.length] = { key: thisItem, 'class': thisClass, value: listItems[thisItem] };
                        }
                    }
                    return retVal;
                };
                this.resetSelected = function(keepDirty) {
                    var selected = $(thisWidget).find('.plastic-filterlist-selected div');
                    var complete = $(thisWidget).find('.plastic-filterlist-complete div');
                    var thisSelected = ((fopts) && (fopts.selected)) ? fopts.selected : null;
                    var thisUpdate = {};
                    thisUpdate[thisSelected] = {};
                    var cntUpdates = 0;
                    $(thisWidget).find('.plastic-filterlist-complete li, .plastic-filterlist-selected li').each(function(){
                        $(this).removeClass('plastic-dirty');
                        if ($(this).attr('plastic-filterlist-selected')) {
                            if (keepDirty) {
                                $(this).appendTo(selected).find('span.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                                if ((listSelected[$(this).text()] === undefined) || (/^[- ]/.test(listSelected[$(this).text()]))) {
                                    $(this).addClass('plastic-dirty');
                                }
                            } else {
                                if ((listSelected[$(this).text()] === undefined) || (/^[- ]/.test(listSelected[$(this).text()]))) {
                                    $(this).appendTo(complete).removeAttr('plastic-filterlist-selected') //->
                                        .find('span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
                                    thisUpdate[thisSelected][Math.abs(parseInt(listSelected[$(this).text()]))] = null;
                                    cntUpdates ++;
                                }
                            }
                        } else {
                            if (keepDirty) {
                                $(this).appendTo(complete).find('span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
                                if ((listSelected[$(this).text()] !== undefined) && (/^[- ]/.test(listSelected[$(this).text()]))) {
                                    $(this).addClass('plastic-dirty');
                                }
                            } else {
                                if ((listSelected[$(this).text()] !== undefined) && (/^[- ]/.test(listSelected[$(this).text()]))) {
                                    $(this).appendTo(selected).attr('plastic-filterlist-selected', true) //->
                                        .find('span.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                                    thisUpdate[thisSelected][Math.abs(parseInt(listSelected[$(this).text()]))] = $(this).text();
                                    cntUpdates ++;
                                }
                            }
                        }
                    });
                    if (cntUpdates) {
                        // Update Datastore With Selection Changes
                        var source = (thisWidget) ? thisWidget.source : null;
                        if ((source) && (source.length)) {
                            var key = (thisId) ? $('#' + thisId).data('plastic-key') : null;
                            var dsname = source[0].plasticopts.datastore;
                            var namespace = ((source) && (source.length) && (source[0].plasticopts)) ? source[0].plasticopts.namespace : 'default';
                            var datastore = ((source) && (_PlasticRuntime.datastore[dsname])) ? _PlasticRuntime.datastore[dsname] : null;
                            if (datastore) {
                                datastore.updateRow( key, [{ "status": "selectionupdate", "id": datastore.nextSequence() }, //->
                                    thisUpdate ], source.rowsUpdated, { namespace: namespace });
                            }
                        }
                    }
                    thisWidget.adjustWidth(); // Make More Efficient?? (FindMe!!)
                };
                this.adjustSelected = function() {
                    $(thisWidget).find('.plastic-filterlist-complete li, .plastic-filterlist-selected li').each(function(){
                        _PlasticBug(this, 4, 'comment');
                        if ((listSelected[$(this).text()] === undefined) || (/^ /.test(listSelected[$(this).text()]))) {
                            $(this).removeAttr('plastic-filterlist-selected') //->
                                .find('span.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
                        } else {
                            $(this).attr('plastic-filterlist-selected', true) //->
                                .find('span.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                        }
                    });
                    this.resetSelected(true);
                };
                this.adjustSorting = function() {
                    var sorter = function(a,b){
                        var left = $(a).text().toLowerCase();
                        var right = $(b).text().toLowerCase();
                        return (left === right) ? 0 : (left < right) ? -1 : 1;
                    };
                    $(thisWidget).find('.plastic-filterlist-selected li').sort(sorter).appendTo($(thisWidget).find('.plastic-filterlist-selected div'));
                    $(thisWidget).find('.plastic-filterlist-complete li').sort(sorter).appendTo($(thisWidget).find('.plastic-filterlist-complete div'));
                };
                this.adjustWidth = function() {
                    $(thisWidget).find('.plastic-filterlist-complete div, .plastic-filterlist-selected div').css({ width: 'auto' });
                    $(thisWidget).find('.plastic-filterlist-complete, .plastic-filterlist-selected').each(function(){
                        $(this).children('div').width( this.scrollWidth );
                    });
                };
                this.rowsRead = function _plasticwidget_filterlist_rowsRead(rowObjects, fopts) {
                    _PlasticBug('rowsRead(rowObjects); called', 4, 'function');
                    if (rowObjects) {
                        if (rowObjects.length === 1) {
                            while (listHierarchy.length) {
                                var tryNext = listHierarchy.pop();
                                if (tryNext[1] === null) { continue; };
                                datastore.readRows(tryNext[0], tryNext[1], thisWidget.rowsRead, { namespace: namespace });
                                break;
                            }
                            if (listHierarchy.length === 0) {
                                // Clear Selected List
                                $(thisWidget).find('.plastic-filterlist-selected div').html('');
                                var thisComplete = $(thisWidget).find('.plastic-filterlist-complete div');
                                var completeList = [];
                                for (var thisItem in listItems) {
                                    completeList[completeList.length] = '<li class="ui-element ui-state-default" ' + //->
                                        ' itemKey="' + thisItem + '"' + //->
                                        ' title="' + listItems[thisItem] + '">' + //->
                                        '<span class="ui-icon ui-icon-plus plastic-filterlist-select" />' + listItems[thisItem] + '</li>';
                                }
                                thisComplete.html($(completeList.join('')));
                            }
                        } else {
                            var thisKeys = {};
                            // Collect These Keys
                            for (var cntRowObject = 1; cntRowObject < rowObjects.length; cntRowObject ++) {
                                thisKeys[rowObjects[cntRowObject].key] = 1;
                            }
                            // Process These Keys
                            for (var cntRowObject = 1; cntRowObject < rowObjects.length; cntRowObject ++) {
                                var rowObject = rowObjects[cntRowObject];
                                var parentkey = rowObject.parentKey;
                                var key = rowObject.key;
                                var prev = rowObject.prev;
                                var next = rowObject.next;
                                if (listItems[key] === undefined) {
                                    ///cl('ROW0: ' + rowObjects[1].title);
                                    ///cl('ROW1: ' + rowObjects[1].attributes.name);
                                    ///listItems[key] = rowObject.title;
                                    listItems[key] = rowObject.attributes.name;
                                    listHierarchy[listHierarchy.length] = [parentkey, next];
                                    datastore.readRows(key, null, thisWidget.rowsRead, { namespace: namespace });
                                } else if (next) {
                                    if (!(thisKeys[next])) {
                                        datastore.readRows(key, next, thisWidget.rowsRead, { namespace: namespace });
                                    }
                                }
                            }
                        }
                    }
                };
                this.bindDatastore = function _plasticwidget_filterlist_bindDatastore(){
                    _PlasticBug("bindDatastore(PlasticDatastore[, Namespace]); called", 4, 'function');
                    _PlasticBug(this, 4, 'comment');
                    if (arguments.length === 0) { _PlasticBug("Usage: this.bindDatastore(PlasticDatastore[, Namespace]);", undefined, undefined, 'warn'); };
                    datastore.readRows(null, null, thisWidget.rowsRead, { namespace: namespace });
                    //var namespace = (arguments.length == 2) ? arguments[1] : "default";
                    //datastore[namespace] = arguments[0];
                    //datastore[namespace].bindView(this, namespace);
                    //datastore[namespace].readRows(null, null, self.rowsRead, { namespace: namespace });
                };
                this.render = function _plasticwidget_filterlist_render(rowObjects){
                    self._register.call(this, rowObjects);
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    var thisKey = ((rowObjects) && (rowObjects.length > 1)) ? rowObjects[1].key : null;
                    $('#' + thisId).data('plastic-key', thisKey);
                    // Move this Common (FindMe!!)
                    ///if ((this.parent) && (this.parent.activate) && //->
                    ///    (typeof (this.parent.activate) === 'function')) {
                    ///    this.parent.activate($(this).attr('id'));
                    ///}
                    var selected = ((fopts) && (fopts.selected)) ? fopts.selected : null;
                    if ((selected) && (rowObjects) && (rowObjects.length > 1) && //->
                        (rowObjects[1].attributes) && (rowObjects[1].attributes[selected])) {
                        var thisDirty = ((rowObjects[1].dirty) && (rowObjects[1].dirty[selected])) //->
                            ? rowObjects[1].dirty[selected] : {};
                        listSelected = {};
                        for (var thisSelected in rowObjects[1].attributes[selected]) {
                            var thisIndex = rowObjects[1].attributes[selected][thisSelected];
                            ////if (/^-- [^<]*<[^>]*> --$/.test(thisDirty[thisSelected])) {
                            if (/^<span .*\/span>$/.test(thisDirty[thisSelected])) {
                                //thisIndex = thisIndex.replace(/^-- [^<]*</, '').replace(/> --$/, '');
                                thisIndex = $(thisIndex).data('text');
                            }
                            listSelected[thisIndex] = //->
                                (thisDirty[thisSelected] === undefined) ? thisSelected : //->
                                    (thisDirty[thisSelected] === thisIndex) ? '-' + thisSelected : ' ' + thisSelected;
                        }
                    }
                    _PlasticBug(selected, 4, 'comment');
                    this.adjustSelected();
                    thisWidget.adjustSorting();
                /*
                var thisComplete = $(this).find('.plastic-filterlist-complete');
                function loadThisComplete() {
                    var thisCompleteList = [];
                    for (var cntRows = 0; cntRows < 1000; cntRows ++) {
                        thisCompleteList[thisCompleteList.length] = '<li class="ui-element ui-state-default">' + //->
                            '<span class="ui-icon ui-icon-plus plastic-filterlist-select" />' + cntRows + '</li>';
                    }
                    thisComplete.html(thisCompleteList.join(''));
                }
                //setTimeout( loadThisComplete, 500);
                loadThisComplete();
                */
                };
                this.update = this.render;
/*
                this.update = function _plasticwidget_filterlist_update(rowObjects){
                    var listId = $(this).attr('id');
                    var thisReplace = new RegExp('^' + listId + '_');
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    var selected = ((this) && (this.plasticopts) && (this.plasticopts.selected)) //->
                        ? this.plasticopts.selected : null;
                    if ((rowObjects) && (rowObjects.length > 1) && (rowObjects[1].dirty)) {
                        for (var thisDirty in rowObjects[1].dirty) {
                            if ((rowObjects[1].attributes) && (rowObjects[1].attributes[thisDirty] !== undefined)) {
                                if ((selected) && (selected === thisDirty)) {
                                    _PlasticBug(thisDirty + ' => ' + rowObjects[1].attributes[thisDirty], 0, 'pdmk', 'info');
                                }
                            } else if (rowObjects[1][thisDirty] !== undefined) {
                                _PlasticBug(thisDirty + ' => ' + rowObjects[1][thisDirty], 0, 'pdmk', 'info');
                            }
                        }
                    }
                };
*/
                this.init = function _plasticwidget_filterlist_init(){
                    datastore.readRows(null, null, thisWidget.rowsRead, { namespace: namespace });
                };
                return $(this);
            }
           ,menu: function _plasticwidget__make_menu(fopts) {
                $(this).on('click', '.plastic-menu-item', function() {
                    var thisMenu = $(this).attr('for');
                    if ((fopts) && (fopts.menu) && (fopts.menu[thisMenu])) {
                        if (fopts.menu[thisMenu].target)  {
                            var target = self._findTarget(fopts.menu[thisMenu].target);
                            target[0].render([{},{}]);
                        }
                    }
                    _PlasticBug(this, 4, 'comment');
                });
                var thisMenuCount;
                var menuCount = ((fopts) && (fopts.ordered)) ? 0 : null;
                if ((fopts) && (fopts.menu)) {
                    var menuDetails = '<ul>';
                    for (var thisMenu in fopts.menu) {
                        if (fopts.menu[thisMenu].separator) {
                            menuDetails += '<li class="plastic-menu-separator"></li>';
                        }
                        thisMenuCount = (typeof (menuCount) === 'number') ? '<span class="plastic-menu-number">' + (++menuCount) + '.)</span>' : '';
                        menuDetails += '<li class="plastic-menu-item" for="' + thisMenu + '">' + //->
                            thisMenuCount + '<span>' + thisMenu + '</span></li>';
                    }
                    menuDetails += '</ul>';
                    $(this).append(menuDetails);
                }
///                $(this).resize(function (e){
///                    e.stopPropagation(); // Resize needs to bubble opposite normal flow for efficiency in the browser
///                    // Make More Generic (FindMe!!)
///                    $(this).outerHeight($(this).parent().height() - $(this).parent().children('ul:first').outerHeight());
///                });
                return $(this);
            }
           ,iframe: function _plasticwidget__make_iframe(fopts) {
                var thisId = $(this).attr('id');
                var thisTitle = ((fopts) && (fopts.title)) //->
                    ? self._varExpand(fopts.title, {}) : null;
                var baseLocation = ((fopts) && (fopts.location)) //->
                    ? self._varExpand(fopts.location, {}) : 'about:blank';
                this.render = function _plasticwidget_iframe_render(rowObjects){
                    var rowObject = ((rowObjects) && (rowObjects.length > 1)) ? rowObjects[1] : {};
                    thisTitle = ((fopts) && (fopts.title)) //->
                        ? self._varExpand(fopts.title, rowObject) : null;
                    baseLocation = ((fopts) && (fopts.location)) //->
                        ? self._varExpand(fopts.location, rowObject) : 'about:blank';
                    if ($(this).is(':visible')) { $(this).trigger('profileshow.plastic'); };
                ///        if ((this.parent) && (this.parent.activate) && //->
                ///            (typeof (this.parent.activate) === 'function')) {
                ///            this.parent.activate(thisId);
                ///        }
                };
                $(this).on('profileshow.plastic', function(){
                    if (thisTitle) {
                        $(this).closest('.plastic-title-host').trigger('hosttitle.plastic', { title: thisTitle });
                    }
                    var thisLocation = ((fopts) && (fopts.random === false)) //->
                        ? baseLocation : baseLocation + '?uniq=' + Math.random();
                    $(this).find('.plastic-iframe-frame:first').attr({ 'src' : thisLocation });
                });
                $(this).on('profilehide.plastic', function(){ // Lower memory footprint of hidden iframes
                    $(this).find('.plastic-iframe-frame:first').attr({ 'src' : 'about:blank' });
                });
                $(this).on('initialize.plastic', function (e) {
                    if ($(this).is('.plastic-visible-inactive')) {
                        var thisLocation = ((fopts) && (fopts.random === false)) //->
                            ? baseLocation : baseLocation + '?uniq=' + Math.random();
                        $(this).find('.plastic-iframe-frame:first').attr({ 'src' : thisLocation });
                    }
                });
                $(this).append($('<iframe class="plastic-iframe-frame" id="' + thisId + '_frame" src="about:blank" />'));
                //if ($(this).is(':visible')) {
                //    $(this).find('.plastic-iframe-frame:first').attr({ 'src' : fopts.defaultTarget + '?uniq=' + Math.random() });
                //}
                return $(this).addClass('plastic-lowprofile');
            }
        };
        this._findTarget = function _plasticview__findTarget(source) {
            _PlasticBug("_findTarget(source); called", 4, 'function');
            var target = ((source.plasticopts) && (source.plasticopts['defaultTarget'])) //->
                ? source.plasticopts['defaultTarget'] : source;
            if (target['jquery'] === undefined) { // Not jQuery reference
                if ($('#' + target).length) { // Last Resort ??
                    target = $('#' + target);
                }
            }
            return target;
        };
        this._subComponentsFreeze = function _plasticview__subComponentsFreeze() {
            var subComponents = {};
            $(this).find('.plastic-widget, .plastic-view').each(function(){
                var thisScrollPos = ((this.isplastic) && (this['plastic' + this.isplastic]) && //->
                    (this['plastic' + this.isplastic].getScrollDetails)) //->
                    ? this.plasticview.getScrollDetails() : undefined;
                subComponents[$(this).attr('id')] = [ thisScrollPos, $(this).detach() ];
            });
            return subComponents;
        };
        this._subComponentsThaw = function _plasticview__subComponentsThaw(subComponents, rowObjects, renderer) {
            for (var thisSubComponent in subComponents) {
                subComponents[thisSubComponent][1].appendTo($(this).find('div[plastic-sub-component="' + thisSubComponent + '"] fieldset'));
                if (subComponents[thisSubComponent][1][0][renderer]) {
                    subComponents[thisSubComponent][1][0][renderer](rowObjects); // Replace "source" with self (FindMe!!)
                } // Notify Missing Renderer?? (FindMe!!)
                var shortComponent = subComponents[thisSubComponent][1][0];
                if ((shortComponent.isplastic) && (shortComponent['plastic' + shortComponent.isplastic]) && //->
                    (shortComponent['plastic' + shortComponent.isplastic].setScrollDetails) && //->
                    (typeof (shortComponent['plastic' + shortComponent.isplastic].setScrollDetails) === 'function')) {
                    shortComponent['plastic' + shortComponent.isplastic].setScrollDetails(subComponents[thisSubComponent][0]);
                }
            }
        };
        return this.each(function(item) {
            var thisId = $(this).attr('id');
            _PlasticBug('BUILD: ' + thisId, 4, 'build');
            ///$(this).css({ 'border' : 'solid red 1px', 'padding' : '3px' });
            $(this).css({ 'padding' : '3px' });
            var widgetopts = (widgetargs.length >= 2) ? widgetargs[1] : {};
            if ((widgetargs[0]) && (self._make[widgetargs[0]] !== undefined)) {
                widget[thisId] = self._make[widgetargs[0]].call(this, widgetopts);
                widget[thisId][0].plasticopts = widgetopts;
                widget[thisId][0].plasticwidget = self; // Find Cleaner Way??(FindMe!!)
                widget[thisId][0].plasticcomponent = widgetargs[0];
                widget[thisId][0].isplastic = 'widget';
                var wasRender = widget[thisId][0].render;
                widget[thisId][0].render = function _widget_render_wrap(rowObjects) { // Stuff Data
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    this.caller = (rowObjects[0].caller) ? rowObjects[0].caller : undefined;
                    this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    $(this).data('plastic-row', rowObjects[1]);
                    $(this).data('plastic-key', rowObjects[1].key);
                    var mustJump = undefined; // Check and react to "jumpIf" component
                    if ((self) && (self.length) && (self[0].plasticopts) && (self[0].plasticopts.jumpIf)) {
                        for (var thisJump in self[0].plasticopts.jumpIf) {
                            var tests = self[0].plasticopts.jumpIf[thisJump];
                            for (var cntTest = 0; cntTest < tests.length; cntTest ++) {
                                mustJump = Plastic.Test.call(this.source, rowObjects[1], tests[cntTest], {});
                                if (!(mustJump)) { break; }; // One false is enough
                            }
                            if (mustJump) { mustJump = thisJump; break; }; // First hit for jumpIf wins
                        }
                    }
                    if (mustJump) {
                        var target = self._findTarget(mustJump);
                        if ((target) && (target[0].render) && (typeof target[0].render === 'function')) {
                            target[0].render(rowObjects);
                        } else {
                            _PlasticBug('WARN: Feature - "jumpIf" failed to locate renderable object', 2);
                        }
                    } else {
                        var maxActive = $('.plastic-stack-active').plasticDataSorter('plastic-active') //->
                            .last().data('plastic-active');
                        if (maxActive === undefined) { maxActive = 100; };
                        //if ((this.parent) && (this.parent.activate) && //->
                        //    (typeof (this.parent.activate) === 'function')) {
                        //    this.parent.activate($(this).attr('id'));
                        //}
                        if ((wasRender) && (typeof (wasRender) === 'function')) {
                            wasRender.call(this, rowObjects);
                        }
                        if ($(this).parents('.plastic-elevated').length) { // Needs Offset
                            maxActive += $(this).parents('.plastic-elevated:first').data('plastic-offset');
                        }
                        $(this).trigger('activate.plastic', { start: maxActive });
                        $('.plastic-actionable').trigger('actiontest.plastic');
                        $(self).find('span[activate]').each(function(){
                            if ($(this).attr('title') === undefined) {
                                $(this).attr('title', ($(this).attr('activate')) ? 'Click to follow link' : 'Unavailable link');
                            }
                        }); // Need this for updates?? (FindMe!!)
                        $(self).trigger('rendered.plastic');
                    }
                };
                var wasUpdate = widget[thisId][0].update;
                widget[thisId][0].update = function _widget_update_wrap(rowObjects) { // Stuff Data
                    this.source = (rowObjects[0].source) ? rowObjects[0].source : undefined;
                    this.caller = (rowObjects[0].caller) ? rowObjects[0].caller : undefined;
                    this.datastore = (rowObjects[0].datastore) ? rowObjects[0].datastore : undefined;
                    this.path = (rowObjects[0].path) ? rowObjects[0].path : undefined;
                    $(this).data('plastic-row', rowObjects[1]);
                    $(this).data('plastic-key', rowObjects[1].key);
                    if ((wasUpdate) && (typeof (wasUpdate) === 'function')) {
                        wasUpdate.call(this, rowObjects);
                    }
                    $('.plastic-actionable').trigger('actiontest.plastic');
                };
                module('PlasticWidget');
                test('Find required (widget) methods for: ' + widgetargs[0] + ' => ' + thisId, function() {
                    ok(typeof (self[0].render) === 'function', 'Found (render) method'); /*-##QUNIT##-*/
                    ok(typeof (self[0].update) === 'function', 'Found (update) method'); /*-##QUNIT##-*/
                    ok(typeof (self.resize) === 'function', 'Found (resize) method'); /*-##QUNIT##-*/
                    //ok(typeof (self.getRowObjectFor) === 'function', 'Found (getRowObjectFor) method'); /*-##QUNIT##-*/
                });
                if ((widgetopts) && (widgetopts['default'])) {
                    widget[thisId].addClass('plastic-stack-active');
                }
            } else {
                widget[thisId] = $(this).append($('<div class="plastic-undefined-component">Undefined Widget: ' + widgetargs[0] + '</div>'));
                widget[thisId][0].render = function _widget_undefined_render_wrap(rowObjects) { // Stuff Data
                    if ((this.parent) && (this.parent.activate) && //->
                        (typeof (this.parent.activate) === 'function')) {
                        this.parent.activate($(this).attr('id'));
                    }
                };
            }
            widget[thisId].addClass('plastic-widget');
            // Horizontal splitter support - Roll this common?? (FindMe!!)
            if ((widgetopts) && (widgetopts['defaultwidth'])) {
                widget[thisId].outerWidth(widgetopts['defaultwidth']);
                widget[thisId].addClass('plastic-width-manual');
            } else if ((widgetopts) && (widgetopts['fixedwidth'])) {
                widget[thisId].outerWidth(widgetopts['fixedwidth']);
                widget[thisId].addClass('plastic-width-fixed');
            } else {
                widget[thisId].addClass('plastic-width-auto');
            }
            // Vertical splitter support - Roll this common?? (FindMe!!)
            if ((widgetopts) && (widgetopts['defaultheight'])) {
                widget[thisId].outerHeight(widgetopts['defaultheight']);
                widget[thisId].addClass('plastic-height-manual');
            } else if ((widgetopts) && (widgetopts['fixedheight'])) {
                widget[thisId].outerHeight(widgetopts['fixedheight']);
                widget[thisId].addClass('plastic-height-fixed');
            } else {
                widget[thisId].addClass('plastic-height-auto');
            }
        });
    };
    $.fn.plasticwidget.formwidget = function() { // Testing
        _PlasticBug('PlasticFormWidget', 4, 'comment');
    };
})( jQuery );

