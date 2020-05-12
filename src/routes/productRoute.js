const router = require('express').Router()
const conn = require('../config/db')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')

//multer
const upload = multer({
    limits: {
        fileSize : 10000000// max 10MB
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File harus berupa jpg, jpeg, atau png'))
        }
        cb(null, true)
    }
})

//path untuk akses gambar
const filesDirectory = path.join(__dirname,'../../public/files')


//CREATE
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const productName = `${req.body.name}-avatar.png`
        await sharp(req.file.buffer).png().toFile(`${filesDirectory}/${productName}`)

        const sql = `
        INSERT INTO products (name, price, image)
        VALUES ('${req.body.name}', ${req.body.price}, '${productName}')
        `
        
        conn.query(sql, (err, result) => {
            if(err) return res.status(500).send(err)

            res.status(200).send(result)
        })
    } catch (error) {
        res.status(500).send(error)
    }
}, (err, req, res, next) => {
    res.status(500).send(err)
})

// READ AVATAR
router.get('/products/image/:name', (req, res) => {
    const sql = `SELECT image FROM products WHERE name = ?`
    const data = req.params.name

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        //pakai try catch just in case ada orang pakai postman langsung nembak url dan mau merubah data
        try {
            res.sendFile(`${filesDirectory}/${result[0].image}`, (err) => {
                if(err) return res.send('Anda belum mengupload avatar')
            })
        } catch (error) {
            res.send('Username tidak ditemukan')
        }
    })
})


//READ
router.get('/products', (req, res) => {
    const sql = `SELECT * FROM products WHERE product_id = ${req.query.product_id}`

    conn.query(sql, (err, result)=> {
        if(err) return res.status(500).send(err)

        res.status(200).send({result: result, photo : `http://localhost:2020/products/image/${result[0].name}` }) 
    })
})

//UPDATE
router.patch('/products', upload.single('image'), async (req, res) => {
    try {
        const sql = `UPDATE products SET ? WHERE product_id = ?`
        const data = [req.body, req.body.product_id]
        const productName = `${req.body.name}-avatar.png`
        if(req.file){
        await sharp(req.file.buffer).png().toFile(`${filesDirectory}/${productName}`)
        data[0].image = productName
        }
        conn.query(sql, data, (err, result) => {
            if(err) return res.status(500).send(err)

            res.status(200).send(result)
        })
    } catch (error) {
        res.status(500).send(error)
    }
}, (err, req, res, next) => {
    res.status(500).send(err)
})

// DELETE
router.delete('/products/:product_id', (req, res)=> {
    let id = req.params.product_id

    const sql = `DELETE FROM products WHERE product_id = ${id} `

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send({
            message: `Data telah berhasil dihapus`,
            result : result
        })
    })
})


module.exports = router