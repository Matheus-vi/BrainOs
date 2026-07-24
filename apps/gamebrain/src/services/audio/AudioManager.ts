class AudioManager {

    private running = false;

    start(){

        this.running = true;

        console.log("🎤 Audio Started");

    }

    stop(){

        this.running = false;

        console.log("🔇 Audio Stopped");

    }

    isRunning(){

        return this.running;

    }

}

export default new AudioManager();