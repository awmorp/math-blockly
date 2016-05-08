/* Code generator to produce latex from math blocks */
/* Adapted from blockly/generators/javascript.js */

Blockly.Latex = new Blockly.Generator('Latex');


/**
 * Order of operation ENUMs.
  */
Blockly.Latex.ORDER_ATOMIC = 0;         // Literals, variables

/* Logic/boolean operations */
Blockly.Latex.ORDER_FORALL = 1;         // forall X in __ ...
Blockly.Latex.ORDER_EXISTS = 1;         // exists X in __ ...
Blockly.Latex.ORDER_QUANTIFIER_SET = 1; // exists __ in XXX ...
Blockly.Latex.ORDER_QUANTIFIER_NUM = 1; // exists __ > XXX ...
Blockly.Latex.ORDER_QUANTIFIER_SCOPE = 1; // exists __ _ XXX ...
Blockly.Latex.ORDER_NOT = 2;            // NOT a
Blockly.Latex.ORDER_IFF = 4;            // a IFF b
Blockly.Latex.ORDER_IMPLIES = 4;        // a IMPLIES b
Blockly.Latex.ORDER_AND = 3;            // a AND b
Blockly.Latex.ORDER_OR = 4;             // a OR b

/* Comparisons  - all have equal precedence */
Blockly.Latex.ORDER_EQUAL = 10;         // a = b
Blockly.Latex.ORDER_NOTEQUAL = 10;      // a = b
Blockly.Latex.ORDER_SUBSET = 10;        // A subset B
Blockly.Latex.ORDER_SUBSETEQ = 10;      // A subseteq B
Blockly.Latex.ORDER_LESS = 10;          // A < B
Blockly.Latex.ORDER_LESSEQ = 10;        // A <= B
Blockly.Latex.ORDER_GREATER = 10;       // A > B
Blockly.Latex.ORDER_GREATEREQ = 10;     // A >= B
Blockly.Latex.ORDER_COMPARISON = 10;    // covers all comparisons: =, <, subseteq, etc


/* Set operations */
Blockly.Latex.ORDER_SET_COMPLEMENT = 2;  // set complement A^c
Blockly.Latex.ORDER_SET_EXCLUSION = 3;   // set exclusion A \ B
Blockly.Latex.ORDER_INTERSECTION = 4;   // set intersection
Blockly.Latex.ORDER_UNION = 5;          // set union
Blockly.Latex.ORDER_SET_ELEMENT = 20;   // X element of __
Blockly.Latex.ORDER_SET_SET = 20;       // __ element of X
Blockly.Latex.ORDER_SET_MEMBERSHIP = 21;// (XX element of YY)

/* Set bounding operations - all have equal precedence */
Blockly.Latex.ORDER_SUP = 1;
Blockly.Latex.ORDER_INF = 1;
Blockly.Latex.ORDER_MIN = 1;
Blockly.Latex.ORDER_MAX = 1;

/* Number operations */
Blockly.Latex.ORDER_FUNCTION = 1;       // Function application eg sin(...)
Blockly.Latex.ORDER_MULT_INVERSE = 2;
Blockly.Latex.ORDER_ADD_INVERSE = 3;
Blockly.Latex.ORDER_POWER = 4;
Blockly.Latex.ORDER_MULTIPLICATION = 5;
Blockly.Latex.ORDER_DIVISION = 5;
Blockly.Latex.ORDER_ADDITION = 6;
Blockly.Latex.ORDER_SUBTRACTION = 6;

Blockly.Latex.ORDER_NONE = 99;          // (...)

/* Text to appear as a placeholder for any empty slots */
Blockly.Latex.blank = "\\text{[blank]}";

/* Code for left & right parentheses */
Blockly.Latex.leftParen = "\\left(";
Blockly.Latex.rightParen = "\\right)";

/* Latex uses \\ for line break */
Blockly.Latex.lineSeparator = "\\\\\n";

/* Adds comments or other annotations to code. Not needed in this case. */
Blockly.Latex.scrub_ = function(block, code) {
  return( code );
}

/* Adds semicolons, linebreaks etc at end of line. Not needed in this case. */
Blockly.Latex.scrubNakedValue = function(line) {
  return( line );
}

/* Add any prelude, eg variable definitions. Not needed in this case. */
Blockly.Latex.finish = function(code) {
  return( code );
}

/* Mapping from field names (Unicode symbols or text labels) to latex command and precedence value */
Blockly.Latex.symbolToLatex = {
    '∧': ["\\wedge",Blockly.Latex.ORDER_AND],
    '∨': ["\\vee",Blockly.Latex.ORDER_OR],
    '⇒': ["\\implies",Blockly.Latex.ORDER_IMPLIES],
    '⇔': ["\\iff",Blockly.Latex.ORDER_IFF],
    '∨': ["\\vee",Blockly.Latex.ORDER_OR],
    '∨': ["\\vee",Blockly.Latex.ORDER_OR],
    '∪': ["\\cup", Blockly.Latex.ORDER_UNION],
    '∩': ["\\cap", Blockly.Latex.ORDER_INTERSECTION],
    '\\': ["\\setminus", Blockly.Latex.ORDER_SET_EXCLUSION],
    'SUBSET': ["\\subset", Blockly.Latex.ORDER_SUBSET],
    'SUBSETEQ': ["\\subseteq", Blockly.Latex.ORDER_SUBSETEQ],
    '=': ["=", Blockly.Latex.ORDER_EQUAL],
    '≠': ["\\not=", Blockly.Latex.ORDER_NOTEQUAL],
    '<': ["<", Blockly.Latex.ORDER_LESS],
    '>': [">", Blockly.Latex.ORDER_GREATER],
    '≤': ["\\leq", Blockly.Latex.ORDER_LESSEQ],
    '≥': ["\\geq", Blockly.Latex.ORDER_GREATEREQ],
    'SUPREMUM': ["\\sup", Blockly.Latex.ORDER_SUP],
    'INFIMUM': ["\\inf", Blockly.Latex.ORDER_INF],
    'MINIMUM': ["\\min", Blockly.Latex.ORDER_MIN],
    'MAXIMUM': ["\\max", Blockly.Latex.ORDER_MAX],
    'ADD': ["+", Blockly.Latex.ORDER_ADDITION],
    'MINUS': ["-", Blockly.Latex.ORDER_SUBTRACTION],
    'MULTIPLY': ["\\times", Blockly.Latex.ORDER_MULTIPLICATION],
    'DIVIDE': ["/", Blockly.Latex.ORDER_DIVISION],
    'POWER': ["^", Blockly.Latex.ORDER_POWER],
    '∀': ["\\forall", Blockly.Latex.ORDER_FORALL],
    '∃': ["\\exists", Blockly.Latex.ORDER_EXISTS],
    'FORALL': ["\\forall", Blockly.Latex.ORDER_FORALL],
    'EXISTS': ["\\exists", Blockly.Latex.ORDER_EXISTS],
    '∈': ["\\in", Blockly.Latex.ORDER_SET_MEMBERSHIP],
    'BLANK': [Blockly.Latex.blank, Blockly.Latex.ORDER_ATOMIC],   // For dropdowns with nothing selection
  };


Blockly.Latex.init = function(workspace) {
};

/* Quantifiers: forall x in set P(x), forall x > n P(x) etc */
Blockly.Latex['logic_quantifier'] = function(block) {
  var order = Blockly.Latex.symbolToLatex[block.getFieldValue( "QUANTIFIER" )][1]
  var str = Blockly.Latex.symbolToLatex[block.getFieldValue( "QUANTIFIER" )][0] + " " + (block.getFieldValue( "VAR" ) || Blockly.Latex.blank) +
    " " + Blockly.Latex.symbolToLatex[block.getFieldValue( "OPERATOR" )][0] + " " + 
    (Blockly.Latex.valueToCode(block, "SCOPE", Blockly.Latex.ORDER_QUANTIFIER_SCOPE) || Blockly.Latex.blank ) + " " +
    (block.getInput( "STLABEL" ).isVisible() ? "\\text{ s.t. }" : "\\; " ) +
    (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, order];
};

Blockly.Latex['logic_forall'] = function(block) {
  var str = "\\forall " + (block.getFieldValue( "VAR" ) || Blockly.Latex.blank) + " \\in " +
    (Blockly.Latex.valueToCode(block, "SCOPE", Blockly.Latex.ORDER_QUANTIFIER_SET) || Blockly.Latex.blank ) +
    " \\; " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_FORALL];
};

Blockly.Latex['logic_forall_condition'] = function(block) {
  var str = "\\forall " + (block.getFieldValue( "VAR" ) || Blockly.Latex.blank) + " " + block.getFieldValue( "COMPARISON_OPERATOR" ) + " " + 
    (Blockly.Latex.valueToCode(block, "SCOPE", Blockly.Latex.ORDER_QUANTIFIER_NUM) || Blockly.Latex.blank ) +
    " \\; " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_FORALL ) || Blockly.Latex.blank );
return [str, Blockly.Latex.ORDER_FORALL];
};

Blockly.Latex['logic_exists'] = function(block) {
  var str = "\\exists " + (block.getFieldValue( "VAR" ) || Blockly.Latex.blank) + " \\in " +
    (Blockly.Latex.valueToCode(block, "SCOPE", Blockly.Latex.ORDER_QUANTIFIER_SET) || Blockly.Latex.blank) +
    " \\text{ s.t. } " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_EXISTS];
};

Blockly.Latex['logic_exists_condition'] = function(block) {
  var str = "\\exists " + (block.getFieldValue( "VAR" ) || Blockly.Latex.blank) + " " + block.getFieldValue( "COMPARISON_OPERATOR" ) + " " + 
    (Blockly.Latex.valueToCode(block, "SCOPE", Blockly.Latex.ORDER_QUANTIFIER_NUM) || Blockly.Latex.blank ) +
    " \\text{ s.t. } " + (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_FORALL ) || Blockly.Latex.blank );
  return [str, Blockly.Latex.ORDER_EXISTS];
};

Blockly.Latex['logic_connective'] = function(block) {
  /* Logic connective: AND, OR, etc */
  var connective = block.getFieldValue('CONNECTIVE');
  var operator = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Latex['logic_negation'] = function(block) {
  var str = "\\sim " + 
    (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_NOT) || Blockly.Latex.blank);
  return [str, Blockly.Latex.ORDER_NOT];
};

Blockly.Latex['logic_prop_variable'] = function(block) {
  return [block.getFieldValue( "VARNAME" ) || Blockly.Latex.blank, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_r'] = function(block) {
  return ["\\mathbb{R}", Blockly.Latex.ORDER_ATOMIC];   /* Or use Unicode? */
};

Blockly.Latex['set_c'] = function(block) {
  return ["\\mathbb{C}", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_q'] = function(block) {
  return ["\\mathbb{Q}", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_z'] = function(block) {
  return ["\\mathbb{Z}", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_n'] = function(block) {
  return ["\\mathbb{N}", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_nullset'] = function(block) {
  return ["\\emptyset", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_variable'] = function(block) {
  return [block.getFieldValue( "VARNAME" ) || Blockly.Latex.blank, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_membership'] = function(block) {
  var str = (Blockly.Latex.valueToCode(block, "ELEMENT", Blockly.Latex.ORDER_SET_ELEMENT) || Blockly.Latex.blank)
    + " \\in " +
    (Blockly.Latex.valueToCode(block, "SET", Blockly.Latex.ORDER_SET_SET) || Blockly.Latex.blank);
  return [str, Blockly.Latex.ORDER_SET_MEMBERSHIP];
};

Blockly.Latex['set_operations'] = function(block) {
  /* Set operations: union, intersection, exclusion */
  var connective = block.getFieldValue('OPERATION');
  var operator = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];

};

Blockly.Latex['set_complement'] = function(block) {
  var str = (Blockly.Latex.valueToCode(block, "SET", Blockly.Latex.ORDER_SET_COMPLEMENT) || Blockly.Latex.blank) + "^c";
  return [str, Blockly.Latex.ORDER_SET_COMPLEMENT];
};

Blockly.Latex['set_comparison'] = function(block) {
  var connective = block.getFieldValue('OPERATOR');
  var operator = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Latex['set_bounds'] = function(block) {
  /* Set bounds: sup, inf, min, max */
  var connective = block.getFieldValue('OPERATOR');
  var operator = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var code = operator + " " + (Blockly.Latex.valueToCode(block, 'SET', order) || Blockly.Latex.blank);
  return [code, order];
};

/* Could re-use function for set, propositional variable? */
Blockly.Latex['number_variable'] = function(block) {
  return [block.getFieldValue( "VARNAME" ) || Blockly.Latex.blank, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_0'] = function(block) {
  return ["0", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_1'] = function(block) {
  return ["1", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_pi'] = function(block) {
  return ["\\pi", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_e'] = function(block) {
  return ["e", Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_add_inv'] = function(block) {
  var str = "-" + (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_SET_COMPLEMENT) || Blockly.Latex.blank);
  return [str, Blockly.Latex.ORDER_ADD_INVERSE];
};

Blockly.Latex['number_mult_inv'] = function(block) {
  var str = (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_SET_COMPLEMENT) || Blockly.Latex.blank) + "^{-1}";
  return [str, Blockly.Latex.ORDER_MULT_INVERSE];
};

Blockly.Latex['number_squared'] = function(block) {
  var str = (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_SET_COMPLEMENT) || Blockly.Latex.blank) + "^{2}";
  return [str, Blockly.Latex.ORDER_POWER];
};

Blockly.Latex['number_abs'] = function(block) {
  var str = "\\left|" + (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_ATOMIC) || Blockly.Latex.blank) + "\\right|";
  return [str, Blockly.Latex.ORDER_ATOMIC]; /* Using ORDER_ATOMIC as |...| act as brackets themselves. */ /* TODO: is this correct? Should be ORDER_NONE? */
};

Blockly.Latex['number_log_function'] = function(block) {
  var str = "\\log\\left(" + (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_ATOMIC) || Blockly.Latex.blank) + "\\right)";
  return [str, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_trig_functions'] = function(block) {
  var str = "\\" + block.getFieldValue( "FUNCTION" )
    + "\\left(" + (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_ATOMIC) || Blockly.Latex.blank) + "\\right)";
  return [str, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['function_variable'] = function(block) {
  var str = block.getFieldValue( "FUNCNAME" ) + "\\left( " +
    (Blockly.Latex.valueToCode(block, "INPUT", Blockly.Latex.ORDER_ATOMIC) || Blockly.Latex.blank) + " \\right)";
  return [str, Blockly.Latex.ORDER_ATOMIC];
}

Blockly.Latex['number_comparison'] = function(block) {
  /* Number comparisons: equal, not equal, less than, etc */
  var connective = block.getFieldValue('COMPARISON_OPERATOR');
  var operator = Blockly.Latex.symbolToLatex[connective][0];
  var order = Blockly.Latex.symbolToLatex[connective][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Latex['number_comparison_3'] = function(block) {
  /* Number comparisons: equal, not equal, less than, etc */
  var comparison0 = block.getFieldValue('COMPARISON_OPERATOR0');
  var comparison1 = block.getFieldValue('COMPARISON_OPERATOR1');
  var compsymbol0 = Blockly.Latex.symbolToLatex[comparison0][0];
  var compsymbol1 = Blockly.Latex.symbolToLatex[comparison1][0];
  var order = Blockly.Latex.symbolToLatex[comparison0][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'LEFTINPUT', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'MIDDLEINPUT', order) || Blockly.Latex.blank;
  var argument2 = Blockly.Latex.valueToCode(block, 'RIGHTINPUT', order) || Blockly.Latex.blank;
  var code = argument0 + ' ' + compsymbol0 + ' ' + argument1 + ' ' + compsymbol1 + ' ' + argument2;
  return [code, order];
};


/* Generator for Blockly standard number block. Replace with our own block? */
Blockly.Latex['math_number'] = function(block) {
  return [block.getFieldValue( "NUM" ), Blockly.Latex.ORDER_ATOMIC];
};

/* Generator for Blockly standard arithmetic block. Replace with our own block? */
Blockly.Latex['math_arithmetic'] = function(block) {
  /* Number comparisons: equal, not equal, less than, etc */
  var op = block.getFieldValue('OP');
  var operator = Blockly.Latex.symbolToLatex[op][0];
  var order = Blockly.Latex.symbolToLatex[op][1];
  var argument0 = Blockly.Latex.valueToCode(block, 'A', order) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'B', order) || Blockly.Latex.blank;  /* TODO: need to use different order for exponent */
  var code;
  if( op == "POWER" ) {
    code = argument0 + "^{" + argument1 + "}";  /* Need braces around argument */
  } else {
    code = argument0 + ' ' + operator + ' ' + argument1;
  }
  return [code, order];
};



/* Blocks for translation exercise */
Blockly.Latex['logic_quantifier_set_restricted_1'] = Blockly.Latex['logic_quantifier_set_restricted_2'] = function(block) {
//  console.log( block.getFieldValue("QUANTIFIER") );
  var order = Blockly.Latex.symbolToLatex[block.getFieldValue( "QUANTIFIER" )][1]
  var varname = block.getFieldValue( "VAR" );
  if( !varname || varname == "BLANK" ) varname = Blockly.Latex.blank;
  var str = Blockly.Latex.symbolToLatex[block.getFieldValue( "QUANTIFIER" )][0] + " " + varname +
    " ∈ ℤ " + 
//    (block.getFieldValue( "QUANTIFIER" ) == "∃" ? "\\text{ s.t. }" : "\\; " ) +
    (Blockly.Latex.valueToCode( block, "PREDICATE", Blockly.Latex.ORDER_EXISTS ) || Blockly.Latex.blank );
  return [str, order];
};

Blockly.Latex['predicate_multiple_of_3'] = Blockly.Latex['predicate_multiple_of_6'] = function(block) {
  var str = (Blockly.Latex.valueToCode( block, "NUM", Blockly.Latex.ORDER_ATOMIC ) || Blockly.Latex.blank )
   + " \\text{ is a multiple of " + (block.type == "predicate_multiple_of_3" ? "3" : "6") + "}";
  return [str, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['number_multiplication'] = function(block) {
  var argument0 = Blockly.Latex.valueToCode(block, 'A', Blockly.Latex.ORDER_MULTIPLICATION) || Blockly.Latex.blank;
  var argument1 = Blockly.Latex.valueToCode(block, 'B', Blockly.Latex.ORDER_MULTIPLICATION) || Blockly.Latex.blank;
  var code = argument0 + " \\times " + argument1;
  return [code, Blockly.Latex.ORDER_MULTIPLICATION];
};

Blockly.Latex['number_variable_restricted'] = function(block) {
  var varname = block.getFieldValue("VAR");
  if( varname == "BLANK" ) varname = Blockly.Latex.blank;
  return [varname, Blockly.Latex.ORDER_ATOMIC];
};

Blockly.Latex['set_dropdown'] = function(block) {
  var setname = block.getFieldValue("SET");
  if( setname == " " ) varname = Blockly.Latex.blank;
  return [setname, Blockly.Latex.ORDER_ATOMIC];
};
