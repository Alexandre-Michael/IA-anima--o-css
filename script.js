/* 
VÁRIAVEIS - Um pedacinho de memória do computador
que eu posso guardar o que eu quiser.

FUNCOES
É um pedacinho de código QUE, só executa 
Quando é chamado.

documet = HTML
querySelector = buscar alguém no HTML

[x] Descobrir quando o botão foi clicado
[x] Pegar o que foi escrito no Input
[ ] Enviar para o N8N
[ ] Receber o que o N8N Respondeu
[ ] Colocar na Tela o que ele respondeu    

*/

let webhook = "http://localhost:5678/webhook/animacao-css";

async function cliqueiNoBotao(event) {
    event.preventDefault() // 🚫 Impede o formulário de recarregar a página
    const botao = document.querySelector(".botao-magica")
    botao.disabled = true
    botao.style = "cursor: not-allowed; background: #999999;"
    

	let textoInput = document.querySelector(".input-animacao").value;
	let codigo = document.getElementById("codigo");
	let areaResultado = document.querySelector(".area-resultado");

	try {
		// fetch: 1) Endereço que eu quero acessar, 2) configurações, 3) os dados
		let resposta = await fetch(webhook, {
			method: "POST",
			// Headers são informações que eu envio junto com a requisição
			headers: {
				"Content-Type": "application/json",
			},
			// Body é o corpo da requisição, onde eu envio os dados
			// No caso, eu quero enviar o que foi escrito no input
			body: JSON.stringify({
				pergunta: textoInput,
			}),
		});

		console.log(resposta);

		let resultado = await resposta.json();
		
		let info = JSON.parse(resultado.resposta);

		codigo.innerHTML = info.code;
		areaResultado.innerHTML = info.preview;

		// Remove estilo antigo, se existir
		let estiloAntigo = document.getElementById("estilo-dinamico");
		if (estiloAntigo) estiloAntigo.remove();

		// Cria o novo <style> com o conteúdo da animação
		let styleTag = document.createElement("style");
		styleTag.id = "estilo-dinamico";
		styleTag.innerHTML = info.style;

		// Insere no final do <head>, como o insertAdjacentHTML faria
		document.head.insertAdjacentElement("beforeend", styleTag);
	} catch (error) {
		console.error("Erro ao enviar a requisição:", error);
		alert("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
	} finally {
		botao.disabled = false;
  		botao.style = "cursor: pointer; background: #FF5252;";
	}
    botao.disabled = false
    botao.style = "cursor: pointer; background: #52FF74;"
}
