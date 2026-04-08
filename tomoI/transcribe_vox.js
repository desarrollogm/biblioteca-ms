const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Usaremos un espacio de Whisper que sea simple y rápido
    const url = 'https://hf-audio-whisper-large-v3-turbo.hf.space/';
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/sample3_yaqui.mp3');
    
    console.log(`[*] Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

    try {
        console.log(`[*] Subiendo archivo para transcripción: ${audioPath}`);
        // En Gradio, el input de archivo suele estar oculto pero accesible vía selector 'input[type="file"]'
        const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 30000 });
        await fileInput.uploadFile(audioPath);
        
        console.log(`[*] Pulsando botón de transcripción...`);
        // Buscar el botón 'Submit' o similar
        const submitBtn = await page.waitForSelector('button.primary', { visible: true });
        await submitBtn.click();

        console.log(`[*] Esperando resultado (Whisper)...`);
        // Esperar a que el área de texto de salida tenga contenido
        const outputSelector = 'textarea[data-testid="textbox"]';
        await page.waitForFunction((sel) => {
            const el = document.querySelector(sel);
            return el && el.value && el.value.length > 10;
        }, { timeout: 120000 }, outputSelector);

        const transcript = await page.evaluate((sel) => document.querySelector(sel).value, outputSelector);
        
        console.log(`[+] Transcripción obtenida:\n${transcript}`);
        fs.writeFileSync('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/vox/transcript.txt', transcript);

    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
    } finally {
        await browser.close();
    }
})();
