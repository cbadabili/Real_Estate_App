import { Router } from "express";

const router = Router();

router.use((_req, res) => {
  res.status(501).json({ error: "Real estate intelligence search is not yet implemented" });
});

export default router;
