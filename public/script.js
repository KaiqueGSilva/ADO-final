// Função para cadastrar usuário
async function cadastrarUsuario(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const user = document.getElementById('user').value;
    const email = document.getElementById('email').value;
    const passWord = document.getElementById('passWord').value;

    const userData = { user, email, passWord };

    try {
        const response = await fetch('http://localhost:8080', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        if (response.status === 201) {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('userForm').reset(); // Limpa os campos do formulário
        } else {
            alert('Erro ao cadastrar o usuário');
            console.error(result);
        }
    } catch (error) {
        alert('Erro de comunicação com o servidor.');
        console.error(error);
    }
}

// Função para fazer login
async function autenticarLogin(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const email = document.getElementById('loginEmail').value;
    const passWord = document.getElementById('loginPassWord').value;

    const loginData = { email, passWord };

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        if (response.status === 200) {
            alert(result.message);  // Exibe mensagem de sucesso

            // Redireciona para a tela adequada dependendo se é master ou não
            window.location.href = result.redirectTo;
        } else {
            alert(result.message);  // Exibe erro se houver
        }
    } catch (error) {
        alert('Erro de comunicação com o servidor.');
        console.error(error);
    }
}

// Adiciona listeners aos formulários
document.getElementById('userForm').addEventListener('submit', cadastrarUsuario);
document.getElementById('loginForm').addEventListener('submit', autenticarLogin);

// URL da API (ajuste conforme necessário)
const apiUrl = 'http://localhost:3000';

// Função para enviar dados para a API
async function sendData(url, data, method = 'POST') {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Adicionar jogo
document.getElementById('addGameForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const title = document.getElementById('gameTitle').value;
    const genre = document.getElementById('gameGenre').value;
    const releaseDate = document.getElementById('gameReleaseDate').value;

    const newGame = { title, genre, releaseDate };
    const result = await sendData(`${apiUrl}/games`, newGame);

    alert(result.message);
});

// Avaliar jogo
document.getElementById('rateGameForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const gameId = document.getElementById('gameId').value;
    const userId = document.getElementById('userId').value;
    const rating = document.getElementById('gameRating').value;

    const newRating = { userId, rating };
    const result = await sendData(`${apiUrl}/games/${gameId}/rating`, newRating);

    alert(result.message);
});

// Adicionar aos favoritos
document.getElementById('addToFavoritesForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = document.getElementById('userIdFavorites').value;
    const gameId = document.getElementById('gameIdFavorites').value;

    const result = await sendData(`${apiUrl}/users/${userId}/favorites`, { gameId });

    alert(result.message);
});

// Ver recomendações
document.getElementById('viewRecommendationsForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = document.getElementById('userIdRecommendations').value;

    const response = await fetch(`${apiUrl}/users/${userId}/recommendations`);
    const recommendations = await response.json();

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = ''; // Limpar recomendações anteriores

    if (recommendations.recommendedGames && recommendations.recommendedGames.length > 0) {
        recommendations.recommendedGames.forEach((game) => {
            const gameElement = document.createElement('div');
            gameElement.textContent = `Jogo: ${game.title} | Gênero: ${game.genre} | Lançamento: ${game.releaseDate}`;
            recommendationsDiv.appendChild(gameElement);
        });
    } else {
        recommendationsDiv.textContent = 'Nenhuma recomendação encontrada.';
    }
});
