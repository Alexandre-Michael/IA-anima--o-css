// Exporta a função handler para que o Netlify consiga chamá-la
// "async" indica que podemos usar "await" dentro da função
export async function handler(event, context) {
  // Bloco try/catch para capturar erros e não quebrar a função
  try {
    // Pega o corpo da requisição enviado pelo front-end
    // event.body vem como string JSON, então usamos JSON.parse para transformar em objeto
    const { pergunta } = JSON.parse(event.body); 
    // "pergunta" é a mensagem que o usuário digitou no site

    // Faz uma requisição HTTP para o webhook do n8n
    // Usamos "await" para esperar a resposta antes de continuar
    const resposta = await fetch(process.env.N8N_WEBHOOK_URL, {
      // Define que a requisição será POST
      method: "POST", 
      // Define os headers da requisição
      headers: {
        // Diz que o corpo da requisição está em JSON
        "Content-Type": "application/json",
        // Envia o segredo que autentica o webhook no n8n
        // process.env.N8N_SECRET_KEY é uma variável de ambiente do Netlify
        "x-secret-key": process.env.N8N_SECRET_KEY
      },
      // Corpo da requisição: transformamos em JSON a pergunta do usuário
      body: JSON.stringify({ pergunta }), 
    });

    // Espera a resposta do n8n e converte de JSON para objeto JS
    const resultado = await resposta.json();

    // Retorna o resultado para o front-end
    // statusCode 200 = sucesso
    // body precisa ser string, então usamos JSON.stringify
    return {
      statusCode: 200,
      body: JSON.stringify(resultado),
    };

  } catch (error) {
    // Se algum erro acontecer no try, ele cai aqui

    // Mostra o erro no console do Netlify para debug
    console.error("Erro na função Netlify:", error);

    // Retorna uma resposta de erro para o front-end
    return {
      // statusCode 500 = erro interno
      statusCode: 500,
      // mensagem de erro amigável
      body: JSON.stringify({ error: "Erro ao processar a requisição" }),
    };
  }
}
