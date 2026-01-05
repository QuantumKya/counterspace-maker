//-------------------------- Tool Selection Logic --------------------------

let currentColor = 'wt';
let typingmode = false;
let answermode = false;

const colorholder = document.getElementById('colorholder');
const abcimg = document.getElementById('abcimg');
const ansimg = document.getElementById('ansimg');
const extras = [abcimg, ansimg];
for (const [colorkey, color] of Object.entries(colors)) {
    const swatch = document.createElement('div');
    swatch.style.backgroundColor = color;
    swatch.id = colorkey;
    if (colorkey === 'wt') swatch.classList.toggle('selected', true);

    swatch.addEventListener('mousedown', e => {
        e.preventDefault();
        if (e.button !== 0) return;
        
        currentColor = colorkey;
        typingmode = false;
        answermode = false;
        colorholder.querySelectorAll('div').forEach(div => {
            div.classList.toggle('selected', div.id === colorkey);
        });
        extras.forEach(el => el.classList.toggle('selected', false));
    });

    colorholder.appendChild(swatch);
}
for (const elem of extras) elem.addEventListener('mousedown', e => {
    e.preventDefault();
    if (e.button !== 0) return;

    typingmode = false;
    answermode = false;
    if (elem === abcimg) typingmode = true;
    if (elem === ansimg) answermode = true;
    colorholder.querySelectorAll('div').forEach(div => div.classList.toggle('selected', false));
    extras.forEach(el => {
        el.classList.toggle('selected', el === elem);
    });
});



//-------------------------- Drawing Logic --------------------------

let drawing = false;
canvas.addEventListener('mousedown', e => {
    if (typingmode) return;
    if (e.button !== 0) return;

    const mp = getMPos();
    if (answermode) {
        const i = inputs.findIndex(p => p.x === mp.x && p.y === mp.y);

        (i === -1)
        ? inputs.push({ x: mp.x, y: mp.y })
        : inputs.splice(i, 1);

        draw();
    }
    else {
        drawing = true;
    
        setGridColor(mp.x, mp.y, currentColor);
    }
});
window.addEventListener('mouseup', e => drawing = false);


canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const mp = getMPos();
    setGridColor(mp.x, mp.y, currentColor);
});



//-------------------------- Drawing Logic --------------------------

function drawInputs() {
    ctx.font = `bold ${fontSize}px Roboto`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'hanging';
    ctx.textRendering = 'auto';
    ctx.fillStyle = '#000000';
    for (const input of inputs) {
        ctx.fillText('__', (input.x+0.5)*RESX, (input.y+0.4)*RESY, RESX*0.40);
    }
}
pacificDraw = drawInputs;



//-------------------------- Character Entry --------------------------

document.addEventListener('keydown', e => {
    if (!typingmode) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    const mp = getMPos();

    if (e.key === 'Backspace') {
        setGridChar(mp.x, mp.y, '');
        return;
    }
    if (e.key.length !== 1) return;
    
    setGridChar(mp.x, mp.y, e.key);
});