//-------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////
/*-------------------------------------------------------------------//
/ COPYRIGHT (c) 2014 CenturyLink, Inc.
/ SEE LICENSE-MIT FOR LICENSE TERMS
/ SEE CREDITS FOR CONTRIBUTIONS AND CREDITS FOR THIS PROJECT 
/
/ Program: "PlasticPlaybookHelp.js" => Plastic Data Modeling Kit [pdmk]
/                                      Help Demo Application
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

// Add Event Handler To Prepare Syntax Highlighting
$(document).ready(function(){
    $('body').on('rendered.plastic', '.Plastic.widget-form, #ExampleDialog', function(){
        PR.prettyPrint(); // Redraw code sections with syntax highlighting
        var legalObj = $('.plastic-legal', this);
        if (legalObj.length) {
            legalObj.html(legalObj.html().replace(/https?:\/\/[^\s]*/g, function($1){
                return '<a href="' + $1 + '" target="_blank">' + $1 + '</a>';
            }).replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig, function($1){
                return '<a href="mailto:' + $1 + '">' + $1 + '</a>';
            }));
        }
        // Quick Title Change
        var newTitle = ($(this).hasClass('widget-dialog')) //->
            ? $(this).closest('.ui-dialog').find('.ui-dialog-title').text().replace('[]', '[pdmk]') //->
            : $('div:eq(2)', this).text().replace('[]', '[pdmk]');
        if (newTitle.length) { $('title').text( newTitle ); };
        // Initialize Flow Player Instances
        $('div.pdmk-flowplayer').flowplayer().removeClass('pdmk-flowplayer');
    });
    $('body').on('show.plastic', '#LicenseDialog', function(){ // Envoke Logo Animation
        $('img[src="cust/images/pdmkanim3o.gif"]', this).attr('src', 'about:blank').attr('src', 'cust/images/pdmkanim3o.gif');
    });
});

//
// The playbook represents the full application lifecycle hierarchy
// Each of the Plastic Elements are defined below and given to
// the "Plastic.RegisterPlaybook" glue function.  Once initialized
// The elements are automatically expanded as needed throughout the
// life of the application.  Application flow is determined through
// the configuration of element options as defined in the
// documentation.  Of particular note is the defaultTarget option
// which will determine where the result of an action will be
// returned.  Data returned to a stacked element will cause the stack
// to change visibility (where applicable) and present the previously
// hidden element.  See documentation for additional details regarding
// this and other playbook features.
//

//try {
Plastic.RegisterPlaybook({
    MainHelpLayout: {
        type: 'stack-vsplit'
       ,options: {
            prettyNames: { NavTree: 'Navigation', ContentPane: 'Contents'  }
        }
       ,children: {
            TopPane: {
                type: 'widget-iframe'
               ,options: {
                    fixedheight: '138px'
                   ,location: 'help.html'
                }
            }
           ,BottomPane: {
                type: 'stack-hsplit'
               ,children: {
                    NavTree: {
                        type: 'view-tree'
                       ,options: {
                            datastore: 'help'
                           ,defaultwidth: '300px'
                           ,forceRootExpanded: true
                           ,autoExpand: true
                           ,defaultTarget: 'MainStackForm'
                        }
//                       ,children: {
//                            NavContext: {
//                                type: 'widget-context'
//                               ,options: {
//                                    type: '.*'
//                                   ,menu: {
//                                        Previous: {
//                                            action: 'prev'
//                                           ,path: '-'
//                                           ,against: '-'
//                                           //,hideIf: [ [ 'isequal', 'type', 'example' ] ]
//                                           //,hideIf: [ [ 'islike', 'key', 'stack' ] ]
//                                           ,hideIf: [ [ 'isgreater', 'nom', 5 ], [ 'isless', 'nom', 8 ] ]
//                                           ,icon: 'cut'
//                                        }
//                                       ,Next: {
//                                            action: 'next'
//                                           ,path: '-'
//                                           ,against: '-'
//                                        }
//                                       ,Magoo: {
//                                            action: 'greater'
//                                           ,path: 'nom'
//                                           ,against: 5
//                                        }
//                                       ,Activate: {
//                                            target: 'MainStackForm'
//                                        }
//                                       ,Dialog: {
//                                            target: 'ExampleDialog'
//                                        }
//                                    }
//                                }
//                            }
//                        }
                    }
                   ,ContentPane: {
                        type: 'stack-vsplit'
//                       ,options: {
//                            defaultwidth: '300px'
//                        }
                       ,children: {
                            ButtonBar: {
                            type: 'widget-buttonbar'
                               ,options: {
                                    fixedheight: '34px'
                                   ,prettyNames: { Previous: '&lt;&lt;' }
                                   ,buttons: {
                                        Previous: {
                                            action: 'prev'
                                           ,path: '-'
                                           ,against: '-'
                                        }
                                       ,Next: {
                                            action: 'next'
                                           ,path: '-'
                                           ,against: '-'
                                        }
//                                       ,Delete: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet1: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet2: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet3: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet4: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet5: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet6: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet7: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet8: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Delet9: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
//                                       ,Dele10: {
//                                            //action: 'delete'
//                                            target: 'ExampleDialog'
//                                        }
                                    }
                                }
                            }
                           ,MainContent: {
                                type: 'stack-stack'
                               ,children: {
                                    MainStackForm: {
                                        type: 'widget-form'
                                       ,options: {
                                            ///title: 'Wha: "%{title}" => "%{tooltip}"'
                                            title: ''
                                           ,help: {
                                                _inlinepre: '%{preinlinehelp}'
                                               ,_inline: '%{inlinehelp}%{preinlinehelp!<br><div style="position:relative;left:20px;">' + //->
                                                    '<b>P</b>lastic <b>D</b>ata <b>M</b>odeling <b>K</b>it&nbsp;&nbsp;' + //->
                                                    '<font size="+1"><b>[<img src="images/pdmklogo_plainback01_sm.png" ' + //->
                                                    'style="vertical-align:middle;" title="Plastic Data Modeling Kit">]</b></font>}'
                                            }
                                           //,layout: [
                                           //     ['tooltip', 'name']
                                           // ]
                                           ,jumpIf: {
                                                ExampleFrame: [ [ 'isequal', 'type', 'example' ] ]
                                               ///,LicenseDialog: [ [ 'isequal', 'type', 'license' ] ]
                                               ,LicenseForm: [ [ 'isequal', 'type', 'license' ] ]
                                            }
                                           ,isDefault: 'help'
                                        }
                                    }
                                   ,ExampleDialog: {
                                        type: 'widget-dialog'
                                       ,options: {
                                            title: 'Examples on JSFiddle [pdmk]'
                                           ///,defaultheight: '550px'
                                           ,buttons: {
                                                Ok: {
                                                    action: 'accept'
                                                   ,close: true
                                                }
                                               ,Prev: {
                                                    action: 'prev'
                                                   ,path: '-'
                                                   ,against: 'against'
                                                }
                                               ,Next: {
                                                    action: 'next'
                                                   ,path: '-'
                                                   ,against: 'type'
                                                }
                                               ,Cancel: {
                                                    action: 'noop'
                                                   ,close: true
                                                }
                                            }
                                        }
                                       ,children: {
                                            ExampleFrame: {
                                                type: 'widget-iframe'
                                               ,options: {
                                                    title: 'Examples on JSFiddle [pdmk] - "%{fiddletitle}"'
                                                   ,location: 'https://jsfiddle.net/funwithplastic/%{fiddlepath}/embedded/'
                                                }
                                            }
                                        }
                                    }
                                   ,LicenseDialog: {
                                        type: 'widget-dialog'
                                       ,options: {
                                            title: 'LICENSE TERMS [MIT]'
                                           ,defaultwidth: '580px'
                                           ,defaultheight: '550'
                                           ,buttons: {
                                                Ok: {
                                                    action: 'accept'
                                                   ,close: true
                                                }
                                            }
                                        }
                                       ,children: {
                                            LicenseForm: {
                                                type: 'widget-form'
                                               ,options: {
                                                ////    defaultTarget: 'LICENSE-MIT'
                                                    title: ''
                                                   ,help: {
                                                        _inlinepre: '%{preinlinehelp}'
                                                       ,_inline: '%{inlinehelp}<br><center><img src="cust/images/pdmkanim3o.gif" style="width:409px;height:230px;"></center>'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
//                   ,Third: {
//                        type: 'view-tree'
//                    }
                }
            }
        }
    }
});
//} catch (e) {
//    alert ('ERROR detected in playbook: ' + e.message);
//}


