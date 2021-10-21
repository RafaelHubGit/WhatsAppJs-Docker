const { Router } = require('express');
const { whatsAppInit } = require('../controllers/whatsApp');
const { whatsAppSend, socket } = require('../sockets/whatsappSocket');


const router = Router();

router.get('/', whatsAppInit);
// router.get('/:id', getUsuario);
router.post('/', whatsAppSend);
// router.put('/:id', putUsuario);
// router.delete('/:id', deleteUsuario);


// export default router;
module.exports = router;