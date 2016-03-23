/**** Code for custom variable dropdowns ****/
/* Set up inheritance */
goog.provide('Blockly.FieldMathVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');

Blockly.FieldMathVariable = function(varname, opt_changeHandler, opt_type, opt_strict) {
  Blockly.FieldMathVariable.superClass_.constructor.call(this,
      varname, opt_changeHandler, opt_type);
  this.menuGenerator_ = Blockly.FieldMathVariable.dropdownCreate;
  this.enforceScope_ = !!opt_strict;
};
goog.inherits(Blockly.FieldMathVariable, Blockly.FieldVariable);

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldMathVariable.dropdownCreate = function() {
  var variableList = [];
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    /* Recursively collect variables from parents */
    var variableHash = Object.create(null);
    var parent = this.sourceBlock_;
    while( parent = parent.parentBlock_ ) {
      if( parent.getVars &&
          !(parent.isQuantifier && 
            parent.getInput( "SCOPE" ) && parent.getInput( "SCOPE" ).connection.targetBlock() && 
            parent.getInput( "SCOPE" ).connection.targetBlock().isParentOf( this.sourceBlock_ )) )
        {
          // Variable defined by a quantifier is not available to blocks in the 'SCOPE' input
          // ie, you can't have "Forall x > x" or "Exists x in { y: y != x}"
        var blockVariables = parent.getVars();
        for (var y = 0; y < blockVariables.length; y++) {
          if( blockVariables[y] instanceof String ) {
            /* Variable is untyped */
            if( !this.type_ ) {
              var varName = blockVariables[y];
              // Variable name may be null if the block is only half-built.
              if (varName) {
                variableHash[varName.toLowerCase()] = varName;
              }            
            }
          } else if( blockVariables[y] instanceof Array ) {
            /* Variable is typed - blockVariables[y] is an array [name, type] */
            var varName = blockVariables[y][0];
            var varType = blockVariables[y][1];
            // Variable name may be null if the block is only half-built.
            if (varName && (!this.type_ || (this.type_ == varType))) {
              variableHash[varName.toLowerCase()] = varName;
            }
          }
        }
      }
    }
    // Add predefined global variables
    var workspace = this.sourceBlock_.workspace;
    if( workspace.globalVariables ) {
      for (var y = 0; y < workspace.globalVariables.length; y++) {
        if( workspace.globalVariables[y] instanceof String ) {
          /* Variable is untyped */
          if( !this.type_ ) {
            var varName = workspace.globalVariables[y];
            if (varName ) {
              variableHash[varName.toLowerCase()] = varName;
            }            
          }
        } else if( workspace.globalVariables[y] instanceof Array ) {
          /* Variable is typed - workspace.globalVariables[y] is an array [name, type] */
          var varName = workspace.globalVariables[y][0];
          var varType = workspace.globalVariables[y][1];
          // Variable name may be null if the block is only half-built.
          if (varName && (!this.type_ || (this.type_ == varType))) {
            variableHash[varName.toLowerCase()] = varName;
          }
        }
      }
    }
    for (var name in variableHash) {
      variableList.push(variableHash[name]);
    }
  } else {
    variableList = [];
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

