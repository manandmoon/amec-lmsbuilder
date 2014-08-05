<?php 
	function prettyPrint($json) {

	    $result      = '';
	    $pos         = 0;
	    $strLen      = strlen($json);
	    $indentStr   = '  ';
	    $newLine     = "\n";
	    $prevChar    = '';
	    $outOfQuotes = true;

	    for ($i=0; $i<=$strLen; $i++) {

	        // Grab the next character in the string.
	        $char = substr($json, $i, 1);

	        // Are we inside a quoted string?
	        if ($char == '"' && $prevChar != '\\') {
	            $outOfQuotes = !$outOfQuotes;

	        // If this character is the end of an element,
	        // output a new line and indent the next line.
	        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
	            $result .= $newLine;
	            $pos --;
	            for ($j=0; $j<$pos; $j++) {
	                $result .= $indentStr;
	            }
	        }

	        // Add the character to the result string.
	        $result .= $char;

	        // If the last character was the beginning of an element,
	        // output a new line and indent the next line.
	        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
	            $result .= $newLine;
	            if ($char == '{' || $char == '[') {
	                $pos ++;
	            }

	            for ($j = 0; $j < $pos; $j++) {
	                $result .= $indentStr;
	            }
	        }

	        $prevChar = $char;
	    }

	    return $result;
	}
	ini_set('track_errors', 1);
	$fd = fopen("videos/" . $_POST['fileName'], "wb");
	fwrite($fd, "var " . str_replace(".json", "", $_POST['fileName']) . " = " . prettyPrint($_POST['content']));
	fclose($fd);
	if ($fd) {
		echo $_POST['fileName'] . " Generated";
	} else {
		echo $_POST['fileName'] . " Could not be Generated";
	}
  ?>