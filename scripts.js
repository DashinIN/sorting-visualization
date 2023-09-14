
//Инициализируем исходный массив столбцов и состояния сортировки и ее остановки
let array = [];
let sorting = false;
let stopSorting = false;


function generateArray() {
    if (sorting) return;

    const sizeInput = document.querySelector('.array-size');
    const minValueInput = document.querySelector('.min-value');
    const maxValueInput = document.querySelector('.max-value');

    const size = parseInt(sizeInput.value);
    const minValue = parseInt(minValueInput.value);
    const maxValue = parseInt(maxValueInput.value);

    // Проверяем корректность введенных значений
    if (isNaN(size) || isNaN(minValue) || isNaN(maxValue)) {
        alert('Пожалуйста, введите корректные значения.');
        return;
    }

    if (minValue >= maxValue) {
        alert('Минимальное значение должно быть меньше максимального.');
        return;
    }

    array = [];
    const container = document.querySelector('.array-container');
    container.innerHTML = '';

    //Заполняем массив данными и отрисовываем по ним соответствующие столбцы 
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value}px`;
        container.appendChild(bar);
        array.push(value);
    }
}

//Для обновления перерисовываем значения в столбцах на новые
function updateArrayDisplay() {
    const bars = document.querySelectorAll('.array-bar');
    for (let i = 0; i < array.length; i++) {
        bars[i].style.height = `${array[i]}px`;
    }
}

//Меняем элементы местами с задержкой 50ms
async function swap(i, j) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    [array[i], array[j]] = [array[j], array[i]];
    updateArrayDisplay();
}


async function stopSort() {
    stopSorting = true;
}


function resetSortingFlags() {
    sorting = false;
    stopSorting = false;
}


async function doSort(sortFunction) {
    resetSortingFlags();
    sorting = true;
    await sortFunction();
    sorting = false;
}


//Функции, отвечающие за алгоритмы сортировки

async function bubbleSort() {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
            // Проверяем флаг остановки сортировки
            if (stopSorting) {
                resetSortingFlags();
                return;
            }
        }
    }
    resetSortingFlags();
}


async function selectionSort() {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        // Проверяем флаг остановки сортировки
        if (stopSorting) {
            resetSortingFlags();
            return;
        }
    }
    resetSortingFlags();
}


async function insertionSort() {
    const n = array.length;

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            await swap(j, j + 1);
            j = j - 1;
            // Проверяем флаг остановки сортировки
            if (stopSorting) {
                resetSortingFlags();
                return;
            }
        }
        array[j + 1] = key;
    }
    resetSortingFlags();
}


async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
        // Проверяем флаг остановки сортировки
        if (stopSorting) {
            resetSortingFlags();
            return;
        }
    }
}


async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
        // Проверяем флаг остановки сортировки
        if (stopSorting) {
            resetSortingFlags();
            return;
        }
    }
    await swap(i + 1, high);
    return i + 1;
}


async function merge(left, middle, right) {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] < rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateArrayDisplay();
        k++;
        // Проверяем флаг остановки сортировки
        if (stopSorting) {
            resetSortingFlags();
            return;
        }
    }

    while (i < leftArray.length) {
        array[k] = leftArray[i];
        i++;
        k++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateArrayDisplay();
    }

    while (j < rightArray.length) {
        array[k] = rightArray[j];
        j++;
        k++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        updateArrayDisplay();
    }
}


async function mergeSort(left, right) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);
        await mergeSort(left, middle);
        await mergeSort(middle + 1, right);
        await merge(left, middle, right);
        // Проверяем флаг остановки сортировки
        if (stopSorting) {
            resetSortingFlags();
            return;
        }
    }
}

const generateArrayButton = document.querySelector('.generate-array-btn')
const bubbleSortButton = document.querySelector('.bubble-sort-btn')
const selectionSortButton = document.querySelector('.selection-sort-btn')
const insertionSortButton = document.querySelector('.insertion-sort-btn')
const quickSortButton = document.querySelector('.quick-sort-btn')
const mergeSortButton = document.querySelector('.merge-sort-btn')
const stopSortingButton = document.querySelector('.stop-sorting-btn')

// Добавляем обработчики для кнопок
generateArrayButton.addEventListener('click', generateArray);
bubbleSortButton.addEventListener('click', () => doSort(bubbleSort));
selectionSortButton.addEventListener('click', () => doSort(selectionSort));
insertionSortButton.addEventListener('click', () => doSort(insertionSort));
quickSortButton.addEventListener('click', () => doSort(() => quickSort(0, array.length - 1)));
mergeSortButton.addEventListener('click', () => doSort(() => mergeSort(0, array.length - 1)));
stopSortingButton.addEventListener('click', stopSort);

// Инициализируем массив при загрузке страницы
generateArray();
