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
booleanHue = 120;
booleanQuantifierHue = 90;
numberHue = Blockly.Blocks.math.HUE;
setHue = 45;


/****** Quantifiers ******/
Blockly.Blocks['logic_forall'] = {
  init: function() {
    this.appendValueInput("SET")
        .setCheck("Set")
        .appendField("∀")
        .appendField(new Blockly.FieldVariable("x"), "VAR")
        .appendField("∈");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Universal (\'for all\') quantifier');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['logic_forall_condition'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField("∀")
        .appendField(new Blockly.FieldVariable("x"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "≤"], ["≠", "≠"]]), "COMPARISON_OPERATOR");
        /* Note: using the mathematical symbol as the blockly 'language neutral' identifier (as maths is a universal language :) */
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Universal (\'for all\') quantifier with condition');
    this.setHelpUrl('http://www.example.com/');
  }
};


/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hkxkys */
Blockly.Blocks['logic_exists'] = {
  init: function() {
    this.appendValueInput("SET")
        .setCheck("Set")
        .appendField("∃")
        .appendField(new Blockly.FieldVariable("x"), "VAR")
        .appendField("∈");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean")
        .appendField(" s.t.");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('Existential (\'exists\') quantifier');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#yt9arv */
Blockly.Blocks['logic_exists_condition'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField("∃")
        .appendField(new Blockly.FieldVariable("x"), "VAR")
        .appendField(new Blockly.FieldDropdown([[">", ">"], ["≥", "≥"], ["<", "<"], ["≤", "v"], ["≠", "≠"]]), "COMPARISON_OPERATOR");
    this.appendValueInput("PREDICATE")
        .setCheck("Boolean")
        .appendField(" s.t.");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanQuantifierHue);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
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
    this.setColour(booleanHue);
    this.setTooltip('Logical connectives: conjunction (\'and\'), disjunction (\'or\'), conditional (\'implies\'), biconditional (\'iff\')');
    this.setHelpUrl('http://www.example.com/');
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
    this.setColour(booleanHue);
    this.setTooltip('Negation of a proposition (\'not\')');
    this.setHelpUrl('http://www.example.com/');
  }
};

/****** Propositional variable ******/
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#at3zwa */
Blockly.Blocks['logic_prop_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("P"), "propvarname");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('A propositional variable');
    this.setHelpUrl('http://www.example.com/');
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
    this.setColour(setHue);
    this.setTooltip('The set of all real numbers');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['set_c'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℂ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('The set of all complex numbers');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['set_q'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℚ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('The set of all rational numbers');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['set_z'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℤ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('The set of all integers');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['set_nullset'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("∅");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('The empty set');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['set_n'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ℕ");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('The set of all natural numbers');
    this.setHelpUrl('http://www.example.com/');
  }
};




/* Set variable */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#65tt5x */
Blockly.Blocks['set_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("A"), "setname");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('A variable representing a set');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Element-of */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mtw79z */
Blockly.Blocks['set_membership'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("Number");
    this.appendValueInput("set")
        .setCheck("Set")
        .appendField("∈");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Set membership (\'element of\')');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Set operations */
/* https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#r6h6cn */
Blockly.Blocks['set_operations'] = {
  init: function() {
    this.appendValueInput("leftinput")
        .setCheck("Set");
    this.appendValueInput("rightinput")
        .setCheck("Set")
        .appendField(new Blockly.FieldDropdown([["∪", "union"], ["∩", "intersection"], ["\\", "difference"]]), "setoperation");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('Set operations: union, intersection, set difference');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Set complement */
/* TODO: superscript c symbol? */
/* 
https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vnfeaw */
Blockly.Blocks['set_complement'] = {
  init: function() {
    this.appendValueInput("input")
        .setCheck("Set");
    this.appendDummyInput()
        .appendField("′");
    this.setInputsInline(true);
    this.setOutput(true, "Set");
    this.setColour(setHue);
    this.setTooltip('Set complement');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Set comparison: subset, equality etc */
Blockly.Blocks['set_comparison'] = {
  init: function() {
    this.appendValueInput("leftinput")
        .setCheck("Set");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["⊂", "SUBSET"], ["⊆", "SUBSETEQ"], ["=", "EQUAL"], ["≠", "NOTEQUAL"]]), "operator");
    this.appendValueInput("rightinput")
        .setCheck("Set");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(booleanHue);
    this.setTooltip('Set comparison operators');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['set_bounds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["sup", "SUPREMUM"], ["inf", "INFIMUM"], ["max", "MAXIMUM"], ["min", "MINIMUM"]]), "operator");
    this.appendValueInput("setinput")
        .setCheck("Set");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Set bound operators');
    this.setHelpUrl('http://www.example.com/');
  }
};

/****** Number operations ******/
Blockly.Blocks['number_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("x"), "varname");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('A variable representing a number');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Constants */
Blockly.Blocks['number_0'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("0");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('The additive identity');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['number_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("1");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('The multiplicative identity');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['number_pi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("π");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('The number π (pi)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['number_e'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("e");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('The number e (base of natural log)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['number_add_inv'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("-");
    this.appendValueInput("input")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Multiplicative inverse');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['number_mult_inv'] = {
  init: function() {
    this.appendValueInput("input")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("-1");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Multiplicative inverse');
    this.setHelpUrl('http://www.example.com/');
  }
};



Blockly.Blocks['number_abs'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("|");
    this.appendValueInput("input")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("|");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Absolute value function');
    this.setHelpUrl('http://www.example.com/');
  }
};

/* Single variable functions */
Blockly.Blocks['number_trig_functions'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["sin", "SIN"], ["cos", "COS"], ["tan", "TAN"], ["arcsin", "ARCSIN"], ["arccos", "ARCCOS"], ["arctan", "ARCTAN"]]), "operator");
    this.appendValueInput("numberinput")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Trigonometric functions');
    this.setHelpUrl('http://www.example.com/');
  }
};
Blockly.Blocks['number_log_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("log");
    this.appendValueInput("numberinput")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(numberHue);
    this.setTooltip('Natural log');
    this.setHelpUrl('http://www.example.com/');
  }
};



/* Number comparison. Adapted from blockly/blocks/logic.js */
Blockly.Blocks['number_comparison'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS = this.RTL ? [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['>', 'LT'],
          ['\u2265', 'LTE'],
          ['<', 'GT'],
          ['\u2264', 'GTE']
        ] : [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE']
        ];
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(booleanHue);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A')
        .setCheck("Number");
    this.appendValueInput('B')
        .setCheck( "Number" )
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
  }
};

