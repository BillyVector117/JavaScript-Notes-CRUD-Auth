const router = require('express').Router() // Require Express to create a server and its Router methods

router.get('/', (req, res) => {
    res.render('index') // Render index.hbs as server response
})
// Url:  /about
router.get('/about', (req, res) => {
    res.render('about')
})
module.exports = router