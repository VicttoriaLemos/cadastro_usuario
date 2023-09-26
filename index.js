//console.log("Hello, world!")

const mysql = require('mysql2')
const express = require('express')

const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud'
})

connection.connect(function (err) {
    if (err) {
        console.error('Erro:', err)
        return
    }
    console.log('Concexão estabelecida com sucesso!')
});

/*connection.query("INSERT INTO CLIENTES (nome, idade, uf) VALUES ('?', ? ,'?')",
    function (err, result) {
        if (!err) {
            console.log("Dados inseridos com sucesso!")
        } else {
            console.log("Erro: Não foi possível incerir os dados", err)
        }
    });

connection.query("SELECT * FROM  CLIENTES", function (err, rows, result) {
    if (!err) {
        console.log("Resultado:", rows)
    } else {
        console.log("Erro: Não foi possível incerir os dados", err)
    }
});*/

app.get("/formulario", function (rep, res) {
    res.sendFile(__dirname + "/formulario.html")

})

app.post('/adcionar', (req, res) => {
    const nome = req.body.nome;
    const idade = req.body.idade;
    const uf = req.body.uf;

    const values = [nome, idade, uf]
    const insert = "INSERT INTO CLIENTES(nome, idade, uf) VALUES (?,?,?)"

    connection.query(insert, values, function (err, result) {
        if (!err) {
            console.log("Dados inseridos com sucesso!")
            res.send("Dados inseridos!")

        } else {
            console.log("Não foi possível inserir os dados", err)
            res.send("Erro!")
        }
    })

})

app.get("/listar", function (req, res) {
    const selectAll = "SELECT * FROM CLIENTES";

    connection.query(selectAll, function (err, rows) {
        if (!err) {
            console.log("Dados inseridos com sucesso!")
            res.send(`
            <html>
                <head>
                    <title>Lista de Clientes</title>
                </head>
                    <body>
                        <h1>Lista de Cleintes </h1>
                        <table>
                            <tr>
                                <th>Nome</th>
                                <th>Idade</th>
                                <th>UF</th>
                            </tr>
                            ${rows.map(rows => `
                            <tr>
                                <td>${rows.nome}</td>
                                <td>${rows.idade}</td>
                                <td>${rows.uf}</td>

                            </tr>

                             `).join('')}

                        </table>
                    </body>
            <html>
            `);

        } else {
            console.log("Erro ao listar os dados", err)
            res.send("Erro!")
        }
    })
})

app.get("/",function(req,res){
    res.send(`
    <html>
    <head>
    <title>Sitema de Gerenciamento de Usuários</title>
    </head>
    <body>
    <h1>Sistema de Gerenciamento de Usuários</h1>
    <p><a href="http://localhost:8081/formulario">Cadastrar Usuários</a></p>
    <p><a href="http://localhost:8081/listar">Listar Usuários</a></p>
    </body>
    </html>
    `)})

app.listen(8081, function () {
    console.log("Servidor rodando na url http://localhost:8081")
})