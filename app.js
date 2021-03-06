const express = require('express')
const mysql = require('mysql')
const expressLayout = require('express-ejs-layouts')
const { redirect } = require('express/lib/response')
const session = require('express-session')
const res = require('express/lib/response')
var request = require("request");

const app = express()


app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(expressLayout)
app.use(session({
    cookie: {maxAge: 1000*60*60*24},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(express.json({}))
app.use(express.urlencoded({
    extended: true
}))

const db = mysql.createConnection({
    host: "127.0.0.1",
    database: "db_yummyco",
    user: "root",
    password: ""
})

// var sessionConnection = mysql.createConnection(db)
// var sessionStore = new MySQLStore({db},sessionConnection)


db.connect(err => {
    if(err){
        throw err
    }else{
        db.query('SELECT * FROM makanan', (err, result) => {
            let transaction_iterate
            app.get('/transaction', (req, res) => {
                if(req.session.userinfo){
                    db.query(`SELECT MAX(id_transaksi) as iterasi from transaksi`,(err, result) => {
                        for(let e of result){
                            if(e.iterasi == null){
                                transaction_iterate = 1
                            }else{
                                transaction_iterate = e.iterasi
                            }
                        }
                    })
                    db.query('SELECT * FROM makanan', (err, result) => {
                    res.render('component/transaction', {
                        title: "Kelola Transaksi",
                        layout: "layouts/main",
                        result,
                        isError: "style=display:none",
                    })
                })
                }else{
                    res.redirect('/login')
                }
            })
            app.post('/transaction', (req, res) =>{
                if(req.session.userinfo){
                db.query('SELECT * FROM makanan', (err, result) => {
                let totalBayar = 0
                let i = 0
                for(let e of result){
                    if(req.body.jumlahBeli[i] > e.stok){
                        res.render('component/transaction', {
                            layout: "layouts/main",
                            title: "Kelola Transaksi",
                            isError: "style=display:block"
                            ,
                            result
                        })
                        return false
                    }else{
                        totalBayar += e.harga * req.body.jumlahBeli[i];
                        db.query(`UPDATE makanan SET stok = stok-${req.body.jumlahBeli[i]} WHERE id_makanan=${e.id_makanan}`)
                    }
                    i++
                }
                db.query(`INSERT INTO transaksi(nama_pelanggan,tanggal_transaksi,total_bayar) VALUES ('${req.body.namaPelanggan}','${new Date().toISOString().slice(0,10)}','${totalBayar}')`)
                req.body.hidden.forEach((e,i) => {
                  db.query(`SELECT MAX(id_transaksi) as iterasi from transaksi`,(err, idTransaksi) => {
                     for(let j of idTransaksi){
                         db.query(`INSERT INTO detail_transaksi(id_transaksi,id_makanan,jumlah_beli) VALUES (${j.iterasi},${e},'${req.body.jumlahBeli[i]}')`)
                        } 
                    })
                })
                transaction_iterate++
                db.query(`SELECT * FROM transaksi`, (err, result) => {
                    db.query(`SELECT detail_transaksi.id_transaksi, makanan.id_makanan, tanggal_transaksi, nama_pelanggan, jenis_makanan, jumlah_beli,harga, total_bayar from transaksi JOIN detail_transaksi ON detail_transaksi.id_transaksi = transaksi.id_transaksi JOIN makanan ON makanan.id_makanan = detail_transaksi.id_makanan WHERE transaksi.id_transaksi=${transaction_iterate}`, (err,result) =>{
                        res.render('component/transaction_success', {
                            title: "Hasil Transaksi",
                            layout: "layouts/main",
                            result
                        })
                    })
                })
            })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/transaction/success/:id_transaksi', (req, res) => {
                if(req.session.userinfo){
                    db.query(`SELECT detail_transaksi.id_transaksi, makanan.id_makanan, tanggal_transaksi, nama_pelanggan, jenis_makanan, jumlah_beli,harga, total_bayar from transaksi JOIN detail_transaksi ON detail_transaksi.id_transaksi = transaksi.id_transaksi JOIN makanan ON makanan.id_makanan = detail_transaksi.id_makanan WHERE transaksi.id_transaksi=${req.params.id_transaksi}`, (err,result) =>{
                        res.render('component/transaction_success', {
                            title: "Hasil Transaksi",
                            layout: "layouts/main",
                            result
                        })
                    })
                }else{
                    res.redirect('/login')
                }
            })
        })
        app.get('/inventory',(req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM makanan`, (err, result) => {
                    res.render('component/inventory', {
                        title: "Kelola Gudang",
                        layout: "layouts/main",
                        result
                    });
                })
            }
        })
        app.get('/inventory/add', (req, res) => {
            if(req.session.userinfo){
                res.render('component/add', {
                    title: "Tambah Makanan",
                    layout: "layouts/main"
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/inventory/add', (req, res) => {
            if(req.session.userinfo){
                db.query(`INSERT INTO makanan(jenis_makanan,harga,stok) VALUES ('${req.body.jenis_makanan}',${req.body.harga},${req.body.stok})`,(err, result) =>{
                    if (err) throw err
                    res.redirect('/inventory')
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/inventory/delete/:id_makanan', (req,res) => {
            if(req.session.userinfo){
                db.query(`DELETE FROM makanan where id_makanan='${req.params.id_makanan}'`)
                res.redirect('/inventory')
            }else{
                res.redirect('/login')
            }
        })
        app.get('/inventory/edit/:id_makanan', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM makanan WHERE id_makanan='${req.params.id_makanan}'`, (err, result) => {
                    res.render('component/edit', {
                        title: "Edit Makanan",
                        layout: "layouts/main",
                        result
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/inventory/edit', (req, res) => {
            if(req.session.userinfo){
            db.query(`UPDATE makanan SET jenis_makanan='${req.body.jenis_makanan}',harga=${req.body.harga},stok=${req.body.stok} WHERE id_makanan=${req.body.hidden}`,(err, result) =>{
                if (err) throw err
                res.redirect('/inventory')
            })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/report', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM transaksi`, (err, result) => {
                    res.render('component/report', {
                        title: "Laporan Transaksi",
                        layout: "layouts/main",
                        result,
                        searchField: '',
                        isSearched: "style=display:none"
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/report', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM transaksi WHERE nama_pelanggan LIKE '%${req.body.search}%' OR id_transaksi LIKE '%${req.body.search}%'`, (err,result) => {
                    res.render('component/report', {
                        title: "Laporan Transaksi",
                        layout: "layouts/main",
                        result,
                        searchField: req.body.search,
                        isSearched: "style=display:block"
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/delivery',(req,res) =>{
            if(req.session.userinfo){
                let city
                var options = {
                    method: 'GET',
                    url: 'https://api.rajaongkir.com/starter/city',
                    headers: {key: '7b8d650935e3fa791e1d3afaf612cede'}
                  };
                  
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                  
                    city = JSON.parse(body).rajaongkir.results

                    db.query(`SELECT transaksi.id_transaksi, transaksi.nama_pelanggan, delivery.id_delivery from delivery RIGHT JOIN transaksi ON delivery.id_transaksi = transaksi.id_transaksi WHERE id_delivery IS NULL`, (err, result) => {
                        res.render('component/ongkir', {
                            title: "Cek Ongkir",
                            layout: "layouts/main",
                            result,
                            city
                        });
                    })
                });
                  
    
                
            }else{
                res.redirect('/login')
            }
        })
        app.post('/delivery',(req,res) =>{
            if(req.session.userinfo){

            var options = {
            method: 'POST',
            url: 'https://api.rajaongkir.com/starter/cost',
            headers: {key: '7b8d650935e3fa791e1d3afaf612cede', 'content-type': 'application/x-www-form-urlencoded'},
            form: {origin: '22', destination: req.body.kota, weight: 1000, courier: 'jne'}
            };

            request(options, function (error, response, body) {
            if (error) throw new Error(error);

            harga = JSON.parse(body).rajaongkir.results[0].costs[0].cost[0].value
            province = JSON.parse(body).rajaongkir.destination_details.province
            city = JSON.parse(body).rajaongkir.destination_details.city_name

            db.query(`INSERT INTO delivery(id_transaksi,lokasi_tujuan,harga,alamat) VALUES (${req.body.transaksi},'${city}, ${province}',${harga}, '${req.body.alamat}')`,(err,result) => {
                res.redirect(`/delivery/check/${req.body.transaksi}`)
            })
                
            });

            }else{
                res.redirect('/login')
            }
        })
        app.get('/delivery/check/:id_transaksi', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT transaksi.id_transaksi, transaksi.nama_pelanggan, delivery.* from delivery JOIN transaksi ON delivery.id_transaksi = transaksi.id_transaksi WHERE delivery.id_transaksi = ${req.params.id_transaksi}`, (err,result) =>{
                    res.render('component/deliveryCheck', {
                        title: "Hasil Transaksi",
                        layout: "layouts/main",
                        result
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/recipe', (req,res) => {
            if(req.session.userinfo){
                var options = {
                    method: 'GET',
                    url: 'https://api.spoonacular.com/recipes/complexSearch?apiKey=6e4139c311c241e8a01b232ab8b322d7'
                  };
                  request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    
                    res.render('component/recipe', {
                        title: "Daftar Resep",
                        layout: "layouts/main",
                        result: JSON.parse(body).results
                    })
                    console.log(JSON.parse(body).results)
                        
                    });
            }else{
                res.redirect('/login')
            }
        })
        app.get('/recipe/:id', (req,res) => {
            if(req.session.userinfo){
                let id = req.params.id.split("&")[0]
                let title = req.params.id.split("&")[1]
                var options = {
                    method: 'GET',
                    url: `https://api.spoonacular.com/recipes/${id}/information?apiKey=6e4139c311c241e8a01b232ab8b322d7`
                  };
                  request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    
                    console.log(JSON.parse(body).extendedIngredients)
                    
                    res.render('component/detail_recipe', {
                        title: "Detail Resep",
                        layout: "layouts/main",
                        recipe_name: title,
                        results: JSON.parse(body).extendedIngredients
                    })
                        
                    });
            }else{
                res.redirect('/login')
            }
        })
        app.get('/', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT SUM(total_bayar) AS total from transaksi`, (err, totalPendapatan) => {
                    db.query('SELECT * from transaksi', (err, dataTransaksi) =>{
                    db.query(`SELECT * from transaksi ORDER BY tanggal_transaksi DESC LIMIT 5`, (err, infoTransaksi) => {
                        db.query(`SELECT id_makanan, jenis_makanan, stok from makanan`, (err, infoMakanan) => {
                            res.render('component/dashboard', {
                                title: "Dashboard",
                                layout: "layouts/main",
                                totalPendapatan,
                                infoTransaksi,
                                dataTransaksi,
                                infoMakanan
                            })
                        })
                    })
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/login',(req,res) => {
            res.render('component/loginForm',{
                layout: "layouts/login",
                isHidden: 'hidden'
            })
        })
        app.post('/login',(req, res) => {
            db.query(`SELECT username, password FROM login_user`,(err, result) => {
                // [username, password] = ...result;
                let username = result[0].username;
                let password = result[0].password;
                if(username != req.body.username || password != req.body.password){
                    res.status(401)
                    res.render('component/loginForm',{
                        layout: "layouts/login",
                        isHidden: undefined
                    })
                }else{
                    req.session.userinfo = result[0].username
                    res.redirect('/')
                }
            })  
        })
        app.get('/logout',(req,res) =>{
            req.session.destroy(err => {
                if(!err){
                    res.redirect('/login')
                }
            })
        })
    }
    // app.get('/login', (req,res) =>{
    // })
})
app.listen(3004,() => {
    console.log('App running http://localhost:3004')
})