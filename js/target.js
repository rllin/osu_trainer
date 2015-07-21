var circle;
var inputFlag = 1;
var mouseCoor;
var viewportwidth;
var viewportheight;
updateSize();
$(window).on('resize', function() {
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
        'age': bio.age,
        'gender': bio.gender,
        'rank': bio.rank,
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
        'age': bio.age,
        'gender': bio.gender,
        'rank': bio.rank,
        'state': state,
        'data': JSON.stringify(data)
    }).done(function(data) {
        console.log('inserted for ' + bio.email);
    });
}

function nextButton(section) {
    $('#btnSections').off();
    $('#btnSections').on('click', function() {initialize(section)});
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

function calculate() {
	var playbackRate = $('#playback').val();
	var bpm_new = 100*playbackRate;
	var beats_per_second = bpm_new/60;
	milliseconds_per_beat = 1000/beats_per_second;
    console.log(milliseconds_per_beat)
	$("#bpm").value = Math.ceil(bpm_new*100)/100;;
}

function resetTable() {
	$("#bpm").value = 100;
	$("#playback").value = 1.0;
	$("#size").value = 0.5;
	$("#duration").value = "5";
}

function startCountdown() {
	calculate();
	disableSelection($("#purple"));
	disableSelection($("#timer"));
	disableSelection($("#circlestats"));
	$("#tableContent").css('visibility', "hidden");
	$("#countdown").innerHTML = "Ready?";
	countdownTimer = setInterval(function() { handleTimer(countdownCount); }, 700);
}

function handleTimer() {
	if(countdownCount === 0) {
		clearInterval(countdownTimer);
		endCountdown();
	} else {
		$("#countdown").innerHTML = countdownCount;
		countdownCount--;
	}
}

function endCountdown() {
	$("#content").css('visibility', "hidden");
	startLoop($('#size').val(), $('#duration').val());
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
    $(document).off();
    $(document).on('mousemove', function(event) {
        var nCoor = normalizeCoors(event.pageX, event.pageY);
        var nxCoor = nCoor.x,
            nyCoor = nCoor.y;
        mouseCoor.push([(new Date).getTime(), 'move', nxCoor, nyCoor])
    });
    $(document).on('click', function(event) {
        var nCoor = normalizeCoors(event.pageX, event.pageY);
        var nxCoor = nCoor.x,
            nyCoor = nCoor.y;
        mouseCoor.push([(new Date).getTime(), 'click', nxCoor, nyCoor])
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
            $(document).on('click', function(event) {execute(event, section, circle)});
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




function startLoop(size, duration) {
	trainingTimer(duration,0);
	circleTimer(size,0);
}

function trainingTimer(duration,c) {
	$("#timer").innerHTML = "Time left: "+(duration-c);
	if(duration==c) {
		endTraining();
	}
	else {
		window.setTimeout(function() {trainingTimer(duration,c+1)},1000);
	}
}

function endTraining() {
	trainingEnded = 1;
    setTimeout(function() {
        $("#timer").css('display', 'none');
        $("#circlestats").css('display', 'none');
        $("#accuracy").css('display', 'none');
        $("#averageAccuracy").css('display', 'none');
        $("#content").css('display', 'block');
        $("#headertext").innerHTML = "TIME IS UP!";
        //$("#countdown").innerHTML = "Results:<br/><br/>"+$("#circlestats").innerHTML+"<br/>"+$("#averageAccuracy").innerHTML+"<br/><br/><span onclick='location.reload()' style='cursor:pointer'>Play Again</span>";
        $("#countdown").innerHTML = "<span onclick='location.reload()' style='cursor:pointer'>Play Again</span>";
        $("#download").innerHTML = '<a href="data:' + encodeURI("text/json;charset=utf-8," + JSON.stringify(responseData)) + '" download="data.json">download data</a>';
    }, 1000);
}

function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function rndNorm() {
    // thanks central limit theorem for nice approximation of normal distribution sampling
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function randomR(mean, spread) {
    return Math.abs(mean + spread * rndNorm())
}

function randomTheta(angle) {
    return angle * Math.random()
}

function isOdd(num) { 
	return num % 2;
}

function generateCircle(oldX, oldY, bound, rightBound, bottomBound) {
    var mean = 300
    var spread = 10
    var r = randomR(mean, spread)
    var theta = randomTheta(2*Math.PI)
    var addX = r * Math.cos(theta)
    var addY = r * Math.sin(theta)
    var x,y
    if ( (oldX + addX) <= bound || (oldX + addX) >= rightBound) {
        x = oldX - addX
    } else {
        x = oldX + addX
    }
    if ( (oldY + addY) <= bound || (oldY + addY) >= bottomBound) {
        y = oldY - addY
    } else {
        y = oldY + addY
    }

    x = Math.max(Math.min(rightBound, x), bound)
    y = Math.max(Math.min(rightBound, y), bound)
    return {x: x, y:y}
}

function circleTimer(size,c) {
	totalCircles++;
	var totalCirclesDisplay;
	if(totalCircles>1) {
		totalCirclesDisplay = totalCircles-1;
	}
	else {
		totalCirclesDisplay = totalCircles;
	}
	$("#circlestats").innerHTML = "Circles clicked: "+circlesClicked+"/"+totalCirclesDisplay+" ("+Math.round((circlesClicked/totalCirclesDisplay*100))+"%)";
    //$('#player').play();
	var bound = 100*size;
	var viewportwidth;
	var viewportheight;
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
	var rightBound = viewportwidth-bound;
	var bottomBound = viewportheight-bound;

    $("#purple").css('display', 'block');

    purpleCoor = generateCircle(purpleX, purpleY, bound, rightBound, bottomBound)
    purpleX = purpleCoor.x;
    purpleY = purpleCoor.y;

    $("#purple").css('left', purpleX + "px");
    $("#purple").css('top', purpleY + "px");
    purpleTimer = new Date().getTime();

    responseData[purpleTimer] = {'click': 0}

	if(trainingEnded==1) {
		clearInterval(loopTimer);
		$("#purple").css('display', 'none');
	}
	else {
		loopTimer = setTimeout(function() {
            circleTimer(size,c+1);
        },(milliseconds_per_beat));
	}
}

function clickedCircle() {
	var currentTime = new Date().getTime();
    circlesClicked++;
    $("#circlestats").innerHTML = "Circles clicked: "+circlesClicked+"/"+totalCircles+" ("+Math.round((circlesClicked/totalCircles*100))+"%)";
    var accuracy;
    var averageTiming;
    var timing;
    accuracy = (currentTime - purpleTimer);
    $("#purple").css('visibility', "hidden");
    if(accuracy>0) {
        timing = "early";
        timing = 'late';
    }
    else {
        timing = "late";
        timing = 'early';
    }
    $("#accuracy").innerHTML = "Accuracy: "+Math.abs(accuracy)+" ms "+timing;
    averageAccuracy = averageAccuracy + accuracy;
    if(averageAccuracy>0) {
        averageTiming = "early";
    }
    else {
        averageTiming = "late";
    }
    var averageDisplay = averageAccuracy/circlesClicked;
    $("#averageAccuracy").innerHTML = "Average Accuracy: "+Math.round(Math.abs(averageDisplay))+" ms "+averageTiming;

    responseData[purpleTimer] = {
        'click': 1,
        'hitTime': currentTime,
        'circleX': purpleX,
        'circleY': purpleY,
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

