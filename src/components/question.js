let draggedElement = null;
let answerWords = [];

// Funciones para el manejo de drag and drop
document.addEventListener('DOMContentLoaded', function() {
    const wordChips = document.querySelectorAll('.word-chip');
    const answerArea = document.getElementById('answerArea1');

    wordChips.forEach(chip => {
        chip.addEventListener('dragstart', handleDragStart);
        chip.addEventListener('dragend', handleDragEnd);
    });

    answerArea.addEventListener('dragover', handleDragOver);
    answerArea.addEventListener('drop', handleDrop);
    answerArea.addEventListener('dragenter', handleDragEnter);
    answerArea.addEventListener('dragleave', handleDragLeave);
});

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedElement && !draggedElement.classList.contains('used')) {
        // Clonar la palabra y agregarla al área de respuesta
        const clonedChip = draggedElement.cloneNode(true);
        clonedChip.classList.remove('dragging');
        clonedChip.classList.add('answer-word');
        clonedChip.draggable = false;
        
        // Funcionalidad para quitar la palabra
        clonedChip.addEventListener('click', function() {
            const originalWord = draggedElement.getAttribute('data-word');
            const originalChip = document.querySelector('[data-word = "' + originalWord + '"]');
            if (originalChip) {
                originalChip.classList.remove('used');
            }
            this.remove();
            updateAnswerWords();
        });

        this.appendChild(clonedChip);
        draggedElement.classList.add('used');
        updateAnswerWords();
    }
}

function updateAnswerWords() {
    const answerArea = document.getElementById('answerArea1');
    answerWords = Array.from(answerArea.children).map(chip => 
        chip.getAttribute('data-word') || chip.textContent
    );
}

function checkAnswer1() {
    const respuestaUsuario = answerWords.join(' ');  // Unir las palabras en el área de respuesta
    const feedback = document.getElementById('feedback1'); // Área de feedback

    // Enviar la respuesta al PHP usando fetch
    fetch('enviar-respuesta.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'respuesta=' + encodeURIComponent(respuestaUsuario) // Pasar la respuesta del usuario
    })
    .then(response => response.json())  // Obtener la respuesta en formato JSON
    .then(data => {
        if (data.error) {
            alert(data.error);  // Mostrar alerta si hubo un error
        } else {
            // Mostrar el mensaje recibido desde PHP en el feedback
            feedback.style.display = 'block';
            feedback.className = 'feedback ' + (data.correcto ? 'correct' : 'incorrect');
            feedback.textContent = data.mensaje; // Mostrar el mensaje enviado desde PHP

            // También podemos hacer que muestre una alerta adicional
            if (data.correcto) {
                alert('¡Respuesta correcta!');  // Alerta en caso de respuesta correcta
            } else {
                alert('¡Respuesta incorrecta!');  // Alerta en caso de respuesta incorrecta
            }
        }
    })
    .catch(error => {
        console.error('Error al enviar la respuesta:', error);
        alert('Hubo un error al procesar tu respuesta. Intenta nuevamente.');
    });
}
