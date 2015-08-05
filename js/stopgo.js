var circle;
var inputFlag = 1;
var viewportwidth;
var viewportheight;
var reactSpeeds = [];
var timeStart;
var csgoRanks = ['Unranked', 'Silver I', 'Silver II', 'Silver III', 'Silver IV', 'Silver Elite', 'Silver Elite Master', 'Gold Nova I', 'Gold Nova II', 'Gold Nova III', 'Gold Nova Master', 'Gold Nova Guardian I', 'Gold Nova Guardian II', 'Master Guardian Elite', 'Distinguished Master Guardian', 'Legendary Eagle', 'Legendary Eagle Master', 'Supreme Master First Class', 'The Global Elite'];
updateSize();
$(window).on('resize', function() {
    updateSize();
});
window.setInterval(function() {
    allowMouseMove = 1;
}, 16);
var sections = [
    {'name': 'round 1',
     'circles': [[1,1], [1,0], [0,1], [0,0]], // 0 for stop, 1 for go, 0 for left, 1 for right
     'radius': 10,
     'isi': [1000, 1000, 1000],
     'rest': 3,
     //'rest': 30,
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
	$('#mmr').replaceWith('<select id=\'mmr\'></select>')
	$.each(csgoRanks, function(key, value) {
            $('#mmr').append($('<option></option>')
                .attr('value', key)
                .text(value));
        });
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
    $.post('ec2-52-27-131-155.us-west-2.compute.amazonaws.com:3000/api/stopgo', {
    //$.post('localhost:3000/api/stopgo', {
        'timestamp': (new Date()).getTime().toString(),
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
    $.post('ec2-52-27-131-155.us-west-2.compute.amazonaws.com:3000/api/stopgo', {
    //$.post('localhost:3000/api/stopgo', {
        'timestamp': (new Date()).getTime().toString(),
        'email': bio.email, 
        'state': state,
        'data': JSON.stringify(data)
    }).done(function(data) {
        console.log('inserted for ' + bio.email);
    });
}

function nextButton(section) {
    $('#btnSections').off().on('click', function() {initialize(section)});
    //$('#btnSections').css('left', 0.5 * viewportwidth + 'px');
    //$('#btnSections').css('top', 0.5 * viewportheight + 'px');
    $('#btnSections').css('display', 'block');
    $('#btnSections').text(section.name);
}

var taskNum = 0;
var goX = 0;
var goY = 0;
var goTimer;
var averageAccuracy = 0;
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
    //console.log('initialize')
    $("#go").css('height', size+"px");
    $("#go").css('width', size+"px");
    $('#btnSections').css('display', 'none');
    taskNum++;
    var data = {
        'task mode': mode,
        'combos': circles,
        'size': {viewportheight, viewportwidth}
    };
    addToResponseData((new Date()).getTime().toString(), 'initialize', data);
    circleList = circles.slice(0);
    showNextCircle(section);
}

function showNextCircle(section) {
    mouseCoor = [];
    targetCoor = [];
    $(document).off();
    $(document).on('click', function(event) {
        mouseCoor.push([(new Date).getTime(), 'click', event.pageX, event.pageY])
    });
    if (circleList.length < section.circles.length) {
        reactSpeeds.push((new Date).getTime() - timeStart);
    };
    circle = circleList.shift();
    setTimeout(function() {
        $('#correct').css('display', 'none');
        $('#incorrect').css('display', 'none');
        setTimeout(function() {
            if (circle == undefined && circleList.length == 0) {
                endGame(taskNum, section);
            } else {
                timeStart = (new Date()).getTime();
                inputFlag = 1;
                targetCoor = [(new Date).getTime(), 'appear', circle[0], circle[1]];
                $(document).on('keydown', function(event) {execute(event, section, circle)});
                $('#go').css('background-color', '#000000');
                $('#go').css('display', 'block');
                if (circle[1] == 0) {
                    $("#go").css('left', txCoor - section.radius + "px");
                } else if (circle[1] == 1) {
                    $("#go").css('left', txCoor - section.radius + "px");
                }
                $("#go").css('top', tyCoor - section.radius + "px");
            }
        }, section.isi.shift());
        setTimeout(function() {
            if (circle[0] == 1) {
                $('#stop').css('background-color', '#000000');
                $('#stop').css('display', 'block');
            }
        }, section.SSD);
    }, 200);
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
    if (event.which == 81 || event.which == 80) {
        inputFlag = 0;
        if ((event.which == 81 && circle[1] == 0) || (event.which == 80 && circle[1] == 1)) {
            correctFlag = 'correct';
            $('#correct').css('display', 'block');
        } else {
            correctFlag = 'incorrect';
            $('#incorrect').css('display', 'block');
        }
        var data = {
            'correctness': correctFlag,
            'mouseCoor': mouseCoor,
            'size': {viewportheight, viewportwidth},
            'target': targetCoor
        };
        addToResponseData(timestamp, 'hit', data);
        showNextCircle(section);
    }
}

function endGame(nextTask) {
    $(document).off();
    //console.log(sections[taskNum].name);
    $('#go').css('display', 'none');
    if (sections[taskNum].name == 'download') {
        var sum = 0;
        for (var x=0; x < reactSpeeds.length; x++) {
		console.log(sum);
            sum = sum + reactSpeeds[x];
        }
        $('#doneInstructions').append('<br>avg reaction time: ' + Number(sum/reactSpeeds.length).toFixed(0) + ' ms</br>');
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

