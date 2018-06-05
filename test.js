
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8100, '0.0.0.0',function () {
  console.log('Example app listening on port 3000!')
})
