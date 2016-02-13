/** Adds angled, rounded and brace-shaped connectors, and chooses connector shape based on type **/
/* Author: Anthony Morphett, awmorp@gmail.com */

/**
 * SVG path for drawing an angled tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_ANGLE = 'v 5 l -' + Blockly.BlockSvg.TAB_WIDTH + ',' + 7.5 +
    ' l ' + Blockly.BlockSvg.TAB_WIDTH + ',' + 7.5;

/**
 * SVG path for drawing a round-shaped tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_ROUND = 'v 5 a ' + Blockly.BlockSvg.TAB_WIDTH + ' ' + 7.5 +
    ' 0 0 0 0 ' + 1.75*Blockly.BlockSvg.TAB_WIDTH;

/**
 * SVG path for drawing a brace-shaped tab from top to bottom.
 * @const
 */
/*Blockly.BlockSvg.TAB_PATH_DOWN_BRACE = 'v 2.5 c -5,0 -2,9 -10,10 c 8,1 5,10 10,10'; */
Blockly.BlockSvg.TAB_PATH_DOWN_BRACE = 'v 5 c -' + (0.5*Blockly.BlockSvg.TAB_WIDTH) + ',0' + 
    ' -' + (0.2*Blockly.BlockSvg.TAB_WIDTH) + ',' + (0.9*7.5) +
    ' -' + (0.75*Blockly.BlockSvg.TAB_WIDTH) + ',' + 7.5 +
    ' c ' + (0.55*Blockly.BlockSvg.TAB_WIDTH) + ',' + (0.1*7.5) +
    ' ' + (0.5*0.75*Blockly.BlockSvg.TAB_WIDTH) + ',' + (7.5) +  /* Not sure this is quite symmetric? */
    ' ' + (0.75*Blockly.BlockSvg.TAB_WIDTH) + ',' + (7.5);

/**
 * SVG path for drawing an arrow-shaped tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_ARROW = 'v 5 h -3 v -3 l -3 7 l 3 7 v -3 h 3 v 5';

/* Define new getConnector function.
   Determine shape based on connector type.
*/
Blockly.BlockSvg.getConnectorPath = function(connector) {
  alert( "Warning: obsolete shaped-connector.js getConnectorPath called!" );
  var typeArray = connector.check_;
  if( typeArray && typeArray.length == 1 ) {
    switch( typeArray[0] ) {
      case "Number": return( Blockly.BlockSvg.TAB_PATH_DOWN_ROUND );
      case "Boolean": return( Blockly.BlockSvg.TAB_PATH_DOWN_ANGLE );
      case "Set": return( Blockly.BlockSvg.TAB_PATH_DOWN_BRACE );
      case "Vector": return( Blockly.BlockSvg.TAB_PATH_DOWN_ARROW );
      default: return( Blockly.BlockSvg.TAB_PATH_DOWN_PUZZLE );
    }
  } else {
    return( Blockly.BlockSvg.TAB_PATH_DOWN_PUZZLE );
  }
}
