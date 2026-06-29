function formatoPesos(valor) {
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

    const premios = {};

    if (ranking.length === 0) return premios;

    ranking.sort((a, b) => a.score - b.score);

    const primerScore = ranking[0].score;
    const primeros = ranking.filter(j => j.score === primerScore);

    // Empate en primero
    if (primeros.length > 1) {

        const premio = bolsa / primeros.length;

        primeros.forEach(j => {

            premios[j.nombre] = premio;

        });

        return premios;

    }

    premios[primeros[0].nombre] = bolsa * 0.70;

    const restantes = ranking.filter(j => j.score !== primerScore);

    if (restantes.length === 0)
        return premios;

    const segundoScore = restantes[0].score;

    const segundos = restantes.filter(j => j.score === segundoScore);

    const premioSegundo = (bolsa * 0.30) / segundos.length;

    segundos.forEach(j => {

        premios[j.nombre] = (premios[j.nombre] || 0) + premioSegundo;

    });

    return premios;

}

function sumarPremios(total, categoria) {

    for (const jugador in categoria) {

        total[jugador] = (total[jugador] || 0) + categoria[jugador];

    }

}

function liquidarPolla(config, general, ida, vuelta) {

    const bolsa = calcularBolsa(

        config.jugadores,
        config.apuesta,
        config.cervezas

    );

    const total = {};

    sumarPremios(total, repartirCategoria(bolsa.general, general));
    sumarPremios(total, repartirCategoria(bolsa.ida, ida));
    sumarPremios(total, repartirCategoria(bolsa.vuelta, vuelta));

    return {

        bolsa,

        premios: total

    };

}