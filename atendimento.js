const form =
    document.getElementById("attendanceForm");

const situacao =
    document.getElementById("situacao");

const characterCount =
    document.getElementById("characterCount");

const generateButton =
    document.getElementById("generateButton");

const emptyState =
    document.getElementById("emptyState");

const generatedResult =
    document.getElementById("generatedResult");

const resultText =
    document.getElementById("resultText");

const resultStatus =
    document.getElementById("resultStatus");

const copyButton =
    document.getElementById("copyButton");

const regenerateButton =
    document.getElementById("regenerateButton");

const clearButton =
    document.getElementById("clearButton");

const toast =
    document.getElementById("toast");



/* =========================================================
   CONTADOR
========================================================= */

situacao.addEventListener(
    "input",
    function () {

        characterCount.textContent =
            this.value.length + " / 1000";

    }
);



/* =========================================================
   ENVIAR FORMULARIO
========================================================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        await gerarResposta();

    }
);



/* =========================================================
   GERAR RESPOSTA COM IA
========================================================= */

async function gerarResposta() {

    const data =
        new FormData(form);


    const values = {

        tipo:
            data.get("tipo"),

        negocio:
            data.get("negocio")
                .trim(),

        situacao:
            data.get("situacao")
                .trim(),

        tom:
            data.get("tom")

    };


    if (
        !values.tipo ||
        !values.negocio ||
        !values.situacao ||
        !values.tom
    ) {

        mostrarToast(
            "Preencha todos os campos."
        );

        return;

    }



    /* BOTAO CARREGANDO */

    generateButton.disabled =
        true;


    generateButton.textContent =
        "Gerando com IA...";


    resultStatus.classList.remove(
        "ready"
    );


    resultStatus.innerHTML =
        "<i></i> Gerando...";



    try {

        /* =============================================
           CHAMADA PARA API
        ============================================== */

        const response =
            await fetch(
                "/api/generate",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            ferramenta:
                                "atendimento",

                            dados:
                                values

                        })

                }
            );



        const result =
            await response.json();



        /* =============================================
           ERRO DA API
        ============================================== */

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Erro ao gerar resposta."
            );

        }



        if (!result.result) {

            throw new Error(
                "A API nao retornou uma resposta."
            );

        }



        /* =============================================
           MOSTRAR RESULTADO
        ============================================== */

        resultText.textContent =
            result.result;


        emptyState.style.display =
            "none";


        generatedResult
            .classList
            .add(
                "visible"
            );


        resultStatus
            .classList
            .add(
                "ready"
            );


        resultStatus.innerHTML =
            "<i></i> Pronto";



        /* SALVAR FORMULARIO */

        salvarFormulario(
            values
        );



        /* SALVAR HISTORICO */

        salvarHistorico();


    }

    catch (error) {

        console.error(
            "Erro Atendimento:",
            error
        );


        emptyState.style.display =
            "none";


        generatedResult
            .classList
            .add(
                "visible"
            );


        resultText.textContent =
            "Nao foi possivel gerar a resposta agora. Tente novamente.";


        resultStatus
            .classList
            .remove(
                "ready"
            );


        resultStatus.innerHTML =
            "<i></i> Erro";

    }

    finally {

        generateButton.disabled =
            false;


        generateButton.textContent =
            "Gerar resposta";

    }

}



/* =========================================================
   GERAR NOVAMENTE
========================================================= */

regenerateButton.addEventListener(
    "click",
    async function () {

        await gerarResposta();

    }
);



/* =========================================================
   COPIAR
========================================================= */

copyButton.addEventListener(
    "click",
    async function () {

        const texto =
            resultText.textContent;


        if (!texto) {

            return;

        }


        try {

            await navigator.clipboard
                .writeText(
                    texto
                );


            mostrarToast(
                "Mensagem copiada!"
            );

        }

        catch (error) {

            console.error(
                "Erro ao copiar:",
                error
            );


            mostrarToast(
                "Nao foi possivel copiar."
            );

        }

    }
);



/* =========================================================
   LIMPAR
========================================================= */

clearButton.addEventListener(
    "click",
    function () {

        form.reset();


        situacao.value =
            "";


        characterCount.textContent =
            "0 / 1000";


        resultText.textContent =
            "";


        generatedResult
            .classList
            .remove(
                "visible"
            );


        emptyState.style.display =
            "flex";


        resultStatus
            .classList
            .remove(
                "ready"
            );


        resultStatus.innerHTML =
            "<i></i> Aguardando";


        localStorage.removeItem(
            "iapratica-atendimento"
        );


        mostrarToast(
            "Formulario limpo."
        );

    }
);



/* =========================================================
   SALVAR FORMULARIO
========================================================= */

function salvarFormulario(values) {

    localStorage.setItem(
        "iapratica-atendimento",
        JSON.stringify(
            values
        )
    );

}



/* =========================================================
   CARREGAR FORMULARIO
========================================================= */

function carregarFormulario() {

    const salvo =
        localStorage.getItem(
            "iapratica-atendimento"
        );


    if (!salvo) {

        return;

    }


    try {

        const values =
            JSON.parse(
                salvo
            );


        if (values.tipo) {

            document
                .getElementById("tipo")
                .value =
                values.tipo;

        }


        if (values.negocio) {

            document
                .getElementById("negocio")
                .value =
                values.negocio;

        }


        if (values.situacao) {

            situacao.value =
                values.situacao;


            characterCount.textContent =
                values.situacao.length +
                " / 1000";

        }


        if (values.tom) {

            const radio =
                document.querySelector(
                    'input[name="tom"][value="' +
                    values.tom +
                    '"]'
                );


            if (radio) {

                radio.checked =
                    true;

            }

        }

    }

    catch (error) {

        console.error(
            "Erro ao carregar formulario:",
            error
        );

    }

}



/* =========================================================
   HISTORICO DO DASHBOARD
========================================================= */

function salvarHistorico() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "iapratica-history"
            ) || "[]"
        );


    history.unshift({

        icon:
            "💬",

        category:
            "ATENDIMENTO",

        title:
            "Falar com clientes",

        time:
            new Date()
                .toLocaleTimeString(
                    "pt-BR",
                    {

                        hour:
                            "2-digit",

                        minute:
                            "2-digit"

                    }
                )

    });


    localStorage.setItem(
        "iapratica-history",
        JSON.stringify(
            history.slice(
                0,
                5
            )
        )
    );

}



/* =========================================================
   TOAST
========================================================= */

function mostrarToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "visible"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "visible"
            );

        },
        1800
    );

}



/* =========================================================
   INICIAR
========================================================= */

carregarFormulario();