const playersInput = document.getElementById("players");
const betInput = document.getElementById("bet");
const beersInput = document.getElementById("cervezas");

const pozoInput = document.getElementById("pozo");
const sugeridaInput = document.getElementById("cervezaSugerida");
const premiosInput = document.getElementById("premios");

playersInput.addEventListener("input", actualizarValores);
betInput.addEventListener("change", actualizarValores);
beersInput.addEventListener("input", actualizarValores);

document.getElementById("btnCalcular").addEventListener("click", calcular);

const btnWhatsapp = document.getElementById("btnWhatsapp");

function actualizarValores() {

    const jugadores = Number(playersInput.value);
    const apuesta = Number(betInput.value);

    if (!jugadores) return;

    const pozo = jugadores * apuesta;

    let sugerido = Math.round((pozo * 0.10) / 1000) * 1000;

    pozoInput.value = formato(pozo);
    sugeridaInput.value = formato(sugerido);

    if (beersInput.value === "" || Number(beersInput.value) === 0) {
        beersInput.value = sugerido;
    }

    premiosInput.value = formato(pozo - Number(beersInput.value));

}

actualizarValores();

function leerRanking(texto) {

    const ranking = [];

    texto.trim().split("\n").forEach(linea => {

        linea = linea.trim();

        if (linea === "") return;

        const partes = linea.split(/\s+/);

        const score = Number(partes.pop());

        const nombre = partes.join(" ");

        ranking.push({
            nombre,
            score
        });

    });

    return ranking;

}

function calcular() {

    const resultado = liquidarPolla({

        jugadores: Number(playersInput.value),
        apuesta: Number(betInput.value),
        cervezas: Number(beersInput.value)

    },

    leerRanking(document.getElementById("general").value),
    leerRanking(document.getElementById("ida").value),
    leerRanking(document.getElementById("vuelta").value)

    );

    mostrarResultado(resultado);

}

function ganador(detalle){

    const nombres = Object.keys(detalle);

    if(nombres.length===0) return null;

    let ganador=nombres[0];

    nombres.forEach(nombre=>{

        if(detalle[nombre]>detalle[ganador]){

            ganador=nombre;

        }

    });

    return{

        nombre:ganador,

        premio:detalle[ganador]

    };

}

function mostrarResultado(resultado){

    const gGeneral=ganador(resultado.detalle.general);
    const gIda=ganador(resultado.detalle.ida);
    const gVuelta=ganador(resultado.detalle.vuelta);

    document.getElementById("cardsGanadores").innerHTML=`

    <div class="cardWinner">

        <h3>🏆 General</h3>

        <div class="nombre">${gGeneral.nombre}</div>

        <div class="valor">${formato(gGeneral.premio)}</div>

    </div>

    <div class="cardWinner">

        <h3>🥇 Primera vuelta</h3>

        <div class="nombre">${gIda.nombre}</div>

        <div class="valor">${formato(gIda.premio)}</div>

    </div>

    <div class="cardWinner">

        <h3>🔥 Segunda vuelta</h3>

        <div class="nombre">${gVuelta.nombre}</div>

        <div class="valor">${formato(gVuelta.premio)}</div>

    </div>

    `;

    let jugadores=Object.entries(resultado.jugadores);

    jugadores.sort((a,b)=>b[1].total-a[1].total);

    let html=`

    <table>

        <tr>

            <th>Jugador</th>

            <th>General</th>

            <th>Ida</th>

            <th>Vuelta</th>

            <th>Total</th>

        </tr>

    `;

    let whatsapp=`🏌️ GOLF POLLA\n\n`;

    whatsapp+=`👥 Jugadores: ${playersInput.value}\n`;
    whatsapp+=`💰 Pozo: ${formato(resultado.bolsa.pozo)}\n`;
    whatsapp+=`🍺 Cervezas: ${formato(resultado.bolsa.cervezas)}\n\n`;

    jugadores.forEach((j,index)=>{

        let medal="";

        if(index===0) medal="🥇";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        html+=`

        <tr>

            <td>${medal} ${j[0]}</td>

            <td>${j[1].general?formato(j[1].general):"-"}</td>

            <td>${j[1].ida?formato(j[1].ida):"-"}</td>

            <td>${j[1].vuelta?formato(j[1].vuelta):"-"}</td>

            <td><b>${formato(j[1].total)}</b></td>

        </tr>

        `;

        whatsapp+=`${medal} ${j[0]}\n`;
        whatsapp+=`General: ${j[1].general?formato(j[1].general):"-"}\n`;
        whatsapp+=`Ida: ${j[1].ida?formato(j[1].ida):"-"}\n`;
        whatsapp+=`Vuelta: ${j[1].vuelta?formato(j[1].vuelta):"-"}\n`;
        whatsapp+=`TOTAL: ${formato(j[1].total)}\n\n`;

    });

    html+="</table>";

    document.getElementById("resultado").innerHTML=html;

    btnWhatsapp.style.display="block";

    btnWhatsapp.onclick=()=>{

        navigator.clipboard.writeText(whatsapp);

        alert("Resultados copiados al portapapeles.");

    };

}