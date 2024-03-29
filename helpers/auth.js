const LocalStrategy = require('passport-local').Strategy
const User = require('../models/Users')
const bcrypt = require('bcrypt')

function initialize(passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if (!user) return done(null, false);
                if (await bcrypt.compare(password, user.password)) return done(null, user)
                return done(null, false, { message: 'Password incorrect' })
            } catch (error) {
                return done(error, false)
            }
        }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error, false)
        }
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/articles')
    }
    next()
}

module.exports = { initialize, checkAuthenticated, checkNotAuthenticated }