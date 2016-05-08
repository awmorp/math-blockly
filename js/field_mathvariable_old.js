/**** Code for custom variable dropdowns ****/
/* This version uses a dropdown menu based on Blockly's FieldVariable. */
'use strict';

/* Set up inheritance */
goog.provide('Blockly.FieldMathVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Flydown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');

/**
 * A dropdown menu for a math variable. Differences to standard FieldVariable:
 *   - variable names are restricted to one alphabetic character
 *   - variables are typed
 * @param {?bool} opt_strict If true, dropdown shows only variables which are either quantified, or predefined global variables.
 * @param {?bool} opt_flydown If true, on mouseover a flyout will appear with a block for this variable, for easy access.
 */
Blockly.FieldMathVariable = function(varname, opt_type, opt_validator, opt_flydown, opt_strict) {
  Blockly.FieldMathVariable.superClass_.constructor.call(this,
      varname, opt_validator, opt_type);
  this.menuGenerator_ = Blockly.FieldMathVariable.dropdownCreate;
  this.enforceScope_ = !!opt_strict;
  this.useFlydown_ = !!opt_flydown;
};
goog.inherits(Blockly.FieldMathVariable, Blockly.FieldVariable);

// Called when field is installed on a block.
Blockly.FieldMathVariable.prototype.init = function(block) {
  Blockly.FieldMathVariable.superClass_.init.call( this, block );
  
  if( this.useFlydown_ ) {
    Blockly.Flydown.workspaceInit( block.workspace ); // Set up Flydown for this workspace
    this.mouseOverWrapper_ =
        Blockly.bindEvent_(this.fieldGroup_, 'mouseover', this, this.onMouseOver_);
    this.mouseOutWrapper_ =
        Blockly.bindEvent_(this.fieldGroup_, 'mouseout', this, this.onMouseOut_);
  }
};

/**
 * Milliseconds to wait before showing flydown after mouseover event on flydown field.
 */
Blockly.FieldMathVariable.flydownTimeout = 750;

/**
 * Process ID for timer event to show flydown (scheduled by mouseover event)
 * @type {number}
 */
Blockly.FieldMathVariable.showPid_ = 0;

// Note: To be correct, the next two should be per-workspace. App Inventor code assumes only one (non-flyout) Blockly workspace is present.
/**
 * The flydown which is currently active (if any)
 */
Blockly.FieldMathVariable.activeFlydown_ = null;

/**
 * Which instance of FieldMathVariable (or a subclass) is an open flydown attached to?
 * @type {Blockly.FieldMathVariable (or subclass)}
 * @private
 */
Blockly.FieldMathVariable.flydownOwner_ = null;

Blockly.FieldMathVariable.prototype.onMouseOver_ = function(e) {
  console.log( "FieldMathVariable onmouseover" );
  if( !this.sourceBlock_.isInFlyout ) { // [lyn, 10/22/13] No flydowns in a flyout!
    var field = this;
    var callback = function() {
      Blockly.FieldMathVariable.showPid_ = 0;
      field.showFlydown_();
    };
    if( Blockly.FieldMathVariable.showPid_ ) window.clearTimeout( Blockly.FieldMathVariable.showPid_ );
    Blockly.FieldMathVariable.showPid_ = window.setTimeout( callback, Blockly.FieldMathVariable.flydownTimeout );
    // This event has been handled.  No need to bubble up to the document.
  }
  e.stopPropagation();
};

Blockly.FieldMathVariable.prototype.onMouseOut_ = function(e) {
  console.log( "FieldMathVariable onmouseout" );
  // Clear any pending timer event to show flydown
  window.clearTimeout(Blockly.FieldMathVariable.showPid_);
  Blockly.FieldMathVariable.showPid_ = 0;
  e.stopPropagation();
};

Blockly.FieldMathVariable.prototype.showEditor_ = function() {
  console.log( "FieldMathVariable showEditor_" );
  Blockly.FieldMathVariable.hideFlydown();
  Blockly.FieldMathVariable.superClass_.showEditor_.call( this );
}

/**
 * Creates a Flydown containing a block for the current variable.
 */
Blockly.FieldMathVariable.prototype.showFlydown_ = function() {
  console.log("FieldMathVariable show Flydown");
  if( !this.getValue() || this.getValue() == "" ) return; // No flydown if no variable currently selected
  
  Blockly.hideChaff(); // Hide open context menus, dropDowns, flyouts, and other flydowns
  Blockly.FieldMathVariable.flydownOwner_ = this; // Remember field to which flydown is attached
  var flydown = this.sourceBlock_.workspace.flydown_;
  Blockly.FieldMathVariable.activeFlydown_ = flydown;
  var blocksXMLText = '<xml><block type="number_variable" x="10" y="10"><field name="VARNAME">' + this.getValue() + '</field></block></xml>';
  var blocksDom = Blockly.Xml.textToDom(blocksXMLText);
  var blocksXMLList = goog.dom.getChildren(blocksDom); // List of blocks for flydown
  var xy = Blockly.getSvgXY_(this.borderRect_, this.sourceBlock_.workspace);
  var borderBBox = this.borderRect_.getBBox();
  var x = xy.x;
  var y = xy.y;
  y = y + borderBBox.height;
  flydown.showAt(blocksXMLList, x, y);
};

/**
 * Hide the flydown menu and squash any timer-scheduled flyout creation
 */
Blockly.FieldMathVariable.hideFlydown = function() {
  console.log( "hideFlydown_: ", Blockly.FieldMathVariable.showPid_, Blockly.FieldMathVariable.activeFlydown_ );
  // Clear any pending timer event to show flydown
  if( Blockly.FieldMathVariable.showPid_ != 0 ) window.clearTimeout(Blockly.FieldMathVariable.showPid_);
  // Clear any displayed flydown
  if( Blockly.FieldMathVariable.activeFlydown_ ) Blockly.FieldMathVariable.activeFlydown_.hide();
  if( Blockly.FieldMathVariable.flydownOwner_ ) Blockly.FieldMathVariable.flydownOwner_ = null;
};

/**
 * Close the flydown and dispose of all UI.
 */
Blockly.FieldMathVariable.prototype.dispose = function() {
  if (Blockly.FieldMathVariable.flydownOwner_ == this) {
    Blockly.FieldMathVariable.hideFlydown();
  }
  // Call parent's destructor.
  Blockly.FieldMathVariable.superClass_.dispose.call( this );
};


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