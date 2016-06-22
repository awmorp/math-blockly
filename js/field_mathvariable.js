/**** Code for custom variable dropdowns ****/
'use strict';

/* Set up inheritance */
goog.provide('Blockly.FieldMathVariable');

goog.require('Blockly.FieldFlydown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');

/**
 * A text input for a math variable. Notable characteristics:
 *   - variable names are restricted to one alphabetic character
 *   - variables are typed
 *   - hovering over the field will (optionally) produce a flydown with variable block for easy access
 * Based on FieldFlydown from App Inventor.
 * @param {?bool} opt_flydown If true, on mouseover a flyout will appear with a block for this variable, for easy access.
 * @param {?bool} opt_strict If true, field highlights out-of-scope variables which are not quantified or predefined global variables.
 */
Blockly.FieldMathVariable = function(varname, opt_type, opt_validator, opt_flydown, opt_strict) {
  Blockly.FieldMathVariable.superClass_.constructor.call(this, varname,
      true,   /* isEditable */
      Blockly.FieldFlydown.DISPLAY_BELOW,   /* displayLocation */
      (opt_validator != null ? opt_validator : Blockly.FieldMathVariable.validator_),
      1   /* opt_maxlength - maximum allowed input length */
    );
  this.enforceScope_ = !!opt_strict;
  this.useFlydown_ = !!opt_flydown;
  this.type_ = opt_type;
  this.onchange = function() {console.log("onchange", this.getValue()); };
};
goog.inherits(Blockly.FieldMathVariable, Blockly.FieldFlydown);

Blockly.FieldMathVariable.prototype.isVariable_ = true;

/* CSS class for the flydown */
Blockly.FieldMathVariable.prototype.flyoutCSSClassName = 'blocklyFieldMathVariableFlydown';

// Called when field is installed on a block.
Blockly.FieldMathVariable.prototype.init = function() {
  if( this.useFlydown_ ) {
    Blockly.FieldMathVariable.superClass_.init.call( this );
  } else {
    /* Skip FieldFlydown init and go straight to FieldTextInput init */
    Blockly.FieldFlydown.superClass_.init.call( this );
  }
  var workspace = this.sourceBlock_.workspace;
  if( !workspace.isFlyout && !workspace.fieldMathVariableEventHandler_ ) {
    /* Install onchange handler to detect variable conflicts on block addition/removal */
    workspace.fieldMathVariableEventHandler_ = function(event) {
      if( event.type == Blockly.Events.CREATE || event.type == Blockly.Events.DELETE )
      {
        Blockly.FieldMathVariable.checkVars_( workspace );
      }
    }
    workspace.addChangeListener( workspace.fieldMathVariableEventHandler_ );
  }
};


/* Restrict input to one character alphabetic */
Blockly.FieldMathVariable.validator_ = function(text) {
  return( (text.length == 1 && text.search(/^[a-zA-Zα-ωΑ-Ωϵ]$/) == 0) ? text : null ); // Regexp: string consists of a single alphabetic Latin or Greek character.
}

Blockly.FieldMathVariable.prototype.setValue = function(text) {
  var oldvar = this.getValue();
  Blockly.FieldMathVariable.superClass_.setValue.call(this, text);
  if( this.sourceBlock_ && !this.sourceBlock_.isInFlyout ) {
    /* Check for variable collisions */
    Blockly.FieldMathVariable.checkVars_( this.sourceBlock_.workspace );
  }
}

Blockly.FieldMathVariable.checkVars_ = function(workspace) {
//  debugger;
  var varDB = {};
  /* Iterate over all variables from the workspace, and check if their types match */
  var blocks = workspace.getAllBlocks();
  for( var i in blocks ) {
    var b = blocks[i];
    for( var j in b.inputList ) {
      var input = b.inputList[j];
      for( var k in input.fieldRow ) {
        var field = input.fieldRow[k];
        if( field instanceof Blockly.FieldMathVariable ) {
          var vname = field.getValue();
          if( varDB[vname] ) {
            varDB[vname][2].push(field);
            if( varDB[vname][0] != field.type_ ) varDB[vname][1] = true;
          } else {
            varDB[vname] = [field.type_, false, [field]];  /* type, conflicting, list of fields */
          }
        }
      }
    }
  }
//  console.log( "checkVars_", varDB );
  for( var i in varDB ) {
    if( varDB[i][1] ) {
      /* Highlight fields in red */
      varDB[i][2].map( function(f) {f.addCSSClass("blocklyMathVariableError");} );
    } else {
      /* Remove red highlight */
      varDB[i][2].map( function(f) {f.removeCSSClass("blocklyMathVariableError");} );
    }
  }
}

Blockly.FieldMathVariable.prototype.flydownBlocksXML_ = function() {
  /* TODO: Handle other variable types */
  var getterSetterXML =
      '<xml>' +
        '<block type="number_variable">' +
          '<field name="VARNAME">' +
            this.getText() +
          '</field>' +
        '</block>' +
      '</xml>';
  return getterSetterXML;
}
