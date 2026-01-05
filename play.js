//-------------------------- Typing Logic --------------------------

let typing = false;
let typeIndex = -1;
let guesses = inputs.map(a => '');

canvas.addEventListener('mousedown', e => {
    const mp = getMPos();
    typeIndex = inputs.findIndex(p => p.x === mp.x && p.y === mp.y);

    draw();
});

document.addEventListener('keydown', e => {
    if (e.key === ' ') e.preventDefault();
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (typeIndex === -1) return;

    if (e.key === 'Backspace') {
        guesses[typeIndex] = '';
        draw();
        return;
    }
    if (e.key.length !== 1) return;
    
    guesses[typeIndex] = e.key;
    draw();
});


//-------------------------- Win Check --------------------------

const winCheck = () =>
    guesses.every((g, i) => {
    const ip = inputs[i];
    return (g === getGrid(ip.x, ip.y).char);
});


//-------------------------- Functions --------------------------



function drawGuesses() {
    inputs.forEach((pos, i) => {
        const g = getGrid(pos.x, pos.y);
        if (!g) return;

        ctx.fillStyle = colors[g.color];
        ctx.fillRect(pos.x * RESX, pos.y * RESY, RESX, RESY);
        
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${fontSize}px Roboto`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((guesses[i] === '') ? '_' : guesses[i], (pos.x + 0.5) * RESX, (pos.y + 0.5) * RESY, RESX * 0.75);
    });
    edgeDraw();

    if (typeIndex === -1 || !inputs[typeIndex]) return;

    const ip = inputs[typeIndex];

    ctx.strokeStyle = '#5050ff';
    ctx.lineWidth = edgeWidth;
    ctx.strokeRect(ip.x*RESX, ip.y*RESY, RESX, RESY);
}
pacificDraw = drawGuesses;