const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const url = 'https://mrfakename-e2-f5-tts.hf.space/';
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/sample3_yaqui.mp3');
    const outputDir = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/vox');
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    console.log(`[*] Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    try {
        console.log(`[*] Subiendo referencia: ${audioPath}`);
        const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 30000 });
        await fileInput.uploadFile(audioPath);
        
        console.log(`[*] Esperando procesamiento de audio...`);
        await new Promise(r => setTimeout(r, 5000));

        const texts = [
            "EL PACTO ROTO. Tomo primero: El Reino Fracturado.",
            "EL TERREMOTO SILENCIOSO. La erosión de la seguridad social.",
            "¿Traición o Cooperación?"
        ];

        for (let i = 0; i < texts.length; i++) {
            console.log(`[*] Generando Clip ${i+1}: "${texts[i]}"`);
            
            // Localizar el textbox dinámicamente
            const textBox = await page.waitForSelector('textarea[data-testid="textbox"]', { visible: true });
            await page.evaluate((el) => el.value = '', textBox);
            await textBox.type(texts[i]);

            // Clic en Generar
            const genBtn = await page.waitForSelector('button.primary', { visible: true });
            await genBtn.click();

            console.log(`[*] Esperando síntesis (esto puede tardar)...`);
            const audioSelector = 'audio'; 
            await page.waitForFunction(() => {
                const aud = document.querySelector('audio');
                return aud && aud.src && aud.src.startsWith('blob:');
            }, { timeout: 120000 });

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
        }

    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
    } finally {
        await browser.close();
    }
})();
