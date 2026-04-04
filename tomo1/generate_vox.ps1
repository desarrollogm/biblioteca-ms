Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Asegurar carpeta de salida
$outPath = 'C:\Users\USUARIO\.gemini\antigravity\scratch\tomo1_production\vox_v3'
if (!(Test-Path $outPath)) { New-Item -ItemType Directory -Path $outPath -Force }

# Clip 1
$speak.SetOutputToWaveFile("$outPath\clip_1.wav")
$speak.Speak('EL PACTO ROTO. Tomo primero: El Reino Fracturado.')

# Clip 2
$speak.SetOutputToWaveFile("$outPath\clip_2.wav")
$speak.Speak('EL TERREMOTO SILENCIOSO. La erosion de la seguridad social.')

# Clip 3
$speak.SetOutputToWaveFile("$outPath\clip_3.wav")
$speak.Speak('Traicion o Cooperacion?')

$speak.Dispose()
