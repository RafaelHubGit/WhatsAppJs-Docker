

const paths = {
    whatsapp:   '/api/whatsApp'
}

const routes = ( app ) => {
    app.use( paths.whatsapp, require('./whatsApp'));
}


module.exports = routes;