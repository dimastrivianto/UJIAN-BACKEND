const router = require('express').Router()
const conn = require('../config/db')


// CREATE
router.post('/inventory', (req, res) => {
    const sql = `
        INSERT INTO inventory (product_id, store_id, inventory)
        VALUES (${req.body.product_id}, ${req.body.store_id}, ${req.body.inventory} )
        `
    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

// READ
router.get('/inventory', (req, res) => {
    const sql = `
        SELECT i.inventory_id  , p.name , s.branch_name , i.inventory FROM products p  JOIN inventory i ON p.product_id = i.product_id JOIN stores s ON s.store_id = i.store_id
    `

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

//UPDATE
// UPDATE
router.patch('/inventory/:id', (req, res) => {
    const sql = `UPDATE inventory SET ? WHERE inventory_id = ?`
    const data = [req.body, req.params.id]

    conn.query(sql, data, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

//DELETE stock
router.delete('/inventory/:id', (req, res) => {
    let id = req.params.id

    const sql = `DELETE FROM inventory WHERE inventory_id = ${id} `

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send({
            message: `Data telah berhasil dihapus`,
            result : result
        })
    })
})




module.exports = router