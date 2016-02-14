
/* Abstract addition block - accepts both Number and Vector */
Blockly.Blocks['arithmetic_addition_abstract'] = {
  init: function() {
    var A = Blockly.TypeVar.getUnusedTypeVar();
    this.appendValueInput("LEFTINPUT")
        .setCheck(["Number", "Vector"])
        .setTypeExpr(A);
    this.appendValueInput("RIGHTINPUT")
        .setCheck(["Number", "Vector"])
        .setTypeExpr(A)
        .appendField("+");
    this.setInputsInline(true);
    this.setOutput(true, ["Number", "Vector"]);
    this.setOutputTypeExpr(A);
    this.setColour(Blockly.BlockSvg.ABSTRACT_COLOUR);
    this.setTooltip('Addition operation');
    this.setHelpUrl();
  }
};

Blockly.Blocks['vector_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{v}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('The zero vector');
    this.setHelpUrl();
  }
};

Blockly.Blocks['vector_AB'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\overrightarrow{AB}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('The zero vector');
    this.setHelpUrl();
  }
};


