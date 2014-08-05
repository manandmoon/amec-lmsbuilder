angular.module('templates-app', ['video/templates/header.tpl.html', 'video/templates/moreinfo.tpl.html', 'video/templates/overlay.tpl.html', 'video/templates/questions.tpl.html', 'video/templates/video.tpl.html', 'video/templates/videoplayer.tpl.html']);

angular.module("video/templates/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/header.tpl.html",
    "<header ng-show=\"isShown()\" ng-init=\"true\">\n" +
    "  <img class=\"logo\" src=\"assets/{{generalSettings.logo}}\"/>\n" +
    "  <h1>{{generalSettings.name}} - {{generalSettings.title}}</h1>\n" +
    "  <a class=\"back\" href=\"#\" ng-click=\"closeHeader()\">&times;</a>\n" +
    "  <div class=\"progress\" style=\"width: {{progressWidth()}};\"></div>\n" +
    "</header>");
}]);

angular.module("video/templates/moreinfo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/moreinfo.tpl.html",
    "<section id=\"more-info\" ng-init=\"moreinfoControl.moreinfoArray\">\n" +
    "	<div class=\"info-box\" ng-repeat=\"moreinfoContent in moreinfoControl.moreinfoArray\" ng-show=\"isShown({{$index}})\">\n" +
    "		 <p ng-bind-html=\"moreinfoContent.text | to_trusted\"></p>\n" +
    "	</div>\n" +
    "</section>");
}]);

angular.module("video/templates/overlay.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/overlay.tpl.html",
    "<div class=\"overlays\" ng-init=\"true\">\n" +
    "    <div class=\"rewatch\" ng-animate=\"'animate'\" ng-show=\"isShown('rewatch')\">\n" +
    "      <div class=\"action \">\n" +
    "        Rewatch Section\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"play\" ng-show=\"isShown('begin')\">\n" +
    "      <div class=\"action green\" ng-click=\"toggleVideoStart()\">\n" +
    "        Begin\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"info nobg\" ng-show=\"isShown('more')\">\n" +
    "      <div class=\"action small\" ng-click=\"showMoreInfoClick()\">\n" +
    "        {{backButtonText}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"section-end nobg\" ng-show=\"isShown('sectionquestions')\">\n" +
    "      <div class=\"center\">\n" +
    "        Section Questions\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>");
}]);

angular.module("video/templates/questions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/questions.tpl.html",
    "<section id=\"content\" ng-init=\"true\">\n" +
    "\n" +
    "		\n" +
    "			<div class=\"quiz\" ng-repeat=\"quiz in questionsControl.questionArray\" ng-init=\"true\" ng-show=\"isShownParent($index)\">\n" +
    "\n" +
    "				<h2>{{quiz.title}}</h2>\n" +
    "					<div class=\"row question\" ng-repeat=\"question in quiz.questions\" ng-init=\"true\" ng-show=\"isShown($index)\">\n" +
    "						<form name=\"{{quiz.name}}\">\n" +
    "							<div class=\"half\">{{question.question}}</div>\n" +
    "							<div class=\"half last\" ng-switch=\"\" on=\"question.type\">\n" +
    "								<input ng-switch-when=\"text\" ng-model=\"question.model\" name=\"{{question.model + $index}}\" id=\"{{question.model + $index}}\" type=\"text\">\n" +
    "								<div class=\"checkboxes\" ng-switch-when=\"checkbox\">\n" +
    "									<div ng-repeat=\"checkValue in question.listValues\">\n" +
    "										<input checklist-model=\"question.model\" id=\"checkbox-{{question.model}}{{$parent.$index}}{{$index}}\" type=\"checkbox\" checklist-value=\"{{checkValue.value}}\" ng-checked=\"selection.indexOf(checkValue.value) > -1\" ng-click=\"toggleCheckbox(question.model, checkValue.value)\" >  \n" +
    "								    	<label for=\"checkbox-{{question.model}}{{$parent.$index}}{{$index}}\" class=\"checklabel\">{{checkValue.value}}</label>\n" +
    "							   		</div>\n" +
    "								</div>\n" +
    "								<div class=\"radiobuttons\" ng-switch-when=\"radio\">\n" +
    "									<div ng-repeat=\"radioValue in question.listValues\">\n" +
    "										<input type=\"radio\" name=\"radio-{{question.model}}{{$parent.$index}}\" ng-click=\"toggleRadio(question.model, radioValue.value)\" value=\"{{radioValue.value}}\">{{radioValue.value}}\n" +
    "									</div>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<button type=\"submit\" ng-click=\"checkAnswer(question.model, $parent.$index, $index, question.type)\" class=\"{{questionsControl.submitState}}\">{{questionsControl.submitText}}</button>\n" +
    "							<div class=\"correction\" ng-show=\"showCorrection()\">{{questionsControl.correctionText}}</div>\n" +
    "							<div class=\"clear\"></div>\n" +
    "						</form>\n" +
    "					</div>\n" +
    "				<div class=\"clear\"></div>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"video-complete\" ng-show=\"showVideoComplete()\">\n" +
    "				<h2>Module Complete</h2>\n" +
    "				<div class=\"the-end-box\">\n" +
    "					You have now completed the module. Please continue to be returned to the LMS<br/>\n" +
    "					<a class=\"continueButton\">\n" +
    "						Continue\n" +
    "					</a>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "\n" +
    "		</section>\n" +
    "		<div class=\"\">\n" +
    "		<div class=\"center\">\n" +
    "			\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	</article>");
}]);

angular.module("video/templates/video.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/video.tpl.html",
    "<div headersection></div>\n" +
    "\n" +
    "<section id=\"player\" class=\"overlay\">\n" +
    "  <div overlay></div>\n" +
    "  <div uivideo control=\"uivideoControl\"></div>\n" +
    "</section>\n" +
    "\n" +
    "<div moreinfo></div>\n" +
    "<div questions></div>\n" +
    "");
}]);

angular.module("video/templates/videoplayer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("video/templates/videoplayer.tpl.html",
    "<!-- <video id=\"mainplayer\" class=\"video-js vjs-default-skin {{videoControl.videoId}}\" preload=\"auto\" ng-click=\"toggleVideoState()\">\n" +
    "	<source  type=\"video/mp4\" src=\"{{videoControl.videoSrc}}\" />\n" +
    "		Your browser does not support the video tag.\n" +
    "</video> -->\n" +
    "\n" +
    "<!-- \"Video For Everybody\" http://camendesign.com/code/video_for_everybody -->\n" +
    "<video id=\"mainplayer\" class=\"video-js vjs-default-skin {{videoControl.videoId}}\" preload=\"auto\" ng-click=\"toggleVideoState()\">\n" +
    "	<source  type=\"video/mp4\" src=\"{{videoControl.videoSrc}}\" />\n" +
    "	<object type=\"application/x-shockwave-flash\" data=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\" width=\"640\" height=\"360\">\n" +
    "		<param name=\"movie\" value=\"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf\" />\n" +
    "		<param name=\"allowFullScreen\" value=\"true\" />\n" +
    "		<param name=\"wmode\" value=\"transparent\" />\n" +
    "		<param name=\"flashVars\" value=\"config={'playlist':['http%3A%2F%2Fsandbox.thewikies.com%2Fvfe-generator%2Fimages%2Fbig-buck-bunny_poster.jpg',{'url':'{{videoControl.videoSrc}}','autoPlay':false}]}\" />\n" +
    "		<img alt=\"Big Buck Bunny\" src=\"http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg\" width=\"640\" height=\"360\" title=\"No video playback capabilities, please download the video below\" />\n" +
    "	</object>\n" +
    "</video>");
}]);
