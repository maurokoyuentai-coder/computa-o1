/* =========================================================
   ELEMENTOS
========================================================= */

const form =
    document.getElementById(
        "attendanceForm"
    );


const situationField =
    document.getElementById(
        "situacao"
    );


const characterCount =
    document.getElementById(
        "characterCount"
    );


const generateButton =
    document.getElementById(
        "generateButton"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const generatedResult =
    document.getElementById(
        "generatedResult"
    );


const resultText =
    document.getElementById(
        "resultText"
    );


const resultStatus =
    document.getElementById(
        "resultStatus"
    );


const copyButton =
    document.getElementById(
        "copyButton"
    );


const regenerateButton =
    document.getElementById(
        "regenerateButton"
    );


const clearButton =
    document.getElementById(
        "clearButton"
    );


const toast =
    document.getElementById(
        "toast"
    );



/* =========================================================
   CONTADOR
========================================================= */

situationField
    .addEventListener(
        "input",
        function() {


            characterCount.textContent =
                `${this.value.length} / 1000`;


        }
    );



/* =========================================================
   FORM
========================================================= */

form
    .addEventListener(
        "submit",
        function(event) {


            event.preventDefault();


            generateMessage();


        }
    );



/* =========================================================
   GERAR
========================================================= */

function generateMessage() {


    const data =
        new FormData(
            form
        );


    const values = {


        tipo:
            data.get("tipo"),


        negocio:
            data
                .get("negocio")
                .trim(),


        situacao:
            data
                .get("situacao")
                .trim(),


        tom:
            data.get("tom")


    };



    if (
        !values.tipo ||
        !values.negocio ||
        !values.situacao
    ) {

        return;

    }



    generateButton.disabled =
        true;


    generateButton.innerHTML =
        "<span>✦</span> Gerando...";



    setTimeout(
        () => {


            const message =
                buildMessage(
                    values
                );


            resultText.textContent =
                message;


            emptyState.style.display =
                "none";


            generatedResult
                .classList
                .add("visible");


            resultStatus
                .classList
                .add("ready");


            resultStatus.innerHTML =
                "<i></i> Pronto";


            generateButton.disabled =
                false;


            generateButton.innerHTML =
                "<span>✦</span> Gerar resposta";


            saveForm(
                values
            );


        },
        450
    );


}



/* =========================================================
   CONSTRUTOR
========================================================= */

function buildMessage(values) {


    const greeting =
        getGreeting(
            values.tom
        );


    const introduction =
        getIntroduction(
            values.tipo,
            values.negocio
        );


    const resolution =
        getResolution(
            values.tipo
        );


    const closing =
        getClosing(
            values.tom,
            values.negocio
        );


    return `${greeting}

${introduction}

${values.situacao}

${resolution}

${closing}`;


}



/* =========================================================
   SAUDAÇÃO
========================================================= */

function getGreeting(tone) {


    const greetings = {


        Profissional:
            "Olá! Tudo bem?",


        Amigável:
            "Oi! Tudo bem? 😊",


        Direto:
            "Olá!",


        Elegante:
            "Olá! Espero que esteja bem."


    };


    return (
        greetings[tone] ||
        greetings.Profissional
    );


}



/* =========================================================
   INTRODUÇÃO
========================================================= */

function getIntroduction(
    type,
    business
) {


    const messages = {


        "Resposta para cliente":

            `Agradecemos por entrar em contato com a ${business}.`,


        "Resposta para reclamação":

            `Agradecemos por nos informar sobre a situação. Na ${business}, valorizamos a experiência dos nossos clientes e queremos ajudá-lo da melhor maneira possível.`,


        "Mensagem de orçamento":

            `Obrigado pelo interesse na ${business}. Será um prazer dar continuidade ao seu atendimento e fornecer as informações necessárias para o orçamento.`,


        "Mensagem de acompanhamento":

            `Estamos entrando em contato para acompanhar seu atendimento com a ${business}.`


    };


    return (
        messages[type] ||
        messages[
            "Resposta para cliente"
        ]
    );


}



/* =========================================================
   RESOLUÇÃO
========================================================= */

function getResolution(type) {


    switch (type) {


        case "Resposta para reclamação":

            return `Queremos entender a melhor forma de resolver essa situação e encontrar uma solução adequada para você.`;



        case "Mensagem de orçamento":

            return `Caso precise de algum detalhe adicional para avaliar o orçamento, ficaremos felizes em ajudar.`;



        case "Mensagem de acompanhamento":

            return `Gostaríamos de saber se podemos ajudar em mais alguma etapa ou esclarecer alguma dúvida.`;



        default:

            return `Esperamos que essas informações ajudem. Caso tenha alguma dúvida, podemos continuar o atendimento.`;


    }


}



/* =========================================================
   FINALIZAÇÃO
========================================================= */

function getClosing(
    tone,
    business
) {


    const closings = {


        Profissional:

`Se precisar de qualquer informação adicional, estamos à disposição.

Atenciosamente,
Equipe ${business}`,


        Amigável:

`Se precisar de mais alguma coisa, pode chamar. Será um prazer ajudar! 😊

Equipe ${business}`,


        Direto:

`Ficamos à disposição.

Equipe ${business}`,


        Elegante:

`Permanecemos à disposição para qualquer esclarecimento adicional.

Cordialmente,
Equipe ${business}`


    };


    return (
        closings[tone] ||
        closings.Profissional
    );


}



/* =========================================================
   COPIAR
========================================================= */

copyButton
    .addEventListener(
        "click",
        async function() {


            const text =
                resultText.textContent;


            if (!text) {

                return;

            }


            try {


                await navigator
                    .clipboard
                    .writeText(
                        text
                    );


                showToast(
                    "Mensagem copiada!"
                );


            }

            catch (error) {


                console.error(
                    "Erro ao copiar:",
                    error
                );


            }


        }
    );



/* =========================================================
   REGENERAR
========================================================= */

regenerateButton
    .addEventListener(
        "click",
        function() {


            generateMessage();


        }
    );



/* =========================================================
   LIMPAR
========================================================= */

clearButton
    .addEventListener(
        "click",
        function() {


            form.reset();


            situationField.value =
                "";


            characterCount.textContent =
                "0 / 1000";


            resultText.textContent =
                "";


            generatedResult
                .classList
                .remove("visible");


            emptyState.style.display =
                "flex";


            resultStatus
                .classList
                .remove("ready");


            resultStatus.innerHTML =
                "<i></i> Aguardando";


            localStorage
                .removeItem(
                    "iapratica-attendance"
                );


        }
    );



/* =========================================================
   SALVAR FORMULÁRIO
========================================================= */

function saveForm(values) {


    localStorage.setItem(
        "iapratica-attendance",
        JSON.stringify(
            values
        )
    );


}



/* =========================================================
   CARREGAR ÚLTIMO FORMULÁRIO
========================================================= */

function loadForm() {


    const saved =
        localStorage.getItem(
            "iapratica-attendance"
        );


    if (!saved) {

        return;

    }


    try {


        const values =
            JSON.parse(
                saved
            );


        if (values.tipo) {

            document
                .getElementById(
                    "tipo"
                )
                .value =
                values.tipo;

        }


        if (values.negocio) {

            document
                .getElementById(
                    "negocio"
                )
                .value =
                values.negocio;

        }


        if (values.situacao) {

            situationField.value =
                values.situacao;


            characterCount.textContent =
                `${values.situacao.length} / 1000`;

        }


        if (values.tom) {


            const radio =
                document.querySelector(
                    `input[name="tom"][value="${values.tom}"]`
                );


            if (radio) {

                radio.checked =
                    true;

            }


        }


    }

    catch (error) {


        console.error(
            "Erro ao carregar formulário:",
            error
        );


    }


}



/* =========================================================
   TOAST
========================================================= */

function showToast(message) {


    toast.textContent =
        message;


    toast.classList
        .add("visible");


    setTimeout(
        () => {


            toast.classList
                .remove("visible");


        },
        1800
    );


}



/* =========================================================
   INICIAR
========================================================= */

loadForm();