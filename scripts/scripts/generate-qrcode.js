javascript
const QRCode = require('qrcode');
const fs = require('fs');

const SITE_URL = 'https://ylma2025.github.io/cardapio/';

async function generateQRCode() {
    try {
        console.log('📱 Gerando QR Code...');
        
        await QRCode.toFile('qrcode.png', SITE_URL, {
            width: 300,
            margin: 2,
            color: {
                dark: '#6d3b9e',  // Roxo da sua marca
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
        });
        
        console.log('✅ QR Code gerado com sucesso!');
        console.log(`🔗 URL: ${SITE_URL}`);
        
    } catch (err) {
        console.error('❌ Erro ao gerar QR Code:', err);
        process.exit(1);
    }
}

generateQRCode();
