let _filesToLoad;
let _drawingBoard;
let simpAnswer;
let tradAnswer;
let numbers = [];
let difficulty = 1000;
let numRounds = 0;
let numCorrect = 0;
$(".chinese").click(function(e) {
    guess(e.target.id.substring(7))
})


$("#next").click(function() {
    numRounds++;
    update();
})
$("#prev").click(function(e) {
    if (e.target.id !== "prev") {
        let word = e.target.innerText[0] === '(' ? e.target.innerText[1] : e.target.innerText[0];
        let idNumber = e.target.id.substring(8);
        $('#char').empty();
        $('#animate').css('visibility', 'visible')

        let writer = HanziWriter.create('char', word, {
            width: 100,
            height: 100,
            padding: 5,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 200,
            showOutline: true
        });

        $('#animate').click(function() {
            writer.animateCharacter();
        })
        $('#char-pinyin').html(`<h3>Pinyin:</h3> <p>${numbers[idNumber].pinyin}</p>`)
        $('#char-def').html(`<h3>Definition:</h3> <p>${numbers[idNumber].definition}</p>`)
    }

})




function update() {
    $(`#score`).text(`Score: ${numCorrect} / ${numRounds}`)
    let currentText = $(`#prev`).html();

    if (simpAnswer !== tradAnswer) {
        $(`#prev`).html(`${currentText} <p class = "answers" id = answers-${numRounds}>${simpAnswer}</p><p class = "answers" id = answers-${numRounds}>(${tradAnswer}),<\p>`);
    } else {
        $(`#prev`).html(`${currentText} <p class = "answers" id = answers-${numRounds} >${simpAnswer},<\p>`);
    }
    assign(Math.floor(Math.random() * difficulty))
    _drawingBoard.clearCanvas();
    _drawingBoard.redraw();
    lookup();
}

function guess(num) {
    let guess = $(`#chinese${num}`).text();
    console.log(guess);
    if ((guess === (simpAnswer)) || (guess === (tradAnswer))) {

        $("#response").text("Correct!").show().fadeOut('slow')
        numRounds++;
        numCorrect++;
        update();

    } else {
        $("#response").text("Try again!").show().fadeOut('slow');
    }

}

$(document).ready(function() {

    // Only fetch data (large, takes long) when the page has loaded
    _filesToLoad = 2;
    HanziLookup.init("mmah", "https://raw.githubusercontent.com/Resocram/chinese/master/dist/mmah.json", fileLoaded);
    HanziLookup.init("orig", "https://raw.githubusercontent.com/Resocram/chinese/master/dist/orig.json", fileLoaded);
    assign(Math.floor(Math.random() * difficulty));
});


//Assigns definition and pinyin to chosen word
function assign(number) {

    let fields = dataArray[number];
    $("#pinyin").text(fields.pinyin);
    $("#definition").text(fields.definition);
    $("#example").empty();
    let length = fields.exampleWord.length > 3 ? 3 : fields.exampleWord.length;
    let answers = fields.char;
    simpAnswer = answers[0];
    tradAnswer = answers[0];
    if (answers.indexOf("F") !== -1) {
        tradAnswer = answers[answers.indexOf("F") + 1]
    }
    for (let i = 0; i < length; i++) {
        let currentText = $("#example").html();
        let word = fields.exampleWord[i];
        $("#example").html(`${currentText} <p>${word.char.replace(simpAnswer,"__").replace(tradAnswer, "__")} [${word.pinyin}] ${word.definition}</p>`)
    }


    numbers[numRounds + 1] = dataArray[number];

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
    var matcherOrig = new HanziLookup.Matcher("orig");
    matcherOrig.match(analyzedChar, 8, function(matches) {
        showResultsORIG(matches);
    });
    // Look up with MMAH data
    var matcherMMAH = new HanziLookup.Matcher("mmah");
    matcherMMAH.match(analyzedChar, 8, function(matches) {
        showResultsMMAH(matches);
    });
}

// Populates UI with (ordered) Hanzi matches
function showResultsMMAH(matches) {
    for (let i = 0; i != matches.length; i++) {
        $(`#chinese${i}`).text(`${matches[i].character}`);
    }
}

function showResultsORIG(matches) {
    for (let i = 0; i != matches.length; i++) {
        $(`#chinese${i+8}`).text(`${matches[i].character}`);
    }
}