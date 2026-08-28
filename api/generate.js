import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Metodo nao permitido."
        });

    }


    try {

        const {
            ferramenta,
            dados
        } = req.body;


        if (!ferramenta || !dados) {

            return res.status(400).json({
                error: "Dados incompletos."
            });

        }


        if (ferramenta !== "atendimento") {

            return res.status(400).json({
                error: "Ferramenta invalida."
            });

        }


        const prompt = `
Voce e o assistente de atendimento da plataforma IA Pratica.

Sua funcao e criar mensagens profissionais para pequenos negocios brasileiros.

DADOS:

Tipo de mensagem:
${dados.tipo}

Negocio:
${dados.negocio}

Situacao:
${dados.situacao}

Tom desejado:
${dados.tom}

REGRAS:

- Responda em portugues do Brasil.
- Escreva de maneira natural.
- Respeite o tom escolhido pelo usuario.
- Nao invente informacoes.
- Nao mencione que voce e uma inteligencia artificial.
- Nao explique como a mensagem foi criada.
- Entregue somente a mensagem final pronta para copiar e enviar.
`;


        const response =
            await openai.responses.create({

                model: "gpt-5.4",

                input: prompt

            });


        return res.status(200).json({

            result:
                response.output_text

        });


    }

    catch (error) {

        console.error(
            "Erro API:",
            error
        );


        return res.status(500).json({

            error:
                "Nao foi possivel gerar a resposta."

        });

    }

}