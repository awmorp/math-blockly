/*** Blockly block definitions for mathematical expression construction ***/
/* By Anthony Morphett, awmorp@gmail.com */

/*
 Blocks for English -> Mathematics translation activity
 
 Assumes that math-blocks.js is loaded.
*/


var varlist = [[" ", "BLANK"],["a", "a"], ["b", "b"],["c","c"]];
var valuelist = varlist;
var setlist = [[" ", "BLANK"], ["ℝ", "REAL"], ["ℚ", "RATIONAL"], ["ℤ", "INTEGERS"], ["ℕ", "NATURALS"]];
var quantifierlist = [[" ", "BLANK"],["∀", "FORALL"],["∃","EXISTS"]];

/****** Quantifiers ******/
Blockly.Blocks['logic_quantifier_set_restricted'] = {
  init: function() {
    this.appendValueInput("PREDICATE")
        .appendField(new Blockly.FieldDropdown(quantifierlist), "QUANTIFIER")
        .appendField(new Blockly.FieldDropdown(varlist), "VAR")
        .appendField("∈ ℤ")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Quantifier');
  }
};

Blockly.Blocks['predicate_multiple_of_3'] = {
 init: function() {
    this.appendValueInput( "NUM" )
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("is a multiple of 3");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('');
  }
};

Blockly.Blocks['predicate_multiple_of_6'] = {
 init: function() {
    this.appendValueInput( "NUM" )
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("is a multiple of 6");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('');
  }
};

Blockly.Blocks['number_variable_restricted'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(valuelist), "VAR");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('');
  }
};

Blockly.Blocks['set_dropdown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(setlist), "SET");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('');
  }
};

