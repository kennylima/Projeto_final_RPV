const express   = require ('express')
const expbhs    = require ('express-handlebars')
const conn      = require('./db/conn')
const app       = express()
const session   = require('express-session')
const FileStore = require('session-file-store')(session)
const flash     = require('express-flash')

//Configuração das sessões
app.use(
    session({
        name: 'session',
        secret: 'nosso-secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now(), +360000),
            httpOnly: true
        }
    })
)

//Setar sessões para requisição
app.use((req, res, next) => {
    if(req.session.userId){
        res.locals.session = req.session
    }
    next()
})

//Configurando Flash Messages
app.use(flash())

// //Configurando o template engine
app.engine('handlebars', expbhs.engine())
app.set('view engine', 'handlebars')

//Middlewares para receber dados dos formulários
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Importação dos Models 
const Associado     = require('./models/Associado') //Associado
const Administrador = require('./models/Administrador') //Administrador
const Dependente    = require('./models/Dependente') //Dependente
const Reserva       = require('./models/Reserva') //Reserva

//Rotas
const associadoRoutes       = require('./routes/associadoRoutes')
const loginRoutes           = require('./routes/loginRoutes')
const perfilRoutes          = require('./routes/perfilRoutes')
const listarDependentes     = require('./controllers/PerfilController')

//Utilização de rotas
app.use('/cadastrar', associadoRoutes)
app.use('/login', loginRoutes)
app.use('/perfil', perfilRoutes)

//Rota principal
app.get('/', (req, res)=>{
    res.render('home')
})

//Conexão BD
conn.sync().then(()=>{
    app.listen(3000)
}).catch((erro)=> {
    console.log(erro)
})