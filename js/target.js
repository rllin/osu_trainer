var circle;
var inputFlag = 1;
var mouseCoor;
var targetCoor;
var viewportwidth;
var viewportheight;
var maxMouseMoveDiff = 0;
var allowMouseMove = 0;
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
     //'circles': [[0.1,0.1], [0.2, 0.2], [0.3, 0.3]],
     'circles': [[0.52866399833005717, 0.77944353193983373], [0.28581225565436269, 0.54823080928972834], [0.83735488028441551, 0.50227740464264292], [0.66177305269812592, 0.71632750296907322], [0.30488540793805013, 0.57015910291462057], [0.24816045973353507, 0.376917341406451], [0.58681635988720338, 0.19325928255115027], [0.85653731600278482, 0.47026517542965712], [0.47891506504400949, 0.84039781558066307], [0.083338112527185815, 0.54343800877354498], [0.74859306204981513, 0.20307311882618845], [0.44016415144847826, 0.78220919452795357], [0.76730771574042467, 0.55812654252457572], [0.069359923231988141, 0.43409921492100112], [0.23329521096021466, 0.83352128432454731], [0.75376125853401577, 0.6382383499311568], [0.49631337974931017, 0.92239515303101149], [0.67354811568555562, 0.30172433630850048], [0.7177964462621077, 0.43155169392913789], [0.1673938875417143, 0.33120578483244789], [0.75568593211586221, 0.38172265273328121], [0.42700067977707801, 0.88031565469214734], [0.26444034068467132, 0.232725993232476], [0.43790820580253859, 0.84419850817380337], [0.24295759403236561, 0.61857010002626045], [0.67966354931324602, 0.62157950078689728], [0.70672215683190098, 0.24689129193822601], [0.18535732070655009, 0.24241853343888164], [0.43694009556270347, 0.090914105485557228], [0.42076204227169223, 0.29554276984466521], [0.23988623326714614, 0.52861769389301638], [0.80512553927451869, 0.43465443473938309], [0.27298700432621859, 0.36162141876071852], [0.37536721950803364, 0.71308505792384713], [0.37230207798545378, 0.76977013779431469], [0.90384900043244032, 0.60210688090122844], [0.17307471519312806, 0.54314786844489604], [0.72279105764404084, 0.28799112142761307], [0.51074718283529186, 0.19098574977459309], [0.72187977619098698, 0.31292408840597002], [0.27339654173052064, 0.59864234601064525], [0.48499738278467491, 0.25706988314129009], [0.19757709019845832, 0.51079076206451945], [0.10515189529063679, 0.29173338103436852], [0.70257374554211605, 0.69703380261344727], [0.71418614542320769, 0.15176989089475723], [0.35583054127444591, 0.20672128717022026], [0.3635521358932573, 0.68828809708888605], [0.53743892008108318, 0.73706935124778816], [0.19823064539998925, 0.28306974104373978]],
     'radius': 10,
     'isi': [900, 1200, 800, 900, 1200, 1100, 1200, 1200, 800, 700, 900, 1200, 700, 1100, 600, 800, 700, 600, 800, 1300, 900, 1000, 1400, 900, 900, 700, 1500, 700, 500, 1200, 1200, 1400, 800, 1100, 600, 1100, 1000, 500, 700, 1200, 800, 1000, 900, 1200, 1100, 700, 1100, 900, 1100, 900],
     //'rest': 3,
     'rest': 30,
    },
    {'name': 'round 2',
     //'circles': [[0.1,0.1], [0.2, 0.2], [0.3, 0.3]],
     'circles': [[0.7798979275755118, 0.60257360141593064], [0.45274239479746065, 0.93623537230111165], [0.75980418235145852, 0.5411396664733179], [0.70294307153476265, 0.42247083324696588], [0.48537998030217022, 0.72884579212881051], [0.72806983244874379, 0.48921047092833675], [0.68294824076806404, 0.17975134776787344], [0.76640456059810891, 0.68696798847654839], [0.77203172477528603, 0.74805343871316798], [0.20559484637031222, 0.24959517884720533], [0.39950124414348781, 0.92119770280559876], [0.89190355244688946, 0.59246815424730992], [0.47865038720576231, 0.81629266404623291], [0.28531311869038822, 0.73928134845066884], [0.70654888096189028, 0.50903388290307061], [0.14637335170511073, 0.65553688351508899], [0.35172151888845293, 0.8997142060041784], [0.81232056689558729, 0.20095953099325964], [0.66310280136765509, 0.085174720465542086], [0.3274680868666674, 0.3513923768287861], [0.42461309818009912, 0.13288162123837061], [0.70253984543968984, 0.35904717333766728], [0.78024371006715176, 0.84180241563771707], [0.83398792620419937, 0.47111926256842818], [0.43990098200236899, 0.82760007073559128], [0.084698483880431052, 0.6477990117961604], [0.37966924282143749, 0.89636322290998216], [0.69365354930529555, 0.81839411175933496], [0.59492623976267622, 0.91321556955495076], [0.16387024827564312, 0.48430239933393004], [0.6095072330325606, 0.75173267723045634], [0.13617460931423231, 0.34955526192897379], [0.83032637382279106, 0.55421276322347079], [0.1711640843336068, 0.80491064498347886], [0.21121287048876153, 0.68289610863561823], [0.10083741139927688, 0.60737037023434703], [0.23325489397042398, 0.65075879636817213], [0.45245528110593247, 0.065047597663727641], [0.41951691255333973, 0.7841442821331196], [0.07259440994633598, 0.49472249762782738], [0.88228469652674135, 0.5046481479028434], [0.29002651446660588, 0.80566336397922644], [0.83996046395130963, 0.35851763923413482], [0.1721568395510239, 0.44837253407697014], [0.43161008499288223, 0.93926503721154664], [0.28156597969182562, 0.26637687579709823], [0.651879148426035, 0.72193578902915512], [0.79657450749859526, 0.26105039659023177], [0.73173233521258674, 0.86293483807715665], [0.28300515487380562, 0.55550874089392321]],
     'radius': 10,
     'isi': [1200, 600, 1300, 800, 1300, 1200, 1100, 800, 1100, 900, 700, 1300, 1100, 1400, 1100, 900, 1000, 600, 600, 1200, 1300, 900, 900, 1100, 1600, 900, 1000, 2000, 700, 1100, 1300, 800, 1400, 900, 900, 1400, 400, 700, 700, 700, 1000, 1400, 1300, 700, 800, 1000, 1100, 500, 1100, 1000],
     //'rest': 3,
     'rest': 30,
    },
    {'name': 'round 3',
     //'circles': [[0.1,0.1], [0.2, 0.2], [0.3, 0.3]],
     'circles': [[0.48857836370992169, 0.11844747637474895], [0.64907768216100625, 0.3137436311926699], [0.79125837028315749, 0.59322215029746606], [0.66822932727086815, 0.64520003449823249], [0.21790245673756103, 0.43652801487220388], [0.6890626456029838, 0.62107999296252081], [0.70597492224495151, 0.26855165801994019], [0.17149030675217253, 0.31515620297420155], [0.68261457592106289, 0.4016426907921114], [0.1017317790859269, 0.58459630029083121], [0.69575278300673349, 0.13038944628562293], [0.27165551445964919, 0.18078293368666748], [0.59727691051794207, 0.1428830619707247], [0.38194750772133296, 0.10143609993624886], [0.20323705045344753, 0.29939581752873268], [0.82955458664532356, 0.28376529972727427], [0.72556557377968522, 0.24310749623386563], [0.29214410534989743, 0.50416555206305091], [0.72041104112455701, 0.47938037282762391], [0.25805814746901079, 0.16642930847032589], [0.2215650226939353, 0.52369006547998742], [0.92479726842658327, 0.64343778397250273], [0.24682659754312836, 0.53969475299846481], [0.34754982238177168, 0.85950157101639046], [0.45749488897366464, 0.75353941037976546], [0.70900669157493834, 0.23514790512108763], [0.307143961843236, 0.34373904200140176], [0.62525123936356586, 0.29805515037467489], [0.15465427330099735, 0.23583465533078374], [0.29957121462019198, 0.7729942980059159], [0.30738674616874456, 0.29584794458542424], [0.54642451512800672, 0.91286502370673561], [0.92239427643473793, 0.54534257681844645], [0.2757986152690014, 0.63072855049740051], [0.28233289296900271, 0.26058287120376844], [0.30755747758726026, 0.72635010303638414], [0.37821165682640773, 0.072659763095998309], [0.44769955945845807, 0.12351125311056937], [0.44854689304107337, 0.79682344579822972], [0.86353526756732601, 0.32374481332462163], [0.74329681005590209, 0.57519152972611554], [0.7609957337139619, 0.6603517970679087], [0.45364467440264256, 0.70860681707780415], [0.87484318642266268, 0.5105362179212305], [0.41652100966534789, 0.13941897980443591], [0.83651790857029107, 0.42487421032012596], [0.64560990126836904, 0.84665744899625894], [0.32053346032513191, 0.72709206070701093], [0.49356208295818554, 0.050515957516031329], [0.80318879877739946, 0.40653052804131118]],
    'radius': 10,
    'isi': [900, 1000, 700, 800, 700, 800, 1000, 1300, 600, 1300, 700, 800, 700, 900, 1800, 800, 1100, 800, 500, 700, 900, 1100, 1300, 1000, 1100, 1100, 1100, 700, 600, 1000, 800, 900, 1500, 1100, 1000, 700, 1400, 500, 1400, 1000, 800, 1700, 400, 1000, 600, 700, 1100, 1200, 500, 1800],
    //'rest': 3,
    'rest': 30,
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
    $.post('http://ec2-52-25-109-156.us-west-2.compute.amazonaws.com:3000/api/target', {
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
    $.post('http://ec2-52-25-109-156.us-west-2.compute.amazonaws.com:3000/api/target', {
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
    //console.log('initialize')
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
    $(document).off();
    $(document).on('mousemove', function(event) {
	if (allowMouseMove == 1) {
	    //var lastTime = mouseCoor[mouseCoor.length-1][0]
	    mouseCoor.push([(new Date).getTime(), 'move', event.pageX, event.pageY])
	    allowMouseMove = 0;
	    //var diff = mouseCoor[mouseCoor.length-1][0] - lastTime;
	    //maxMouseMoveDiff = Math.max(maxMouseMoveDiff, diff);
	    //console.log(diff, maxMouseMoveDiff, event.pageX, event.pageY);
        }
    });
    $(document).on('click', function(event) {
        mouseCoor.push([(new Date).getTime(), 'click', event.pageX, event.pageY])
    });
    if (circleList.length < section.circles.length) {
        reactSpeeds.push((new Date).getTime() - timeStart);
    };
    circle = circleList.shift();
    setTimeout(function() {
        $('#purple').css('display', 'none');
        setTimeout(function() {
            if (circle == undefined && circleList.length == 0) {
                endGame(taskNum, section);
            } else {
                timeStart = (new Date()).getTime();
                inputFlag = 1;
                var cCoor = convertCoors(circle[0], circle[1]);
                var txCoor = cCoor.x,
                    tyCoor = cCoor.y;
                targetCoor = [(new Date).getTime(), 'appear', txCoor, tyCoor];
                $(document).on('click', function(event) {execute(event, section, circle)});
                $('#purple').css('background-color', '#000000');
                $('#purple').css('display', 'block');
                $("#purple").css('left', txCoor - section.radius + "px");
                $("#purple").css('top', tyCoor - section.radius + "px");
            }
        }, section.isi.shift());
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
    if ((xCoor - txCoor)*(xCoor - txCoor) + (yCoor - tyCoor)*(yCoor - tyCoor) <= section.radius*section.radius && inputFlag == 1) {
        $('#purple').css('background-color', '#00FF00');
        inputFlag = 0;
        var data = {
            'mouseCoor': mouseCoor,
            'size': {viewportheight, viewportwidth},
            'target': targetCoor
        }
        //console.log('last mouseCoor: ' + mouseCoor[mouseCoor.length - 1])
        addToResponseData(timestamp, 'hit', data);
        showNextCircle(section);
    } else {
        console.log('clicked out circle: ' + xCoor + ', ' +  yCoor)
    }
}

function endGame(nextTask) {
    $(document).off();
    //console.log(sections[taskNum].name);
    $('#purple').css('display', 'none');
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

