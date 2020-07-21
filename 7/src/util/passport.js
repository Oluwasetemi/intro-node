const passport = require('passport')
const sequelize = require('sequelize')
const User = require('../models/user')

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

