/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ngBoilerplate.services', [])
	/*.value('version', '0.1');*/
	// Define a simple audio service 
  .factory('generalsettings', function() {
    return {
      name: "AMEC",
      title: "Tax",
      logo: "logo.gif",
      showHeader: true
    };
  }).factory('videochanges', function() {
    return {
        isStarted: false,
        isPaused: true,
        isEnded: false,
        currentTime: 0,
        duration: 0,
        overlayArray: {
          "begin": true,
          "rewatch": false,
          "more": false,
          "sectionquestions": false
        },
        startVideo: function() {
          this.isStarted = true;
        },
        endVideo: function() {
          this.isEnded = true;
        },
        togglePauseState: function(pauseState) {
          this.isPaused = pauseState;
        },
        toggleOverlay: function(overlayName, overlayState) {
          this.overlayArray[overlayName] = overlayState;
        },
        setDuration: function(duration) {
          this.duration = duration;
        }
    };
  }).factory('moreinfochanges', function($http) {
      return{ 
        currentInfo: 0,
        currentShow: false,
        showClicked: false,
        moreinfoArray: infoArrayDataFile
      };
  }).factory('questionchanges', function() {
    return questionDataFile;
  }).factory('globalfunctions', function() {
    return {
    };
  });


  /*
  currentQuiz: 0,
      currentQuestion: 0,
      currentShow: false,
      nextQuiz: false,
      finishTime: 303.5,
      questionArray: [
        {
          title: "Exercise 1",
          name: "quiz1",
          times: {start: 0, finish: 209},
          type: "text",
          questions: [
          {
              model: "Question 1",
              question: "Picture a high level project plan laid out in a timeline with the main objectives and desired completion dates detailed out.  What type of strategic thinking principle should be applied so that the finer details of each objective can be defined in an actionable and accurate way?",
              answers: {1:"right to left",2:"right-to-left"},
              collection: true,
              explanation: "",
              correction: "In what order should you plan for each objective if you want to ensure that you don't have to re-plan each objective due to any objective interdependencies? (Think directionality)",
              type: "text",
              time: 137
            },
            {
              model: "Question 2",
              question: "What aspect of the Level 1 Schedule are you, as a Lead, responsible for delivering to?",
              answers: {1:"milestones",2:"major milestones",3:"control milestones", 4:"milestone"},
              collection: false,
              explanation: "The control milestones established in Level 1 are representations of the major commitments of the project and therefore you are responsible for making sure they are met.",
              correction: "Recall from the initial project planning that Engineering, Supply Chain, and Construction identified their responsibilities and used this to form a set of information to establish the Level 1 schedule.  What are the individual points in the Level 1 schedule called?",
              type: "text",
              time: 69
            },
            {
              model: "Question 3",
              question: "Choose the 3 examples of major/control milestones.",
              listValues: [{value: "start and finish of project phase"}, {value: "engineering work package complete"}, {value: "funding points"}, {value: "regulatory events"}, {value: "P&IDs IFD"}],
              answers: {1:"start and finish of project phase",2:"funding points",3:"regulatory events"},
              collection: true,
              explanation: "The major milestones include a defined set of information with a common theme from each participating group -- start and finish of project phases, funding points, and regulatory events.",
              correction: "",
              type: "checkbox",
              time: 66
            }
          ]
        },
        {
          title: "Exercise 2",
          name: "quiz2",
          times: {start: 175, finish: 302},
          type: "text",
          questions: [
            {
              model: "Question 1",
              question: "You attended an alignment session. Name one of the three groups that joined you?",
              answers: {1:"procurement",2:"construction",3:"commissioning"},
              collection: true,
              explanation: "",
              correction: "",
              type: "text"
            },
            {
              model: "Question 2",
              question: "Name another of the three groups that joined you?",
              answers: {1:"procurement",2:"construction",3:"commissioning"},
              collection: true,
              explanation: "",
              correction: "",
              type: "text"
            },
            {
              model: "Question 3",
              question: "Name the last of the three groups that joined you?",
              answers: {1:"procurement",2:"construction",3:"commissioning"},
              collection: true,
              explanation: "The engineering group met with the procurement, construction, and commissioning group to discuss the project and align their strategies.",
              correction: "As discussed in the initial planning stage an alignment session may be necessary.  Alignment is needed between different parties in order to coordinate plans and therefore it is important to recognise and internalise the existence of the Procurement, Construction, and Commissioning groups.",
              type: "text"
            },
            {
              model: "Question 4",
              question: "What are the five areas in which those groups contribute to the level 2 schedule details?",
              listValues: [{value: "work packages"}, {value: "contracts awarded"}, {value: "purchase orders awarded"}, {value: "major deliverables"}, {value: "start and completion dates"}, {value: "P&IDs IFD"}],
              answers: {1:"work packages",2:"contracts awarded",3:"purchase orders awarded", 5:"major deliverables",6:"start and completion dates"},
              collection: false,
              explanation: "That's right, detail we've developed in the Level 1 Schedule, which ultimately came from our Initial Planning, needs to be broken down to a finer detail of how the control milestones will be met.  The work packages, contracts and purchase orders being awarded, major deliverables, and start/completion dates are sufficiently high level in detail but are apparent and fall out of the Level 1 detail.",
              correction: "Level 1 milestones and their resulting schedule, derived from the Initial Planning stage, break down into discrete contributions to the Level 2 schedule.",
              type: "checkbox",
              time: 225
            },
            {
              model: "Question 5",
              question: "How many of those 5 areas do you also contribute to?",
              answers: {1:"5",2:"five"},
              collection: false,
              explanation: "The schedule is a collaborative effort between the various groups and therefore you all have the same responsibility for contributing to its development.",
              correction: "secondary content forced on schedule development diagram",
              type: "text"
            },
            {
              model: "Question 6",
              question: "When are you establishing milestones that need approval to change?",
              listValues: [{value: "Level 1"}, {value: "Level 2"}],
              answers: {1:"Level 1"},
              collection: false,
              explanation: "The control milestones established in Level 1 must use control and trending processes to change.  However, the key milestones in Level 2 are elaborated details on meeting Level 1 milestones and therefore don't need control and trending processes to change.",
              correction: "The control milestones established in Level 1 must use control and trending processes to change.  However, the key milestones in Level 2 are elaborated details on meeting Level 1 milestones and therefore don't need control and trending processes to change.",
              type: "radio",
              time: 225
            }
          ]
        }
      ]*/

  /*
  {
          title: "Exercise 1",
          name: "quiz1",
          times: {start: 0, finish: 10},
          type: "text",
          questions: [
            {
              model: "Question 1",
              question: "If you're a member of Central Working, what is something you should expect and strive to do with other members and staff?",
              answers: {1:"Network",2:"Talk",3:"Interact"},
              correction: "Nothing yet",
              type: "text"
            },
            {
              model: "Question 2",
              question: "Is there a defined scope of what the staff will and won't help you with?",
              listValues: [{value: "Yes"}, {value: "No"}],
              answers: {1:"Yes"},
              correction: "Nothing yet",
              type: "radio"
            },
            {
              model: "Question 3",
              question: "What parts of London already have clubs and which are getting more clubs (East, West, etc.)?",
              listValues: [{value: "North"}, {value: "South"}, {value: "East"}, {value: "West"}, {value: "Central"}],
              answers: {1:"North", 2: "East", 3: "West", 4: "Central"},
              correction: "Nothing yet",
              type: "checkbox"
            }
          ]
        }
        */







