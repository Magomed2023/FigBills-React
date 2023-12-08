export function isTokenValid(checkRefreshToken) {
    // Zugriffstoken abrufen
    let accessToken = localStorage.getItem('token') || '';
    // Das Zugriffstoken ist ein JWT-Token (siehe jwt.io) und besteht daher aus drei Teilen, die durch Punkte verbunden sind. Wir teilen sie auf.
    const tokenParts = accessToken.split('.');
    // Überprüfen, ob das Token tatsächlich aus drei Teilen besteht
    if (tokenParts.length === 3) {
        // Das Token enthält die Daten als JSON, aber base64-kodiert. Zum Dekodieren von base64 können wir die integrierte JS-Funktion atob verwenden
        // Danach parsen wir das JSON
        // (Hinweis: Es gibt auch eine Funktion btoa, die base64 kodiert, sie können leicht verwechselt werden!)
        const tokenData = JSON.parse(atob(tokenParts[1]));
        // Überprüfen des Ablaufdatums im Token, wenn es nicht abgelaufen ist, ist das Token gültig
        if (tokenData.exp >= Date.now() / 1000) {
            return true;
        }
    }
    // Wenn wir auch das Auffrischungstoken überprüfen wollen, machen wir dasselbe wie für das Zugriffstoken
    if (checkRefreshToken) {
        let refreshToken = localStorage.getItem('refresh_token') || '';
        const tokenParts = refreshToken.split('.');
        if (tokenParts.length === 3) {
            const tokenData = JSON.parse(atob(tokenParts[1]));
            if (tokenData.exp >= Date.now()) {
                return true;
            }
        }
    }
    // Wenn das Token nicht gültig ist, gib false zurück
    return false;
}
