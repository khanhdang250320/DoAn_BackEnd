import { Router } from 'express';
import { createBook, findAllBooks, findBookById, updateBook, deleteBook } from '../controllers';

const router = Router();

router.get('/list', findAllBooks);
router.post('/create', createBook);
router.delete('/delete/:id', deleteBook);
router.get('/detail/:id', findBookById);
router.put('/update', updateBook);
// router.post('/login', findUserByUsernameAndPassword);

export = router;
