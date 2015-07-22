var circle;
var inputFlag = 1;
var mouseCoor;
var targetCoor;
var viewportwidth;
var viewportheight;
updateSize();
$(window).off().on('resize', function() {
    updateSize();
});

var sections = [
    {'name': 'round 1',
     'circles': [[0.1, 0.1], [0.1, 0.2], [0.3, 0.4]],
     'radius': 30,
     'isi': 1000,
     'rest': 3,
    },
    {'name': 'round 2',
     'circles': [[0.1, 0.1], [0.1, 0.2], [0.3, 0.4]],
     'radius': 30,
     'isi': 1000,
     'rest': 2,
    },
    {'name': 'download'}
];

function submitMobaForm() {
    $('#btnSubmitMoba').css('display', 'none')
    $('#btnSubmit').css('display', 'block')
    $('#bioForm').css('display', 'block')
    $('#mobaForm').css('display', 'none')
    if ($('#moba').val() == 'League') {
        $('#mmrDesc').text('League MMR (use op.gg to estimate):')
    } else if ($('#moba').val() == 'Dota2') {
        $('#mmrDesc').text('Dota 2 MMR (exact value from profile):')
    } else if ($('#moba').val() == 'CS:GO') {
        $('#mmrDesc').text('CSGO rank:')
    }
}

function submitForm() {
    var email = $('#email').val();
    var age = $('#age').val();
    var gender = $('#gender').val();
    var rank = $('#mmr').val();
    var game = $('#moba').val();
    var data = {
        'game': game,
        'email': email,
        'age': age,
        'gender': gender,
        'rank': rank,
    }
    bio = data;
    $.post('http://ec2-52-25-109-156.us-west-2.compute.amazonaws.com:3000/api/target', {
        'email': bio.email, 
	    'state': 'bio',
        'data': JSON.stringify(data)
    }).done(function(data) {
        $('#required').css('display', 'none');
        $('#btnSubmit').css('display', 'none');
        $('#bioForm').css('display', 'none');
        $('#headertext').css('display', 'none');
        nextButton(sections[taskNum]);
    }).fail(function(data) {
        $('#required').text('Make sure you fill out all form boxes.');
        $('#required').css('display', 'block');
    });
}

var responseData = {};

function addToResponseData(timestamp, state, data) {
    $.post('http://ec2-52-25-109-156.us-west-2.compute.amazonaws.com:3000/api/target', {
        'email': bio.email, 
        'state': state,
        'data': JSON.stringify(data)
    }).done(function(data) {
        console.log('inserted for ' + bio.email);
    });
}

function nextButton(section) {
    $('#btnSections').off().on('click', function() {initialize(section)});
    $('#btnSections').css('display', 'block');
    $('#btnSections').text(section.name);
}

var taskNum = 0;

var circlesClicked = 0;
var totalCircles = 0;
var bpm = 100;
var playback_rate = 1;
var milliseconds_per_beat = 0;
var countdownCount = 3;
var countdownTimer;
var purpleX = 0;
var purpleY = 0;
var purpleTimer;
var averageAccuracy = 0;
var loopTimer;
var trainingEnded = 0;
var responseData = {};

function disableSelection(target) {
    target.attr('unselectable', 'on')
        .css({'-moz-user-select':'-moz-none',
           '-moz-user-select':'none',
           '-o-user-select':'none',
           '-khtml-user-select':'none',
           '-webkit-user-select':'none',
           '-ms-user-select':'none',
           'user-select':'none'
     }).bind('selectstart', function(){ return false; });
}

function updateSize() {
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
        viewportheight = window.innerHeight
    }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
        viewportheight = document.documentElement.clientHeight
    }
    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
}

function initialize(section) {
    var mode = section.name;
    var circles = section.circles;
    var size = 2*section.radius;
    console.log('initialize')
 
	$("#purple").css('height', size+"px");
	$("#purple").css('width', size+"px");
    $('#btnSections').css('display', 'none');
    taskNum++;
    var data = {
        'task mode': mode,
        'combos': circles,
        'size': {viewportheight, viewportwidth}
    };
    addToResponseData((new Date()).getTime().toString(), 'initialize', data);
    circleList = circles.slice(0);
    //circle = circleList.shift();
    showNextCircle(section);
}

function showNextCircle(section) {
    mouseCoor = [];
    targetCoor = [];
    $(document).off().on('mousemove', function(event) {
        mouseCoor.push([(new Date).getTime(), 'move', event.pageX, event.pageY])
    });
    $(document).off().on('click', function(event) {
        mouseCoor.push([(new Date).getTime(), 'click', event.pageX, event.pageY])
    });
    circle = circleList.shift();
    setTimeout(function() {
        if (circle == undefined && circleList.length == 0) {
            endGame(taskNum, section);
        } else {
            inputFlag = 1;
            var cCoor = convertCoors(circle[0], circle[1]);
            var txCoor = cCoor.x,
                tyCoor = cCoor.y;
            targetCoor = [(new Date).getTime(), 'appear', txCoor, tyCoor];
            $(document).off().on('click', function(event) {execute(event, section, circle)});
            $('#purple').css('background-color', '#000000');
            $('#purple').css('display', 'block');
            $("#purple").css('left', txCoor - section.radius + "px");
            $("#purple").css('top', tyCoor - section.radius + "px");
        }
    }, section.isi);
}

function normalizeCoors(xCoor, yCoor) {
    return {x: xCoor / viewportwidth, y: yCoor / viewportheight}
} 

function convertCoors(xCoor, yCoor) {
    return {x: xCoor * viewportwidth, y: yCoor * viewportheight}
}
    
function execute(event, section, circle) {
    var timestamp = (new Date()).getTime().toString();
    var xCoor = event.pageX
    var yCoor = event.pageY
    var cCoor = convertCoors(circle[0], circle[1]);
    var txCoor = cCoor.x,
        tyCoor = cCoor.y;
    if ((xCoor - txCoor)*(xCoor - txCoor) + (yCoor - tyCoor)*(yCoor - tyCoor) <= section.radius*section.radius && inputFlag == 1) {
        $('#purple').css('background-color', '#00FF00');
        inputFlag = 0;
        var data = {
            'mouseCoor': mouseCoor,
            'size': {viewportheight, viewportwidth},
            'target': targetCoor
        }
        console.log('last mouseCoor: ' + mouseCoor[mouseCoor.length - 1])
        addToResponseData(timestamp, 'hit', data);
        showNextCircle(section);
    } else {
        console.log('clicked out circle: ' + xCoor + ', ' +  yCoor)
    }
}

function endGame(nextTask) {
    $(document).off();
    console.log(sections[taskNum].name);
    $('#purple').css('display', 'none');
    if (sections[taskNum].name == 'download') {
        $('#doneInstructions').css('display', 'block');
    } else {
        var myCounter = new Countdown({  
            seconds: sections[taskNum].rest,  // number of seconds to count down
            onUpdateStatus: function(sec){$('#countDown').text(sec + ' seconds until next session.');}, // callback for each second
            onCounterEnd: function() {
                alert('Start next session!');
                $('#countDown').text('');
                nextButton(sections[taskNum]);
            } // final action
        });
        myCounter.start();
    }   
}

function Countdown(options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}

