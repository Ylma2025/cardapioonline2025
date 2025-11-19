javascript
const fs = require('fs');
const csv = require('csv-parser');

// Configurações do seu cardápio
const CONFIG = {
    siteUrl: 'https://ylma2025.github.io/cardapio/',
    nomeEstabelecimento: 'Ylma Cake\'s & Cia',
    telefone: '(71) 98864-0247',
    endereco: 'Praça do Baixo Formoso, s/n - Porto de Sauipe - Entre Rios - BA'
};

function processCSV() {
    const results = [];
    
    console.log('📊 Processando arquivo CSV...');
    
    fs.createReadStream('data/cardapio.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(`✅ CSV processado: ${results.length} itens encontrados`);
            const cardapioData = organizeData(results);
            generateHTML(cardapioData);
        })
        .on('error', (error) => {
            console.error('❌ Erro ao processar CSV:', error);
        });
}

function organizeData(data) {
    const categorias = {};
    
    data.forEach(item => {
        // Verificar se item está disponível para venda
        const disponivel = item['Available for sale [Ylma Cake\'s]'] === 'Y';
        
        if (disponivel) {
            const categoria = item.Category || 'Outros';
            const nome = item.Name || 'Item sem nome';
            const preco = item['Price [Ylma Cake\'s]'] || '0.00';
            
            if (!categorias[categoria]) {
                categorias[categoria] = [];
            }
            
            // Limpar descrição de tags HTML
            let descricao = item.Description || '';
            descricao = descricao.replace(/<[^>]*>/g, '').trim();
            
            categorias[categoria].push({
                nome: nome,
                descricao: descricao,
                preco: preco
            });
        }
    });
    
    console.log(`📁 Categorias processadas: ${Object.keys(categorias).length}`);
    return categorias;
}

function generateHTML(cardapioData) {
    const dataAtualizacao = new Date().toLocaleString('pt-BR');
    
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.nomeEstabelecimento} - Cardápio Digital</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%);
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .header {
            background: linear-gradient(135deg, #8b5fad 0%, #6d3b9e 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(109, 59, 158, 0.3);
        }

        .logo h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .logo p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .contato {
            background: white;
            padding: 2rem 0;
            border-bottom: 3px solid #8b5fad;
        }

        .contato-info {
            display: flex;
            justify-content: center;
            gap: 3rem;
            flex-wrap: wrap;
        }

        .contato-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1.1rem;
        }

        .cardapio {
            padding: 3rem 0;
        }

        .cardapio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .categoria-section {
            margin-bottom: 3rem;
        }

        .categoria-titulo {
            font-size: 1.8rem;
            color: #6d3b9e;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #8b5fad;
        }

        .item-card {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border-left: 4px solid #8b5fad;
        }

        .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(139, 95, 173, 0.2);
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .item-nome {
            font-size: 1.3rem;
            font-weight: 600;
            color: #333;
            flex: 1;
        }

        .item-preco {
            font-size: 1.4rem;
            font-weight: 700;
            color: #6d3b9e;
            background: #f0e6ff;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
        }

        .item-descricao {
            color: #666;
            margin-bottom: 1rem;
            line-height: 1.5;
        }

        .qrcode-section {
            text-align: center;
            margin: 4rem 0;
            padding: 2rem;
            background: #f0e6ff;
            border-radius: 15px;
            border: 3px solid #8b5fad;
        }

        .qrcode-section h3 {
            color: #6d3b9e;
            margin-bottom: 1rem;
        }

        .atualizacao {
            text-align: center;
            margin: 1rem 0;
            color: #666;
            font-size: 0.9rem;
        }

        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 3rem;
        }

        @media (max-width: 768px) {
            .logo h1 { font-size: 2rem; }
            .contato-info { flex-direction: column; gap: 1rem; }
            .cardapio-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <h1>${CONFIG.nomeEstabelecimento}</h1>
                <p>Cardápio Digital Automático</p>
                <div class="atualizacao">
                    📍 Atualizado em: ${dataAtualizacao}
                </div>
            </div>
        </div>
    </header>

    <section class="contato">
        <div class="container">
            <div class="contato-info">
                <div class="contato-item">
                    <span>📞</span>
                    <p>${CONFIG.telefone}</p>
                </div>
                <div class="contato-item">
                    <span>📍</span>
                    <p>${CONFIG.endereco}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cardapio">
        <div class="container">
            <div class="cardapio-grid">
                ${generateCardapioSections(cardapioData)}
            </div>
        </div>
    </section>

    <section class="qrcode-section">
        <div class="container">
            <h3>📱 QR Code do Cardápio</h3>
            <img src="qrcode.png" alt="QR Code - ${CONFIG.nomeEstabelecimento}" width="200">
            <p><strong>Scan para acessar o cardápio</strong></p>
            <p><small>Atualiza automaticamente quando o cardápio muda</small></p>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${CONFIG.nomeEstabelecimento} - Todos os direitos reservados</p>
            <p><small>Cardápio gerado automaticamente - Última atualização: ${dataAtualizacao}</small></p>
        </div>
    </footer>
</body>
</html>
    `;
    
    fs.writeFileSync('index.html', html);
    console.log('✅ HTML gerado com sucesso!');
}

function generateCardapioSections(cardapioData) {
    let html = '';
    const categoriasOrdenadas = ['Café da Manhã', 'Lanches', 'Bebidas', 'Petiscos', 'Pastel', 'Pizza'];
    
    // Ordenar categorias
    categoriasOrdenadas.forEach(categoria => {
        if (cardapioData[categoria] && cardapioData[categoria].length > 0) {
            html += `
                <div class="categoria-section">
                    <h2 class="categoria-titulo">${categoria}</h2>
                    <div class="cardapio-grid">
                        ${cardapioData[categoria].map(item => `
                            <div class="item-card">
                                <div class="item-header">
                                    <h3 class="item-nome">${item.nome}</h3>
                                    <span class="item-preco">R$ ${parseFloat(item.preco).toFixed(2)}</span>
                                </div>
                                ${item.descricao ? `<p class="item-descricao">${item.descricao}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    // Outras categorias não listadas
    Object.entries(cardapioData).forEach(([categoria, itens]) => {
        if (!categoriasOrdenadas.includes(categoria) && itens.length > 0) {
            html += `
                <div class="categoria-section">
                    <h2 class="categoria-titulo">${categoria}</h2>
                    <div class="cardapio-grid">
                        ${itens.map(item => `
                            <div class="item-card">
                                <div class="item-header">
                                    <h3 class="item-nome">${item.nome}</h3>
                                    <span class="item-preco">R$ ${parseFloat(item.preco).toFixed(2)}</span>
                                </div>
                                ${item.descricao ? `<p class="item-descricao">${item.descricao}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    return html;
}

processCSV();
