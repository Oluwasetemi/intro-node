const express = require('express')
const cookieparser = require('cookie-parser')
const app = express()

app.use(cookieparser())

app.get('/send', (req, res) => {
    // res.status(200).send(req.Cookies)
    res.cookie('loggedin', 'true')
    res.send('Cookie Sent!')
    console.log('Cookies:', req.cookies);
})
app.get('/read', (req, res) => {
    let response = 'Not logged in!'
    
    if(req.cookies.loggedin == 'true'){
        response = 'Yup! You are logged in!'
    }
    res.send(response)
})
app.listen(3000, () => {
    console.log('Server running');
})