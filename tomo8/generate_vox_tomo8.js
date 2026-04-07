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
    const audioRef = 'C:/Users/USUARIO/.gemini/antigravity/scratch/biblioteca-ms/tomo8/sc1_full.mp3'; 
    const outputDir = 'C:/Users/USUARIO/.gemini/antigravity/scratch/biblioteca-ms/tomo8/vox_final';
    
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    console.log(`[*] Navegando a TTS Engine...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const scripts = [
        { id: 4, text: "Hemos aprendido la Ley de la Escalada. No se trata de gritar más fuerte, sino de coordinarse mejor. La Matriz Z3 no es una protesta, es un protocolo de sincronización técnica. Si ellos mueven un peón, nosotros alteramos la estructura del tablero." },
        { id: 5, text: "La Zona Económica III no es un privilegio geográfico, es justicia histórica. Durante décadas, el magisterio han sostenido el sistema con salarios de zona dos mientras el costo de vida es de zona tres. Es hora de que el salario refleje la dignidad de nuestra labor." },
        { id: 6, text: "El Fondo de Pensión Intergeneracional Protegida es el escudo que nos libera de la UMA. No es una promesa política, es una estructura blindada por la base. Hoy sembramos la pensión que cosecharán quienes apenas están entrando al aula." }
    ];

    try {
        console.log(`[*] Subiendo referencia: ${audioRef}`);
        const fileInput = await page.waitForSelector('input[type="file"]');
        await fileInput.uploadFile(audioRef);
        await new Promise(r => setTimeout(r, 4000));

        for (const scene of scripts) {
            console.log(`[*] Generando Vox Cap ${scene.id}...`);
            const textBox = await page.waitForSelector('textarea[data-testid="textbox"]');
            await page.evaluate((el) => el.value = '', textBox);
            await textBox.type(scene.text);

            const genBtn = await page.waitForSelector('button.primary');
            await genBtn.click();

            await page.waitForFunction(() => {
                const aud = document.querySelector('audio');
                return aud && aud.src && aud.src.startsWith('blob:');
            }, { timeout: 120000 });

            const audioData = await page.evaluate(async () => {
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
                const filePath = path.join(outputDir, `vox_cap${scene.id}.mp3`);
                fs.writeFileSync(filePath, Buffer.from(audioData, 'base64'));
                console.log(`[+] Vox Cap ${scene.id} guardado.`);
            }
            
            // Simular recarga o limpieza para el siguiente clip
            await page.reload({ waitUntil: 'networkidle2' });
            const reFileInput = await page.waitForSelector('input[type="file"]');
            await reFileInput.uploadFile(audioRef);
            await new Promise(r => setTimeout(r, 3000));
        }

    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
    } finally {
        await browser.close();
    }
})();
