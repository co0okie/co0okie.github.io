{

function on(element, type) {
    return new Promise(r => element.addEventListener(type, r, { once: true }));
}

function numberOnly(e) {
    /*
        has value, is number, repeated | prevent default
        0 X X | 0
        1 0 X | 1
        1 1 0 | 0
        1 1 1 | 1
    */
    e.data && (!/[0-9]/.test(e.data) || input.value.includes(e.data)) && e.preventDefault();
}

async function playerGuess() {
    input.addEventListener('beforeinput', numberOnly);
    
    // generate random answer
    let answer = [];
    let select = Array.from(new Array(10).keys()).map(n => n.toString());
    for (let _ = 0; _ < numberLength; _++) answer.push(...select.splice(Math.floor(Math.random() * select.length), 1));
    // console.log(answer);
        
    for (;;) {
        let e = await on(input, 'keydown');
        if (e.key !== 'Enter') continue;
        if (input.value.length < numberLength) continue;
        
        let a = 0, b = 0;
        for (let i = 0; i < answer.length; i++) {
            let index = input.value.indexOf(answer[i]);
            if      (index ===  i) a++;
            else if (index !== -1) b++;
        }
        
        dialog.innerHTML = `${a}A${b}B`;
        recordText.innerHTML += `${input.value} ${a}A${b}B<br>`;
        input.value = '';
        if (a === numberLength) break;
    }
    
    dialog.innerHTML = 'you win!';
}

async function computerGuess() {
    input.removeEventListener('beforeinput', numberOnly);
    const records = [];
    talk: for (;;) {
        // console.log(JSON.stringify(records));
        // 4251
        // 1234 1A2B => (1, 3)
        // 7561 1A1B => (1, 2)
        // 3(0, 1)(0, 0), X, X, X => (0-3, 1-4)(0-3, 0-3)
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), X, X => (0-2, 1-3)(1-3, 1-3)
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), 0(0, 0)(0, 0), X => (0-1, 1-2)(1-2, 1-2)
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), 2(0, 1)(0, 0), X => (0-1, 2-3)(1-2, 1-2)
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), 2(0, 1)(0, 0), 4(1, 1)(0, 0) => (1, 3)(1, 1)
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), 2(0, 1)(0, 0), ...
        // 3(0, 1)(0, 0), 5(0, 0)(1, 1), ...
        
        // guess
        let guess = [];
        let matches = new Array(records.length).fill(null).map(() => []);
        // console.log(JSON.stringify(matches));
        let result = (function findPossible() {
            // console.log('guess.length:', guess.length);
            // remove duplicated
            let possibility = [...new Array(10).keys()];
            for (let n of guess) {
                let index = possibility.indexOf(n);
                possibility.splice(index, 1);
            }
            
            // find possible
            while(possibility.length) {
                // get random number
                // console.log('possibility:', JSON.stringify(possibility));
                let [n] = possibility.splice(Math.floor(Math.random() * possibility.length), 1);
                // console.log('n:', n);
                
                // n out of range?
                let ABs = [];
                if (records.some((record, i) => {
                    let index = record.guess.indexOf(n);
                    // console.log(guess.length, index);
                    let AB = index ===  guess.length ? [1, 1] : index !== -1 ? [0, 1] : [0, 0];
                    // console.log('AB', JSON.stringify(AB));
                    ABs.push(AB);
                    // console.log('ABs', JSON.stringify(ABs));
                    let [minA, minB] = matches[i].reduce(([pA, pB], [cA, cB]) => [pA + cA, pB + cB], AB);
                    let maxA = minA + numberLength - 1 - guess.length, maxB = minB + numberLength - 1 - guess.length;
                    // console.log(`A: ${minA} ~ ${maxA}, B: ${minB} ~ ${maxB}, ${record.guess.join('')}, ${record.a} ${record.b}`);
                    return record.a < minA || record.a > maxA || record.b < minB || record.b > maxB;
                })) {
                    // console.log('some out of range');
                    continue;
                }
                for (let i = 0; i < matches.length; i++) matches[i].push(ABs[i]);
                // console.log('matches:', JSON.stringify(matches));
                guess.push(n);
                // console.log('guess:', JSON.stringify(guess));
                
                if (guess.length !== numberLength && !findPossible()) {
                    matches.forEach(a => a.pop());
                    guess.pop();
                    continue;
                }
                
                // console.log('return true');
                return true;
            }
            
            // console.log('return false');
            return false;
        })()
        
        if (result) {
            dialog.innerHTML = guess.join('');
        } else {
            dialog.innerHTML = 'no answer.';
            break;
        }
        
        // await nAnB
        for (;;) {
            let e = await on(input, 'keydown');
            if (e.key !== 'Enter') continue;
            let match = input.value.match(/^([0-9])([0-9])$/);
            if (!match) continue;
            let [a, b] = [match[1], match[2]].map(s => parseInt(s));
            
            input.value = '';
            dialog.innerHTML = 'loading...';
            
            if (a === numberLength) {
                dialog.innerHTML = 'yeah!';
                break talk;
            }
            
            // prevent lag
            await new Promise(r => setTimeout(r, 1));
            
            records.push({ guess: guess, a: a, b: a + b });
            break;
        }
    }
}

const dialog = document.createElement('p');
const playerGuessButton = document.createElement('input');
const computerGuessButton = document.createElement('input');
const input = document.createElement('input');
const replay = document.createElement('input');
const recordText = document.createElement('p');
MAIN.append(dialog, playerGuessButton, computerGuessButton, input, replay, recordText);
playerGuessButton.type = computerGuessButton.type = 'button';
playerGuessButton.value = 'player guess';
computerGuessButton.value = 'computer guess';
input.style.width = '10ch';
replay.type = 'button';
replay.value = 'replay';

let numberLength;

(async () => {
    for (;;) {
        input.style.display = 'none';
        replay.style.display = 'none';
        playerGuessButton.style.display = '';
        computerGuessButton.style.display = '';
        recordText.innerHTML = '';
        dialog.innerHTML = 'number length:';
        numberLength = 9;
        input.maxLength = numberLength;
        dialog.innerHTML = 'select game mode:';
        let game = await new Promise(r => {
            on(playerGuessButton, 'click').then(e => r(playerGuess));
            on(computerGuessButton, 'click').then(e => r(computerGuess));
        });
        
        playerGuessButton.style.display = 'none';
        computerGuessButton.style.display = 'none';
        input.style.display = '';
        dialog.innerHTML = 'start';
        await game();
        input.style.display = 'none';
        replay.style.display = '';
        await on(replay, 'click');
    }
})()

}