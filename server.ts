import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

  app.use(express.json());

  // API Routes
  interface Post {
    id: string;
    text: string;
    date: string;
  }

  const posts: Post[] = [
    {
      id: "1",
      text: "Sejam bem-vindas ao Flor de Maio! Um espaço de apoio para mães e bebês.",
      date: new Date().toLocaleDateString("pt-BR")
    }
  ];

  app.get("/api/posts", (_req, res) => {
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { text, date } = req.body as { text: string; date: string };
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "O texto é obrigatório" });
      return;
    }
    const post: Post = {
      id: Date.now().toString(),
      text: text.trim(),
      date: date || new Date().toLocaleDateString("pt-BR"),
    };
    posts.unshift(post);
    res.status(201).json(post);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
