const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 1500;

const grid = [];
let WIDTH = 5;
let HEIGHT = 5;
let RESX = canvas.width / WIDTH;
let RESY = canvas.height / HEIGHT;
let fontSize = RESY * 0.66;

const inputs = [];

function init(w = WIDTH, h = HEIGHT) {
    WIDTH = w;
    HEIGHT = h;
    RESX = canvas.width / WIDTH;
    RESY = canvas.height / HEIGHT;
    fontSize = RESY * 0.66;

    inputs.length = 0;
    grid.length = 0;
    for (let x = 0; x < w; x++) grid[x] = new Array(h).fill('wt ');
}

const textlevelinput = document.getElementById('b64input');
textlevelinput.value = '';


//-------------------------- Color Catalogue --------------------------

const colors = {
    'wt': '#ffffff',
    'lg': '#efefef',
    'dg': '#cccccc',
    'rd': '#ff9e9e',
    'bl': '#83c1f8',
    'cy': '#d3f8ff',
    'gr': '#a9f78e',
    'yw': '#ffe28d',
    'or': '#fac38a',
    'pk': '#ffaedf',
    'pr': '#c6b7e7',
};


//-------------------------- Grid Logic --------------------------

function getGrid(x, y) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;

    const entry = grid[x][y];
    if (!entry) return;

    const color = entry.slice(0,2);
    const char = entry.slice(2);
    return { color, char };
}
function setGrid(x, y, color, char = '') {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    if (!Object.keys(colors).includes(color)) return;

    grid[x][y] = color + char;
    draw();
}
function setGridColor(x, y, color) {
    const g = getGrid(x, y);
    if (!g) return;
    setGrid(x, y, color, g.char);
}
function setGridChar(x, y, char) {
    const g = getGrid(x, y);
    if (!g) return;
    setGrid(x, y, g.color, char);
}


//-------------------------- Drawing Logic --------------------------

const edgeColor = '#e1e1e1';
const edgeWidth = 8;

let pacificDraw = () => {};

function edgeDraw() {
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = edgeWidth;
    ctx.beginPath();
    for (let x = 1; x < WIDTH; x++) {
        ctx.moveTo(x*RESX, 0);
        ctx.lineTo(x*RESX, canvas.height);
    }
    for (let y = 1; y < HEIGHT; y++) {
        ctx.moveTo(0, y*RESY);
        ctx.lineTo(canvas.width, y*RESY);
    }
    ctx.stroke();
}

function draw() {
    ctx.font = `${fontSize}px Roboto`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.textRendering = 'geometricPrecision';

    for (let x = 0; x < WIDTH; x++)
        for (let y = 0; y < HEIGHT; y++) {
            const gridData = getGrid(x, y);
            if (!gridData) continue;

            ctx.fillStyle = colors[gridData.color];
            ctx.fillRect(x*RESX, y*RESY, RESX, RESY);
            ctx.fillStyle = '#000000';
            ctx.fillText(gridData.char, (x+0.5)*RESX, (y+0.5)*RESY, RESX*0.75);
    }

    edgeDraw();

    pacificDraw();
}


//-------------------------- Mouse Position --------------------------

const findGridPosFromMouse = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * canvas.width / rect.width;
    const my = (e.clientY - rect.top) * canvas.height / rect.height;

    const px = Math.floor(mx / RESX);
    const py = Math.floor(my / RESY);
    return { x: px, y: py };
}

let mPos = { x: 0, y: 0 };
const getMPos = () => mPos;
const setMPos = (mp) => mPos = mp;

canvas.addEventListener('mousemove', e => {
    const mp = findGridPosFromMouse(e);
    setMPos(mp);
});
canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    const mp = findGridPosFromMouse(e);
    setMPos(mp);
});


//-------------------------- Initialization --------------------------

init(5, 5);
draw();


//-------------------------- Puzzle Saving & Sharing --------------------------

const exportPuzzle = () => {
    let data = `${WIDTH},${HEIGHT}`;

    for (let i = 0; i < WIDTH; i++)
        for (let j = 0; j < HEIGHT; j++) {
            const g = getGrid(i, j);
            if (g) {
                data += `${g.color}${g.char}`;
            } else {
                data += 'wt ';
            }
        }

    if (inputs.length > 0) {
        for (const input of inputs) {
            data += `${input.x},${input.y}`;
            data += ';';
        }
        data = data.slice(0, -1);
    }
    
    navigator.clipboard.writeText(data);
    alert('Puzzle copied to clipboard!');
};

const importPuzzle = (dataStr) => {
    const sizeStr = (dataStr.match(/\d+,\d+/g) || [])[0];
    if (!sizeStr) {
        alert("Invalid puzzle data, sorry.");
        return;
    }

    const [ w, h ] = sizeStr.split(',').map(Number);

    dataStr = dataStr.slice(sizeStr.length);
    const dataArr = dataStr.slice(0, 3*w*h).match(/.{1,3}/g) || [];
    if (dataArr.length === 0) {
        alert("Invalid puzzle data, sorry.");
        return;
    }
    dataStr = dataStr.slice(3*w*h);
    
    
    init(w, h);
    
    let row = 0;
    let col = 0;
    for (const datum of dataArr) {
        grid[row][col] = datum;
        
        col++;
        if (col === w) { col = 0; row++; }
        if (row === h) break;
    }
    
    const inputData = dataStr.split(';') || [];
    inputData.forEach((a, i) => { const [ x, y ] = a.split(',').map(Number); inputs[i] = { x, y }});
    

    // ------------- FIX THIS LATER --------------------

    // reinitialize guesses to match inputs
    if (typeof guesses !== 'undefined') {
        guesses = inputs.map(a => '_');
    }
    
    draw();
}