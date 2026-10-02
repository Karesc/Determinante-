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
