var circle;
var inputFlag = 1;
var mouseCoor;
var targetCoor;
var viewportwidth;
var viewportheight;
var maxMouseMoveDiff = 0;
var allowMouseMove = 0;
var csgoRanks = ['Silver I', 'Silver II', 'Silver III', 'Silver IV', 'Silver Elite', 'Silver Elite Master', 'Gold Nova I', 'Gold Nova II', 'Gold Nova III', 'Gold Nova Master', 'Gold Nova Guardian I', 'Gold Nova Guardian II', 'Master Guardian Elite', 'Distinguished Master Guardian', 'Legendary Eagle', 'Legendary Eagle Master', 'Supreme Master First Class', 'The Global Elite'];
updateSize();
$(window).on('resize', function() {
    updateSize();
});
window.setInterval(function() {
    allowMouseMove = 1;
}, 16);
var sections = [
    {'name': 'round 1',
     'circles': [[0.33274373033725607, 0.47828501117819705], [0.63685306389192586, 0.60899581230906952], [0.37015386637460401, 0.92214500982464942], [0.44827328348236273, 0.85194610963141149], [0.62221847664019148, 0.77278432740389713], [0.52471991742964119, 0.33221710495233092], [0.89143341650198171, 0.5397216652295832], [0.64079383695891301, 0.39929527275910348], [0.63983227327324244, 0.52743528197407652], [0.60350788645102749, 0.31805580006455214], [0.64514495024759066, 0.73570529542477781], [0.44030804252709671, 0.71915883866382413], [0.26467742514631487, 0.66388661324282283], [0.78780167758198227, 0.36022934774385934], [0.13248352919961676, 0.38446002926670653], [0.29176188392434771, 0.17447046397595184], [0.70487188423718405, 0.63305799248484618], [0.72640686953135525, 0.64852832052821197], [0.57990077165887988, 0.31080687675306562], [0.45852745350482149, 0.30944818086209147], [0.49566809441818399, 0.37917321024935202], [0.58503301253224049, 0.68357084491259579], [0.58938971122947992, 0.88967258474876787], [0.67492322316940057, 0.40951551782794438], [0.78568071741401124, 0.5459005963007264], [0.46503703330710472, 0.20587393874767679], [0.65508730548182914, 0.27192253052380733], [0.64646602647226092, 0.67658264769176968], [0.8386738819139048, 0.4753891657334578], [0.65061303282495542, 0.73074527045793403], [0.63003085249553936, 0.24128914786607603], [0.83060912060820469, 0.73224267660562992], [0.69202554078220169, 0.13274567943159798], [0.67625642163076338, 0.42720724089752482], [0.075199275296539136, 0.49655189389815257], [0.44069121052068905, 0.63426677718044666], [0.49786777405224147, 0.36162599327764822], [0.7418248225125712, 0.68718156362535876], [0.55294539985354718, 0.65995317636317086], [0.1640582275554649, 0.39504164492595312], [0.23853532412364797, 0.83305526516911721], [0.39326234211366728, 0.41911925465463784], [0.66308167636086868, 0.69142490933662193], [0.47616174613322959, 0.70110102135550312], [0.64304093622613678, 0.39520149658986753], [0.5542391216905852, 0.23016253056831126], [0.65496559309283309, 0.30052146281139896], [0.20913532315805128, 0.83469264945000043], [0.67055404853902145, 0.46858727584493176], [0.6561226122379874, 0.90759939519011623]],
     'radius': 20,
     'isi': 1000,
     'rest': 3,
    },
    {'name': 'round 2',
     'circles': [[0.47255532065401062, 0.38127432193272859], [0.4799292233975973, 0.3670052710800914], [0.10496277205928312, 0.51813998733457933], [0.48195128513438568, 0.19728777696498495], [0.33566953710470859, 0.3933562591338462], [0.82485256334248502, 0.32905763764253115], [0.55320118695316611, 0.6068408374858032], [0.31173995644782326, 0.71316697020853215], [0.23290399225044156, 0.49980726973048423], [0.56490831348407311, 0.66516412836864203], [0.19751191477330282, 0.43320731364059428], [0.15449823626865761, 0.64122498037076392], [0.07563745138251371, 0.58512535996517667], [0.58605624350005536, 0.40071024808106165], [0.62375078823616958, 0.66869165317282286], [0.29149819897283785, 0.52749921731721428], [0.32843163888288085, 0.6107714823337701], [0.099287643857612851, 0.70356826204532097], [0.35869880423947159, 0.56874898793529616], [0.87914208871883515, 0.40824616153697979], [0.70649835874056022, 0.74234229900010673], [0.57730771537543191, 0.67533759845421604], [0.78043738109116778, 0.51754941552195544], [0.19424170660070689, 0.33697909692163558], [0.53482959948130537, 0.70823332630479152], [0.31312539713126109, 0.10426509416871871], [0.33630926971216868, 0.56969493104233515], [0.42775015826887325, 0.67025103545714959], [0.78651048110521748, 0.2741787609536519], [0.59530630547533425, 0.78270402093476443], [0.28440455139188309, 0.63990410419067689], [0.6959274326240954, 0.44448923927228945], [0.2631958507203378, 0.50503533378402987], [0.45846382517155077, 0.37016737499735874], [0.56686297673176866, 0.59206866418834869], [0.75564772851681161, 0.72329078040496408], [0.33315293637811394, 0.76568582214150116], [0.41600512961683928, 0.44448665308607188], [0.48530069704270223, 0.67622810511778697], [0.47803052640771304, 0.9382663494950928], [0.38589678337154176, 0.27787649918309054], [0.29980351070713651, 0.67834295565389202], [0.50897562752943282, 0.10988202409217257], [0.61457360541617811, 0.24272321725974544], [0.51876664372984349, 0.64812009585894215], [0.1398384689372052, 0.51319678248522793], [0.86996726356595522, 0.61500197321828953], [0.38141142687066021, 0.91042005528627512], [0.28008725251258743, 0.88839100887455658], [0.42980728993359718, 0.67701082120460376]],
     'radius': 20,
     'isi': 1000,
     'rest': 30,
    },
    {'name': 'round 3',
     'circles': [[0.46992297067534738, 0.40023336262673986], [0.18879307284731922, 0.50116369416132189], [0.474100151313188, 0.37232592891915672], [0.68213278073579164, 0.79757744525679208], [0.69640668911807002, 0.71356843474761078], [0.77833009029638234, 0.48040243148914391], [0.44624632226699046, 0.38126523087995956], [0.213800930771608, 0.20255324403654967], [0.63400914158014077, 0.75535332638108121], [0.28808505234374981, 0.55893574548409486], [0.67390504880025004, 0.12084954929604619], [0.68338784223778148, 0.42379538728547789], [0.38196438454340781, 0.47167836868317436], [0.67407360780783443, 0.22095612825141897], [0.1140244505411484, 0.69620529548575982], [0.59115575201903403, 0.4435534203797723], [0.1786246400368478, 0.47368656115083657], [0.29351293888184626, 0.64650494275975601], [0.54673890594174002, 0.37728551590038722], [0.7810142622186742, 0.30671973427171417], [0.47443051032587386, 0.68843506282539269], [0.49643057642473459, 0.3829061741333592], [0.8763790879022012, 0.40713682922654726], [0.81450132311222134, 0.30437061579975666], [0.51247769380573527, 0.31262340737531036], [0.39726479582169694, 0.46939752919554872], [0.34376048025534628, 0.12223230576096239], [0.66532931639465442, 0.42162547920842997], [0.22541082360019554, 0.5563377326719382], [0.72648614252333032, 0.48264245896872254], [0.39098981344793365, 0.37709817506336835], [0.24523295197548817, 0.5034142147963182], [0.47671244462960694, 0.75395617864588904], [0.57851055125325446, 0.62478643038633175], [0.45822118559964775, 0.88427032689011298], [0.52123202419794534, 0.084805270925018217], [0.67049330607595481, 0.60486656295552033], [0.59349832180503115, 0.84912598106263548], [0.14708788426890768, 0.35682829951590311], [0.47208790011169355, 0.64701076740447905], [0.38187047833755122, 0.15268266413853931], [0.60238335977393376, 0.45561214522561055], [0.21025980370478214, 0.30598018897213863], [0.61952396745474481, 0.60330827619268901], [0.41886170392950872, 0.34196017762197234], [0.21408141963685157, 0.63708777165445185], [0.54864789496289357, 0.32988269594885911], [0.52660290879800586, 0.074240663202383927], [0.54994811751450634, 0.6042781948238114], [0.32943204986884089, 0.18321904040748199]],
    'radius': 20,
    'isi': 1000,
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

