import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Главная страница
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/templates/index.html'));
});

export default router;