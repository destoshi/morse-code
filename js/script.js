//Author: Bouabid Anas

let morse = {
    ' ':'  ', 'A':'.-', 'B':'-...',
    'C':'-.-.', 'D':'-..', 'E':'.',
    'F':'..-.', 'G':'--.', 'H':'....',
    'I':'..', 'J':'.---', 'K':'-.-',
    'L':'.-..', 'M':'--', 'N':'-.',
    'O':'---', 'P':'.--.', 'Q':'--.-',
    'R':'.-.', 'S':'...', 'T':'-',
    'U':'..-', 'V':'...-', 'W':'.--',
    'X':'-..-', 'Y':'-.--', 'Z':'--..',
    '1':'.----', '2':'..---', '3':'...--',
    '4':'....-', '5':'.....', '6':'-....',
    '7':'--...', '8':'---..', '9':'----.',
    '0':'-----', ', ':'--..--', '.':'.-.-.-',
    '?':'..--..', '/':'-..-.', '-':'-....-',
    '(':'-.--.', ')':'-.--.-'
};


function textToMorse(text){
    let output = '';
    let counter = 0;
    for(let letter in text){
        //letter is an index, not the actual letter, so to get the letter we have to type text[letter]
        if(morse[text[letter]]){
            if(counter == 0){//checking for first letter of text to we dont add a space
                output += morse[text[letter]];//also adds one space before each letter
            }else if (text[letter] === ' '){
                output += ' ';//we only add one space, because there's already a second space before letters
            }else{
                output += ' ' + morse[text[letter]];//also adds one space before each letter
            }
        }else{
            output += ' #';// # for unknown characters
        }
        counter++;
    }
    document.getElementById('text-output').value = output;
}

function morseToLetter(letter){
    for(let m in morse){
        if(morse[m] === letter){
            return m;
        }
    }
    return '#';
}

function morseToText(text){
    let output = '';
    text = text.split("  ");//we split the text for every double space (meaning every word)

    let counter = 0;
    for(let w in text){
        //if counter is not 0 we add a space (one space before every word)
        if(counter !== 0){
            output += ' ';
        }
        //we split the word for every space (meaning every letter)
        let word = text[w].split(' ');
        for(let letter in word){
            output += morseToLetter(word[letter]);
        }
        document.getElementById('text-input').value = output;

        counter++;
    }
}


document.getElementById('text-input').addEventListener('input', function () {
    textToMorse(this.value.toUpperCase());
});

document.getElementById('text-output').addEventListener('input', function () {
    morseToText(this.value.toUpperCase());
});

let beep = document.getElementById("audio");

async function playSound() {
    let btn = document.getElementById("sound-btn");
    btn.disabled = true;
    btn.style.backgroundColor = "#55606d";
    btn.style.cursor = 'not-allowed';

    let text = document.getElementById('text-output').value;
    for (let i = 0; i < text.length; i++) {
        const item = text[i];
        const item2 = text[i+1]
        await new Promise((resolve) => {
            if (item === ' ') {
                if(item2 === ' '){
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 900);
                }else{
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 450);
                }
            } else if(item === '.'){
                beep.onended = resolve; //on ended, meaning previous event has fully ended
                beep.playbackRate = 1.3;
                beep.play();
            }else if(item === '-'){
                beep.onended = resolve;
                beep.playbackRate = 0.5;
                beep.play();
            }
        });
    }

    btn.disabled = false;
    btn.style.backgroundColor = "#002e63";
    btn.style.cursor = 'pointer';
}

async function playLight() {
    let btn = document.getElementById("light-btn");
    btn.disabled = true;
    btn.style.backgroundColor = "#55606d";
    btn.style.cursor = 'not-allowed';

    let div = document.getElementById("light-div");

    let text = document.getElementById('text-output').value;
    for (let i = 0; i < text.length; i++) {
        const item = text[i];
        const item2 = text[i+1];
        div.style.background = "transparent";
        await new Promise((resolve) => {
            if (item === ' ') {
                if(item2 === ' '){
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 750);
                }else{
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 150);
                }
            } else if(item === '.'){
                setTimeout(resolve, 150);
                div.style.background = "#ffffff";
            }else if(item === '-'){
                setTimeout(resolve, 150);
                div.style.background = "#000000";
            }
        });
        await new Promise((resolve) => {
            if(item === '.' || item === '-'){
                div.style.background = "transparent";
                setTimeout(resolve, 150);
            }else if(item === ' '){
                div.style.background = "transparent";
                setTimeout(resolve, 200);
            }
        });
    }

    btn.disabled = false;
    btn.style.backgroundColor = "#002e63";
    btn.style.cursor = 'pointer';
}

function reset(){
    let soundBtn = document.getElementById("sound-btn");
    soundBtn.disabled = false;
    soundBtn.style.backgroundColor = "#002e63";
    soundBtn.style.cursor = 'pointer';

    let lightBtn = document.getElementById("light-btn");
    lightBtn.disabled = false;
    lightBtn.style.backgroundColor = "#002e63";
    lightBtn.style.cursor = 'pointer';
}



