import { Router } from 'express'
import { ProductController } from '../controller/ProductController'

const router = Router()

router.post('/', ProductController.createProduct)
router.get('/', ProductController.getAllProducts)

export default router
