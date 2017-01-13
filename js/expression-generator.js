/* Routines for generating random mathematical expressions */

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


var t2 = fullBinaryTree(2);
var t3 = fullBinaryTree(3);
var n = getAllNodes(t2);



var opScalarPlus = {
  left: ["scalarOp", "scalarVars","scalarConsts"],
  right: ["scalarOp", "scalarVars","scalarConsts"]
}

var scalarVars = ["x","y","z","a","b","α","λ"];
var scalarVarGen = {
  list: scalarVars
};
var scalarConsts = ["1","2","3","4","5","12","0.5","1.2","0","\sqrt{2}","\sqrt{5}","\frac{1}{2}","\frac{\sqrt{2}}{2}"];
var vectorTerms = ["\mathbf{u}","\mathbf{v}","\mathbf{w}","\\overrightarrow{AB}","\\overrightarrow{OA}","\\overrightarrow{PQ}","\mathbf{0}"];
//var binaryOps = [opScalarPlus, opScalarMinus, opVectorPlus, opVectorMinus, opVectorDot, opVectorCross, opScalarTimes];




/* The desired complexity of the randomly generated expression, measured as the # of atomic terms in the expression. */
var targetComplexity = 4;








/*
Notes:
* global 'complexity level' variable - determining size of tree (# of leaves)

Two possible approaches for generating valid/invalid expressions:
1. Decide initially whether expression should be valid or invalid. Decide at which leaf the error should lie. Pass this to the generator.
 Advantage: can produce any desired distribution of valid/invalid, or where the error is.
2. At each generation step, randomly decide whether to make it valid or invalid. Once one invalid leaf is produced, all others should be valid. Tune the probability so that we get a desired overall valid/invalid rate (binomial distribution).

Approach 1 probably better?





*/