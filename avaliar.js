// Função para obter o nome do produto da URL e exibir na página de avaliação
function exibirNomeProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const nomeProduto = urlParams.get("nome");

    if (nomeProduto) {
        document.getElementById("nomeProduto").textContent = nomeProduto;
    } else {
        document.getElementById("nomeProduto").textContent = "Nome do Jogo não encontrado";
    }
}


// Carregar o nome do produto na página de avaliação
document.addEventListener("DOMContentLoaded", exibirNomeProduto);


app.post('/api/avaliar', (req, res) => {
    const { nomeProduto, avaliacao, favorito } = req.body;

    // Supondo que você tenha um modelo para produtos
    Produto.findOneAndUpdate(
        { identificacao: nomeProduto }, // Encontrar o produto pelo nome
        { $push: { avaliacoes: { avaliacao, favorito } } }, // Adicionar a avaliação ao produto
        { new: true },
        (err, produto) => {
            if (err) {
                return res.status(500).send('Erro ao salvar a avaliação');
            }
            res.status(200).send('Avaliação salva com sucesso');
        }
    );
});