const express = require("express"); // Importando o express
const app = express(); // Iniciando o express, passando o express pra variável app
app.use(express.json());
// Importe da conexão com o banco de dados
//const db = require('./models/db')
const languages = require('./models/languages')
var cors = require('cors')
/**
 * Configuração do middleware Express.js para habilitar o CORS (Cross-Origin Resource Sharing) em uma aplicação Node.js
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
    app.use(cors());
    next();
});

app.get('/', (req, res) => {
    res.send('Rota Inicial Node App Coffe WP')
})

app.get('/about', async (req, res) => {
    res.json({
        "id": 1,
        "name": "Coffee With Programation",
        "Description": "O Aplicativo 'Coffee With Programation' - Professor Nelci Mariano, é um app desenvolvido em React-Nativo cujo o objetivo é ser um material de consulta para os alunos que tem aula de Programação Mobile comigo, a idéia é permitir que esses acessem ao Projeto via GitHub e verifiquem a codificação deste, servindo de referência para a criação de seus Projetos Mobile"
    })
})

// SELECT languages
app.get("/select-languages", async (req, res) => { //async define uma função assíncrona
    await languages.findAll({ // await na função assincrona indica o ponto a ser aguardado
        attributes: ['id', 'name', 'description'], //Indica as colunas
        order: [['id', 'ASC']] //order by
    })
        .then((languages) => { // then -> recebe uma função callback, retorna um "objeto-promessa"
            return res.json({
                erro: false,
                languages
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum registro encontrado!"
            });
        });
});

app.get("/select-language/:id", async (req, res) => {
    const languageId = req.params.id; // Capta o id da url

    try {
        const language = await languages.findOne({
            where: { id: languageId }, 
            attributes: ['id', 'name', 'description'],
        });

        if (language) {
            return res.json({
                erro: false,
                language, // Retorna o idioma encontrado
            });
        } else {
            return res.status(404).json({
                erro: true,
                mensagem: "Erro: Idioma não encontrado!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            erro: true,
            mensagem: "Erro: Não foi possível buscar o idioma!",
        });
    }
});



// Iniciando o Servidor - Sempre ficará no final da codificação
app.listen(4000, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
})
