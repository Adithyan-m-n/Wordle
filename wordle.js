var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0; //current guess (attempt #)
var col = 0; //current letter for that attempt

var gameOver = false;

var wordList = [];
var word;

fetch("https://raw.githubusercontent.com/charlesreid1/five-letter-words/b45fda30524a981c73ec709618271cecfb51c361/sgb-words.txt")
  .then(response => response.text())
  .then(data => {
    const lst = data.trim().split('\n');
    wordList = lst.filter(word => word.length === 5);
    word = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
    console.log(word);
    onWordGenerated(word);
  })
  .catch(error => console.error(error));

function onWordGenerated(word) {
  console.log(word.length);
}


window.onload = function(){
    intialize();
}

function intialize() {
    document.addEventListener("keyup", (e) => {
            processInput(e);
        })
    keyTile=document.getElementsByClassName("key-tile");
    for (let i = 0; i < keyTile.length; i++) {
        keyTile[i].addEventListener("click", processKey);
    }
    entertile=document.getElementById("Enter");
    resetButton = document.getElementById("reset");
    entertile.addEventListener("click", processKey);
    resetButton.addEventListener("click", resetpage);
}

function resetpage() {
    window.location.reload();
}

function processKey() {
    e = { "code" : this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return; 

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -=1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        update();
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = "ANSWER : "+ word;
        document.getElementById("reset").style.display = "block";
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    //string up the guesses into the word
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); 


    if (!wordList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in Word List";
        return;
    }
    
    //start processing guess
    let correct = 0;

    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }


    //first iteration, check all the correct ones first
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if (word[c] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1; //deduct the letter count
        }

        if (correct == width) {
            gameOver = true;
            document.getElementById("answer").innerText = "YOU WIN!";
            document.getElementById("reset").style.display = "block";
        }
    }

    //go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // skip the letter if it has been marked correct
        if (!currTile.classList.contains("correct")) {
            //Is it in the word?         //make sure we don't double count
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } 
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent")
            }
        }
    }

    row += 1;
    col = 0; 
}