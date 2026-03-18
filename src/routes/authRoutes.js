import express from 'express'
import { registerUser } from '../controllers/authControllers.js'

const router = express.Router()

router.post('/login', (req, res) => {
    console.log('hiciste una peticion POST  a /login')

    res.json({ message: 'hiciste una peticion POST  a /login' })
})

router.post('/logout', (req, res) => {
    console.log('hiciste una peticion POST  a /logout')

    res.json({ message: 'hiciste una peticion POST  a /logout' })
})

router.post('/register', registerUser)

router.get('/profile', (req, res) => {
    console.log('hiciste una peticion POST  a /profile')

    res.json({ message: 'hiciste una peticion POST  a /profile' })
})

export default router
