class PresenceSocket {
    private socket: WebSocket | null = null;

    private token: string | null = null;

    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    private reconnectAttempts = 0;

    private manuallyDisconnected = false;

    connect(token: string) {

         console.log(
            "PRESENCE CONNECT CALLED",
            token ? "TOKEN EXISTS" : "NO TOKEN"
        );

        this.token = token;
        this.manuallyDisconnected = false;

        if (
            this.socket &&
            (
                this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        this.createConnection();
    }

    private createConnection() {

        console.log(
            "PRESENCE CREATING SOCKET"
        );

        if (!this.token || this.manuallyDisconnected) {

            console.log(
                "PRESENCE SOCKET NOT CREATED",
                {
                    hasToken: !!this.token,
                    manuallyDisconnected:
                        this.manuallyDisconnected,
                }
            );

            return;
        }

        const socket = new WebSocket(
            `ws://localhost:8000/ws/presence/?token=${this.token}`
        );

        this.socket = socket;

        socket.onopen = () => {

            // Ignore an old connection that has already
            // been replaced by a newer connection.
            if (
                socket !== this.socket ||
                this.manuallyDisconnected
            ) {
                socket.close();
                return;
            }

            console.log(
                "Presence WebSocket Connected"
            );

            this.reconnectAttempts = 0;

            this.startHeartbeat();
        };

        socket.onclose = () => {

        // Ignore close events from an old socket.
        if (socket !== this.socket) {
            return;
        }

        console.log(
            "Presence WebSocket Closed"
        );

        this.stopHeartbeat();

        this.socket = null;

        if (!this.manuallyDisconnected) {
            this.scheduleReconnect();
        }
    };  

        socket.onerror = (error) => {
            console.error(
                "Presence WebSocket Error:",
                error
            );

            socket.close();
        };
    }

    private startHeartbeat() {
        this.stopHeartbeat();

        this.heartbeatInterval = setInterval(() => {
            if (
                this.socket &&
                this.socket.readyState === WebSocket.OPEN
            ) {
                this.socket.send(
                    JSON.stringify({
                        type: "heartbeat",
                    })
                );
            }
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private scheduleReconnect() {
        if (
            this.manuallyDisconnected ||
            !this.token ||
            this.reconnectTimeout
        ) {
            return;
        }

        const delays = [
            2000,
            4000,
            8000,
            15000,
            30000,
        ];

        const delay =
            delays[
                Math.min(
                    this.reconnectAttempts,
                    delays.length - 1
                )
            ];

        console.log(
            `Presence WebSocket reconnecting in ${delay}ms`
        );

        this.reconnectAttempts += 1;

        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;

            this.createConnection();
        }, delay);
    }

    disconnect() {
        this.manuallyDisconnected = true;

        this.stopHeartbeat();

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        this.socket?.close();

        this.socket = null;

        this.token = null;

        this.reconnectAttempts = 0;
    }
}

export const presenceSocket =
    new PresenceSocket();