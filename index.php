<!doctype html>
<html>
<head>
  <title>Form Builder</title>
  <meta name="description" content="">
  <link rel="stylesheet" href="vendor/css/vendor.css" />
  <link rel="stylesheet" href="dist/formbuilder.css" />
  <link rel="stylesheet" href="dist/redactor/redactor.css" />
  <script src="http://code.jquery.com/jquery-latest.min.js"
        type="text/javascript"></script>
  <style>
  * {
    box-sizing: border-box;
  }

  body {
    background-color: #444;
    font-family: sans-serif;
  }

  .fb-main,
  .video-player,
  .video-upload {
    background-color: #fff;
    border-radius: 5px;
  }

  video {
    width: 100%;
    height: auto;
  }

  .fb-main {
    min-height: 600px;
    padding-bottom: 50px;
  }

  .video-player,
  .video-upload {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0;
    position: relative;
    font-family: 'Source Sans Pro','Open Sans',Tahoma;
  }

  .video-upload input[type="file"] {
    width: 200px;
  }

  .video-upload {
    max-width: 1000px;
    padding: 10px;
    border: 1px solid #333;
  }

  input[type=button] {
    cursor: pointer;
  }

  input[type=text] {
    height: 26px;
    margin-bottom: 3px;
  }

  .element-title {
    padding: 10px 10px;
  }

  .response-field-text,
  .response-field-checkboxes,
  .response-field-radio {
    margin-left: 25px;
  }

  select {
    margin-bottom: 5px;
    font-size: 40px;
  }
  </style>
</head>
<body>
  <div class="video-player">
    <?php
      // In PHP versions earlier than 4.1.0, $HTTP_POST_FILES should be used instead
      // of $_FILES.
    ini_set('display_errors',1);
    error_reporting(E_ALL);
      if (count($_FILES) > 0) {
        $uploaddir = 'videos/';
        $uploadfile = $uploaddir . "video-presentation.mp4";
        if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) { 
        ?>
        <video id="mainplayer" controls>
        <source  type="video/mp4" src="videos/<?php echo $_FILES['userfile']['name']; ?>" />
        </video>
        <?php } else {
          echo 'There was a problem uploading your video.';
        }
      } else {
          echo 'Upload your video.';
      }
      ?>
  </div>
  <div class="video-upload">
    <form enctype="multipart/form-data" action="" method="POST">
      <!-- Name of input element determines name in $_FILES array -->
      Upload Video: <input name="userfile" type="file" />
      <input type="submit" value="Send File" /> <span>(Note that anytime you upload a new video it will wipe your previous form data)</span>
    </form>

  </div>
  <div class='fb-main'></div>

  <script src="vendor/js/vendor.js"></script>
  <script src="dist/formbuilder.js"></script>
  <script src="dist/redactor/redactor.js"></script>
  
  <script>
    var myVid=document.getElementById("mainplayer");

    function setVideoTime(el) {
      $(el).parent().find(".time-field").val(Math.round(myVid.currentTime));
      //return myVid.currentTime;
    }

    $(function(){
      fb = new Formbuilder({
        selector: '.fb-main',
        bootstrapData: [
        ]
      });      
      
      var infoData = "";
      var generalData = "";
      var questionData = "";
      var questions = [];

      Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
      };

      window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
      
      function errorHandler(e) {
        var msg = '';
        switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
          case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
          case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
          case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
          case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
          default:
            msg = 'Unknown Error';
            break;
        };
       console.log(msg);
      }

      function writeToFile(content, fileVariableName){
        var fileContent = content;
        $.ajax({
            url: "writeToFiles.php",
            type: "POST",
            data: { "fileName" : fileVariableName + ".json",
                "content" : JSON.stringify(fileContent) },
            success: function(data, status, jqxhr) {
              alert(jqxhr.responseText);
            }
        });
      }

      function addToZip(infoExists, questionExists, generalExists){
        $.ajax({
            url: "addToZip.php",
            type: "POST",
            data: { "infoExists" : infoExists,
                    "questionExists" : questionExists,
                    "generalExists" : generalExists },
            success: function(data, status, jqxhr) {
              alert(jqxhr.responseText);
            }
        });
      }

      function infoboxHandle(val) {
        var infoBox = {};
        if (val["field_options"]["description"] != undefined) {
          infoBox["text"] = val["field_options"]["description"];
          infoBox["times"] = {};
          infoBox["times"]["start"] = parseInt(val["field_options"]["time"]);
          infoBox["times"]["finish"] = parseInt(val["field_options"]["time"]) + 5;
          infoBox["isShown"] = false;
        } else {
          infoBox["text"] = "";
        }
        return infoBox;
      }

      fb.on('save', function(payload){
        infoData = [];
        generalData = {};
        questionArray = [];
        var data = payload;
        var jsonObj = $.parseJSON('[' + data + ']');
        var questionStart = false;
        var questions = [];
        var exerciseSet = {};
        var questionCount = 1;
        var exerciseCount = 1;
        var question = {};
        var prevQuestionTime = 0;
        questionArray["questions"] = [];
        question["answers"] = {};
        question["listValues"] = [];
        jsonObj = jsonObj[0];
        jsonObj = jsonObj["fields"];

        var questionchanges = {};



        questionchanges["currentQuiz"] = 0;
        questionchanges["currentQuestion"] = 0;
        questionchanges["currentShow"] = 0;
        questionchanges["nextQuiz"] = false;
        questionchanges["finishTime"] = parseInt(myVid.duration) - 1.5;
        questionchanges["questionArray"] = 0;

        //All values being put in same question set and exerciseSet not incrementing LOOK AT!!!!
        
        $.each(jsonObj, function(i, val) {
          question = {};
          question["answers"] = {};
          question["listValues"] = [];
          //end of question set logic
          if (val["field_type"] == "info-box" || val["field_type"] == "questions") {
            if (questionStart) {
              exerciseSet["questions"] = questions;
              questionArray.push(exerciseSet);
              questionStart = false;
              exerciseCount++;
            }
          }



          //General seperate item type logic
          if (val["field_type"] == "general") {
            generalData["name"] = val["label"];
            generalData["videoTime"] = parseInt(myVid.duration);
            if (val["field_options"]["description"] != undefined) {
              generalData["title"] = val["field_options"]["description"];
            } else {
              generalData["title"] = "";
            }
          } else if (val["field_type"] == "info-box") {
            infoData.push(infoboxHandle(val));
          } else if (val["field_type"] == "questions") {
            exerciseSet = {};
            questions = [];
            question["answers"] = {};
            question["listValues"] = [];

            exerciseSet["title"] = "Exercise " + exerciseCount;
            exerciseSet["name"] = "quiz" + exerciseCount;
            exerciseSet["times"] = {start: (prevQuestionTime  + 1), finish: parseInt(val["field_options"]["time"])};
            questionStart = true;
            prevQuestionTime = parseInt(val["field_options"]["time"]);
          } else if (val["field_type"] == "text") {
            question["type"] = "text";
          } else if (val["field_type"] == "radio") {
            question["type"] = "radio";
          } else if (val["field_type"] == "checkboxes") {
            question["type"] = "checkbox";
          }

          if (val["field_type"] == "radio" || val["field_type"] == "checkboxes") {
            if (typeof val["field_options"]["answer"] == 'undefined') {
              question["listValues"].push("");
            } else {
              if (val["field_options"]["answer"].indexOf(",") > -1) {
                for(v in val["field_options"]["options"]) {
                  question["listValues"].push({"value" : val["field_options"]["options"][v]["label"]});
                }
              } else {
                question["listValues"].push(val["field_options"]["options"]["label"]);
              }
            }
          }

          //majority of question logic that is the same
          if (val["field_type"] == "checkboxes" || val["field_type"] == "radio" || val["field_type"] == "text") {
            question["model"] = "Question " + questionCount;
            if (typeof val["field_options"]["answer"] == 'undefined') {
              question["answers"][1] = "";
            } else {
              if (val["field_options"]["answer"].indexOf(",") > -1) {
                var answers = val["field_options"]["answer"].split(',');
                for(q in answers) {
                  question["answers"][(q+1)] = answers[q];
                }
              } else {
                question["answers"][1] = val["field_options"]["answer"];
              }
            }
            question["collection"] = false;
            if (val["field_options"]["explanation"] != undefined) {
              question["explanation"] = val["field_options"]["explanation"];
            } else {
              question["explanation"] = "";
            }
            if (val["field_options"]["correction"] != undefined) {
              question["correction"] = val["field_options"]["correction"];
            } else {
              question["correction"] = "";
            }
            question["description"] = val["field_options"]["description"];
            question["time"] = parseInt(val["field_options"]["revert_time"]);
            questions.push(question);
            questionCount++;
          }
        });
        if (questionStart) {
          exerciseSet["questions"] = questions;
          questionArray.push(exerciseSet);
          questionchanges["questionArray"] = questionArray;
          questionStart = false;
          exerciseCount++;
        }

        var infoExists = false;
        var questionExists = false;
        var generalExists = false;

        if (Object.size(infoData) > 0) {
          writeToFile(infoData, "infoArrayDataFile");
          infoExists = true;
        }
        if (Object.size(questionchanges) > 0) {
          writeToFile(questionchanges, "questionDataFile");
          questionExists = true;
        }
        if (Object.size(generalData) > 0) {
          writeToFile(generalData, "generalDataFile");
          generalExists = true;
        }
        setTimeout(function(){
          addToZip(infoExists, questionExists, generalExists);
        }, 500);
      })
    });
  </script>
  <div class="video-upload">
    Once complete please all files will be copied to a zip file in the home directory called "asset-package.zip" which should be unzipped into the "/assets" folder for the video application.<br/>
    These files copied into the zip should be:
    <ul>
    <li>generalDataFile.json</li>
    <li>questionDataFile.json</li>
    <li>infoArrayDataFile.json</li>
    <li>Your new video file to overwrite "video-presentation.mp4"</li>
    <li>Your new logo to overwrite "logo.gif"</li>
    </ul>
  If anything is missing or a mistake is made the files can be manually copied.
  </div>

</body>
</html>