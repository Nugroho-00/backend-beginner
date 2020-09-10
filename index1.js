const express = require('express')
const bodyParser = require('body-parser')
const db = require('./src/helper/db')
const {
  request
} = require('express')
const qs = require('querystring')

const app = express()

// middleware
app.use(bodyParser.urlencoded({
  extended: false
}))

app.post('/items', (req, res) => {
  const {
    name,
    price,
    description
  } = req.body
  if (name && price && description) {
    db.query(`INSERT INTO items(name,price,description) VALUES('${name}', ${price},'${description}')`, (err, result, fields) => {
      if (!err) {
        res.status(201).send({
          success: true,
          message: 'Item has been created',
          data: req.body
        })
      } else {
        console.log(err)
        res.status(500).send({
          success: false,
          message: 'Internal Server Error'
        })
      }
    })
  } else {
    res.status(400).send({
      success: false,
      message: 'All field must be filled'
    })
  }
})

app.get('/items', (req, res) => {
  let {
    page,
    limit,
    search
  } = req.query
  let searchKey = ''
  let searchValue = ''

  console.log(typeof search)
  if (typeof search === 'object') {
    searchKey = object.keys(search)[0]
    searchValue = object.values(search)[0]
  } else {
    searchKey = 'name'
    searchValue = search || ''
  }

  if (!limit) {
    limit = 5
  } else {
    limit = parseInt(limit)
  }
  if (!page) {
    page = 1
  } else {
    page = parseInt(page)
  }
  const offset = (page - 1) * limit
  const query = `SELECT * FROM items WHERE ${searchKey} LIKE '%${searchValue}%' LIMIT ${limit} OFFSET ${offset}`
  db.query(query, (err, result, fields) => {
    if (!err) {
      const pageInfo = {
        count: 0,
        pages: 0,
        currentPage: page,
        limitPage: limit,
        nextLink: null,
        prevLink: null
      }
      if (result.length) {
        const query = `SELECT COUNT(*) AS count FROM items WHERE ${searchKey} LIKE '%${searchValue}%'`
        db.query(query, (_err, data, fields) => {
          const {
            count
          } = data[0]
          pageInfo.count = count
          pageInfo.pages = Math.ceil(count / limit)

          const {
            pages,
            currentPage
          } = pageInfo

          if (currentPage < pages) {
            pageInfo.nextLink = `http://localhost:8080/items?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
          }
          if (currentPage > 1) {
            pageInfo.prevLink = `http://localhost:8080/items?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
          }

          res.send({
            success: true,
            message: 'List of items',
            data: result
          })
        })
      } else {
        res.send({
          success: true,
          message: 'There is no list items'
        })
      }
    } else {
      console.log(err)
      res.status(500).send({
        success: false,
        message: 'Internal server Error'
      })
    }
  })
})

app.put('/items/:id', (req, res) => {
  const {
    name,
    price,
    description
  } = req.body
  const query = `UPDATE items SET name = '${name}', price = ${price}, description = '${description}' WHERE id ${req.params.id}`
  db.query(query, (err, result, field) => {
    if (!err) {
      res.status(201).send({
        succes: true,
        message: 'Data has been updated',
        data: req.body
      })
    } else {
      res.status().send({
        succes: false,
        message: 'Internal server error'
      })
    }
  })
})

app.patch('/items/:id', (req, res) => {
  const {
    name,
    price,
    description
  } = req.body
  const query = `UPDATE items SET name = '${name}', price = ${price}, description = '${description}' WHERE id ${req.params.id}`
  db.query(query, (err, result, field) => {
    if (!err) {
      res.status(201).send({
        succes: true,
        message: 'Data has been updated',
        data: req.body
      })
    } else {
      res.status().send({
        succes: false,
        message: 'Internal server error'
      })
    }
  })
})

app.delete('/items/:id', (req, res) => {
  const query = `DELETE ROM items  WHERE id ${req.params.id}`
  db.query(query, (err, result, field) => {
    if (!err) {
      res.status(201).send({
        succes: true,
        message: 'Data has been deleted',
        data: null
      })
    } else {
      res.status().send({
        succes: false,
        message: 'Internal server error'
      })
    }
  })
})

app.get('/items/:id', (req, res) => {
  const query = `SELECT * FROM items WHERE id = ${req.params.id}`
  db.query(query, (err, result, field) => {
    if (!err) {
      console.log(result)
      res.status(201).send({
        succes: true,
        message: `Showing items from id : ${req.params.id}`,
        data: result
      })
    } else {
      res.status().send({
        succes: false,
        message: 'Internal server error'
      })
    }
  })
})

app.listen(8080, () => {
  console.log('App listening on port 8080')
})
