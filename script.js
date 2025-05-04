// --- TAREFAS ---
function adicionarTarefa() {
    const input = document.getElementById("novaTarefa");
    const categoriaSelect = document.getElementById("categoriaTarefa");
    const texto = input.value.trim();
    const categoria = categoriaSelect.value;

    if (texto === "") return;

    const nova = {
        texto: texto,
        categoria: categoria,
        concluida: false
    };

    let tarefas = carregarTarefas();
    tarefas.push(nova);
    salvarTarefas(tarefas);

    input.value = "";
    renderizarTarefas();
}

function renderizarTarefas() {
    const lista = document.getElementById("listaTarefas");
    lista.innerHTML = "";

    const tarefas = carregarTarefas();

    tarefas.forEach((tarefa, index) => {
        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${tarefa.texto} [${tarefa.categoria}]`;
        if (tarefa.concluida) texto.classList.add("concluida");

        texto.onclick = () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas(tarefas);
            renderizarTarefas();
        };

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.onclick = () => {
            const novoTexto = prompt("Editar tarefa:", tarefa.texto);
            if (novoTexto !== null && novoTexto.trim() !== "") {
                tarefa.texto = novoTexto.trim();
                salvarTarefas(tarefas);
                renderizarTarefas();
            }
        };

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "❌";
        btnExcluir.onclick = () => {
            tarefas.splice(index, 1);
            salvarTarefas(tarefas);
            renderizarTarefas();
        };

        item.appendChild(texto);
        item.appendChild(btnEditar);
        item.appendChild(btnExcluir);
        lista.appendChild(item);
    });
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const dados = localStorage.getItem("tarefas");
    return dados ? JSON.parse(dados) : [];
}

// --- FINANÇAS ---
function adicionarTransacao() {
    const descricaoInput = document.getElementById("descricao");
    const valorInput = document.getElementById("valor");
    const categoriaInput = document.getElementById("categoriaTransacao");

    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const categoria = categoriaInput.value;

    if (descricao === "" || isNaN(valor)) {
        alert("Preencha a descrição e um valor válido.");
        return;
    }

    const transacoes = carregarTransacoes();
    transacoes.push({ descricao, valor, categoria });
    salvarTransacoes(transacoes);

    descricaoInput.value = "";
    valorInput.value = "";

    renderizarTransacoes();
}

function renderizarTransacoes() {
    const lista = document.getElementById("listaTransacoes");
    const saldoSpan = document.getElementById("saldo");
    lista.innerHTML = "";

    const transacoes = carregarTransacoes();
    let saldo = 0;

    transacoes.forEach((t, index) => {
        const item = document.createElement("li");
        item.textContent = `${t.descricao} [${t.categoria}]: R$ ${t.valor.toFixed(2)}`;
        saldo += t.valor;

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "❌";
        btnExcluir.onclick = () => {
            transacoes.splice(index, 1);
            salvarTransacoes(transacoes);
            renderizarTransacoes();
        };

        item.appendChild(btnExcluir);
        lista.appendChild(item);
    });

    saldoSpan.textContent = saldo.toFixed(2);
    gerarGrafico(transacoes);
}

function salvarTransacoes(transacoes) {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function carregarTransacoes() {
    const dados = localStorage.getItem("transacoes");
    return dados ? JSON.parse(dados) : [];
}

// --- GRÁFICO ---
function gerarGrafico(transacoes) {
    const canvas = document.getElementById("graficoCategorias");
    const ctx = canvas.getContext("2d");

    const gastosPorCategoria = {};

    transacoes.forEach(t => {
        if (t.valor < 0) {
            if (!gastosPorCategoria[t.categoria]) {
                gastosPorCategoria[t.categoria] = 0;
            }
            gastosPorCategoria[t.categoria] += Math.abs(t.valor);
        }
    });

    const labels = Object.keys(gastosPorCategoria);
    const dados = Object.values(gastosPorCategoria);

    if (window.grafico) {
        window.grafico.destroy();
    }

    window.grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Categoria (R$)',
                data: dados,
                backgroundColor: ['#f87171', '#facc15', '#34d399', '#60a5fa']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- INICIALIZAÇÃO ---
window.onload = () => {
    renderizarTarefas();
    renderizarTransacoes();
};
