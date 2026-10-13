const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sliders = {
  a: document.getElementById("a"),
  b: document.getElementById("b"),
  c: document.getElementById("c"),
  d: document.getElementById("d")
};

const values = {
  a: document.getElementById("aValue"),
  b: document.getElementById("bValue"),
  c: document.getElementById("cValue"),
  d: document.getElementById("dValue")
};

const matrix = {
  a: document.getElementById("ma"),
  b: document.getElementById("mb"),
  c: document.getElementById("mc"),
  d: document.getElementById("md")
};

const calc = {
  a: document.getElementById("ca"),
  b: document.getElementById("cb"),
  c: document.getElementById("cc"),
  d: document.getElementById("cd")
};

const detValue = document.getElementById("detValue");
const areaValue = document.getElementById("areaValue");
const orientation = document.getElementById("orientation");

function getData() {
  return {
    a: Number(sliders.a.value),
    b: Number(sliders.b.value),
    c: Number(sliders.c.value),
    d: Number(sliders.d.value)
  };
}

function fmt(x) {
  return Number(x).toFixed(1).replace(".0", "");
}

function updateText(data) {
  for (const key of ["a", "b", "c", "d"]) {
    values[key].textContent = fmt(data[key]);
    matrix[key].textContent = fmt(data[key]);
    calc[key].textContent = fmt(data[key]);
  }

  const det = data.a * data.d - data.b * data.c;
  const area = Math.abs(det);

  detValue.textContent = fmt(det);
  areaValue.textContent = fmt(area);

  orientation.classList.remove("positive", "negative", "zero");

  if (det > 0.001) {
    orientation.textContent = "Orientación positiva";
    orientation.classList.add("positive");
  } else if (det < -0.001) {
    orientation.textContent = "Orientación negativa";
    orientation.classList.add("negative");
  } else {
    orientation.textContent = "Área cero: los vectores son paralelos";
    orientation.classList.add("zero");
  }
}


function draw(data) {
  const W = canvas.width;
  const H = canvas.height;

  const colors = {
    background: "#FAFAF7",
    grid: "#E8E8E2",
    axis: "#92958F",
    u: "#E07A5F",
    v: "#3986A8",
    area: "rgba(93, 155, 145, 0.17)",
    border: "#5D9B91",
    diagonal: "#A5AAA7",
    text: "#343A40",
    origin: "#343A40"
  };

  ctx.clearRect(0, 0, W, H);

  // Fondo
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, W, H);

  const centerX = W / 2;
  const centerY = H / 2;
  const scale = Math.min(W, H) / 13;

  function X(x) {
    return centerX + x * scale;
  }

  function Y(y) {
    return centerY - y * scale;
  }

  // Cuadrícula
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.grid;

  for (let x = -6; x <= 6; x++) {
    ctx.beginPath();
    ctx.moveTo(X(x), Y(-6));
    ctx.lineTo(X(x), Y(6));
    ctx.stroke();
  }

  for (let y = -6; y <= 6; y++) {
    ctx.beginPath();
    ctx.moveTo(X(-6), Y(y));
    ctx.lineTo(X(6), Y(y));
    ctx.stroke();
  }

  // Ejes coordenados
  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(X(-6), Y(0));
  ctx.lineTo(X(6), Y(0));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(X(0), Y(-6));
  ctx.lineTo(X(0), Y(6));
  ctx.stroke();

  // Vectores y vértices
  const O = [0, 0];
  const U = [data.a, data.c];
  const V = [data.b, data.d];
  const UV = [data.a + data.b, data.c + data.d];

  // Paralelogramo
  ctx.beginPath();
  ctx.moveTo(X(O[0]), Y(O[1]));
  ctx.lineTo(X(U[0]), Y(U[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.lineTo(X(V[0]), Y(V[1]));
  ctx.closePath();

  ctx.fillStyle = colors.area;
  ctx.fill();

  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Flechas vectoriales
  function arrow(from, to, label, color, offsetX = 10, offsetY = -10) {
    const x1 = X(from[0]);
    const y1 = Y(from[1]);
    const x2 = X(to[0]);
    const y2 = Y(to[1]);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 12;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Cuerpo de la flecha
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Punta
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - head * Math.cos(angle - Math.PI / 6),
      y2 - head * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - head * Math.cos(angle + Math.PI / 6),
      y2 - head * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Etiqueta con fondo claro
    ctx.font = "italic bold 20px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const labelX = x2 + offsetX;
    const labelY = y2 + offsetY;

    ctx.fillStyle = colors.background;
    ctx.fillRect(labelX - 3, labelY - 12, 22, 24);

    ctx.fillStyle = color;
    ctx.fillText(label, labelX, labelY);
  }

  arrow(O, U, "u", colors.u);
  arrow(O, V, "v", colors.v);

  // Lados trasladados: líneas discontinuas
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = colors.diagonal;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(X(U[0]), Y(U[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.moveTo(X(V[0]), Y(V[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.stroke();
  ctx.restore();

  // Vértice opuesto
  ctx.beginPath();
  ctx.arc(X(UV[0]), Y(UV[1]), 4, 0, Math.PI * 2);
  ctx.fillStyle = colors.border;
  ctx.fill();

  // Origen
  ctx.beginPath();
  ctx.arc(X(0), Y(0), 4, 0, Math.PI * 2);
  ctx.fillStyle = colors.origin;
  ctx.fill();

  // Indicador del área
  const det = data.a * data.d - data.b * data.c;
  const area = Math.abs(det);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = "600 17px Arial, sans-serif";
  ctx.fillStyle = colors.text;
  ctx.fillText(`Área = ${fmt(area)}`, 22, 32);
}


function update() {
  const data = getData();
  updateText(data);
  draw(data);
}

Object.values(sliders).forEach(slider => {
  slider.addEventListener("input", update);
});

document.getElementById("reset").addEventListener("click", () => {
  sliders.a.value = 3;
  sliders.b.value = 1;
  sliders.c.value = 1;
  sliders.d.value = 3;
  update();
});

window.addEventListener("resize", update);

update();

/* =========================================================
   DETERMINANTE 3x3 → VOLUMEN
   ========================================================= */

const sliders3D = {
  a: document.getElementById("a3"),
  b: document.getElementById("b3"),
  c: document.getElementById("c3"),
  d: document.getElementById("d3"),
  e: document.getElementById("e3"),
  f: document.getElementById("f3"),
  g: document.getElementById("g3"),
  h: document.getElementById("h3"),
  i: document.getElementById("i3")
};


/* ---------------------------------------------------------
   Obtener valores
   --------------------------------------------------------- */

function get3DData() {

  return {
    a: Number(sliders3D.a.value),
    b: Number(sliders3D.b.value),
    c: Number(sliders3D.c.value),

    d: Number(sliders3D.d.value),
    e: Number(sliders3D.e.value),
    f: Number(sliders3D.f.value),

    g: Number(sliders3D.g.value),
    h: Number(sliders3D.h.value),
    i: Number(sliders3D.i.value)
  };

}


/* ---------------------------------------------------------
   Determinante 3x3
   --------------------------------------------------------- */

function determinant3x3(A) {

  return (
    A.a * (A.e * A.i - A.f * A.h)
    -
    A.b * (A.d * A.i - A.f * A.g)
    +
    A.c * (A.d * A.h - A.e * A.g)
  );

}


/* ---------------------------------------------------------
   Actualizar números y matriz
   --------------------------------------------------------- */

function update3DText(A) {

  const keys = [
    "a", "b", "c",
    "d", "e", "f",
    "g", "h", "i"
  ];

  keys.forEach(key => {

    const valueElement =
      document.getElementById(key + "3Value");

    if (valueElement) {
      valueElement.textContent = fmt(A[key]);
    }

    const matrixElement =
      document.getElementById(key + "3m");

    if (matrixElement) {
      matrixElement.textContent = fmt(A[key]);
    }

  });

  const det = determinant3x3(A);
  const volume = Math.abs(det);

  document.getElementById("det3Value").textContent =
    fmt(det);

  document.getElementById("volume3Value").textContent =
    fmt(volume);

}


/* ---------------------------------------------------------
   Crear los vectores
   --------------------------------------------------------- */

function vectors3D(A) {

  return {

    u: [A.a, A.d, A.g],

    v: [A.b, A.e, A.h],

    w: [A.c, A.f, A.i]

  };

}


/* ---------------------------------------------------------
   Dibujar paralelepípedo
   --------------------------------------------------------- */


function draw3D(A) {
  const vectors = vectors3D(A);

  const u = vectors.u;
  const v = vectors.v;
  const w = vectors.w;

  const add = (...vectors) => [
    vectors.reduce((s, p) => s + p[0], 0),
    vectors.reduce((s, p) => s + p[1], 0),
    vectors.reduce((s, p) => s + p[2], 0)
  ];

  const O = [0, 0, 0];
  const U = u;
  const V = v;
  const W = w;
  const UV = add(u, v);
  const UW = add(u, w);
  const VW = add(v, w);
  const UVW = add(u, v, w);

  // Paleta de colores
  const colors = {
    u: "#E76F51",
    v: "#2878B5",
    w: "#269B78",
    face1: "rgba(231,111,81,0.28)",
    face2: "rgba(40,120,181,0.28)",
    face3: "rgba(38,155,120,0.28)",
    opposite: "rgba(130,140,155,0.12)",
    edge: "#657080"
  };

  // Cada cara se define mediante cuatro vértices.
  // Las caras se muestran como superficies independientes.
  const faces = [
    { points: [O, U, UV, V], color: colors.face1 },
    { points: [O, U, UW, W], color: colors.face2 },
    { points: [O, V, VW, W], color: colors.face3 },
    { points: [U, UV, UVW, UW], color: colors.opposite },
    { points: [V, UV, UVW, VW], color: colors.opposite },
    { points: [W, UW, UVW, VW], color: colors.opposite }
  ];

  const faceTraces = faces.map(face => ({
    type: "mesh3d",
    x: face.points.map(p => p[0]),
    y: face.points.map(p => p[1]),
    z: face.points.map(p => p[2]),

    // Dos triángulos forman cada paralelogramo
    i: [0, 0],
    j: [1, 2],
    k: [2, 3],

    color: face.color,
    opacity: 1,
    flatshading: false,
    showscale: false,
    hoverinfo: "skip",
    showlegend: false
  }));

  // Aristas del paralelepípedo
  const edges = [
    [O, U], [O, V], [O, W],
    [U, UV], [U, UW],
    [V, UV], [V, VW],
    [W, UW], [W, VW],
    [UV, UVW], [UW, UVW], [VW, UVW]
  ];

  const edgeTrace = {
    type: "scatter3d",
    mode: "lines",
    x: edges.flatMap(e => [e[0][0], e[1][0], null]),
    y: edges.flatMap(e => [e[0][1], e[1][1], null]),
    z: edges.flatMap(e => [e[0][2], e[1][2], null]),
    line: {
      color: colors.edge,
      width: 4
    },
    hoverinfo: "skip",
    showlegend: false
  };

  // Vectores desde el origen, cada uno con su propio color
  const vectorTraces = [
    { p: U, label: "u", color: colors.u },
    { p: V, label: "v", color: colors.v },
    { p: W, label: "w", color: colors.w }
  ].map(({ p, label, color }) => ({
    type: "scatter3d",
    mode: "lines",
    x: [0, p[0]],
    y: [0, p[1]],
    z: [0, p[2]],
    line: {
      color,
      width: 8
    },
    name: label,
    hoverinfo: "skip",
    showlegend: false
  }));

  // Etiquetas de los vectores
  const labels = {
    type: "scatter3d",
    mode: "text",
    x: [U[0], V[0], W[0]],
    y: [U[1], V[1], W[1]],
    z: [U[2], V[2], W[2]],
    text: ["u", "v", "w"],
    textposition: "top center",
    textfont: {
      size: 18,
      color: [colors.u, colors.v, colors.w],
      family: "Arial, sans-serif"
    },
    hoverinfo: "skip",
    showlegend: false
  };

  const layout = {
    margin: { l: 0, r: 0, b: 0, t: 15 },
    paper_bgcolor: "#FAFAF7",
    plot_bgcolor: "#FAFAF7",

    scene: {
      bgcolor: "#FAFAF7",

      xaxis: {
        title: "x",
        range: [-4, 4],
        gridcolor: "#E4E7EB",
        zerolinecolor: "#AAB2BD",
        showbackground: true,
        backgroundcolor: "#F5F6F4"
      },

      yaxis: {
        title: "y",
        range: [-4, 4],
        gridcolor: "#E4E7EB",
        zerolinecolor: "#AAB2BD",
        showbackground: true,
        backgroundcolor: "#F5F6F4"
      },

      zaxis: {
        title: "z",
        range: [-4, 4],
        gridcolor: "#E4E7EB",
        zerolinecolor: "#AAB2BD",
        showbackground: true,
        backgroundcolor: "#F5F6F4"
      },

      aspectmode: "cube",

      camera: {
        eye: { x: 1.6, y: 1.7, z: 1.4 }
      }
    },

    showlegend: false
  };

  Plotly.react(
    "plot3d",
    [
      ...faceTraces,
      edgeTrace,
      ...vectorTraces,
      labels
    ],
    layout,
    {
      responsive: true,
      displaylogo: false
    }
  );
}


/* ---------------------------------------------------------
   Actualizar todo
   --------------------------------------------------------- */

function update3D() {

  const data = get3DData();

  update3DText(data);

  draw3D(data);

}


function actualizarTarjeta(a, b, c, d) {
  // 1. Cálculo del determinante y área
  const det = (a * d) - (b * c);
  const area = Math.abs(det);

  // 2. Actualizar valores en el DOM
  document.getElementById('ma').innerText = a;
  document.getElementById('mb').innerText = b;
  document.getElementById('mc').innerText = c;
  document.getElementById('md').innerText = d;

  document.getElementById('ca').innerText = a;
  document.getElementById('cd').innerText = d;
  document.getElementById('cb').innerText = b;
  document.getElementById('cc').innerText = c;

  document.getElementById('detValue').innerText = det;
  document.getElementById('areaValue').innerText = area;

  // 3. Actualizar estado y clase CSS de orientación
  const orientationEl = document.getElementById('orientation');
  
  if (det > 0) {
    orientationEl.innerText = "Orientación positiva (Antihorario)";
    orientationEl.className = "orientation positive";
  } else if (det < 0) {
    orientationEl.innerText = "Orientación negativa (Horario)";
    orientationEl.className = "orientation negative";
  } else {
    orientationEl.innerText = "Degenerado (Área = 0 / Vectores colineales)";
    orientationEl.className = "orientation zero";
  }
}
/* ---------------------------------------------------------
   Sliders
   --------------------------------------------------------- */

Object.values(sliders3D).forEach(slider => {

  slider.addEventListener(
    "input",
    update3D
  );

});


/* ---------------------------------------------------------
   Botón restablecer
   --------------------------------------------------------- */

document.getElementById("reset3D").addEventListener(
  "click",
  () => {

    sliders3D.a.value = 1;
    sliders3D.b.value = 0;
    sliders3D.c.value = 0;

    sliders3D.d.value = 0;
    sliders3D.e.value = 1;
    sliders3D.f.value = 0;

    sliders3D.g.value = 0;
    sliders3D.h.value = 0;
    sliders3D.i.value = 1;

    update3D();

  }
);



/* ---------------------------------------------------------
   Inicialización
   --------------------------------------------------------- */

update3D();
