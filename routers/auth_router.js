const router = require('express').Router();
const authController =require('../controllers/auth_controller');
const authMiddleware = require('../middlewares/auth_middleware');


//Login

router.post('/login',authMiddleware.oturumAcilmamis,authController.login);



//Register
router.post('/register',authMiddleware.oturumAcilmamis,authController.register);
router.get('/register',authMiddleware.oturumAcilmamis,authController.getRegister);



router.get('/verify',authController.verifyMail);


//Forget Password

router.post('/forget-password',authController.forgetPassword);


router.get('/reset-password:id/:token',authController.yeniSifreFormuGöster);
router.get('/reset-password',authController.yeniSifreFormuGöster);

router.post('/reset-password',authController.yeniSifreyiKaydet);


router.get('/logout',authMiddleware.oturumAcilmis,authController.logout);

module.exports = router;
