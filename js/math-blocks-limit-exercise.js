/*** Blockly block definitions for mathematical expression construction ***/
/* By Anthony Morphett, awmorp@gmail.com */

/*
 Blocks for online activity 1
 
 Assumes that math-blocks.js is loaded.
*/


var varlist = [[" ", "BLANK"],["ϵ", "EPSILON"], ["δ", "DELTA"], ["L","L"], ["M", "M"], ["n", "n"], ["x", "x"]];
var valuelist = [[" ", "BLANK"],["0","0"],["ϵ", "EPSILON"], ["δ", "DELTA"], ["L","L"], ["M", "M"], ["n", "n"], ["x", "x"]];
var setlist = [[" ", "BLANK"], ["ℝ", "REAL"], ["ℚ", "RATIONAL"], ["ℤ", "INTEGERS"], ["ℕ", "NATURALS"]];
var quantifierlist = [[" ", "BLANK"],["∀", "FORALL"],["∃","EXISTS"]];

/****** Quantifiers ******/
Blockly.Blocks['logic_quantifier_set_restricted'] = {
  init: function() {
    this.appendValueInput("PREDICATE")
        .appendField(new Blockly.FieldDropdown(quantifierlist), "QUANTIFIER")
        .appendField(new Blockly.FieldDropdown(varlist), "VAR")
        .appendField("∈")
        .appendField(new Blockly.FieldDropdown(setlist), "SET")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Quantifier');
  }
};

Blockly.Blocks['logic_quantifier_condition_restricted'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(quantifierlist), "QUANTIFIER")
        .appendField(new Blockly.FieldDropdown(varlist), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "v"], ["≠", "≠"]]), "COMPARISON_OPERATOR")
        .appendField(new Blockly.FieldDropdown(valuelist), "BOUND");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Quantifier with condition');
  }
};

Blockly.Blocks['function_fn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("f(n)");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
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

