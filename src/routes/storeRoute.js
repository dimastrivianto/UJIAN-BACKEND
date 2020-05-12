const router = require('express').Router()
const conn = require('../config/db')


// CREATE
router.post('/stores', (req, res) => {
    const sql = `
        INSERT INTO stores (branch_name)
        VALUES ('${req.body.branch_name}')
        `
    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})



//READ
router.get('/stores/:store_id', (req, res) => {
    const sql = `SELECT * FROM stores WHERE store_id = ${req.params.store_id}`

    conn.query(sql, (err, result)=> {
        if(err) return res.status(500).send(err)

        res.status(200).send(result) 
    })
})

// UPDATE
router.patch('/stores', (req, res) => {
    const sql = `UPDATE stores SET ? WHERE store_id = ?`
    const data = [req.body, req.body.store_id]

    conn.query(sql, data, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

// DELETE
router.delete('/stores/:store_id', (req, res)=> {
    let id = req.params.store_id

    const sql = `DELETE FROM stores WHERE store_id = ${id} `

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send({
            message: `Data telah berhasil dihapus`,
            result : result
        })
    })
})





module.exports = router