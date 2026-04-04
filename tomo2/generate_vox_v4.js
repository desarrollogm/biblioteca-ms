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
    const audioPath = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/paloma_sample.mp3');
    const outputDir = path.resolve('C:/Users/USUARIO/.gemini/antigravity/scratch/tomo2_production/vox');
    
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
            "Nos dijeron que nuestra labor era el silencio... pero el aula nos enseñó que la verdad se defiende con dignidad. Por los que ya no están, por los que vienen... este 1ro de mayo, la voz es nuestra.",
            "¿Escuchas eso? Es el latido del Magisterio Sonorense. No somos uno solo, somos miles marchando en una misma línea. Si tú no estás, falta una pieza del futuro. ¡Únete al Movimiento MS!",
            "Este 1ro de mayo no marchamos por rutina, marchamos por justicia. Nos vemos a las 8 AM. Calle 5 de Febrero. Con el corazón en alto. ¡MS presente!"
        ];

        for (let i = 0; i < texts.length; i++) {
            console.log(`[*] Generando Audio ${i+1}: "${texts[i].substring(0, 30)}..."`);
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
                console.log(`[+] Audio ${i+1} guardado: ${filePath}`);
            }
        }
    } catch (err) {
        console.error(`[!] Error: ${err.message}`);
    } finally {
        await browser.close();
    }
})();
