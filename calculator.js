function formato(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

function calcularBolsa(jugadores, apuesta, cervezas) {

    const pozo = jugadores * apuesta;
    const premios = pozo - cervezas;

    return {
        pozo,
        cervezas,
        premios,
        general: premios * 0.50,
        ida: premios * 0.25,
        vuelta: premios * 0.25
    };

}

function repartirCategoria(bolsa, ranking) {

    ranking.sort((a,b)=>a.score-b.score);

    const resultado={};

    if(ranking.length===0) return resultado;

    const primero=ranking[0].score;

    const primeros=ranking.filter(x=>x.score===primero);

    // Empate en primero

    if(primeros.length>1){

        const premio=bolsa/primeros.length;

        primeros.forEach(j=>{

            resultado[j.nombre]=premio;

        });

        return resultado;

    }

    resultado[primeros[0].nombre]=bolsa*0.70;

    const restantes=ranking.filter(x=>x.score!==primero);

    if(restantes.length===0) return resultado;

    const segundo=restantes[0].score;

    const segundos=restantes.filter(x=>x.score===segundo);

    const premioSegundo=(bolsa*0.30)/segundos.length;

    segundos.forEach(j=>{

        resultado[j.nombre]=(resultado[j.nombre]||0)+premioSegundo;

    });

    return resultado;

}

function liquidarPolla(config,general,ida,vuelta){

    const bolsa=calcularBolsa(

        config.jugadores,
        config.apuesta,
        config.cervezas

    );

    const premioGeneral=repartirCategoria(bolsa.general,general);

    const premioIda=repartirCategoria(bolsa.ida,ida);

    const premioVuelta=repartirCategoria(bolsa.vuelta,vuelta);

    const jugadores={};

    function agregar(categoria,nombre){

        for(const jugador in categoria){

            if(!jugadores[jugador]){

                jugadores[jugador]={

                    general:0,
                    ida:0,
                    vuelta:0,
                    total:0

                };

            }

            jugadores[jugador][nombre]+=categoria[jugador];

            jugadores[jugador].total+=categoria[jugador];

        }

    }

    agregar(premioGeneral,"general");
    agregar(premioIda,"ida");
    agregar(premioVuelta,"vuelta");

    return{

        bolsa,

        jugadores,

        detalle:{

            general:premioGeneral,
            ida:premioIda,
            vuelta:premioVuelta

        }

    };

}