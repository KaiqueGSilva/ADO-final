const apiUrl = 'http://localhost:8080/api/informatica';

async function fetchInformatica() {
    try {
        const response = await fetch(apiUrl);
        const informatica = await response.json();

        const informaticaList = document.getElementById('informaticaList');
        informaticaList.innerHTML = '';
        informatica.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${produto.identificacao}</td>
            <td> R$ ${produto.preco}</td>
            <td>${produto.especificacoes}</td>
            <td>${produto.quantidade}</td>
            <td><img src="${produto.imagem}" alt="${produto.identificacao}" style="width: 100px; height: auto; border-radius:20px"></td>
            <td>
                <button onclick="editInformatica('${produto._id}')" class="edit">Editar</button>
                <button onclick="deleteInformatica('${produto._id}')" class="delet">Deletar</button>
            </td>
        `;
        
            informaticaList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

document.getElementById('informaticaForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Evita o comportamento padrão do formulário

    const novoInformatica = {
        identificacao: document.getElementById('identificacao').value,
        preco: document.getElementById('preco').value,
        especificacoes: document.getElementById('especificacoes').value,
        quantidade: document.getElementById('quantidade').value,
        imagem: document.getElementById('imagem').value
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoInformatica),  // Envia os dados em JSON
    });

    document.getElementById('informaticaForm').reset();  // Limpa o formulário
    fetchInformatica();  // Atualiza a lista de produtos
});


async function deleteInformatica(id) {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchInformatica();  // Atualiza a lista após excluir o produto
    }
}

async function editInformatica(id) {
    const newIdentificacao = prompt("Nova Identificação:");
    if (newIdentificacao === null) return;
    const newPreco = prompt("Novo Preço:");
    if (newPreco === null) return;
    const newEspecificacoes = prompt("Novas Especificações:");
    if (newEspecificacoes === null) return;
    const newQuantidade = prompt("Novas Quantidade:");
    if (newQuantidade === null) return;
    const newImagem = prompt("Nova URL da Imagem:");
    if (newImagem === null) return;

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identificacao: newIdentificacao,
                preco: newPreco,
                especificacoes: newEspecificacoes,
                quantidade: newQuantidade,
                imagem: newImagem,
            }),
        });

        // Atualiza a lista de produtos após a edição
        fetchInformatica();
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        alert('Erro ao editar o produto');
    }
}

fetchInformatica();
