const { Router } = require('express');
const { whatsAppInit, whatsAppSend } = require('../controllers/whatsApp');


const router = Router();

router.get('/', whatsAppInit);
// router.get('/:id', getUsuario);
router.post('/', whatsAppSend);
// router.put('/:id', putUsuario);
// router.delete('/:id', deleteUsuario);


// export default router;
module.exports = router;