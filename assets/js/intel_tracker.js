/**
 * INTEL TRACKER MS 2026 - OPERACIÓN OJO DE HALCÓN
 * Modo Sigilo: Activado
 */

const INTEL_URL = "https://script.google.com/macros/s/AKfycbwJUNUGKckgw5ESN6ERqItOrJTCCT1fdi44enWq1jiZ0hax6QWpkbHKxMQGEhGjV5jDlw/exec"; 

(async function() {
    try {
        // 1. Obtener Geolocalización (Sigilo)
        const geoRes = await fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,mobile,proxy,query');
        const geoData = await geoRes.json();

        // 2. Detectar Dispositivo
        const ua = navigator.userAgent;
        let device = "Desktop";
        if (/tablet|ipad|playbook|silk/i.test(ua)) device = "Tablet";
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) device = "Mobile";

        // 3. Preparar Paquete de Inteligencia
        const intelPackage = {
            tomo: document.title.split('|')[0].trim(),
            dispositivo: device,
            ciudad: geoData.city || "Desconocida",
            estado: geoData.regionName || "Desconocido",
            origen: document.referrer || "Directo",
            navegador: navigator.appName + " " + navigator.appVersion.split(' ')[0]
        };

        // 4. Envío al Receptor
        if (INTEL_URL !== "URL_DE_SU_APPS_SCRIPT") {
            fetch(INTEL_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(intelPackage)
            });
        }

    } catch (e) {
        // Silencio absoluto en caso de error
    }
})();
