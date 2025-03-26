import { Router } from 'express';
import { loginUser, verifyUser, destroySession } from './controllers';


const router = Router();

router.post("/login", loginUser)
router.post("/verify", verifyUser)
router.post("/destroy", destroySession)


  
export default router;
