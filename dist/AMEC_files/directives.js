/* Directives */
angular.module('ngBoilerplate.directives', [])
//This injects the factories so they are able to be directly manipulated within the scope of the directive
.directive('headersection', ['videochanges', 'generalsettings',
    function (videochanges, generalsettings) {
        return {
            //Resticts element name in view to exact name of directive e.g. <headersection></headersection>
            restrict: 'A',
            //Location of template view for this directive
            templateUrl: 'video/templates/header.tpl.html',
            //Can change the way other directives are able to interact with the scope of this directive
            scope: {
                control: '='
            },
            //Link acts as a function base for all internal changes to the view
            link: function (scope, element, attrs) {
                //Assigns values to the scope so they are usable wthin the view
                scope.api = videochanges;
                scope.generalSettings = generalsettings;

                //function which can be called from the view
                scope.closeHeader = function () {
                    scope.generalSettings.showHeader = false;
                };

                //function which checks if an element is shown in the view
                scope.isShown = function () {
                    if (scope.api.isPaused && scope.generalSettings.showHeader) {
                        return true;
                    } else {
                        return false;
                    }
                };

                //function which updates progress bar in view
                scope.progressWidth = function () {
                    return (scope.api.currentTime / scope.api.duration * 100) + '%';
                };
            },
            //Controller acts as all external changes to the view
            controller: function ($scope, $element) {
                $scope.api = videochanges;
                $scope.generalSettings = generalsettings;

                //checks if factory videochanges has the isPaused value updated and shows header depending
                $scope.$watch('api.isPaused', function () {
                    $scope.generalSettings.showHeader = true;
                });
            }
        };
    }
//Video Player directive
]).directive('uivideo', ['videochanges', 'moreinfochanges', 'questionchanges',
    function (videochanges, moreinfochanges, questionchanges) {
        //One time defined variables
        var videoId = "video-" + Math.floor((Math.random() * 1000) + 100);
        var videoSrc = "assets/AMEC-1.mp4";
        return {
            restrict: 'A',
            templateUrl: 'video/templates/videoplayer.tpl.html',
            scope: {
                control: '='
            },
            link: function (scope, element, attrs) {
                //Initial Video Variable settings
                var videoElement = element.children("#mainplayer")[0];
                scope.api = videochanges;
                scope.moreInfoArray = moreinfochanges.moreinfoArray;
                scope.videoControl = scope.control || {};
                scope.videoControl.videoId = videoId;
                scope.videoControl.videoSrc = videoSrc;

                //Toggles play/pause state of video
                scope.toggleVideoState = function () {
                    if (scope.api.isPaused && !moreinfochanges.showClicked) {
                        scope.api.togglePauseState(false);
                    } else {
                        scope.api.togglePauseState(true);
                    }
                };

            },
            controller: function ($scope, $element) {
                //Define video element and popcornjs
                var videoElement = $element.children("#mainplayer")[0];
                var pop = new Popcorn(videoElement);

                $scope.api = videochanges;
                $scope.moreInfoArray = moreinfochanges.moreinfoArray;
                $scope.questionsArray = questionchanges.questionArray;

                //Watches for variable value change and pause/plays video
                $scope.$watch('api.isPaused', toggleVideoPlay);
 
                function toggleVideoPlay() {
                    if ($scope.api.isPaused === false && !$scope.api.isEnded) {
                        pop.currentTime($scope.api.currentTime);
                        videoElement.play();
                    } else {
                        videoElement.pause();
                    }
                }

                //Event listener for playing of video
                pop.listen("timeupdate", function () {
                    var current = this.roundTime();
                    var duration = this.duration();
                    currentTime = current;
                    $scope.api.currentTime = currentTime;
                    $scope.api.setDuration(duration);

                    //infoboxes
                    if (moreinfochanges.currentInfo < $scope.moreInfoArray.length) {
                        //Show
                        if (currentTime > $scope.moreInfoArray[moreinfochanges.currentInfo].times.start && currentTime < $scope.moreInfoArray[moreinfochanges.currentInfo].times.finish) {
                            moreinfochanges.currentShow = true;
                        } else if (currentTime > $scope.moreInfoArray[moreinfochanges.currentInfo].times.finish) {
                        //Hide
                            moreinfochanges.currentInfo++;
                            moreinfochanges.currentShow = false;
                        }
                    }

                    //questions show/hide
                    if (questionchanges.currentQuiz < $scope.questionsArray.length) {
                        if (currentTime > $scope.questionsArray[questionchanges.currentQuiz].times.finish) {
                            questionchanges.currentShow = true;
                            $scope.api.toggleOverlay("sectionquestions",true);
                            $scope.api.togglePauseState(true);
                        }
                    }

                    if (currentTime >= questionchanges.finishTime) {
                        $scope.api.endVideo();
                        $scope.api.togglePauseState(true);
                    }
                    $scope.$apply();
                });
            }
        };
    }
//Overlays directive
]).directive('overlay', ['videochanges', 'moreinfochanges',
    function (videochanges, moreinfochanges) {
        return {
            restrict: 'A',
            templateUrl: 'video/templates/overlay.tpl.html',
            scope: {
                control: '='
            },
            link: function (scope, element, attrs) {
                scope.api = videochanges;
                scope.overlayControl = scope.control || {};
                scope.backButtonText = "More";

                scope.toggleVideoStart = function () {
                    scope.api.startVideo();
                    scope.api.togglePauseState(false);
                };

                scope.togglePauseState = function (pauseState) {
                    scope.api.togglePauseState(pauseState);
                };

                scope.setMoreStatus = function (status) {
                    scope.api.togglePauseState(!status);
                    moreinfochanges.showClicked = !status;
                    if (status) {
                        scope.backButtonText = "More";
                    } else {
                        scope.backButtonText = "Continue";
                    }
                };

                scope.showMoreInfoClick = function () {
                    if (moreinfochanges.showClicked) {
                        scope.setMoreStatus(true);
                    } else {
                        scope.setMoreStatus(false);
                    }
                };

                scope.isShown = function (elementName) {
                    return scope.api.overlayArray[elementName];
                };

            },
            controller: function ($scope, $element) {
                $scope.api = videochanges;

                $scope.$watch('api.isStarted', beginButtonState);

                function beginButtonState() {
                    if ($scope.api.isStarted) {
                        $scope.api.toggleOverlay("begin",false);
                    }
                }
            }
        };
    }
//More Info directive
]).directive('moreinfo', ['videochanges', 'moreinfochanges',
    function (videochanges, moreinfochanges) {
        return {
            restrict: 'A',
            templateUrl: 'video/templates/moreinfo.tpl.html',
            scope: {
                control: '='
            },
            link: function (scope, element, attrs) {
                scope.api = videochanges;
                scope.moreInfoArray = moreinfochanges.moreinfoArray;
                scope.moreinfoControl = scope.control || {};

                scope.moreinfoControl.moreinfoArray = scope.moreInfoArray;

                var currentElementNum = "";

                scope.isShown = function (elementNum) {
                    var videoElement = "";
                    var infoActive = moreinfochanges.currentInfo === elementNum && moreinfochanges.currentShow;
                    if (infoActive) {
                        currentElementNum = elementNum;
                        scope.api.toggleOverlay("more",true);
                    }
                    if (infoActive && moreinfochanges.showClicked) {
                        setTimeout(function() {
                            window.scrollTo(0,document.body.scrollHeight);
                        }, 100);
                       
                        videoElement = element.children("#more-info").children().eq(elementNum).children("video").children()[0];
                        if (videoElement !== undefined) {
                            if (videoElement.nodeName === "VIDEO") {
                                videoElement.play();
                            }
                        }
                        return true;
                    } else {
                        if (!moreinfochanges.currentShow) {
                            scope.api.toggleOverlay("more",false);
                        }
                        videoElement = element.children("#more-info").children().eq(elementNum).children("video").children()[0];
                        if (videoElement !== undefined) {
                            if (videoElement.nodeName === "VIDEO") {
                                videoElement.pause();
                            }
                        }
                        return false;
                    }
                };

            },
            controller: function ($scope, $element) {
            }
        };
    }
//Question directive
]).directive('questions', ['videochanges', 'questionchanges',
    function (videochanges, questionchanges) {
        return {
            restrict: 'A',
            templateUrl: 'video/templates/questions.tpl.html',
            scope: {
                control: '='
            },
            link: function (scope, element, attrs) {
                scope.api = videochanges;
                scope.questionsControl = scope.control || {};
                scope.questionsControl.questionArray = questionchanges.questionArray;

                scope.question = questionchanges;

                scope.questionsControl.submitText = "Check Answer";
                scope.questionsControl.submitState = "submit";
                scope.questionsControl.correctionText = "";

                scope.questionsControl.incorrectCount = 0;

                scope.changeSubmitState = function (submitType) {
                    if (submitType == "correct") {
                        scope.questionsControl.correctionText = scope.questionsControl.questionArray[questionchanges.currentQuiz]["questions"][questionchanges.currentQuestion]["explanation"];
                        scope.questionsControl.submitText = "Correct - Next Question";
                    } else if (submitType == "incorrect") {
                        scope.questionsControl.correctionText = scope.questionsControl.questionArray[questionchanges.currentQuiz]["questions"][questionchanges.currentQuestion]["correction"];
                        if (scope.questionsControl.correctionText === "" || scope.questionsControl.incorrectCount !== 0) {
                            scope.questionsControl.submitText = "Incorrect - Rewatch";
                        } else {
                            scope.questionsControl.submitText = "Incorrect - Try again";
                            submitType = "incorrect-try-again";
                            scope.questionsControl.incorrectCount = 1;
                        }
                    } else {
                        scope.questionsControl.submitText = "Check Answer";
                        scope.questionsControl.correctionText = "";
                    }
                    scope.questionsControl.submitState = submitType;
                };

                scope.nextQuestion = function (quizNum, questionNum) {
                    questionchanges.currentQuestion = questionNum;
                    if (questionchanges.currentQuiz != quizNum) {
                        questionchanges.currentQuiz = quizNum;
                        questionchanges.currentShow = false;
                        scope.api.toggleOverlay("sectionquestions",false);
                        /*if (quizNum === scope.questionsControl.questionArray.length) {
                            scope.api.endVideo();
                            scope.api.currentTime = 215;
                        }*/
                    }
                };

                scope.selection = [];
                scope.selection['checkbox'] = [];
                scope.selection['radio'] = [];
                scope.textCollection = [];

                scope.proceedQuestion = function(questionArray, quizNum, questionNum) {
                    scope.changeSubmitState("submit");
                    if (questionNum + 1 === questionArray.questions.length) {
                        questionNum = 0;
                        scope.nextQuestion(quizNum + 1, questionNum);
                    } else {
                        scope.nextQuestion(quizNum, questionNum + 1);
                    }
                };

                scope.checkAnswer = function (submittedAnswer, quizNum, questionNum, questionType) {
                    var questionArray = scope.questionsControl.questionArray[quizNum];
                    var questionData = questionArray.questions[questionNum];
                    if (scope.questionsControl.submitState === "submit" || scope.questionsControl.submitState === "incorrect-try-again") {
                        var elementAnswer = questionData.answers;
                        var correctAnswer = false;
                        if (questionData.collection === false) {
                            scope.textCollection.length = 0;
                        }
                        if (questionType == "text") {
                            if (scope.textCollection.indexOf(submittedAnswer) === -1) {
                                angular.forEach(elementAnswer, function (value, key) {
                                    if (!correctAnswer) {
                                        if (value.toLowerCase() === submittedAnswer.toLowerCase()) {
                                            correctAnswer = true;
                                            scope.textCollection.push(value.toLowerCase());
                                        }
                                    }
                                });
                            } else {
                                correctAnswer = false;
                            }
                        } else if (questionType == "checkbox") {
                            var checkAnswer = true;
                            var checkboxSelectionArray = scope.selection['checkbox'];
                            var checkCount = 0;
                            if (!(submittedAnswer in checkboxSelectionArray)) {
                                checkboxSelectionArray[submittedAnswer] = [];
                            }
                            angular.forEach(checkboxSelectionArray[submittedAnswer], function (compareValue, compareKey) {
                                if (checkAnswer === true) {
                                    correctAnswer = false;
                                    angular.forEach(elementAnswer, function (value, key) {
                                        if (compareValue == value) {
                                            correctAnswer = true;
                                            checkCount++;
                                        }
                                    });
                                    if (correctAnswer === false) {
                                        checkAnswer = false;
                                    }
                                }
                            });
                            //Check count is the same
                            var answerCount = 0;
                            angular.forEach(elementAnswer, function () {
                                answerCount++;
                            });
                            if (checkCount != answerCount) {
                                correctAnswer = false;
                            }
                        } else if (questionType == "radio") {
                            var radioSelectionArray = scope.selection['radio'];
                            angular.forEach(elementAnswer, function (value, key) {
                                if (!correctAnswer) {
                                    if (value.toLowerCase() === radioSelectionArray[submittedAnswer].toLowerCase()) {
                                        correctAnswer = true;
                                    }
                                }
                            });
                        }

                        if (correctAnswer) {
                            scope.changeSubmitState("correct");
                        } else {
                            scope.changeSubmitState("incorrect");
                        }
                    } else if (scope.questionsControl.submitState === "correct") {
                       scope.proceedQuestion(questionArray, quizNum, questionNum);
                    } else if (scope.questionsControl.submitState === "incorrect") {
                        scope.changeSubmitState("submit");
                        if (questionData.time !== undefined) {
                            scope.api.currentTime = questionData.time;
                        } else {
                            scope.api.currentTime = questionArray.times.start;
                        }
                        questionchanges.currentShow = false;
                        scope.api.toggleOverlay("sectionquestions",false);
                        scope.api.togglePauseState(false);
                    }
                };

                scope.toggleCheckbox = function (checkModel, answerSelected) {

                    if (!(checkModel in scope.selection['checkbox'])) {
                        scope.selection['checkbox'][checkModel] = [];
                    }

                    var selectedItem = scope.selection['checkbox'][checkModel].indexOf(answerSelected);

                    if (selectedItem > -1) {
                        var index =  scope.selection['checkbox'][checkModel].indexOf(answerSelected);
                        scope.selection['checkbox'][checkModel].splice(index, 1);
                    } else {
                        scope.selection['checkbox'][checkModel].push(answerSelected);
                    }
                };

                scope.toggleRadio = function (checkModel, answerSelected) {
                    if (!(checkModel in scope.selection['radio'])) {
                        scope.selection['radio'][checkModel] = "";
                    }
                    scope.selection['radio'][checkModel] = answerSelected;
                };

                scope.isShown = function (elementNum) {
                    if (questionchanges.currentQuestion === elementNum && questionchanges.currentShow && scope.api.isPaused) {
                        return true;
                    } else {
                        return false;
                    }
                };

                scope.isShownParent = function (elementNum) {
                    if (questionchanges.currentQuiz === elementNum && questionchanges.currentShow && scope.api.isPaused) {
                        return true;
                    } else {
                        return false;
                    }
                };

                scope.showVideoComplete = function () {
                    return scope.api.isEnded;
                };

                scope.showCorrection = function() {
                    if (scope.questionsControl.correctionText !== "") {
                        return true;
                    } else {
                        return false;
                    }
                };

            },
            controller: function ($scope, $element) {
                $scope.api = videochanges;
                $scope.$watch('question.currentQuiz', function () {
                    if ($scope.api.isStarted) {
                        $scope.api.togglePauseState(false);
                    }
                });
            }
        };
    }
]);