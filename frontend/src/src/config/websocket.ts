const WS_BASE_URL =
    import.meta.env.VITE_WS_BASE_URL ||
    `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;

export default WS_BASE_URL;