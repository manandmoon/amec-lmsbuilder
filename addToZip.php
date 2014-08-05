<?php 

	$zip = new ZipArchive;
	if ($zip->open('assets-package.zip', ZIPARCHIVE::CREATE)) {
		if ($_POST["infoExists"]) {
	    	$zip->addFile('videos/infoArrayDataFile.json', 'infoArrayDataFile.json');
	    }
	    if ($_POST["questionExists"]) {
	    	$zip->addFile('videos/questionDataFile.json', 'questionDataFile.json');
	    }
	    if ($_POST["generalExists"]) {
	    	$zip->addFile('videos/generalDataFile.json', 'generalDataFile.json');
	    }
	    if (file_exists("videos/video-presentation.mp4")) {
	    	$zip->addFile('videos/video-presentation.mp4', 'video-presentation.mp4');
	    }
	    if (file_exists("videos/logo.gif")) {
	    	$zip->addFile('videos/logo.gif', 'logo.gif');
	    }
	    $zip->close();
	    echo 'Files added to zip';
	} else {
	    echo 'Files could not be added to zip';
	}
  ?>