/* Javascript for English to mathematics translation exercise */

/* Animation functions */
function pause( t ) {
  return( function(continuation) {
//      console.log( "Pausing for " + t );
    setTimeout( continuation, t );
  } );
}

function animateBlock( block, x, y, time ) {
  return( function(continuation) {
//      console.log( "Animating block " + block.id );
    block.select();
    var startPos = block.getRelativeToSurfaceXY();
    var dX = (x - startPos.x)/50;
    var dY = (y - startPos.y)/50;
    var i = 0;
    var timer;
    timer = window.setInterval( function() {
      block.moveBy( dX, dY );
      if( i++ == 50 ) {
        window.clearInterval( timer );
        continuation();
      }
    }, time/50);
  });
}

function fixBlock( block ) {
  return( function(continuation) {
//      console.log( "Fixing block " + block.id );
    block.setMovable( false );
    block.setEditable( false );
    block.setDisabled( true );
//      block.updateDisabled();

    continuation();
  });
}

function deleteBlock( block ) {
  return( function(continuation) {
//      console.log( "Deleting block " + block.id );
    block.dispose(false, true); // Delete block with animation
    continuation();
  });
}


function unplug( block ) {
  return( function(continuation) {
//      console.log( "Unplugging block " + block.id );
    block.unplug();
    continuation();
  });
}

function loadXml( nodeId ) {
  return( function(continuation) {
//      console.log( "loadXml( " + nodeId + " )" );
    Blockly.Xml.domToWorkspace( workspace, document.getElementById( nodeId ) );
    continuation();
  });
}

/* Run an animation sequence */
function runSequence( queue ) {
  if( queue ) {
    var next = queue.shift();
    if( goog.isFunction( next ) ) next( function() { runSequence( queue ) } );
    else if( goog.isNumber( next ) ) setTimeout( next, function() { runSequence( queue ) } );
  }
}

/* Load question 2 - run some animations, manipulate some blocks */
function loadQ2() {
  var rootBlock = workspace.getBlockById("6/8T!gQ*,D?*RUNRynp3");
  var impBlock = workspace.getBlockById(":]LON,k-!D|CGQb$A3FB");
  var mult3Block = workspace.getBlockById("fX(^g7xz/h`iw/Q!X8W=");
  var mult6Block = workspace.getBlockById("$O{41OtB{O`4$8%M:2E}");
  var v1Block = workspace.getBlockById("mtgBEc]uuk$k=.EoQh,h");
  var v2Block = workspace.getBlockById("Jr{b*jBHteQRO#N;X3,6");
  
  workspace.getAllBlocks().forEach( function(x) { x.setEditable( false ); } );
  
  Blockly.Events.disable();
  var queue = [animateBlock( rootBlock, workspace.getWidth()/2 - rootBlock.width/2 + 150, 20, 300 ), pause( 500 ),
      unplug( mult6Block ), animateBlock( mult6Block, workspace.getWidth()/3 - mult6Block.width/2, 100, 600 ),
      unplug( mult3Block ), animateBlock( mult3Block, 2*workspace.getWidth()/3 - mult6Block.width/2, 100, 600 ),
//        fixBlock( rootBlock ), fixBlock( impBlock ),
      deleteBlock( mult3Block ), deleteBlock( mult6Block ), pause( 250 ),
      loadXml( "q2addition" ),
      function(cont) {
        workspace.getAllBlocks().forEach( function(x) {
          x.setDisabled( false );
          x.setMovable( true );
          x.setEditable( true );
          x.updateDisabled();
        } );
        Blockly.Events.enable();
        cont();
      }
  ];

  // Start sequence.
  runSequence( queue );
}

/* Compare two XML workspace representations, ignoring block id's and positions */
/* a, b should be XML text */
function compareXML(a,b) {
  /* Strip out x="..", y="..", id=".." attributes and whitespace */
  a = a.replace(/[xy]="[0-9]+"/g,'').replace(/id="[^"]+"/g,'').replace(/[ \n]/g,'');
  b = b.replace(/[xy]="[0-9]+"/g,'').replace(/id="[^"]+"/g,'').replace(/[ \n]/g,'');
  return( a == b);
}

function checkAnswer() {
//  var startTime1 = Date.now();

  var correct = false;
  var topBlocks = workspace.getTopBlocks();
  if( topBlocks.length == 1 ) {
    Blockly.Events.disable();
    correct = questionConfig[currentQuestion-1].solnsBlock.some( function(x) {  /* Does user's response match one of the allowable solutions? */
//      var startTime = Date.now();
      var result = compareBlocks( topBlocks[0], x, !questionConfig[currentQuestion-1].strictVars );
//      console.log( "compareBlocks took " + (Date.now() - startTime) + "ms" );
      return( result );
    } );
    Blockly.Events.enable();
  }
  
  if( correct ) {
    goog.dom.getElement( "resultCorrect" ).style.display = "inline";
    goog.dom.getElement( "resultIncorrect" ).style.display = "none";
    if( currentQuestion == questionConfig.length ) {  /* Last question finished? */
      goog.dom.getElement( "finished" ).style.display = "inline";
    } else {
      goog.dom.getElement( "nextButton" ).style.display = "inline";
    }
  } else {
    goog.dom.getElement( "resultCorrect" ).style.display = "none";
    goog.dom.getElement( "resultIncorrect" ).style.display = "inline";
    goog.dom.getElement( "nextButton" ).style.display = "none";
    goog.dom.getElement( "finished" ).style.display = "none";
  }
//  console.log( "checkAnswer took " + (Date.now() - startTime1) + "ms" );
}

var currentQuestion = 0;

/* Load next question */
function nextQuestion() {
  if( currentQuestion > 0 ) goog.dom.getElement( "q" + currentQuestion ).style.display = "none";
  goog.dom.getElement( "q" + (currentQuestion + 1) ).style.display = "inline";
  currentQuestion++;
  if( currentQuestion <= questionConfig.length ) {  /* Note: questions numbered from 1, array indexing from 0 */
    /* Not up to last question yet. Load next question */
    Blockly.Events.disable();
    var loadData = questionConfig[currentQuestion-1].loadData; /* Questions numbered from 1, array indexing from 0 */
    if( goog.typeOf( loadData ) == "string" ) {
//        console.log( loadData, document.getElementById( loadData ) );
      Blockly.Xml.domToWorkspace( workspace, document.getElementById( loadData ) );
    } else if( goog.typeOf( loadData ) == "function" ) {
      loadData();
    }
    Blockly.Events.enable();
  }
  goog.dom.getElement( "resultCorrect" ).style.display = "none";
  goog.dom.getElement( "resultIncorrect" ).style.display = "inline";
  goog.dom.getElement( "nextButton" ).style.display = "none";
  goog.dom.getElement( "finished" ).style.display = "none";
}

var answerWorkspace;
function setupAnswers() {
//  var time = Date.now();
  if( answerWorkspace ) answerWorkspace.dispose();
  /* For efficiency, we pre-load all answer blocks into a headless workspace */
  answerWorkspace = new Blockly.Workspace();
  for( i in questionConfig ) {
    questionConfig[i].solnsBlock = [];
    for( j in questionConfig[i].solns ) {
      var child = goog.dom.getFirstElementChild( goog.dom.getElement( questionConfig[i].solns[j] ) );
      var block = Blockly.Xml.domToBlockHeadless_( child, answerWorkspace );   /* Assuming that answer is stored as an XML node with a single block child */
      questionConfig[i].solnsBlock[j] = block;
    }
  }
//  console.log( "setupAnswers() took " + (Date.now() - time) + "ms" );
}

function cheat() {
  Blockly.Events.disable();
  workspace.clear();
  var xmlNode = goog.dom.getElement( questionConfig[currentQuestion-1].solns[0] );  /* Questions numbered from 1, array indexing from 0 */
//    console.log( "Cheat: ", xmlNode )
  Blockly.Xml.domToWorkspace(workspace,xmlNode);
  Blockly.Events.enable();
  checkAnswer();
}

/* Compare two blocks for logical equivalence. */
function compareBlocks( b1, b2, doSubst ) {
  var varCount = 0;
  var compareBlocksR = function( b1, b2, subst1, subst2 )  /* Recursive helper function */
  {
    if( !b1 && !b2 ) return( true );        /* Both blocks are null */
    else if( !b1 || !b2 ) return( false );  /* One but not both are null */
    
    /* Compare the top block */
    if( b1.type != b2.type ) return( false );  /* Different type blocks can't match */
    switch( b1.type ) {
      case "logic_quantifier_condition_restricted":
        if( (b1.getFieldValue( "COMPARISON_OPERATOR" ) != b2.getFieldValue( "COMPARISON_OPERATOR" )) || (b1.getFieldValue( "BOUND" ) != b2.getFieldValue( "BOUND" )) ) return( false );
        /* Fall through to next case */
      case "logic_quantifier_set_restricted":
      case "logic_quantifier_set_restricted_1":
      case "logic_quantifier_set_restricted_2":
      case "logic_quantifier_condition_restricted":
        if( b1.getField("QUANTIFIER").getValue() != b2.getField("QUANTIFIER").getValue() ) return( false ); /* Different quantifiers */
        var p1 = b1.getInputTargetBlock( "PREDICATE" );
        var p2 = b2.getInputTargetBlock( "PREDICATE" );
        var newsubst1 = subst1; /* Must make copies as direct modifications to substX will propagate back up call chain due to Javascript passing arguments by reference */
        var newsubst2 = subst2;
        if( doSubst ) {
          newsubst1[b1.getFieldValue("VAR")] = newsubst2[b2.getFieldValue("VAR")] = "_v"+varCount;  /* Substitute variables with unique identifier */
          varCount++;
        } else {
          if( b1.getFieldValue("VAR") != b2.getFieldValue("VAR") ) return( false );
        }
//        console.log( "Comparing quantifiers. varCount = " + varCount, newsubst1, newsubst2 );
        return( compareBlocksR( p1, p2, newsubst1, newsubst2 ) );
        
      case "number_comparison":
        var op1 = b1.getFieldValue( "COMPARISON_OPERATOR" );
        var op2 = b2.getFieldValue( "COMPARISON_OPERATOR" );
        var l1 = b1.getInputTargetBlock( "LEFTINPUT" );
        var l2 = b2.getInputTargetBlock( "LEFTINPUT" );
        var r1 = b1.getInputTargetBlock( "RIGHTINPUT" );
        var r2 = b2.getInputTargetBlock( "RIGHTINPUT" );
        var reverseOp = {"=":"=", "≠":"≠","<":">", ">":"<", "≤":"≥", "≥":"≤"}; /* Mapping of operator to reversed operator */
        return(
            (op2 == op1 && (compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 ))) ||
            (op2 == reverseOp[op1] && (compareBlocksR( l1, r2, subst1, subst2 ) && compareBlocksR( r1, l2, subst1, subst2 )))
          );
      
      case "math_arithmetic":
        var op1 = b1.getFieldValue( "OP" );
        var op2 = b2.getFieldValue( "OP" );
        var l1 = b1.getInputTargetBlock( "A" );
        var l2 = b2.getInputTargetBlock( "A" );
        var r1 = b1.getInputTargetBlock( "B" );
        var r2 = b2.getInputTargetBlock( "B" );
        if( op1 != op2 ) return( false );
        if( op1 == "MULTIPLY" || op1 == "ADD" ) {
          /* Transitive ops */
          return( (compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 )) || (compareBlocksR( l1, r2, subst1, subst2 ) && compareBlocksR( r1, l2, subst1, subst2 )) );
        } else {
          return( compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 ) );
        }
        
      case "number_multiplication":
        var l1 = b1.getInputTargetBlock( "A" );
        var l2 = b2.getInputTargetBlock( "A" );
        var r1 = b1.getInputTargetBlock( "B" );
        var r2 = b2.getInputTargetBlock( "B" );
        return( (compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 )) || (compareBlocksR( l1, r2, subst1, subst2 ) && compareBlocksR( r1, l2, subst1, subst2 )) );
      
      case "number_variable_restricted":
        var v1 = b1.getFieldValue( "VAR" );
        var v2 = b2.getFieldValue( "VAR" );
//        console.log( "Comparing variables v1 = " + v1 + " v2 = " + v2, subst1, subst2 );
        if( subst1[v1] ) v1 = subst1[v1];
        if( subst2[v2] ) v2 = subst2[v2];
//        console.log( "  after subst: v1 = " + v1 + "  v2 = " + v2 );
        return( v1 == v2 );
      
      case "math_number":
        return( b1.getField("NUM").getValue() == b2.getField("NUM").getValue() );
        
      case "number_abs":
        return( compareBlocksR( b1.getInputTargetBlock( "NUM" ), b1.getInputTargetBlock( "NUM" ), subst1, subst2 ) );
        
      case "logic_connective":
        var op1 = b1.getFieldValue( "CONNECTIVE" );
        var op2 = b2.getFieldValue( "CONNECTIVE" );
        var l1 = b1.getInputTargetBlock( "LEFTINPUT" );
        var l2 = b2.getInputTargetBlock( "LEFTINPUT" );
        var r1 = b1.getInputTargetBlock( "RIGHTINPUT" );
        var r2 = b2.getInputTargetBlock( "RIGHTINPUT" );
        if( op1 != op2 ) return( false );
        if( op1 == "⇒" ) {  /* Intransitive */
          return( compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 ) );
        } else {  /* Transitive */
          return( (compareBlocksR( l1, l2, subst1, subst2 ) && compareBlocksR( r1, r2, subst1, subst2 )) || (compareBlocksR( l1, r2, subst1, subst2 ) && compareBlocksR( r1, l2, subst1, subst2 )) );
        }
        /* Note: No attempt to take into account other logical equivalences, eg ~(A and B) == ~A or ~B */
      
      case "predicate_multiple_of_3":
      case "predicate_multiple_of_6":
        return( compareBlocksR( b1.getInputTargetBlock("NUM"), b2.getInputTargetBlock("NUM"), subst1, subst2 ) );

      case "set_dropdown":
        return( b1.getFieldValue( "SET" ) == b2.getFieldValue( "SET" ) );
      
      case "function_fn":
        return( true );

      default:
        console.warn( "Trying to compare unsupported block type '" + b1.type + "'" );
        /* TODO: use generic fieldwise comparison */
        return( false );
    }
  }
  return( compareBlocksR( b1, b2, {}, {} ) );
}
