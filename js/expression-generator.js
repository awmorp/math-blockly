/* Routines for generating random mathematical expressions */

/***************************************/
/* Abstract binary tree data structure */

function Node(data, left, right) {
  this.data = data;
  this.left = left;
  this.right = right;
  this.isLeaf = (left == null && right == null);
}

Node.prototype.toString = function() {
  if( this.isLeaf ) {
    return( "Leaf" + (this.data?"("+this.data+")":"") );
  } else {
    return( "Node" + (this.data?"("+this.data+")":"") + "[" + this.left.toString() + ", " + this.right.toString() + "]" );
  }
};

function fullBinaryTree(depth) {
  if( depth == 0 ) {
    return new Node(null,null,null); // leaf
  } else {
    return new Node(null, fullBinaryTree(depth - 1), fullBinaryTree(depth - 1));
  }
}

function getAllNodes(tree) {
  if( tree == null ) {
    return( [] );
  } else {
    return( [tree].concat(getAllNodes(tree.left), getAllNodes(tree.right)) );
  }
}

function getLeaves(tree) {
  return( getAllNodes(tree).filter(function(x) {return x.isLeaf;}) );
}

function getNonLeaves(tree) {
  return( getAllNodes(tree).filter(function(x) {return !x.isLeaf;}) );
}

function countLeaves(tree) {
  return( getLeaves(tree).length );
}

function pruneChildren(tree) {
  //Note: this modifies the original object!
  tree.left = null;
  tree.right = null;
  tree.isLeaf = true;
  return( tree );
}

/***
 * randomPrune: generate a random tree by pruning branches from a given tree until a desired level of complexity is reached.
 * arguments:
 *  tree: a tree to be pruned.  (Suggestion: start with a complete binary tree of suitable depth.)
 *  leaftarget: the desired number of leaf nodes in the pruned tree
 *
 * Algorithm:
 *  Choose a random non-leaf node. Count the number of leaves below it.
 *  If we can prune those leaves without going below the desired number of leaves (leaftarget), then do so.
 *  Otherwise, try another node.
 */

function randomPrune(tree, leaftarget) {
  var currentLeafCount = countLeaves(tree);
//  console.log( "randomPrune( " + tree + " (" + currentLeafCount + "), " + leaftarget + ")" );
  
  if( currentLeafCount <= leaftarget ) return( tree );  // Already reached target. Nothing to do.
  
  // Otherwise, choose a random non-leaf node to prune (maybe).
  var nodes = getNonLeaves(tree);
  var i = Math.floor(Math.random()*nodes.length);
  var leafChange = countLeaves( nodes[i] ) - 1;  // Net change in number of leaves that would result from pruning this node
  if( currentLeafCount - leafChange >= leaftarget ) {
    // Found an acceptable node. Prune it.
    pruneChildren( nodes[i] );
    if( currentLeafCount - leafChange == leaftarget ) {
      return( tree ); // Finished pruning.
    } else {
      return( randomPrune( tree, leaftarget ) ); // Continue pruning.
    }
  } else {
    // Pruning this node would result in too few leaves remaining. Try again.
    return( randomPrune( tree, leaftarget ) );
  }
}
/* Note: The distribution of trees produced by this algorithm is not uniform. Balanced trees occur half as frequently.
   Run this line in the browser console to demonstrate:
   counts={}; "a".repeat(1000).split("").map(function(x) {return randomPrune(fullBinaryTree(3),4).toString();}).sort().forEach(function(x) { counts[x] = (counts[x] || 0)+1; }); counts
*/



/* Functions to assign syntax elements to a given tree */
function OpRule( name, output, valid, render, leftOp, rightOp, leftAtom, rightAtom ) {
  this.name = name; // human-readable name for debugging
  this.output = output; // output type eg "vector" 
  this.valid = valid; // Does this construct produce valid or invalid syntax?
  this.render = render; // Latex code for rendering this op's symbol
  this.leftOp = leftOp; // List of allowable operations for LHS of expression
  this.rightOp = rightOp;
  this.leftAtom = leftAtom; // List of allowable atoms for LHS of expression
  this.rightAtom = rightAtom;
}
OpRule.prototype.toString = function() {
  return( this.name );
}

function Atom( output, render ) {
  this.name = render;
  this.output = output;
  this.render = render;
  this.valid = true;
}
Atom.prototype.toString = function() {
  return( this.name );
}


var syntaxConfig = {
  opScalarPlus: new OpRule( "Scalar +", "scalar", true, "+", ["scalarOps"], ["scalarOps"], ["scalarVars","scalarConsts"],["scalarVars","scalarConsts"]),
  
  opVectorPlus: new OpRule( "Vector +", "vector",true,"+",["vectorOps"],["vectorOps"],["vectorTerms"],["vectorTerms"]),
  
  opVectorDot: new OpRule( "Vector dot", "scalar",true,"\\cdot",["vectorOps"],["vectorOps"],["vectorTerms"],["vectorTerms"]),
  
  opScalarMult: new OpRule( "Scalar × ", "scalar",true,"",["scalarOps"],["scalarOps"],["scalarVars","scalarConsts"],["scalarVars","scalarConsts"]),
  
  opScalarVectorMult: new OpRule( "Scalar × vector", "vector",true,"",["scalarOps"],["vectorOps"],["scalarVars","scalarConsts"],["vectorTerms"]),
  
  opVectorPlusScalar: new OpRule( "Vector + scalar", "invalid",false,"+",["vectorOps"],["scalarOps"],["vectorTerms"],["scalarVars","scalarConsts"]),
  
  scalarVars: {output: "scalar", atoms:["x","y","z","a","b","α","λ"]},
  scalarConsts: {output: "scalar", atoms:["1","2","3","4","5","12","0.5","1.2","0","\\sqrt{2}","\\sqrt{5}","\\frac{1}{2}","\\frac{\\sqrt{2}}{2}"]},
  vectorTerms: {output: "vector", atoms: ["\\mathbf{u}","\\mathbf{v}","\\mathbf{w}","\\overrightarrow{AB}","\\overrightarrow{OA}","\\overrightarrow{PQ}","\\mathbf{0}"]},
  vectorOps: ["opVectorPlus", "opScalarVectorMult"],
  scalarOps: ["opScalarPlus","opVectorDot", "opScalarMult"],

};

function allocateNode( node, types, tallies ) {
//  debugger;
  console.log( "allocateNode( " + node.toString() + ", " + types + " )" );
  
  if( !types ) {
    // No types specified (must be root node). Choose one at random.
    if( node.isLeaf ) {
      types = ["scalarVars", "scalarConsts", "vectorTerms"];
    } else {
      types = ["vectorOps", "scalarOps"];
    }
  }
  
  if( !tallies ) tallies = {};
  
  // Choose a type at random from the list of allowed types
  var type = types[Math.floor(Math.random()*types.length)];
  
  if( node.isLeaf ) {
    // type should be the name of a list of atoms.
    var atomsList = syntaxConfig[type];
    var atom = atomsList.atoms[Math.floor(Math.random()*atomsList.atoms.length)];
    if( typeof atom === "function" ) atom = atom();    // TODO: use goog.isFunction XXXXXXXXXXXXXXXXXXXXXXXXXX
    node.data = new Atom( atomsList.output, atom );
    console.log( "  Allocated atom " + node.data.toString() );
    tallies[atomsList.output] = (tallies[atomsList.output] || 0) + 1;
    return( node.data );
  } else {
    // type should be the name of a list of operations.
    var ops = syntaxConfig[type];
    var op = syntaxConfig[ops[Math.floor(Math.random()*ops.length)]];
    node.data = op;
    console.log( "  Allocated op " + node.data.toString() );
    tallies[node.data.output] = (tallies[node.data.output] || 0) + 1;
    if( node.left.isLeaf ) {
      allocateNode( node.left, op.leftAtom, tallies );
    } else {
      allocateNode( node.left, op.leftOp, tallies );
    }
    if( node.right.isLeaf ) {
      allocateNode( node.right, op.rightAtom, tallies );
    } else {
      allocateNode( node.right, op.rightOp, tallies );
    }
    return( node.data );
  }
}

function renderNode( node ) {
  console.log( "renderNode( " + node.toString() + " )" );
  if( node.isLeaf ) {
    return( node.data.render );
  } else {
    return( "\\left( " + renderNode( node.left ) + " " + node.data.render + " " + renderNode( node.right ) + " \\right)" );
  }
}


function go() {
  var tree = randomPrune( fullBinaryTree( targetComplexity ), targetComplexity );
  allocateNode( tree );
  var output = "\\[ " + renderNode( tree ) + " \\]";
  renderLatex( output );
}



/* The desired complexity of the randomly generated expression, measured as the # of atomic terms in the expression. */
var targetComplexity = 4;



/* For debugging convenience */
var t2 = fullBinaryTree(2);
var t3 = fullBinaryTree(3);
var rt = randomPrune(fullBinaryTree(3),4);







/*
Notes:
* global 'complexity level' variable - determining size of tree (# of leaves)

Two possible approaches for generating valid/invalid expressions:
1. Decide initially whether expression should be valid or invalid. Decide at which leaf the error should lie. Pass this to the generator.
 Advantage: can produce any desired distribution of valid/invalid, or where the error is.
2. At each generation step, randomly decide whether to make it valid or invalid. Once one invalid leaf is produced, all others should be valid. Tune the probability so that we get a desired overall valid/invalid rate (binomial distribution).

Approach 1 probably better?





*/