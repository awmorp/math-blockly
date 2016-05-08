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
      (opt_validator != null ? opt_validator : Blockly.FieldMathVariable.validator_) );
  this.enforceScope_ = !!opt_strict;
  this.useFlydown_ = !!opt_flydown;
  this.type_ = opt_type;
};
goog.inherits(Blockly.FieldMathVariable, Blockly.FieldFlydown);

/* CSS class for text input box */
Blockly.FieldMathVariable.prototype.fieldCSSClassName = 'blocklyEditableText';  /* TODO: different class for different types, etc? */

/* CSS class for the flydown */
Blockly.FieldMathVariable.prototype.flyoutCSSClassName = 'blocklyFieldMathVariableFlydown';

// Called when field is installed on a block.
Blockly.FieldMathVariable.prototype.init = function(block) {
  if( this.useFlydown_ ) {
    Blockly.FieldMathVariable.superClass_.init.call( this, block );
  } else {
    /* Skip FieldFlydown init and go straight to FieldTextInput init */
    Blockly.FieldFlydown.superClass_.init.call( this, block );
  }
};

Blockly.FieldMathVariable.validator_ = function(text) {
  return( (text.length == 1 && text.search(/^[a-zA-Z]$/) == 0) ? text : null ); // Regexp: string consists of a single alphabetic character.
  /* TODO: support Greek letters. Prevent variable collisions? */
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
