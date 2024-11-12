// Função para carregar produtos da API e exibir na tabela
async function carregarProdutos() {
    try {
        const response = await fetch("http://localhost:8080/api/informatica");
        const informatica = await response.json();

        const informaticaList = document.getElementById('informaticaList');
        informaticaList.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        informatica.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.identificacao}</td>
                <td>R$ ${produto.preco}</td>
                <td>${produto.especificacoes}</td>
                <td>${produto.quantidade}</td>
                <td><img src="${produto.imagem}" alt="${produto.identificacao}" style="width: 100px; height: auto; border-radius:20px"></td>
                <td><button onclick="avaliarProduto('${produto.identificacao}')">Avaliar</button></td>
            `;
            informaticaList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Função para redirecionar para a página de avaliação com o nome do produto selecionado
function avaliarProduto(identificacao) {
    window.location.href = `avaliar-jogos.html?nome=${encodeURIComponent(identificacao)}`;
}

// Carrega os produtos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);

// Função para atualizar a tabela de produtos e calcular a soma das quantidades
async function atualizarTabela() {
    try {
        const response = await fetch('http://localhost:8080/api/informatica');
        const produtos = await response.json();

        const informaticaList = document.getElementById("informaticaList");
        const totalQuantidade = document.getElementById("totalQuantidade");

        let somaQuantidade = 0;
        informaticaList.innerHTML = ''; // Limpa a tabela para reatualizar os dados

        // Adiciona os produtos na tabela e calcula a soma das quantidades
        produtos.forEach(produto => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${produto.identificacao}</td>
                <td>${produto.preco}</td>
                <td>${produto.especificacoes}</td>
                <td>${produto.quantidade}</td>
                <td><img src="${produto.imagem}" alt="${produto.identificacao}" width="50"></td>
                <td><button onclick="avaliarProduto('${produto.identificacao}')">Avaliar</button></td>
            `;

            somaQuantidade += parseInt(produto.quantidade);

            informaticaList.appendChild(tr);
        });

        // Atualiza o total de produtos na tela
        totalQuantidade.textContent = `Total de Produtos: ${somaQuantidade}`;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

// Chama a função para carregar dados e atualizar a tabela ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    atualizarTabela(); // Chama a função para atualizar os dados
    setInterval(atualizarTabela, 5000);  // Atualiza a tabela a cada 5 segundos
});
