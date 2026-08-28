import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export default async function handler(req, res) {

    /* =====================================================
       ACEITAR APENAS POST
    ===================================================== */

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Metodo nao permitido."
        });

    }


    try {

        /* =================================================
           RECEBER DADOS DO SITE
        ================================================= */

        const {
            ferramenta,
            dados
        } = req.body;


        /* =================================================
           VALIDAR DADOS
        ================================================= */

        if (!ferramenta || !dados) {

            return res.status(400).json({
                error: "Dados incompletos."
            });

        }


        /* =================================================
           VALIDAR FERRAMENTA
        ================================================= */

        if (ferramenta !== "atendimento") {

            return res.status(400).json({
                error: "Ferramenta invalida."
            });

        }


        /* =================================================
           VALIDAR CAMPOS DO ATENDIMENTO
        ================================================= */

        if (
            !dados.tipo ||
            !dados.negocio ||
            !dados.situacao ||
            !dados.tom
        ) {

            return res.status(400).json({
                error: "Preencha todos os campos."
            });

        }


        /* =================================================
           PROMPT DO ATENDIMENTO
        ================================================= */

        const prompt = `
Voce e o assistente de atendimento da plataforma IA Pratica.

Sua funcao e criar mensagens profissionais para pequenos negocios brasileiros.

DADOS DO USUARIO:

Tipo de mensagem:
${dados.tipo}

Negocio:
${dados.negocio}

Situacao:
${dados.situacao}

Tom desejado:
${dados.tom}


REGRAS:

- Responda sempre em portugues do Brasil.
- Escreva de maneira natural e humana.
- Respeite o tom escolhido pelo usuario.
- Use apenas as informacoes fornecidas.
- Nao invente precos, prazos, produtos, politicas ou outras informacoes.
- Nao mencione que voce e uma inteligencia artificial.
- Nao explique como a resposta foi criada.
- Evite textos desnecessariamente longos.
- A mensagem deve estar pronta para copiar e enviar ao cliente.
- Entregue somente a mensagem final.
`;


        /* =================================================
           CHAMAR OPENAI
        ================================================= */

        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                input:
                    prompt

            });


        /* =================================================
           VALIDAR RESPOSTA
        ================================================= */

        if (!response.output_text) {

            return res.status(500).json({
                error: "A IA nao retornou uma resposta."
            });

        }


        /* =================================================
           DEVOLVER RESPOSTA PARA O SITE
        ================================================= */

        return res.status(200).json({

            result:
                response.output_text

        });


    }

    catch (error) {

        /* =================================================
           ERRO
        ================================================= */

        console.error(
            "Erro API IA Pratica:",
            error
        );


        return res.status(500).json({

            error:
                "Nao foi possivel gerar a resposta. Tente novamente."

        });

    }

}