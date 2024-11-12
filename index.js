const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 8080;

// Definição do esquema do Produto
const produtoSchema = new mongoose.Schema({
    identificacao: String,
    preco: String,
    especificacoes: String,
    quantidade: String,
    imagem: String
});

const Produto = mongoose.model('Produto', produtoSchema);

app.use(express.json());
app.use(cors());

// Configura o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://silvagabriel7710:83cA8jR5b4mB5MGN@trajes20.rvcoo.mongodb.net/?retryWrites=true&w=majority&appName=Trajes20')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error)); 
    
// Definindo o modelo do usuário
const User = mongoose.model('User', {
    user: String,
    email: String,
    passWord: String,
    isMaster: Boolean
});

// Função para criar o usuário master inicial
async function criarUsuarioMaster() {
    const usuarioMasterExistente = await User.findOne({ isMaster: true });

    if (!usuarioMasterExistente) {
        const usuarioMaster = new User({
            user: 'masterUser',
            email: 'master@example.com',
            passWord: 'master123',
            isMaster: true
        });
        await usuarioMaster.save();
        console.log("Usuário master criado com sucesso.");
    }
}

criarUsuarioMaster();


//criptografia

const bcrypt = require("bcrypt");

// Rota para criar um novo usuário (POST)
app.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.passWord, 10); 
        const novoUser = new User({
            user: req.body.user,
            email: req.body.email,
            passWord: hashedPassword,
            isMaster: req.body.isMaster || false
        });

        await novoUser.save();
        return res.status(201).send(novoUser);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao salvar o usuário', error });
    }
});


// Rota para autenticar o login (POST)
app.post('/login', async (req, res) => {
    try {
        const { email, passWord } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send({ message: 'Usuário não encontrado' });
        }

        // Compara a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(passWord, user.passWord);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Senha incorreta' });
        }

        const redirectTo = user.isMaster ? '/master-dashboard.html' : '/user-dashboard.html';
        return res.status(200).send({ message: 'Login feito com sucesso', redirectTo });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer login', error });
    }
});

// // Rota para criar um novo usuário (POST)
// app.post('/', async (req, res) => {
//     try {
//         const novoUser = new User({
//             user: req.body.user,
//             email: req.body.email,
//             passWord: req.body.passWord,
//             isMaster: req.body.isMaster || false
//         });

//         await novoUser.save();
//         return res.status(201).send(novoUser);
//     } catch (error) {
//         return res.status(500).send({ message: 'Erro ao salvar o usuário', error });
//     }
// });

// // Rota para autenticar o login (POST)
// app.post('/login', async (req, res) => {
//     try {
//         const { email, passWord } = req.body;

//         const user = await User.findOne({ email: email });

//         if (!user) {
//             return res.status(401).send({ message: 'Usuário não encontrado' });
//         }

//         if (user.passWord !== passWord) {
//             return res.status(401).send({ message: 'Senha incorreta' });
//         }

//         const redirectTo = user.isMaster ? '/master-dashboard.html' : '/user-dashboard.html';
//         return res.status(200).send({ message: 'Login feito com sucesso', redirectTo });
//     } catch (error) {
//         return res.status(500).send({ message: 'Erro ao fazer login', error });
//     }
// });

// Rota para buscar todos os usuários (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao buscar usuários', error });
    }
});

// Rota para servir a página do Master
app.get('/master-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'master-dashboard.html'));
});

// Rota para servir a página do Usuário
app.get('/user-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-dashboard.html'));
});

// Rota para deletar um usuário (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Encontra e remove o usuário pelo ID
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        return res.status(200).send({ message: 'Usuário deletado com sucesso', deletedUser });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao deletar usuário', error });
    }
});

// Rota para atualizar um usuário (PUT)
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user, email, passWord, isMaster } = req.body;

        // Atualiza o usuário pelo ID e retorna o usuário atualizado
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { user, email, passWord, isMaster },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        return res.status(200).send({ message: 'Usuário atualizado com sucesso', updatedUser });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao atualizar usuário', error });
    }
});

// Rota para criar um novo Produto (POST)
app.post('/api/informatica', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        return res.status(201).send(novoProduto);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao adicionar produto', error });
    }
});

// Rota para buscar todos os Produtos/Serviços (GET)
app.get('/api/informatica', async (req, res) => {
    try {
        const produtos = await Produto.find();
        return res.status(200).send(produtos);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao buscar produtos', error });
    }
});

// Rota para deletar um produto (DELETE)
app.delete('/api/informatica/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduto = await Produto.findByIdAndDelete(id);

        if (!deletedProduto) {
            return res.status(404).send({ message: 'Produto não encontrado' });
        }

        return res.status(200).send({ message: 'Produto deletado com sucesso', deletedProduto });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao deletar produto', error });
    }
});

// Rota para atualizar um Produto (PUT)
app.put('/api/informatica/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Encontra e atualiza o produto pelo ID
        const updatedProduto = await Produto.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedProduto) {
            return res.status(404).send({ message: 'Produto não encontrado' });
        }

        return res.status(200).send({ message: 'Produto atualizado com sucesso', updatedProduto });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao atualizar produto', error });
    }
});

// Dados em memória para jogos, usuários, avaliações e favoritos
let gamesDB = [];
let usersDB = [];
let ratingsDB = [];
let favoritesDB = [];

// Adicionar um novo jogo à coleção (POST)
app.post('/games', (req, res) => {
  const { title, genre, releaseDate } = req.body;

  if (!title || !genre || !releaseDate) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const newGame = {
    id: gamesDB.length + 1,
    title,
    genre,
    releaseDate,
  };

  gamesDB.push(newGame);
  res.status(201).json({ message: 'Jogo adicionado com sucesso!', game: newGame });
});

// Avaliar um jogo (POST)
app.post('/games/:gameId/rating', (req, res) => {
  const { gameId } = req.params;
  const { userId, rating } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: 'O ID do usuário e a avaliação são obrigatórios' });
  }

  const game = gamesDB.find(game => game.id == gameId);
  if (!game) {
    return res.status(404).json({ message: 'Jogo não encontrado' });
  }

  const newRating = {
    gameId: game.id,
    userId,
    rating,
  };

  ratingsDB.push(newRating);
  res.status(200).json({ message: 'Avaliação adicionada com sucesso!', rating: newRating });
});

// Adicionar jogo à lista de favoritos de um usuário (POST)
app.post('/users/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  const { gameId } = req.body;

  const game = gamesDB.find(game => game.id == gameId);
  if (!game) {
    return res.status(404).json({ message: 'Jogo não encontrado' });
  }

  if (!favoritesDB[userId]) {
    favoritesDB[userId] = [];
  }

  favoritesDB[userId].push(game);
  res.status(200).json({ message: 'Jogo adicionado aos favoritos', favoriteGame: game });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
