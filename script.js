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

  ctx.clearRect(0, 0, W, H);

  const centerX = W / 2;
  const centerY = H / 2;
  const scale = Math.min(W, H) / 13;

  function X(x) { return centerX + x * scale; }
  function Y(y) { return centerY - y * scale; }

  // Fondo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Cuadrícula
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#eeeeee";

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

  // Ejes
  ctx.strokeStyle = "#777777";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(X(-6), Y(0));
  ctx.lineTo(X(6), Y(0));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(X(0), Y(-6));
  ctx.lineTo(X(0), Y(6));
  ctx.stroke();

  // Puntos del paralelogramo
  const O = [0, 0];
  const U = [data.a, data.c];
  const V = [data.b, data.d];
  const UV = [data.a + data.b, data.c + data.d];

  // Área
  ctx.beginPath();
  ctx.moveTo(X(O[0]), Y(O[1]));
  ctx.lineTo(X(U[0]), Y(U[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.lineTo(X(V[0]), Y(V[1]));
  ctx.closePath();

  ctx.fillStyle = "rgba(49, 92, 140, 0.18)";
  ctx.fill();

  ctx.strokeStyle = "#315c8c";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Flecha
  function arrow(from, to, label) {
    const x1 = X(from[0]);
    const y1 = Y(from[1]);
    const x2 = X(to[0]);
    const y2 = Y(to[1]);

    ctx.strokeStyle = "#202124";
    ctx.fillStyle = "#202124";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 12;

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

    ctx.font = "bold 20px Arial";
    ctx.fillText(label, x2 + 10, y2 - 10);
  }

  arrow(O, U, "u");
  arrow(O, V, "v");

  // Vector diagonal
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(X(U[0]), Y(U[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(X(V[0]), Y(V[1]));
  ctx.lineTo(X(UV[0]), Y(UV[1]));
  ctx.stroke();
  ctx.setLineDash([]);

  // Texto del área
  const det = data.a * data.d - data.b * data.c;
  const area = Math.abs(det);

  ctx.fillStyle = "#202124";
  ctx.font = "bold 18px Arial";
  ctx.fillText(`|det(A)| = ${fmt(area)}`, 20, 35);

  // Origen
  ctx.beginPath();
  ctx.arc(X(0), Y(0), 5, 0, Math.PI * 2);
  ctx.fill();
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

  const O = [0, 0, 0];

  const U = u;

  const V = v;

  const W = w;

  const UV = [
    u[0] + v[0],
    u[1] + v[1],
    u[2] + v[2]
  ];

  const UW = [
    u[0] + w[0],
    u[1] + w[1],
    u[2] + w[2]
  ];

  const VW = [
    v[0] + w[0],
    v[1] + w[1],
    v[2] + w[2]
  ];

  const UVW = [
    u[0] + v[0] + w[0],
    u[1] + v[1] + w[1],
    u[2] + v[2] + w[2]
  ];


  /* -------------------------------------------------------
     Vértices
     ------------------------------------------------------- */

  const vertices = [
    O, U, V, W,
    UV, UW, VW, UVW
  ];


  const x = vertices.map(p => p[0]);
  const y = vertices.map(p => p[1]);
  const z = vertices.map(p => p[2]);


  /* -------------------------------------------------------
     Caras trianguladas
     ------------------------------------------------------- */

  const i = [
    0, 0,
    0, 0,
    1, 1,
    2, 2,
    3, 3,
    4, 4
  ];

  const j = [
    1, 2,
    1, 3,
    4, 5,
    4, 6,
    5, 6,
    7, 7
  ];

  const k = [
    4, 6,
    5, 5,
    7, 7,
    7, 7,
    7, 7,
    6, 5
  ];


  /* -------------------------------------------------------
     Paralelepípedo
     ------------------------------------------------------- */

  const box = {
    type: "mesh3d",

    x: x,
    y: y,
    z: z,

    i: i,
    j: j,
    k: k,

    opacity: 0.55,

    flatshading: true,

    hoverinfo: "skip"
  };


  /* -------------------------------------------------------
     Vectores
     ------------------------------------------------------- */

  const vectorX = [
    O[0], U[0], null,
    O[0], V[0], null,
    O[0], W[0]
  ];

  const vectorY = [
    O[1], U[1], null,
    O[1], V[1], null,
    O[1], W[1]
  ];

  const vectorZ = [
    O[2], U[2], null,
    O[2], V[2], null,
    O[2], W[2]
  ];


  const vectorsPlot = {

    type: "scatter3d",

    mode: "lines",

    x: vectorX,

    y: vectorY,

    z: vectorZ,

    line: {
      width: 8
    },

    hoverinfo: "skip"
  };


  /* -------------------------------------------------------
     Extremos y etiquetas
     ------------------------------------------------------- */

  const labels = {

    type: "scatter3d",

    mode: "text",

    x: [
      U[0],
      V[0],
      W[0]
    ],

    y: [
      U[1],
      V[1],
      W[1]
    ],

    z: [
      U[2],
      V[2],
      W[2]
    ],

    text: [
      "u",
      "v",
      "w"
    ],

    textfont: {
      size: 18
    },

    hoverinfo: "skip"
  };


  /* -------------------------------------------------------
     Configuración
     ------------------------------------------------------- */

  const layout = {

    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 20
    },

    scene: {

      xaxis: {
        title: "x",
        range: [-4, 4]
      },

      yaxis: {
        title: "y",
        range: [-4, 4]
      },

      zaxis: {
        title: "z",
        range: [-4, 4]
      },

      aspectmode: "cube",

      camera: {
        eye: {
          x: 1.5,
          y: 1.5,
          z: 1.3
        }
      }

    },

    showlegend: false
  };


  Plotly.react(
    "plot3d",
    [
      box,
      vectorsPlot,
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
