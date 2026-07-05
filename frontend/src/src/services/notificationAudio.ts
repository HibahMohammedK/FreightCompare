import notificationSound from "../assets/sounds/notifications.mp3";

class NotificationAudio {

    private audio: HTMLAudioElement;

    private unlocked = false;

    constructor() {

        this.audio = new Audio(
            notificationSound
        );

        this.audio.volume = 0.35;

    }

    async unlock() {

        if (this.unlocked) {
            return;
        }

        try {

            this.audio.muted = true;

            await this.audio.play();

            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.muted = false;

            this.unlocked = true;

            console.log(
                "Notification audio unlocked."
            );

        } catch (error) {

            console.error(
                "Failed to unlock notification audio.",
                error,
            );

        }

    }

    play() {

        if (!this.unlocked) {
            return;
        }

        this.audio.pause();

        this.audio.currentTime = 0;

        this.audio.play().catch(
            console.error
        );

    }

}

export const notificationAudio =
    new NotificationAudio();