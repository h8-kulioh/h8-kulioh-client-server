const cors = require("cors")
require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3001
const router = require("./routers/index")

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', router)

module.exports ={
    app
}
// app.listen(port, () => {
//     console.log(`This program is running`, port);
// }) 