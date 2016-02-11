var abstractHue = "#888888";
var vectorHue = 300;

/* Abstract addition block - accepts both Number and Vector */
Blockly.Blocks['arithmetic_addition_abstract'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck(["Number", "Vector"]);
    this.appendValueInput("RIGHTINPUT")
        .setCheck(["Number", "Vector"])
        .appendField("+");
    this.setInputsInline(true);
    this.setOutput(true, ["Number", "Vector"]);
    this.setColour(abstractHue);
    this.setTooltip('Addition operation');
    this.setHelpUrl();
    
    this.updateTypes_ = function() {
      
    }
  }
};

Blockly.Blocks['vector_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{v}") );
//        .appendField( new Blockly.FieldMathJax( "\\overrightarrow{v}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(vectorHue);
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
    this.setColour(vectorHue);
    this.setTooltip('The zero vector');
    this.setHelpUrl();
  }
};


