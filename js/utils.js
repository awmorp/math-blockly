/* Set content of element 'id' to 'text' */
function setContentById( id, text )
{
  var e = document.getElementById( id );
  if( e ) {
    e.innerHTML = "";
    e.appendChild( document.createTextNode( text ) );
  }
}

function dumpXML()
{
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var xml_text = Blockly.Xml.domToPrettyText(xml);
  console.log( xml );
  console.log( xml_text );
}

function debug() {
  var nodes = goog.dom.getElementsByClass( "debug" );
  Array.prototype.forEach.call(nodes, function(x) {x.style.display = "block";} );   // nodes is a NodeList rather than Array
}


/* Load local MathJax if viewing page locally, otherwise use remote MathJax */
function loadMathjax() {
  var scriptNode = document.createElement( "script" );
  scriptNode.type = "text/javascript";
  if( window.location.protocol == "file:" ) {
    scriptNode.src = "../MathJax/unpacked/MathJax.js";
  } else {
    scriptNode.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js";
  }
  document.getElementsByTagName('head')[0].appendChild( scriptNode );
}

/* Render block expression on workspace change */
var gPreviousLatex;
function displayLatex(workspace) {
  var code = Blockly.Latex.workspaceToCode( workspace );
  if( code != gPreviousLatex ) {
    gPreviousLatex = code;
    renderLatex( "\\( " + code + " \\)" );
  }
}

function renderLatex( code ) {
  /* Display latex source, if desired */
  var latexNode = document.getElementById( "latex-output" );
  if( latexNode ) setContentById( 'latex-output', code );
  /* Render source into new div asynchronously */
  var newNode = document.createElement( "div" );
  newNode.innerHTML = code;
  var callback = function() {
    var container = document.getElementById( "mathjax-output" );
    /* Clear old Mathjax */
    while( container.firstChild ) container.removeChild(container.firstChild);
    /* Add newly rendered node */
    container.appendChild( newNode );
  };
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, newNode, callback]);
};

function setupAutoLatex( workspace )
{
  workspace.addChangeListener( function() { displayLatex( workspace ); } );
  if( window.MathJax ) {
    /* Do initial render, if MathJax loaded */
    displayLatex( workspace );
  }
}


/* We must wait until MathJax has loaded itself (at least to the point that MathJax.Hub.queue exists) before loading Blockly.
 * This function will be called by a MathJax signal handler once MathJax is loaded.
 */
var workspace;
function loadBlockly() {
  if( window.MathJax ) {
    console.warn( "Warning: loadBlockly() must be called before MathJax is loaded!" );
    return;
  }
  
  var injectBlockly = function() {
    workspace = Blockly.inject('blocklyDiv',
        {
          media: '../blockly/media/',
          disable: false,
          toggleInline: false,
          toolbox: document.getElementById('toolbox'),
          trashcan: true,
          zoom: {controls: true, wheel: true, startScale: 1}
        });
  //    Blockly.Xml.domToWorkspace( workspace, document.getElementById("workspace-initial") );
   }

  /* Set up a hook to load Blockly */
  window.MathJax = { AuthorInit: function() {
      MathJax.Hub.Register.StartupHook( "End", injectBlockly );
    }};
}


if( window.location.search.search("debug") >= 0 ) {
  if( window.addEventListener ){
    window.addEventListener( 'load', debug )
  } else {
    window.attachEvent( 'onload', debug )
  }
}
