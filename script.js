const playersInput = document.getElementById("players");
const betInput = document.getElementById("bet");
const beersInput = document.getElementById("cervezas");

const pozoInput = document.getElementById("pozo");
const sugeridaInput = document.getElementById("cervezaSugerida");
const premiosInput = document.getElementById("premios");

playersInput.addEventListener("input", actualizarValores);
betInput.addEventListener("change", actualizarValores);
beersInput.addEventListener("input", actualizarValores);

document
    .getElementById("btnCalcular")
    .addEventListener("click", calcular);

function formato(valor){

    return valor.toLocaleString("es-CO",{
        style:"currency",
        currency:"COP",
        maximumFractionDigits:0
    });

}

function actualizarValores(){

    const jugadores = Number(playersInput.value);
    const apuesta = Number(betInput.value);

    if(jugadores<=0) return;

    const pozo = jugadores * apuesta;

    const sugerido = Math.round((pozo*0.10)/1000)*1000;

    pozoInput.value = formato(pozo);

    sugeridaInput.value = formato(sugerido);

    if(
        beersInput.value==="" ||
        Number(beersInput.value)==0
    ){
        beersInput.value=sugerido;
    }

    premiosInput.value=formato(

        pozo-Number(beersInput.value)

    );

}

actualizarValores();

function leerRanking(texto){

    const ranking=[];

    texto.trim().split("\n").forEach(linea=>{

        linea=linea.trim();

        if(linea==="") return;

        const partes=linea.split(" ");

        const score=Number(partes.pop());

        const nombre=partes.join(" ");

        ranking.push({

            nombre,
            score

        });

    });

    ranking.sort((a,b)=>a.score-b.score);

    return ranking;

}

function calcular(){

    const general=leerRanking(
        document.getElementById("general").value
    );

    const ida=leerRanking(
        document.getElementById("ida").value
    );

    const vuelta=leerRanking(
        document.getElementById("vuelta").value
    );

    if(
        general.length===0 ||
        ida.length===0 ||
        vuelta.length===0
    ){

        alert("Debe ingresar los resultados.");

        return;

    }

    const resultado=liquidarPolla({

        jugadores:Number(playersInput.value),

        apuesta:Number(betInput.value),

        cervezas:Number(beersInput.value)

    },

    general,
    ida,
    vuelta);

    mostrarResultado(resultado);

}

function mostrarResultado(resultado){

    let html="";

    html+=`
        <h3>Resumen</h3>

        <p><b>Pozo:</b> ${formato(resultado.bolsa.pozo)}</p>

        <p><b>Cervezas:</b> ${formato(resultado.bolsa.cervezas)}</p>

        <p><b>Premios:</b> ${formato(resultado.bolsa.premios)}</p>

        <hr>

        <table>

        <tr>

        <th>Jugador</th>

        <th>Total ganado</th>

        </tr>
    `;

    const lista=[];

    for(const jugador in resultado.premios){

        lista.push({

            nombre:jugador,

            dinero:resultado.premios[jugador]

        });

    }

    lista.sort((a,b)=>b.dinero-a.dinero);

    lista.forEach(j=>{

        html+=`

        <tr>

            <td>${j.nombre}</td>

            <td>${formato(j.dinero)}</td>

        </tr>

        `;

    });

    html+="</table>";

    document.getElementById("resultado").innerHTML=html;

}