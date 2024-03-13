// Recuperare elementi di interesse della pagina
const addButton = document.querySelector('.add-button');
const resetButton = document.querySelector('.reset-button');
const inputField = document.querySelector('input');
const todoList = document.querySelector('.todo-list');
const emptyListMessage = document.querySelector('.empty-list-message');

// Creare una chiave per il local storage
const STORAGE_KEY = '__bool_todo__';

// Lista attività
let activities = [];

// Controllare se c'erano attività nello storage 
const storage = localStorage.getItem(STORAGE_KEY);

if (storage) {
    activities = JSON.parse(storage);
}

showContent();

// OPERAZIONI DINAMICHE

addButton.addEventListener('click', function () {
    // Recuperare il testo nel campo
    const newActivity = inputField.value.trim();

    if (newActivity.length > 0) {
        addActivity(newActivity);
    }
});

resetButton.addEventListener('click', function () {
    // Mostrare una finestra di conferma
    const confirmed = window.confirm('Sei sicuro di voler resettare la lista delle attività?');

    if (confirmed) {
        // Richiamare la funzione resetList per pulire la lista
        resetList();
    }
});



// FUNZIONI

function showContent() {
    // Pulire tutto
    todoList.innerHTML = ''; // Usiamo innerHTML per rimuovere gli elementi HTML
    emptyListMessage.innerText = '';

    if (activities.length > 0) {
        activities.forEach(function (activity) {
            todoList.innerHTML += `
                <li class="todo-item">
                    <div class="todo-check">
                        <img src="images/check.png" alt="Check Icon">
                    </div>
                    <p class="todo-text">${activity}</p>
                    <button class="edit-button">
                        <img src="images/edit.png" alt="edit icon">
                    </button>
                </li>`;
        });

        makeCheckClickable();

    } else {
        emptyListMessage.innerText = 'Sembra che non ci siano attività';
    }
}

function makeCheckClickable() {
    // Cercare tutti i check e fare sì che siano cliccabili
    const checks = document.querySelectorAll('.todo-check');

    // Per ognuno dei check
    checks.forEach(function (check, index) {
        check.addEventListener('click', function () {
            // Mostrare una finestra di conferma
            const confirmed = window.confirm('Sei sicuro di voler rimuovere questa attività?');

            if (confirmed) {
                // Rimuovere elemento dalla lista 
                activities.splice(index, 1);
                // Aggiornare storage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
                // Aggiornare la lista in pagina
                showContent();
            }
        });
    });
}

function addActivity(newActivity) {
    // Aggiungere attività alla lista 
    activities.push(newActivity);
    // Aggiorna lo storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    showContent();
    // Svuotare il campo
    inputField.value = '';
}

function resetList() {
    // Svuota l'array delle attività
    activities = [];
    // Svuota il localStorage
    localStorage.clear();
    // Aggiorna la visualizzazione
    showContent();
}

// Da inserire alla fine dello script perché in #OPERAZIONI DINAMICHE ancora non esiste edit-button
todoList.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('edit-button')) {
        // Trovare il paragrafo corrispondente
        const todoText = target.parentElement.querySelector('.todo-text');

        // Inserire nuovo testo
        const newText = window.prompt('Inserisci il nuovo testo per l\'attività:', todoText.innerText);

        if (newText !== null && newText.trim() !== '') {
            todoText.innerText = newText.trim();
            // Trovare l'indice dell'attività nella lista
            const index = Array.from(todoList.children).indexOf(target.parentElement);
            // Aggiornare l'attività nell'array activities
            activities[index] = newText.trim();
            // Aggiornare lo storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        }
    }
});
