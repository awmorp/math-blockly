/* Code generator to produce latex from math blocks */
/* Adapted from blockly/generators/javascript.js */

Blockly.Latex = new Blockly.Generator('Latex');


/**
 * Order of operation ENUMs.
  */
Blockly.Latex.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Latex.ORDER_FORALL = 1;         // forall X in _ ...
Blockly.Latex.ORDER_EXISTS = 1;         // exists X in _ ...
Blockly.Latex.ORDER_QUANTIFIER_SET = 1; // exists _ in XXX ...
Blockly.Latex.ORDER_QUANTIFIER_NUM = 1; // exists _ > XXX ...
Blockly.Latex.ORDER_NOT = 2;            // NOT a
Blockly.Latex.ORDER_IFF = 4;            // a IFF b
Blockly.Latex.ORDER_IMPLIES = 4;        // a IMPLIES b
Blockly.Latex.ORDER_AND = 3;            // a AND b
Blockly.Latex.ORDER_OR = 4;             // a OR b
Blockly.Latex.ORDER_NONE = 99;          // (...)

/* Text to appear as a placeholder for any empty slots */
Blockly.Latex.blank = "\<\text{blank}\>";

/* Code for left & right parentheses */
Blockly.Latex.leftParen = "\left(";
Blockly.Latex.rightParen = "\right)";

/* Mapping from Unicode symbols (as used as labels in blocks) to latex command and precedence value */
Blockly.Latex.symbolsToLatex = {
    '∧': ["\wedge",Blockly.Latex.ORDER_AND],
    '∨': ["\vee",Blockly.Latex.ORDER_OR],
    '⇒': ["\implies",Blockly.Latex.ORDER_IMPLIES],
    '⇔': ["\iff",Blockly.Latex.ORDER_IFF],
    '∨': ["\vee",Blockly.Latex.ORDER_OR],
    '∨': ["\vee",Blockly.Latex.ORDER_OR]
  };


Blockly.Latex.init = function(workspace) {
};

/* Quantifiers: forall x in set P(x), forall x > n P(x) etc */
Blockly.Latex['logic_forall'] = function(block) {
  var str = "\forall " + block.getFieldValue( "VARNAME" ) + " \in " +
    (Blockly.Latex.valueToCode(block, "SET", Blockly.Latex.ORDER_QUANTIFIER_SET) || Blockly.Latex.blank ) +
    " \; " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_FORALL];
};

Blockly.Latex['logic_forall_condition'] = function(block) {
  var str = "\forall " + block.getFieldValue( "VARNAME" ) + " " + block.getFieldValue( "COMPARISON_OPERATOR" ) + " " + 
    (Blockly.Latex.valueToCode(block, "NUM", Blockly.Latex.ORDER_QUANTIFIER_NUM) || Blockly.Latex.blank ) +
    " \; " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_FORALL ) || Blockly.Latex.blank );
return [str, Blockly.Latex.ORDER_FORALL];
};

Blockly.Latex['logic_exists'] = function(block) {
  var str = "\exists " + block.getFieldValue( "VARNAME" ) + " \in " +
    (Blockly.Latex.valueToCode(block, "SET", Blockly.Latex.ORDER_QUANTIFIER_SET) || Blockly.Latex.blank) +
    " \text{ s.t. } " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_EXISTS];
};

Blockly.Latex['logic_exists_condition'] = function(block) {
  var str = "\exists " + block.getFieldValue( "VARNAME" ) + " " + block.getFieldValue( "COMPARISON_OPERATOR" ) + " " + 
    (Blockly.Latex.valueToCode(block, "NUM", Blockly.Latex.ORDER_QUANTIFIER_NUM) || Blockly.Latex.blank ) +
    " \text{ s.t. } " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_FORALL ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_EXISTS];
};

Blockly.Latex['logic_connective'] = function(block) {
  /* Logic connective: AND, OR, etc */
  var connective = block.getFieldValue('CONNECTIVE')];
  var latex = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var argument0 = Blockly.JavaScript.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.JavaScript.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Latex['logic_negation'] = function(block) {
  var str = "\sim " + 
    (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_NOT) || Blockly.Latex.blank);
  return [str, Blockly.Latex.ORDER_NOT];
};