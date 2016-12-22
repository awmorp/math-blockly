/* Propositional variables with negation */
Blockly.Blocks['logic_p_notp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldDropdown([["P", "P"], ["~P", "NOTP"]]), "VAR");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Propositional variable P');
    this.setHelpUrl();
  }
};

Blockly.Blocks['logic_q_notq'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldDropdown([["Q", "Q"], ["~Q", "NOTQ"]]), "VAR");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Propositional variable Q');
    this.setHelpUrl();
  }
};

Blockly.Blocks['logic_r_notr'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldDropdown([["R", "R"], ["~R", "NOTR"]]), "VAR");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Propositional variable R');
    this.setHelpUrl();
  }
};

/* Implication */
Blockly.Blocks['logic_implies'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck("Boolean");
    this.appendValueInput("RIGHTINPUT")
        .setCheck("Boolean")
        .appendField( "⇒" );
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Logical implication');
    this.setHelpUrl();
  }
};

/* Square of number */
Blockly.Blocks['number_square'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField( "²" );
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Square');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_cube'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField( "³" );
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Cube');
    this.setHelpUrl();
  }
};

Blockly.Blocks['function_fn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( "f(" )
        .appendField(new Blockly.FieldMathVariable("n", "Number"), "VARNAME")
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('f(n)');
    this.setHelpUrl();
  }
};

Blockly.Blocks['function_fn+1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( "f(" )
        .appendField(new Blockly.FieldMathVariable("n", "Number"), "VARNAME")
        .appendField("+1)");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('f(n+1)');
    this.setHelpUrl();
  }
};

Blockly.Blocks['quantifier_abstract'] = {
  init: function() {
    var varField = new Blockly.FieldMathVariable("x", "Abstract", null, true);
    /* Override CSS so that this field is displayed in number colour rather than boolean colour */
    varField.addCSSClass( "blocklyQuantifierVarField" );
    this.appendDummyInput("VARINPUT")
        .appendField(new Blockly.FieldDropdown([["∀", "∀"], ["∃", "∃"]],
            function(quantifier) { this.sourceBlock_.quantifierChanged_(quantifier) }), "QUANTIFIER")
        .appendField(varField, "VAR")
        .appendField("  ");
//    this.appendDummyInput("STLABEL")
//        .appendField("s.t.", "ST");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Quantifier');
    this.setHelpUrl();
    this.isQuantifier = true;
  },
  getVars: function() {
    var varlist = [[this.getFieldValue( 'VAR' ), "Abstract"]];
    return varlist;
  }
};

Blockly.Blocks['abstract_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldMathVariable("x", "Abstract"), "VARNAME");
    this.setInputsInline(true);
    this.setOutput(true, "Abstract");
    this.setColourByType();
    this.setTooltip('A variable representing an unspecified object');
    this.setHelpUrl();
  },
  getVars: function() {
    return [[this.getFieldValue('VARNAME'), "Abstract"]];
  }
};


Blockly.Blocks['predicate_glitters'] = {
  init: function() {
    this.appendValueInput( "VALUE" )
        .setCheck( "Abstract" );
    this.appendDummyInput()
        .appendField( "glitters" );
    this.setInputsInline(true);
    this.setOutput(true,"Boolean");
    this.setColourByType();
    this.setTooltip( "'glitters' predicate" );
  }
};

Blockly.Blocks['predicate_gold'] = {
  init: function() {
    this.appendValueInput( "VALUE" )
        .setCheck( "Abstract" );
    this.appendDummyInput()
        .appendField( "is gold" );
    this.setInputsInline(true);
    this.setOutput(true,"Boolean");
    this.setColourByType();
    this.setTooltip( "'gold' predicate" );
  }
};