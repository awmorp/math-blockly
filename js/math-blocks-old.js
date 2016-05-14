/* Variant math blocks not currently used. Removed from main math-blocks.js to reduce code size. */

Blockly.Blocks['logic_forall_condition'] = {
  init: function() {
    this.appendValueInput("SCOPE")
        .setCheck("Number")
        .appendField("?")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["=", "="], ["<", "<"], ["=", "="], ["?", "?"]]), "COMPARISON_OPERATOR")
        .parentVarsInScope_ = false;
        /* Note: using the mathematical symbol as the blockly 'language neutral' identifier (as maths is a universal language :) */
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Universal (\'for all\') quantifier with condition');
    this.setHelpUrl();
    this.isQuantifier = true;
  },
  getVars: function() {
    return [[this.getFieldValue('VAR'),"Number"]];
  }
};


/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hkxkys */
Blockly.Blocks['logic_exists'] = {
  init: function() {
    this.appendValueInput("SCOPE")
        .setCheck("Set")
        .appendField("?")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField("?")
        .parentVarsInScope_ = false;
    this.appendValueInput("PREDICATE")
//        .appendField(" s.t.")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Existential (\'exists\') quantifier');
    this.setHelpUrl();
    this.isQuantifier = true;
  },
  getVars: function() {
    return [[this.getFieldValue('VAR'),"Number"]];
  }
};

/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#yt9arv */
Blockly.Blocks['logic_exists_condition'] = {
  init: function() {
    this.appendValueInput("SCOPE")
        .setCheck("Number")
        .appendField("?")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["=", "="], ["<", "<"], ["=", "v"], ["?", "?"]]), "COMPARISON_OPERATOR")
        .parentVarsInScope_ = false;
    this.appendValueInput("PREDICATE")
//        .appendField(" s.t.")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('');
    this.setHelpUrl();
    this.isQuantifier = true;
  },
  getVars: function() {
    return [[this.getFieldValue('VAR'),"Number"]];
  },
};
