/**
 * INTEL TRACKER MS 2026 - OPERACIÓN OJO DE HALCÓN
 * Modo Sigilo: Activado
 */

const INTEL_URL = "https://script.google.com/macros/s/AKfycbwDQD-qkUWpQAO8v3ol57A4do3mecxj2dUIm23mWzbb-267muumLIoy2WUTMXyG46BobA/exec"; 
const ALERT_URL = "https://f9bb168722a5c7.lhr.life/api/external-traffic-alert";

(async function() {
    try {
        // 1. Obtener Geolocalización con reintentos
        let geoData = {};
        for(let i=0; i<3; i++) {
            try {
                const geoRes = await fetch('https://ipapi.co/json/');
                geoData = await geoRes.json();
                if(geoData.ip) break;
            } catch(e) { await new Promise(r => setTimeout(r, 1000)); }
        }

        // 2. Detectar Dispositivo
        const ua = navigator.userAgent;
        let device = "Desktop";
        if (/tablet|ipad|playbook|silk/i.test(ua)) device = "Tablet";
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) device = "Mobile";

        // IMPORTANTE: ipapi.co usa 'region', no 'regionName'
        const region = geoData.region || "Desconocido";

        // 3. Preparar Paquete de Inteligencia (Orden A...I para Google Sheets)
        const intelPackage = {
            ip: geoData.ip || "0.0.0.0",
            isp: geoData.org || "Desconocido",
            tomo: document.title.split('|')[0].trim(),
            dispositivo: device,
            ciudad: geoData.city || "Desconocida",
            estado: region,
            origen: document.referrer || "Directo",
            navegador: navigator.appName + " " + navigator.appVersion.split(' ')[0]
        };

        // 4. Envío al Receptor de Google Sheets
        // Para evitar Error 400 en no-cors, no enviamos cabeceras personalizadas
        if (INTEL_URL.includes("/macros/")) {
            fetch(INTEL_URL, {
                method: "POST",
                mode: "no-cors", 
                body: JSON.stringify(intelPackage)
            }).catch(e => {}); 
        }

        // 5. Alerta Crítica: Tráfico fuera de Sonora
        if (region.toLowerCase() !== "sonora" && region !== "Desconocido") {
            fetch(ALERT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ip: intelPackage.ip,
                    city: intelPackage.ciudad,
                    region: intelPackage.estado,
                    isp: intelPackage.isp,
                    tomo: intelPackage.tomo
                })
            }).catch(e => {});
        }

    } catch (e) {
        // Silencio absoluto en el cliente
    }
})();
