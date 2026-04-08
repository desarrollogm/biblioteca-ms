const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // URL directa del espacio Gradio para evitar iFrames externos
    const url = 'https://myshell-ai-openvoicev2.hf.space/';
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/sample3_yaqui.mp3');
    const outputDir = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/vox_v3');
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log(`[*] Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

    try {
        // Encontrar el iframe de Gradio si existe
        let frame = page;
        const frames = page.frames();
        if (frames.length > 1) {
            console.log(`[*] Encontrado iframe de Gradio...`);
            frame = frames.find(f => f.url().includes('hf.space')) || page;
        }

        console.log(`[*] Buscando input de archivo...`);
        const fileInput = await frame.waitForSelector('input[type="file"]', { timeout: 30000 });
        await fileInput.uploadFile(audioPath);
        
        console.log(`[*] Esperando procesamiento...`);
        await new Promise(r => setTimeout(r, 5000));

        const texts = [
            "EL PACTO ROTO. Tomo primero: El Reino Fracturado.",
            "EL TERREMOTO SILENCIOSO. La erosión de la seguridad social.",
            "¿Traición o Cooperación?"
        ];

        for (let i = 0; i < texts.length; i++) {
            console.log(`[*] Generando Clip ${i+1}: "${texts[i]}"`);
            
            const textboxes = await frame.$$('textarea[data-testid="textbox"]');
            // OpenVoice V2: primer textbox es el Prompt, segundo es la referencia (a veces)
            // Generalmente el que tiene el prompt de generación es el segundo
            const genBox = textboxes.length > 1 ? textboxes[1] : textboxes[0];
            
            await frame.evaluate((el) => el.value = '', genBox);
            await genBox.type(texts[i]);

            const submitBtn = await frame.waitForSelector('button.primary', { visible: true });
            await submitBtn.click();

            console.log(`[*] Esperando audio...`);
            await frame.waitForFunction(() => {
                const aud = document.querySelector('audio');
                return aud && aud.src && aud.src.startsWith('blob:');
            }, { timeout: 120000 });

            const audioData = await frame.evaluate(async () => {
                const aud = document.querySelector('audio');
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
                console.log(`[+] Clip ${i+1} guardado: ${filePath}`);
            }
        }

    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
        await page.screenshot({ path: path.join(outputDir, 'error_iframe_debug.png') });
    } finally {
        await browser.close();
    }
})();
