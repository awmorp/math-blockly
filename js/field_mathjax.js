/** Based on Blockly field_image.js **/

'use strict';

goog.provide('Blockly.FieldMathJax');

goog.require('Blockly.Field');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.userAgent');


/**
 * Class for displaying a mathematical expression rendered by MathJax.
 * @param {string} src A mathematical expression, in latex, asciimath or any other format supported by MathJax
 * @param {string=} opt_alt Optional alt text for when block is collapsed.
 * @param {bool=} opt_initialsource If true, show the alt text during initial rendering.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldMathJax = function(src, opt_alt, opt_initial) {
  this.sourceBlock_ = null;
  this.text_ = opt_alt || '';
  this.src_ = src;
  this.size_ = new goog.math.Size(0, 0); /* Size cannot be determined until after rendering */
  this.initialSource_ = (opt_initial == true);
};
goog.inherits(Blockly.FieldMathJax, Blockly.Field);

Blockly.FieldMathJax.svgCache_ = {};

/* TODO: cache clean-up? */

Blockly.FieldMathJax.addToCache = function( src, node ) {
  Blockly.FieldMathJax.svgCache_[src] = {node: node.cloneNode(true), width: node.offsetWidth, height: node.offsetHeight};
}

/**
 * Rectangular mask used by Firefox.
 * @type {Element}
 * @private
 */
Blockly.FieldMathJax.prototype.rectElement_ = null;

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
Blockly.FieldMathJax.prototype.EDITABLE = false;

/**
 * Install this field on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldMathJax.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Field has already been initialized once.
    return;
  }
  this.sourceBlock_ = block;
  // Build the DOM.
  this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';
  }
  
  this.foreignElement_ = Blockly.createSvgElement('foreignObject',
      {}, this.fieldGroup_);
  this.setValue(this.src_);
  if (goog.userAgent.GECKO) {
    // Due to a Firefox bug which eats mouse events on image elements,
    // a transparent rectangle needs to be placed on top of the image.
    // TODO: Check if this bug holds for foreignelement also.
    this.rectElement_ = Blockly.createSvgElement('rect',
        {'fill-opacity': 0}, this.fieldGroup_);
  }
  block.getSvgRoot().appendChild(this.fieldGroup_);

  // Configure the field to be transparent with respect to tooltips.
  var topElement = this.rectElement_ || this.foreignElement_;
  topElement.tooltip = this.sourceBlock_;
  Blockly.Tooltip.bindMouseEvents(topElement);
};

Blockly.FieldMathJax.prototype.setSize_ = function(width, height) {
  this.width_ = width;
  this.height_ = height;
  this.size_ = new goog.math.Size(this.width_,
    this.height_ + 2 * Blockly.BlockSvg.INLINE_PADDING_Y);
  
  this.foreignElement_.setAttribute("width", width + "px");
  this.foreignElement_.setAttribute("height", height + "px");
  
  if( this.rectElement_ ) {
    this.rectElement_.setAttribute("width", width + "px");
    this.rectElement_.setAttribute("height", height + "px");
  }
};

/**
 * Set the latex/asciimath source of the expression.
 * @param {?string} src New source.
 * @override
 */
Blockly.FieldMathJax.prototype.setValue = function(src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.src_ = src;
  if( !this.sourceBlock_ ) {
    /* Block hasn't been initialised yet. Store string for later. */
    return;
  }
  
  /* If this src has been rendered before, re-use svg from cache */
  if( Blockly.FieldMathJax.svgCache_[src] ) {
    goog.dom.removeNode( this.mathDiv_ );
    var cacheData = Blockly.FieldMathJax.svgCache_[src];
    var node = cacheData.node.cloneNode(true);
    this.mathDiv_ = node;
    this.setSize_( cacheData.width, cacheData.height );
    
    this.foreignElement_.appendChild( node );
    node.style.position = "relative";
    node.style.visibility = "visible";
    return;
  }
  
  /* Otherwise, render the math using MathJax */

  if( !this.mathDiv_ && this.initialSource_ ) {
    /* Temporarily display latex source */
    this.mathDiv_ = document.createElement("div");
    this.mathDiv_.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    this.mathDiv_.innerHTML = this.text_;
    this.mathDiv_.style.visibility = "hidden";
    this.mathDiv_.style.position = "absolute";
    this.mathDiv_.style.margin = "0";
    this.mathDiv_.style.fontWeight = "bold";
    document.body.appendChild( this.mathDiv_ );
    this.setSize_( this.mathDiv_.offsetWidth, this.mathDiv_.offsetHeight );
    this.foreignElement_.appendChild( this.mathDiv_ );
    this.mathDiv_.style.visibility = "visible";
    this.mathDiv_.style.position = "relative";
  }
  
  var newDiv = document.createElement("div");
  newDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  newDiv.innerHTML = "\\(\\displaystyle " + src + " \\)";  /* Allow Latex only */
//  newDiv.innerHTML = "\\/( " + src + " \\/)";  /* Allow Latex and asciimath */
  
  // Temporarily add div to document so that we can get its size.
  // Set visibility to hidden so it will not display.
  newDiv.style.visibility = "hidden";
  newDiv.style.position = "absolute";
  document.body.appendChild( newDiv );  
  
  var t = this;
  var callback = function() {
    /* Called when MathJax has finished rendering math expression */
    t.setSize_( newDiv.offsetWidth, newDiv.offsetHeight );
    
    goog.dom.removeNode( t.mathDiv_ );
    t.foreignElement_.appendChild( newDiv );
    newDiv.style.position = "relative";
    newDiv.style.visibility = "visible";
    t.mathDiv_ = newDiv;
    
    /* Re-render block in case size has changed */
    t.sourceBlock_.render();
    
    /* If block is in a flyout, re-flow the flyout due to block size change */
    if( t.sourceBlock_.workspace.isFlyout ) {
      t.sourceBlock_.workspace.targetWorkspace.flyout_.reflow(); //  A bit hackish
    }
    
    /* Add rendered svg to cache */
    Blockly.FieldMathJax.addToCache( src, newDiv );
  };
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, newDiv, callback]);
};

/**
 * Get the latex/asciimath source of this expression.
 * @return {string} Current text.
 * @override
 */
Blockly.FieldMathJax.prototype.getValue = function() {
  return this.src_;
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldMathJax.prototype.dispose = function() {
  goog.dom.removeNode(this.fieldGroup_);
  this.fieldGroup_ = null;
  this.foreignElement_ = null;
  this.mathDiv_ = null;
  this.rectElement_ = null;
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldMathJax.prototype.setTooltip = function(newTip) {
  var topElement = this.rectElement_ || this.foreignElement_;
  topElement.tooltip = newTip;
};

/**
 * Set the alt text of this field.
 * @param {?string} alt New alt text.
 * @override
 */
Blockly.FieldMathJax.prototype.setText = function(alt) {
  if (alt === null) {
    // No change if null.
    return;
  }
  this.text_ = alt;
};

/**
 * Field is fixed width, no need to render.
 * @private
 */
 // TODO: Implement this?
Blockly.FieldMathJax.prototype.render_ = function() {
  // NOP
};
