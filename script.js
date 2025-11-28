window.onload = function() {

    let canvas = document.getElementById('paintCanvas');
    let context = canvas.getContext('2d');
    let boundings = canvas.getBoundingClientRect();
    let range = document.getElementById('brush').value;

    let mouseX = 0;
    let mouseY = 0;
    let isDrawing = false;
    context.strokeStyle = 'black';

    let brush = document.getElementById('brush');
    let brushSizeDisplay = document.getElementById('brushSize');
    context.lineWidth = brush ? brush.value : 1;

    brush.addEventListener('input', function(e) {
        context.lineWidth = e.target.value;
        brushSizeDisplay.innerText = e.target.value;
    });

    let colours = document.getElementsByClassName('colours')[0];

    if (colours) {
        let buttons = colours.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            let b = buttons[i];
            if (b.value) b.style.backgroundColor = b.value;
        }

        colours.addEventListener('click', function(event) {
            if (event.target && event.target.tagName === 'BUTTON') {
                context.strokeStyle = event.target.value || 'black';
            }
        });
    }

    canvas.addEventListener('mousedown', function(event) {
        setMouseCoordinates(event);
        isDrawing = true;

        context.beginPath();
        context.moveTo(mouseX, mouseY);
    });

    canvas.addEventListener('mousemove', function(event) {
        setMouseCoordinates(event);
        if (isDrawing) {
            context.lineTo(mouseX, mouseY);
            context.stroke();
        }
    });

    canvas.addEventListener('mouseup', function(event) {
        setMouseCoordinates(event);
        isDrawing = false;
    });

    function setMouseCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    }

    let clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    let saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function() {
        let dataURL = canvas.toDataURL('image/png');
        let link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        link.click();
    });

    let undoSave = [];
    const maximumUndos = 20;

    undoSave.push(canvas.toDataURL());

    canvas.addEventListener('mouseup', function(event) {
        setMouseCoordinates(event);
        isDrawing = false;

        undoSave.push(canvas.toDataURL());
        if (undoSave.length > maximumUndos) {
            undoSave.shift();
        }
    });

    let undoButton = document.getElementById('undo');
    undoButton.addEventListener('click', function() {
        if (undoSave.length > 1) {
            undoSave.pop();
            let previousState = undoSave[undoSave.length - 1];
            let img = new Image();
            img.src = previousState;
            img.onload = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
            };
        }
    });
}