import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

async function startServer(params) {
  try {
    app.listen(PORT, () => {
      console.log(`Server está rodando na porta: ${PORT}.`);
    });
  } catch (error) {
    console.error(`[ERRO] - O servidor não iniciou corretamente: ${error}`);
    process.exit(1);
  }
}

startServer();
