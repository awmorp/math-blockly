
/* Abstract addition block - accepts both Number and Vector */
Blockly.Blocks['abstract_addition'] = {
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

/* Abstract equality - accepts Number, Vector, Set */
Blockly.Blocks['abstract_equality'] = {
  init: function() {
    var A = Blockly.TypeVar.getUnusedTypeVar();
    this.appendValueInput("LEFTINPUT")
        .setCheck(["Number", "Vector", "Set"])
        .setTypeExpr(A);
    this.appendValueInput("RIGHTINPUT")
        .setCheck(["Number", "Vector", "Set"])
        .setTypeExpr(A)
        .appendField("=");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Equality predicate');
    this.setHelpUrl();
  }
};

/* Abstract modulus - accepts Number or Vector */
Blockly.Blocks['abstract_modulus'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck(["Number", "Vector"])
        .appendField( "|" );
    this.appendDummyInput()
        .appendField( "|" );
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Modulus function');
    this.setHelpUrl();
  }
};

/* Vector constructor */
Blockly.Blocks['vector_constructor'] = {
  init: function() {
    this.appendValueInput("INPUT1")
        .setCheck("Number")
    this.appendValueInput("INPUT2")
        .setCheck("Number")
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{i} + ", "i + ", true ) );
    this.appendValueInput("INPUT3")
        .setCheck("Number")
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{j} + ", "j + ", true ) );
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{k}", "k", true ) );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('Vector in R³');
    this.setHelpUrl();
  }
};

/* Scalar (dot) and vector (cross) product of two vectors */
Blockly.Blocks['vector_products'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck("Vector");
    this.appendValueInput("RIGHTINPUT")
        .setCheck("Vector")
        .appendField(new Blockly.FieldDropdown([["·", "DOT"], ["×", "CROSS"]],
            function(op) { this.sourceBlock_.opChanged_(op) }), "OPERATOR");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('Scalar or vector product');
    this.setHelpUrl();
    /* TODO: Mutator to save output type */
  },
  mutationToDom: function(workspace) {
    var node = document.createElement("mutation");
    node.setAttribute("op", this.getFieldValue("OPERATOR"));
    return( node );
  },
  domToMutation: function(node) {
    var value = node.getAttribute("op");
    if( value ) this.setFieldValue(node.getAttribute("op"),"OPERATOR");
  },
  opChanged_: function(op) {
    var newType;
    if( op == "CROSS" ) {
      newType = "Vector";
    } else {
      newType = "Number";
    }
    Blockly.Events.disable();
    // Must disconnect block before changing its output type.
    var otherConnection = this.outputConnection.targetConnection;
    if( otherConnection ) {
      this.outputConnection.disconnect();
    }
    this.setOutput( true, newType );
    this.setColourByType();
    if( otherConnection ) {
      otherConnection.connect( this.outputConnection );
    }
    Blockly.Events.enable();
  }
};

/* Scalar multiplication of two scalars or scalar and vector */
Blockly.Blocks['abstract_scalarmultiplication'] = {
  init: function() {
    var A = Blockly.TypeVar.getUnusedTypeVar();
    this.appendValueInput("LEFTINPUT")
        .setCheck("Number")
    this.appendValueInput("RIGHTINPUT")
        .setCheck(["Number", "Vector"])
        .setTypeExpr(A)
        .appendField( "·" );
    this.setInputsInline(true);
    this.setOutput(true, ["Number", "Vector"]);
    this.setOutputTypeExpr(A);
    this.setColour(Blockly.BlockSvg.ABSTRACT_COLOUR);
    this.setTooltip('Scalar multiplication');
    this.setHelpUrl();
  }
};


/* Zero vector */
Blockly.Blocks['vector_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{0}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('The zero vector');
    this.setHelpUrl();
  }
};

/* Example of vector variable */
Blockly.Blocks['vector_v'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\underset{\\sim}{v}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('A vector');
    this.setHelpUrl();
  }
};

/* Example of displacement vector */
Blockly.Blocks['vector_AB'] = {
  init: function() {
    this.appendDummyInput()
        .appendField( new Blockly.FieldMathJax( "\\overrightarrow{AB}") );
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColourByType();
    this.setTooltip('Vector from point A to point B');
    this.setHelpUrl();
  }
};


