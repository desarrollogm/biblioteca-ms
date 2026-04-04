const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Espacio de OpenVoice V2 (myshell-ai)
    const url = 'https://myshell-ai-openvoicev2.hf.space/';
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/sample3_yaqui.mp3');
    const outputDir = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/vox_v3');
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log(`[*] Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

    try {
        console.log(`[*] Subiendo referencia: ${audioPath}`);
        const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 30000 });
        await fileInput.uploadFile(audioPath);
        
        const texts = [
            "EL PACTO ROTO. Tomo primero: El Reino Fracturado.",
            "EL TERREMOTO SILENCIOSO. La erosión de la seguridad social.",
            "¿Traición o Cooperación?"
        ];

        for (let i = 0; i < texts.length; i++) {
            console.log(`[*] Generando Clip ${i+1}: "${texts[i]}"`);
            
            // Localizar el textarea de generación (suele ser el segundo o tener un label específico)
            const textboxes = await page.$$('textarea[data-testid="textbox"]');
            const genBox = textboxes.length > 1 ? textboxes[1] : textboxes[0];
            
            await page.evaluate((el) => el.value = '', genBox);
            await genBox.type(texts[i]);

            // Clic en 'Submit'/'Synthesize'
            const submitBtn = await page.waitForSelector('button.primary', { visible: true });
            await submitBtn.click();

            console.log(`[*] Procesando síntesis instantánea...`);
            
            const audioSelector = 'audio';
            await page.waitForFunction(() => {
                const aud = document.querySelector('audio');
                return aud && aud.src && aud.src.startsWith('blob:');
            }, { timeout: 60000 });

            const audioData = await page.evaluate(async () => {
                const aud = document.querySelector('audio');
                if (!aud || !aud.src) return null;
                const resp = await fetch(aud.src);
                const blob = await resp.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                });
            });

            if (audioData) {
                const filePath = path.join(outputDir, `clip_${i+1}.mp3`);
                fs.writeFileSync(filePath, Buffer.from(audioData, 'base64'));
                console.log(`[+] Clip ${i+1} guardado en: ${filePath}`);
            }

            // Pequeña espera para no saturar
            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
        // Capturar pantalla para debug si falla
        await page.screenshot({ path: path.join(outputDir, 'error_debug.png') });
    } finally {
        await browser.close();
    }
})();
