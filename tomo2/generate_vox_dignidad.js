const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const url = 'https://myshell-ai-openvoicev2.hf.space/';
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo1_production/sample3_yaqui.mp3');
    const outputDir = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo2_production/vox_dignidad');
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log(`[*] Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

    try {
        let frame = page;
        const frames = page.frames();
        if (frames.length > 1) {
            frame = frames.find(f => f.url().includes('hf.space')) || page;
        }

        const fileInput = await frame.waitForSelector('input[type="file"]', { timeout: 30000 });
        await fileInput.uploadFile(audioPath);
        
        await new Promise(r => setTimeout(r, 5000));

        const texts = [
            "Colegas, observen este espacio. Un aula en silencio no es solo un vacío, es el testimonio de nuestra lucha.",
            "Es el compromiso de generaciones que hoy ven su seguridad social vulnerada. La estabilidad del ISSSTE no es una concesión, es un derecho ganado con vocación y servicio.",
            "Por la defensa de nuestras pensiones y la dignidad de nuestro gremio, nos convocamos este 1ro de mayo en la Calle 5 de Febrero.",
            "Unidos por la justicia y el futuro. Magisterio Sonorense: Presente en la lucha. Los esperamos."
        ];

        for (let i = 0; i < texts.length; i++) {
            console.log(`[*] Generando Clip ${i+1}: "${texts[i]}"`);
            
            const textboxes = await frame.$$('textarea[data-testid="textbox"]');
            const genBox = textboxes.length > 1 ? textboxes[1] : textboxes[0];
            
            await frame.evaluate((el) => el.value = '', genBox);
            await genBox.type(texts[i]);

            const submitBtn = await frame.waitForSelector('button.primary', { visible: true });
            await submitBtn.click();

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
    } finally {
        await browser.close();
    }
})();
