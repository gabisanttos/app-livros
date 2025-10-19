import 'dotenv/config'; 
import Groq from 'groq-sdk';

interface BookInput {
  title: string;
  author: string;
}

/**
 * Interface para os livros que a API do Groq deve retornar
 * (conforme definido no seu prompt).
 */
interface BookSuggestion {
  title: string;
  author: string;
}

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
  throw new Error("GROQ_API_KEY não está definida no arquivo .env");
}

const groq: Groq = new Groq({
  apiKey: groqApiKey
});

/**
 * Gera 5 sugestões de livros com base em uma lista de exemplos.
 * @param livrosBase
 * @returns
 */

export async function gerarSugestoes(livrosBase: BookInput[]): Promise<BookSuggestion[]> {
  
  const prompt = `
Sugira 5 livros (apenas 5 livros) semelhantes aos seguintes:
${livrosBase.map((l, i) => `${i + 1}. ${l.title}, ${l.author}`).join('\n')}
Considere gênero, estilo de escrita e público-alvo.
Retorne apenas JSON no seguinte formato:
[
  { "title": "...", "author": "..." },
  ...
]
`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Você é um especialista em literatura." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.1-70b-versatile", 
    temperature: 0.7
  });

  try {
    const jsonContent = completion.choices[0]?.message?.content;
    
    if (!jsonContent) {
      console.error("Groq retornou uma resposta de mensagem vazia.");
      return [];
    }
    
    const suggestions: BookSuggestion[] = JSON.parse(jsonContent);
    return suggestions;

  } catch (err: unknown) {
    
    if (err instanceof Error) {
      console.error("Erro ao parsear resposta do Groq:", err.message);
    } else {
      console.error("Erro desconhecido ao parsear resposta do Groq:", err);
    }
    return [];
  }
}