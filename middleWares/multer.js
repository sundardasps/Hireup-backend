import multer from 'multer'
const storege = multer.diskStorage({})

const upload = multer({storege})

export default upload