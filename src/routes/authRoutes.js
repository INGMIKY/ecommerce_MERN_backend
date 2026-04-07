import express from 'express'
import {
    registerUser,
    profile,
    loginUser,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/login', loginUser)

router.post('/logout', (req, res) => {
    console.log('hiciste una peticion POST  a /logout')

    res.json({ message: 'hiciste una peticion POST  a /logout' })
})

router.post('/register', registerUser)

router.get('/profile', profile)

export default router
