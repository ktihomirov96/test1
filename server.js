const express = require('express'), path = require('path'), session = require('express-session'), app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secure123', resave: false, saveUninitialized: true }));
app.use(express.static(__dirname));
function auth(req,res,next){if(req.session.loggedIn){next();}else{res.redirect('/login');}}
app.get('/', auth, (req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/login',(req,res)=>res.sendFile(path.join(__dirname,'login.html')));
app.post('/login',(req,res)=>{if(req.body.username==='admin'&&req.body.password==='1234'){req.session.loggedIn=true;res.redirect('/');}else{res.send('Грешни данни. <a href="/login">Опитай пак</a>');}});
app.get('/logout',(req,res)=>{req.session.destroy(()=>res.redirect('/login'));});
['clients','warehouse','ai','requests','users','logs'].forEach(p=>{app.get(`/${p}`,auth,(req,res)=>res.send(`<h2>Секция: ${p}</h2><p>Съдържание тук...</p><a href='/'>Назад</a>`));});
app.listen(process.env.PORT||3000);