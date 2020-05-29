let _filesToLoad;
let _drawingBoard;
let simpAnswer;
let tradAnswer;
let numRounds = 0;
let numCorrect = 0;
let answers = []
$("#chinese0").click(function() {
    guess(0);
})
$("#chinese1").click(function() {
    guess(1);
})
$("#chinese2").click(function() {
    guess(2);
})
$("#chinese3").click(function() {
    guess(3);
})
$("#chinese4").click(function() {
    guess(4);
})
$("#chinese5").click(function() {
    guess(5);
})
$("#chinese6").click(function() {
    guess(6);
})
$("#chinese7").click(function() {
    guess(7);
})

$("#next").click(function() {
    numRounds++;

    update();
})

function update() {
    $(`#score`).text(`Score: ${numCorrect} / ${numRounds}`)
    if (simpAnswer !== tradAnswer) {
        answers.push(`${simpAnswer}(${tradAnswer})`)
    } else {
        answers.push(simpAnswer);
    }
    $(`#prev`).text(`Previous Answers: ${answers}`)
    assign(Math.floor(Math.random() * 1000))
}

function guess(num) {
    let guess = $(`#chinese${num}`).text();
    if ((guess === (simpAnswer)) || (guess === (tradAnswer))) {

        $("#response").text("Correct!").fadeIn('slow').delay(100).fadeOut('slow')
        numRounds++;
        numCorrect++;
        update();

    } else {
        $("#response").text("Try again!").show().fadeIn('slow').delay(100).fadeOut('slow');
    }

}

$(document).ready(function() {
    // Only fetch data (large, takes long) when the page has loaded
    _filesToLoad = 1;
    HanziLookup.init("mmah", "https://raw.githubusercontent.com/gugray/HanziLookupJS/master/dist/mmah.json", fileLoaded);
    assign(Math.floor(Math.random() * 2715));
});


//Assigns definition and pinyin to chosen word
function assign(number) {

    let fields = dataArray[number];
    let firstBracket = fields.FIELD3.indexOf("[");
    let secondBracket = fields.FIELD3.indexOf("]");
    let pinyin = fields.FIELD3.substring(firstBracket + 1, secondBracket)
    let definition = fields.FIELD3.replace(/,/g, "").replace(/;/g, "").split(" ")

    definition = definition.filter(string => checkWord(string))
    definition.join(', ');

    $("#pinyin").text(pinyin);
    $("#definition").text(definition);
    let answers = fields.FIELD2;
    simpAnswer = answers[0];
    tradAnswer = answers[0];
    if (answers.indexOf("F") !== -1) {
        tradAnswer = answers[answers.indexOf("F") + 1]
    }
}

function checkWord(word) {
    for (let i = 0; i < word.length; i++) {
        if (!valid(word.charAt(i))) {
            return false;
        }
    }
    return true;
}

function valid(char) {
    return ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'))
}

// Initializes mini-app once all scripts have loaded
function fileLoaded(success) {
    if (!success) {
        _filesToLoad = -1;
        $(".drawingBoard span").text("Failed to load data.");
        return;
    }
    --_filesToLoad;
    if (_filesToLoad != 0) return;
    // All data scripts loaded
    $(".drawingBoard").removeClass("loading");
    // Create handwriting canvas (this is optional, you can bring your own)
    _drawingBoard = HanziLookup.DrawingBoard($(".drawingBoard").first(), lookup);
    // Undo/redo commands - have to do with input
    $(".cmdUndo").click(function(evt) {
        _drawingBoard.undoStroke();
        _drawingBoard.redraw();
        lookup();
    });
    $(".cmdClear").click(function(evt) {
        _drawingBoard.clearCanvas();
        _drawingBoard.redraw();
        lookup();
    });
}

// Fetches hand-drawn input from drawing board and looks up Hanzi
function lookup() {
    // Decompose character from drawing board
    var analyzedChar = new HanziLookup.AnalyzedCharacter(_drawingBoard.cloneStrokes());
    // Look up with original HanziLookup data

    // Look up with MMAH data
    var matcherMMAH = new HanziLookup.Matcher("mmah");
    matcherMMAH.match(analyzedChar, 8, function(matches) {
        showResults(matches);
    });
}

// Populates UI with (ordered) Hanzi matches
function showResults(matches) {
    for (let i = 0; i != matches.length; i++) {
        $(`#chinese${i}`).text(`${matches[i].character}`);

    }
}