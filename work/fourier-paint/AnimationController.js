export default class AnimationController {
    #stopSignal; #speed; #elapse; #prev; #pauseSignal;
    
    /** @param {(elapse: number) => void} animation */
    constructor(animation) {
        this.#pauseSignal = false;
        this.#stopSignal = false;
        this.#speed = 1;
        this.#elapse = 0;
        this.#prev = null;
        
        const callback = async now => {
            if (this.#stopSignal) return;
            if (!this.#pauseSignal && this.#prev !== null) 
                this.#elapse += this.#speed * (now - this.#prev);
            this.#prev = now;
            animation(this.#elapse / 1000);
            requestAnimationFrame(callback);
        }
        requestAnimationFrame(callback);
    }
    
    speedUp() {
        this.#speed *= 1.1;
    }
    
    slowDown() {
        this.#speed /= 1.1;
    }
    
    pause() {
        this.#pauseSignal = true;
    }
    
    resume() {
        this.#pauseSignal = false;
    }
    
    togglePause() {
        this.#pauseSignal ? this.resume() : this.pause();
    }
    
    stop() {
        this.#stopSignal = true;
    }
}