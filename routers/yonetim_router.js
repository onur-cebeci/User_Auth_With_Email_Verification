const router = require('express').Router();
const managementController =require('../controllers/yonetim_controller');
const authMiddleware = require('../middlewares/auth_middleware');


//Login

router.get('/',authMiddleware.isActive,managementController.showHomePage);


module.exports = router;
