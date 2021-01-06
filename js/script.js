////////////////////////////
/// Author: Bouabid Anas ///
////////////////////////////

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

    let graphDiv = document.getElementById("graph-div");
    graphDiv.style.display = "none";

    let div = document.getElementById("light-div");
    div.style.display = "block";

    let text = document.getElementById('text-output').value;
    for (let i = 0; i < text.length; i++) {
        const item = text[i];
        const item2 = text[i+1];
        div.style.background = "transparent";
        await new Promise((resolve) => {
            if (item === ' ') {
                if(item2 === ' '){
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 240);
                }else{
                    // insert desired number of milliseconds to pause here
                    setTimeout(resolve, 240);
                }
            } else if(item === '.'){
                setTimeout(resolve, 80);
                div.style.background = "#ffffff";
            }else if(item === '-'){
                setTimeout(resolve, 240);
                div.style.background = "#000000";
            }
        });
        await new Promise((resolve) => {
            if(item === '.' || item === '-'){
                div.style.background = "transparent";
                setTimeout(resolve, 80);
            }else if(item === ' '){
                div.style.background = "transparent";
                setTimeout(resolve, 240);
            }
        });
    }

    btn.disabled = false;
    btn.style.backgroundColor = "#002e63";
    btn.style.cursor = 'pointer';

    div.style.display = "none";
    graphDiv.style.display = "block";
}


/*-------------------------
<Audio using Web Audio API>
 ------------------------*/



function playAudio(){
    let text = document.getElementById('text-output').value;
    if(text.length === 0){
        return false;
    }

    let btn = document.getElementById("sound-btn");
    btn.disabled = true;
    btn.style.backgroundColor = "#55606d";
    btn.style.cursor = 'not-allowed';

    let AudioContext = new window.AudioContext();
    let oscillator = AudioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 700; //500~800

    let gainNode = AudioContext.createGain();
    gainNode.gain.value = 0;//initialise to 0, if not an empty string will cause a headache :)

    let rate = 20; // words per minute
    let dot = 1.2/rate; //formula according to Wikipedia, dot is the duration in ms, and rate is the speed in wpm


    let t = AudioContext.currentTime;

    for(let i = 0; i < text.length; i++){
        switch (text[i]){
            case '.':
                gainNode.gain.setValueAtTime(1, t); //setValueAtTime(value, startTime)
                t += dot;
                gainNode.gain.setValueAtTime(0, t);
                t += dot; // one dot time space between every char
                break;
            case '-':
                gainNode.gain.setValueAtTime(1, t);
                t += 3 * dot; // because a dash is 3 dots according to Wikipedia
                gainNode.gain.setValueAtTime(0, t);
                t += dot;
                break;
            case ' ':
                t += 3 * dot;
                break;
            default:
                t += 4 * dot;
        }
    }

    let analyser = AudioContext.createAnalyser();

    oscillator.connect(gainNode);
    gainNode.connect(analyser); //Connect oscillator to analyser node
    analyser.connect(AudioContext.destination);

    oscillator.start();

    /////////////////////////////////
    /// Visualising the waveforms ///
    /////////////////////////////////

    let lightDiv = document.getElementById("light-div");
    lightDiv.style.display = "none"; //remove light div

    let canvas = document.getElementById("graph-canvas");
    let graph = canvas.getContext('2d');

    analyser.fftSize = 2048; //Fast Fourier Transform, must be between 2^5 and 2^15, defaults to 2048
    let bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size.
                           //generally its the number of data values we have to play with for the vis.
    let dataArray = new Uint8Array(bufferLength); //an array of 8-bit unsigned integers from var bufferLength

    analyser.getByteTimeDomainData(dataArray); //copies the current waveform, or time-domain, data into a Uint8Array
    console.log(dataArray);

    //Dynamic Width and Height
    let width = document.getElementById("graph-div").offsetWidth;
    let height = document.getElementById("graph-div").offsetHeight;

    graph.clearRect(0, 0, width, height);

    function draw(){
        let graphDiv = document.getElementById("graph-div");
        graphDiv.style.display = "block!important"; //show graph div
        window.requestAnimationFrame(draw); //request that browser to update animation before next repaint

        analyser.getByteTimeDomainData(dataArray); //copies the current waveform, or time-domain, data into a Uint8Array

        let gradient = graph.createLinearGradient(0, 0, 0, 170);
        gradient.addColorStop(0, 'rgb(0, 78, 146)');
        gradient.addColorStop(1, 'rgb(0, 4, 40)');

        graph.fillStyle = gradient;
        graph.fillRect(0, 0, width, height);
        graph.lineWidth = 2;
        graph.strokeStyle = "rgb(255,255,255)";
        graph.beginPath();

        let sliceWidth = width / bufferLength; //with to float, then divide with by number of data values

        let x = 0;
        for(let i = 0; i < bufferLength; i++){ //we loop though each data value
            let v = dataArray[i] / 128.0; //128 = (2048 / 8bits) / 2 (because unsigned int)
            let y = v * height / 2; //height/2 because of positive and negative values

            if(i === 0){
                graph.moveTo(x, y); //move because its first value, we cant draw a line from null
            }else{
                graph.lineTo(x, y);
            }

            x += sliceWidth; //adds sliceWidth to x for each value we draw, meaning horizontal values
        }

        graph.lineTo(graph.width, graph.height);
        graph.stroke();
    }

    draw();

    setTimeout(function () {
        btn.disabled = false;
        btn.style.backgroundColor = "#002e63";
        btn.style.cursor = 'pointer';
    }, t * 1000); //t is length of audio in s, t * 1000 is in ms
}


/*--------------------------
</Audio using Web Audio API>
 -------------------------*/


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


document.getElementById('text-input').addEventListener('input', function () {
    textToMorse(this.value.toUpperCase());
});

document.getElementById('text-output').addEventListener('input', function () {
    morseToText(this.value.toUpperCase());
});


function printArray(){
    let output = "";
    let i = 0;
    for(let key in morse){
        if(i === 0){
            output += "<tr>";
        }else if(i % 4 === 0){
            output += "</tr><tr>";
        }
        output += "<td>"+ key +"</td>";
        output += "<td>"+ morse[key] +"</td>";

        i++;
    }
    output += "</tr>";
    return output;
}

document.getElementById("morse-dic").innerHTML = printArray();