const chaptersData = {
    1: {
        title: "Cap. 1: El Equilibrio Roto",
        img: "../media/tomoXX/tomo_xx_cap1_equilibrio_roto_1777162041759.png",
        text: "El sistema ha llegado a su límite termodinámico. El déficit actuarial proyectado de más de 13,743 millones de pesos para el 2025 no es solo un número; es el incendio forestal que consume el seguro de salud y las pensiones del Magisterio Sonorense."
    },
    2: {
        title: "Cap. 2: El Diseño de la Ceguera",
        img: "../media/tomoXX/tomo_xx_cap2_diseno_ceguera_1777162386868.png",
        text: "La Agnotología Institucional es el diseño deliberado de la ceguera. La SEP y la SEC no operan como ministerios de ilustración, sino como tecnologías de control social. Su función principal es la producción de ignorancia y sumisión mediante la 'Neurosis Burocrática'."
    },
    3: {
        title: "Cap. 3: La Fachada vs La Realidad",
        img: "../media/tomoXX/tomo_xx_cap3_fachada_realidad_1777162752716.png",
        text: "Mientras el discurso oficial presenta a Sonora como la sede ejemplar de la logística y la eficiencia, el microcosmos escolar se hunde en la neurosis digital. La desinformación paraliza el sistema educativo más rápido que cualquier huelga tradicional."
    },
    4: {
        title: "Cap. 4: La Matriz de Dominación",
        img: "../media/tomoXX/tomo_xx_cap4_matriz_dominacion_1777163099581.png",
        text: "Para vencer en el tablero, primero hay que decodificar a los jugadores. El Estado aplica la 'Inducción hacia atrás', asfixiando administrativamente al maestro. La Sección 28 del SNTE utiliza la 'Desaparición Táctica', administrando la escasez."
    },
    5: {
        title: "Cap. 5: La Trampa de la Sobrevivencia",
        img: "../media/tomoXX/tomo_xx_cap5_trampa_sobrevivencia_1777163392655.png",
        text: "La Ley de la Proximidad es el arma más efectiva del Estado. Al obligar al docente a luchar por la quincena y medicinas escasas, se bloquea su visión estratégica. Este mecanismo premia el 'Alma Animal' y suprime la solidaridad."
    },
    6: {
        title: "Cap. 6: La Ley de la Asimetría",
        img: "../media/tomoXX/tomo_xx_cap6_ley_asimetria_1777163687103.png",
        text: "El Magisterio Sonorense vence al encarecer el costo político de cada jugada del oponente. La Ley de la Asimetría enseña que el jugador más débil vence alterando la matriz de certidumbre del oponente. No es peso, es inteligencia."
    },
    7: {
        title: "Cap. 7: Cooperación Inteligente",
        img: "../media/tomoXX/tomo_xx_cap7_con_marco_1777164538603.png",
        text: "Abandonar el 'Dilema del Prisionero' y abrazar la 'Cooperación Inteligente'. Requiere tres tácticas: Oráculo Actuarial, Estrategia Estocástica y Autonomía Curricular. La unión es una decisión matemática, no solo emocional."
    },
    8: {
        title: "Cap. 8: El Oráculo Actuarial",
        img: "../media/tomoXX/tomo_xx_cap8_oraculo_actuarial_marcado_1777164861921.png",
        text: "Hackear la agnotología financiera mediante auditorías ciudadanas implacables sobre el FASM28. Democratizar el saber actuarial es sustituir consignas vacías por datos irrebatibles que anulan el poder del charrismo."
    },
    9: {
        title: "Cap. 9: El Ojo por Ojo Cooperativo",
        img: "../media/tomoXX/tomo_xx_cap9_corregido_marcado_1777165381956.png",
        text: "La solidaridad como principio táctico. El 'Ojo por Ojo Cooperativo' implica respuesta colectiva inmediata ante cualquier traición del sistema. Elevar el costo político de la agresión vuelve insostenible la represión."
    },
    10: {
        title: "Cap. 10: El Caballo de Troya",
        img: "../media/tomoXX/tomo_xx_cap10_caballo_troya_marcado_1777165752194.png",
        text: "Transformar el codiseño de la NEM en un arma de insurrección intelectual. Usar el Programa Analítico para diagnosticar la realidad y enseñar a los alumnos a discernir la verdad. El currículo es nuestro Caballo de Troya."
    },
    11: {
        title: "Conclusión: El Bosque Clímax",
        img: "../media/tomoXX/tomo_xx_conclusion_bosque_climax_marcado_1777166345800.png",
        text: "El incendio forestal del ISSSTE es inevitable, pero el saber del magisterio es el banco de semillas. Sonora evoluciona hacia una Comunidad Resiliente. El Jaque Mate no es el fin, es el inicio de una nueva realidad docente."
    }
};

function openModal(id) {
    const data = chaptersData[id];
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${data.img}" alt="${data.title}">
        </div>
        <div class="modal-info">
            <h2>${data.title}</h2>
            <p>${data.text}</p>
            <button class="close-btn" onclick="closeModal()">Cerrar Dossier</button>
        </div>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        closeModal();
    }
}
