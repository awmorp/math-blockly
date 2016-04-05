/**** Code for custom variable dropdowns ****/
'use strict';

/* Set up inheritance */
goog.provide('Blockly.FieldMathVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');

Blockly.FieldMathVariable = function(varname, opt_type, opt_validator, opt_strict) {
  Blockly.FieldMathVariable.superClass_.constructor.call(this,
      varname, opt_validator, opt_type);
  this.menuGenerator_ = Blockly.FieldMathVariable.dropdownCreate;
  this.enforceScope_ = !!opt_strict;
};
goog.inherits(Blockly.FieldMathVariable, Blockly.FieldVariable);

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.FieldMathVariable.dropdownCreate = function() {
  var variables = [];
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    if( this.enforceScope_ ) {
      /* Recursively collect variables from parents */
      var parent = this.sourceBlock_;
      while( parent = parent.parentBlock_ ) {
        if( parent.getVars &&
            !(parent.isQuantifier && 
              parent.getInput( "SCOPE" ) && parent.getInput( "SCOPE" ).connection.targetBlock() && 
              parent.getInput( "SCOPE" ).connection.targetBlock().isParentOf( this.sourceBlock_ )) )
        {
          // Variable defined by a quantifier is not available to blocks in the 'SCOPE' input
          // ie, you can't have "Forall x > x" or "Exists x in { y: y != x}"
          variables = variables.concat( parent.getVars() );  
        }
      }
    } else {
      var blocks = this.sourceBlock_.workspace.getAllBlocks();
      for (var x = 0; x < blocks.length; x++) {
        if (blocks[x].getVars) {
          variables = variables.concat( blocks[x].getVars() );
        }
      }
    }
    // Add predefined global variables
    var workspace = this.sourceBlock_.workspace;
    if( workspace.globalVariables ) {
      variables = variables.concat( workspace.globalVariables );
    }
  } else {
    variables = [];
  }
  
  var variableList = [];
  for (var y = 0; y < variables.length; y++) {
    var v = variables[y];
    if( goog.isString(v) ) {
      /* Variable is untyped */
      if( !this.type_ ) {
        var varName = v;
        // Variable name may be null if the block is only half-built.
        if (varName && variableList.indexOf(varName) == -1) {
          variableList.push( varName );
        }
      }
    } else if( goog.isArray(v) ) {
      /* Variable is typed - v is an array [name, type] */
      var varName = v[0];
      var varType = v[1];
      // Variable name may be null if the block is only half-built.
      if (varName && (!this.type_ || (this.type_ == varType)) && variableList.indexOf(varName) == -1) {
        variableList.push( varName );
      }
    }
  }

  if( !this.enforceScope_ ) {
    // Ensure that the currently selected variable is an option.
    var name = this.getText();
    if (name && variableList.indexOf(name) == -1) {
      variableList.push(name);
    }
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  if( !this.enforceScope_ ) {
//    variableList.push(Blockly.Msg.RENAME_VARIABLE);
    variableList.push(Blockly.Msg.NEW_VARIABLE);
  }
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var x = 0; x < variableList.length; x++) {
    options[x] = [variableList[x], variableList[x]];
  }
  return options;
};

/* We want to use our own 'new variable' dialog but the normal FieldVariable dropdownChange is a static member function so we have to hook it in the hard way. */
Blockly.FieldMathVariable.prototype.setValidator = function(handler) {
  var wrappedHandler;
  if (handler) {
    // Wrap the user's change handler together with the variable rename handler.
    wrappedHandler = function(value) {
      var v1 = handler.call(this, value);
      if (v1 === null) {
        var v2 = v1;
      } else {
        if (v1 === undefined) {
          v1 = value;
        }
        var v2 = Blockly.FieldMathVariable.dropdownChange.call(this, v1);
        if (v2 === undefined) {
          v2 = v1;
        }
      }
      return v2 === value ? undefined : v2;
    };
  } else {
    wrappedHandler = Blockly.FieldMathVariable.dropdownChange;
  }
  Blockly.FieldVariable.superClass_.setValidator.call(this, wrappedHandler);  // Skipping FieldMathVariable setValidator as it will use default dropdownChange instead
};

Blockly.FieldMathVariable.promptCallback_ = function(text) {
  if( text ) Blockly.FieldMathVariable.promptOwner_.setValue( text );
};
Blockly.FieldMathVariable.promptValidator_ = function(text) {
  return( text.length == 1 && text.search(/^[a-zA-Z]$/) == 0 ); // Regexp: string consists of a single alphabetic character. TODO: support Greek letters.
};
Blockly.FieldMathVariable.promptOwner_ = null;
Blockly.FieldMathVariable.prompt_ = new goog.ui.Prompt(Blockly.Msg.NEW_VARIABLE_TITLE, "", Blockly.FieldMathVariable.promptCallback_);
Blockly.FieldMathVariable.prompt_.setValidationFunction( Blockly.FieldMathVariable.promptValidator_ );

Blockly.FieldMathVariable.dropdownChange = function(text) {
  if( text == Blockly.Msg.NEW_VARIABLE ) {
    Blockly.FieldMathVariable.promptOwner_ = this;
    var t = this;
    Blockly.hideChaff();
    Blockly.FieldMathVariable.prompt_.setDefaultValue( this.getValue() );
    Blockly.FieldMathVariable.prompt_.setVisible(true);
    Blockly.FieldMathVariable.prompt_.getInputElement().setAttribute( "maxlength", 1 );
    return( null );
  } else {
    return( Blockly.FieldVariable.dropdownChange.call(this, text) );
  }
}