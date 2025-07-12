export default class AnimationController {
    #stopSignal; #speed; #elapse; #prev; #pauseSignal;
    
    /** @param {(elapse: number, pause: boolean) => void} animation */
    constructor(animation) {
        this.#pauseSignal = false;
        this.#stopSignal = false;
        this.#speed = 1;
        this.#elapse = 0;
        
        const callback = now => {
            now /= 1000;
            if (this.#stopSignal) return;
            if (!this.#pauseSignal) {
                this.#elapse += this.#speed * (now - this.#prev);
            }
            animation(this.#elapse, this.#pauseSignal);
            this.#prev = now;
            requestAnimationFrame(callback);
        }
        requestAnimationFrame(now => {
            this.#prev = now / 1000;
            requestAnimationFrame(callback);
        });
    }
    
    speedUp(scale = 1.1) {
        this.#speed *= scale;
    }
    
    slowDown(scale = 1 / 1.1) {
        this.#speed *= scale;
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