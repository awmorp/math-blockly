/*** Blockly block definitions for mathematical expression construction ***/
/* By Anthony Morphett, awmorp@gmail.com */

/*
 Blocks for English -> Mathematics translation activity
 
 Assumes that math-blocks.js is loaded.
*/


var varlist1 = [[" ", "BLANK"],["a", "a"]];
var varlist2 = [[" ", "BLANK"],["b", "b"],["c","c"]];
var valuelist = [[" ", "BLANK"],["a", "a"], ["b", "b"],["c","c"]];;
var setlist = [[" ", "BLANK"], ["ℝ", "REAL"], ["ℚ", "RATIONAL"], ["ℤ", "INTEGERS"], ["ℕ", "NATURALS"]];
var quantifierlist = [[" ", "BLANK"],["∀", "FORALL"],["∃","EXISTS"]];

/****** Quantifiers ******/
Blockly.Blocks['logic_quantifier_set_restricted_1'] = {
  init: function() {
    this.appendValueInput("PREDICATE")
        .appendField(new Blockly.FieldDropdown(quantifierlist), "QUANTIFIER")
        .appendField(new Blockly.FieldDropdown(varlist1), "VAR")
        .appendField("∈ ℤ")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Quantifier');
  }
};

Blockly.Blocks['logic_quantifier_set_restricted_2'] = {
  init: function() {
    this.appendValueInput("PREDICATE")
        .appendField(new Blockly.FieldDropdown(quantifierlist), "QUANTIFIER")
        .appendField(new Blockly.FieldDropdown(varlist2), "VAR")
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

Blockly.Blocks['number_multiplication'] = {
 init: function() {
    this.appendValueInput( "A" )
        .setCheck("Number");
    this.appendValueInput( "B" )
        .setCheck("Number")
        .appendField("×");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
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

