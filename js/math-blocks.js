/*** Blockly block definitions for mathematical expression construction ***/
/* By Anthony Morphett, awmorp@gmail.com */

/* Generated using the Blockly block factory and hand-modified as necessary */

/* Todo:
Logic:
* Brackets

Function:
* exponentiation a^b
* function variable f(x)
* derivative?

Riemann integration:
* L(f, P), etc
* integral?

*/


/* Define some colours */
var booleanHue = Blockly.BlockSvg.BOOLEAN_COLOUR;
var booleanQuantifierHue = 90;
var numberHue = Blockly.BlockSvg.NUMBER_COLOUR;
var setHue = Blockly.BlockSvg.NUMBER_COLOUR;


/****** Quantifiers ******/
Blockly.Blocks['logic_quantifier'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["∀", "∀"], ["∃", "∃"]],
            function(quantifier) { this.sourceBlock_.quantifierChanged_(quantifier) }), "QUANTIFIER")
        .appendField(new Blockly.FieldMathVariable("x", "Number", null, true), "VAR")
        .appendField(new Blockly.FieldDropdown([["∈","∈"],[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "≤"], ["≠", "≠"]],
            function(op) { this.sourceBlock_.operatorChanged_(op) }), "OPERATOR");
    this.appendValueInput("SCOPE")
        .setCheck("Set")
        .parentVarsInScope_ = false;
    this.appendDummyInput("STLABEL")
        .appendField("s.t.", "ST");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Quantifier');
    this.setHelpUrl();
    this.quantifierChanged_( this.getFieldValue( "QUANTIFIER" ) );
    this.operatorChanged_( this.getFieldValue( "OPERATOR" ) );
    this.isQuantifier = true;
  },
  getVars: function() {
    return [[this.getFieldValue('VAR'),"Number"]];
  },
  quantifierChanged_: function(quantifier) {
//    console.log( "quantifierChanged" );
    if( quantifier == "∃" ) {
      this.getInput("STLABEL").setVisible( true );
    } else {
      this.getInput("STLABEL").setVisible( false );
    }
  },
  operatorChanged_: function(op) {
    if( op == "∈" ) {
      this.getInput("SCOPE").setCheck("Set");
    } else {
      this.getInput("SCOPE").setCheck("Number");
    }
  },
  onchange: function() {
//    console.log("onchange");
    var child = this.getInputTargetBlock( "PREDICATE" );
    if( child && child.isQuantifier ) {
      this.getInput("STLABEL").setVisible( false );
    } else {
      this.quantifierChanged_(this.getFieldValue("QUANTIFIER"));
    }
    this.render();
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var op = this.getField( "OPERATOR" ).getValue();
    var type = (op == "∈" ? "Set" : "Number");
    container.setAttribute('scopetype', type );
    return( container );
  },
  domToMutation: function(node) {
    var type = node.getAttribute( 'scopetype' )
    var input = this.getInput( "SCOPE" );
    input.setCheck( type );
  }
};

Blockly.Blocks['logic_forall'] = {
  init: function() {
    this.appendValueInput("SCOPE")
        .setCheck("Set")
        .appendField("∀")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField("∈")
        .parentVarsInScope_ = false;
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Universal (\'for all\') quantifier');
    this.setHelpUrl();
    this.isQuantifier = true;
  },
  getVars: function() {
    return [[this.getFieldValue('VAR'),"Number"]];
  }
};

Blockly.Blocks['logic_forall_condition'] = {
  init: function() {
    this.appendValueInput("SCOPE")
        .setCheck("Number")
        .appendField("∀")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "≤"], ["≠", "≠"]]), "COMPARISON_OPERATOR")
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
        .appendField("∃")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField("∈")
        .parentVarsInScope_ = false;
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean")
        .appendField(" s.t.");
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
        .appendField("∃")
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "v"], ["≠", "≠"]]), "COMPARISON_OPERATOR")
        .parentVarsInScope_ = false;
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean")
        .appendField(" s.t.");
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

/****** Logical connectives ******/
/* And, or, conditional, biconditional */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xp8ky3 */
Blockly.Blocks['logic_connective'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["∧", "∧"], ["∨", "∨"], ["⇒", "⇒"], ["⇔", "⇔"]]), "CONNECTIVE");
    this.appendValueInput("RIGHTINPUT")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Logical connectives: conjunction (\'and\'), disjunction (\'or\'), conditional (\'implies\'), biconditional (\'iff\')');
    this.setHelpUrl();
  }
};

/* Negation */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8c7oik */
Blockly.Blocks['logic_negation'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Boolean")
        .appendField("∼");
    this.setInputsInline(false);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Negation of a proposition (\'not\')');
    this.setHelpUrl();
  }
};

/****** Propositional variable ******/
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#at3zwa */
Blockly.Blocks['logic_prop_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldMathVariable("P", "Boolean"), "VARNAME");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('A propositional variable');
    this.setHelpUrl();
  },
  getVars: function() {
    return [[this.getFieldValue('VARNAME'),"Boolean"]];
  }
};


/****** Set operations ******/

/* Number sets: R, Z, Q, N */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#dpx4mh */
Blockly.Blocks['set_r'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℝ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The set of all real numbers');
    this.setHelpUrl();
  }
};

Blockly.Blocks['set_c'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℂ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The set of all complex numbers');
    this.setHelpUrl();
  }
};


Blockly.Blocks['set_q'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℚ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The set of all rational numbers');
    this.setHelpUrl();
  }
};

Blockly.Blocks['set_z'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℤ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The set of all integers');
    this.setHelpUrl();
  }
};

Blockly.Blocks['set_n'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℕ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The set of all natural numbers');
    this.setHelpUrl();
  }
};

Blockly.Blocks['set_nullset'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("∅");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('The empty set');
    this.setHelpUrl();
  }
};



/* Set variable */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#65tt5x */
Blockly.Blocks['set_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldMathVariable("A", "Set"), "VARNAME");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('A variable representing a set');
    this.setHelpUrl();
  },
  getVars: function() {
    return [[this.getFieldValue('VARNAME'),"Set"]];
  }
};

/* Element-of */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mtw79z */
Blockly.Blocks['set_membership'] = {
  init: function() {
    this.appendValueInput("ELEMENT")
        .setCheck("Number");
    this.appendValueInput("SET")
        .setCheck("Set")
        .appendField("∈");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Set membership (\'element of\')');
    this.setHelpUrl();
  }
};

/* Set operations */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#r6h6cn */
Blockly.Blocks['set_operations'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck("Set");
    this.appendValueInput("RIGHTINPUT")
        .setCheck("Set")
        .appendField(new Blockly.FieldDropdown([["∪", "∪"], ["∩", "∩"], ["\\", "\\"]]), "OPERATION");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('Set operations: union, intersection, set difference');
    this.setHelpUrl();
  }
};

/* Set complement */
/* TODO: superscript c symbol? */
/* 
https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vnfeaw */
Blockly.Blocks['set_complement'] = {
  init: function() {
    this.appendValueInput("SET")
        .setCheck("Set");
    this.appendDummyInput()
        .appendField("′");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColourByType();
    this.setTooltip('Set complement');
    this.setHelpUrl();
  }
};

/* Set comparison: subset, equality etc */
Blockly.Blocks['set_comparison'] = {
  init: function() {
    this.appendValueInput("LEFTINPUT")
        .setCheck("Set");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⊂", "SUBSET"], ["⊆", "SUBSETEQ"], ["=", "="], ["≠", "≠"]]), "OPERATOR");
    this.appendValueInput("RIGHTINPUT")
        .setCheck("Set");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColourByType();
    this.setTooltip('Set comparison operators');
    this.setHelpUrl();
  }
};

Blockly.Blocks['set_bounds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["sup", "SUPREMUM"], ["inf", "INFIMUM"], ["max", "MAXIMUM"], ["min", "MINIMUM"]]), "OPERATOR");
    this.appendValueInput("SET")
        .setCheck("Set");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Set bound operators');
    this.setHelpUrl();
  }
};

/****** Number operations ******/
Blockly.Blocks['number_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldMathVariable("x", "Number"), "VARNAME");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('A variable representing a number');
    this.setHelpUrl();
  },
  getVars: function() {
    return [[this.getFieldValue('VARNAME'), "Number"]];
  }
};

/* Constants */
Blockly.Blocks['number_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("0");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('0 - The additive identity');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("1");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('1 - The multiplicative identity');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_pi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("π");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('The number π (pi)');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_e'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("e");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('The number e (base of natural log)');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_add_inv'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("-");
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Additive inverse');
    this.setHelpUrl();
  }
};


Blockly.Blocks['number_mult_inv'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("⁻¹");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Multiplicative inverse');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_squared'] = {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("²");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Square of a number');
    this.setHelpUrl();
  }
};

/* Number comparison. Adapted from blockly/blocks/logic.js */
Blockly.Blocks['number_comparison'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setOutput(true, 'Boolean');
    this.setColourByType();
    this.appendValueInput('LEFTINPUT')
        .setCheck("Number");
    this.appendValueInput('RIGHTINPUT')
        .setCheck( "Number" )
        .appendField(new Blockly.FieldDropdown([["=", "="], ["≠", "≠"], ["<", "<"], ["≤", "≤"], [">", ">"], ["≥", "≥"]]), "COMPARISON_OPERATOR");
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip("Equality or inequality of two numbers");
  }
};

Blockly.Blocks['number_comparison_3'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setOutput(true, 'Boolean');
    this.setColourByType();
    this.appendValueInput('LEFTINPUT')
        .setCheck("Number");
    this.appendValueInput('MIDDLEINPUT')
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([["<", "<"], ["≤", "≤"]]), "COMPARISON_OPERATOR0");
    this.appendValueInput('RIGHTINPUT')
        .setCheck( "Number" )
        .appendField(new Blockly.FieldDropdown([["<", "<"], ["≤", "≤"]]), "COMPARISON_OPERATOR1");
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip("Inequality of three numbers");
  }
};


Blockly.Blocks['number_abs'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("|");
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("|");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Absolute value function');
    this.setHelpUrl();
  }
};

Blockly.Blocks['number_log_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("log");
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Natural log');
    this.setHelpUrl();
  }
};

/* Single variable functions */
Blockly.Blocks['number_trig_functions'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["arcsin", "arcsin"], ["arccos", "arccos"], ["arctan", "arctan"]]), "FUNCTION");
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('Trigonometric functions');
    this.setHelpUrl();
  }
};

Blockly.Blocks['function_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldMathVariable("f", "Function"), "FUNCNAME")
        .appendField("(");
    this.appendValueInput("INPUT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColourByType();
    this.setTooltip('An unspecified function');
    this.setHelpUrl();
  }
};

