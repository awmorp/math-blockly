# Simple template replacement engine
#
# Usage: buildhtml inputfile.html
#
# Replaces any text in inputfile.html between tags <!-- @@ BEGIN file.html @@!--> <!-- @@ END @@!--> with the content of file.html

import sys     # for sys.argv
import shutil  # for shutil.move

# regexp module
import re

beginRE = r'<!--@@\s*BEGIN\s(?P<fname>\S+)\s!-->'   # matches <!--@@ BEGIN filename !-->
endRE = r'<!--@@\s*END\s(\S*\s)?!-->'               # matches <!--@@ END !--> or <!--@@ END filename !-->

filename = sys.argv[1]

inputFile = open( filename, "r" )
outputFile = open( filename + ".tmp", "w" )

def output(str):
  outputFile.write(str)

STATE_NORMAL = 0
STATE_INCLUDING = 1
state = STATE_NORMAL

for line in inputFile:
  if state == STATE_NORMAL:
    matchResult = re.search( beginRE, line )
    if matchResult:
      output( line[0:matchResult.end()] + "\n" ) # Output to end of <!--@@ ... !-->
      includeFileName = matchResult.group( "fname" )
      includeFile = open( includeFileName, "r" )
      for line2 in includeFile:
        output(line2)
  #    print "MATCH: file '" + includeFile + "'"
      includeFile.close()
      state = STATE_INCLUDING
    else:
      output( line )
  elif state == STATE_INCLUDING:
    matchResult = re.search( endRE, line )
    if matchResult:
      output( "\n" + line[matchResult.start():] ) # Output from start of <!--@@ ... !-->
      state = STATE_NORMAL

inputFile.close()
outputFile.close()
shutil.move( filename, filename + ".bak" )
shutil.move( filename + ".tmp", filename )
