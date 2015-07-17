
var sections = [
    {'name': 'round 1',
     'circles': ,
    }
];



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
    if (typeof target.onselectstart!="undefined") // if IE
        target.onselectstart=function(){return false}
    else if (typeof target.style.MozUserSelect!="undefined") // if Firefox
        target.style.MozUserSelect="none";
    else // others
        target.onmousedown=function(){return false;}
}

function calculate() {
	var d = $("#playback")[0];
	var playbackRate = d.options[d.selectedIndex].value;
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
	disableSelection($("#purple")[0]);
	disableSelection($("#timer")[0]);
	disableSelection($("#circlestats")[0]);
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
	//var d = $("#playback");
	//$("#player").playbackRate = d.options[d.selectedIndex].value;
	var e = $("#duration");
	var f = $("#size");
	startLoop(f.options[f.selectedIndex].value,e.options[e.selectedIndex].value);
}

function startLoop(size,duration) {
	$("#timer").style.visibility = "hidden";
	$("#circlestats").style.visibility = "visible";
	$("#accuracy").style.visibility = "hidden";
	$("#averageAccuracy").style.visibility = "hidden";
	$("#purple").style.visibility = "visible";
	$("#purple").style.height = 100*size+"px";
	$("#purple").style.width = 100*size+"px";
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
        $("#timer").style.visibility = "hidden";
        $("#circlestats").style.visibility = "hidden";
        $("#accuracy").style.visibility = "hidden";
        $("#averageAccuracy").style.visibility = "hidden";
        $("#content").style.visibility = "visible";
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
    //document.getElementById('player').play();
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

    $("#purple").style.visibility = "visible";

    purpleCoor = generateCircle(purpleX, purpleY, bound, rightBound, bottomBound)
    purpleX = purpleCoor.x;
    purpleY = purpleCoor.y;

    $("#purple").style.left = purpleX + "px";
    $("#purple").style.top = purpleY + "px";
    purpleTimer = new Date().getTime();

    responseData[purpleTimer] = {'click': 0}

	if(trainingEnded==1) {
		clearInterval(loopTimer);
		$("#purple").style.visibility = "hidden";
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
    $("#purple").style.visibility = "hidden";
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
