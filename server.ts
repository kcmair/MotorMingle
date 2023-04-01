import express, { NextFunction } from 'express'
import 'dotenv/config'
const connectMongoose = require('./db/connect')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

require('mongoose')

connectMongoose()

const port = process.env.PORT || 3000
const app = express()

console.log(process.env.NODE_ENV)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
if (process.env.NODE_ENV === 'development') {
    console.log('I am here')
    const morgan = require('morgan')
    app.use(morgan('dev'))
}
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    }
)
app.use(cors())
app.use(
    session({
        secret: 'send it',
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(function (req: any, res: any, next: NextFunction) {
    res.locals.user = req.user || null
    next()
})
app.use('/', require('./routes'))
app.listen(port, (): void => {
    console.log(`MotorMingle app listening on port ${port}`)
})
