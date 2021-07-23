//Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			behavior: 'smooth'
		});
	});
});


//Валидация input
function validateNumberInput(input) {
   const value = parseInt(input.value);
	if (!(isNaN(value)) && value !== '' && value > 4 && value < 12) {
		return true;
	} else {
		const infoTextDiv = input.nextElementSibling;
		infoTextDiv.innerHTML = 'Число  от 4 до 12'
		return false;
	}
}

// Генерация массива
function GenerateArray(n = 8) {
	let array = [];
	for (let i = 0; i < n; i++) {
		array[i] = Math.round((Math.random() * 100));
	}
	return array;
}

//Плавное выезжание контейнеров с массивами
const SlideContainer = (container, show) => {
	if (show) {
		if (!container.classList.contains('active')) {
			container.classList.add('active');
			container.style.height = 'auto';
			const height = '250px';
			container.style.height = '0px';
			setTimeout(() => {
				container.style.height = height;
			}, 0)
		}
	} else {
		if (container.classList.contains('active')) {
			container.style.height = '0px';
			container.addEventListener('transitionend', () => {
				container.classList.remove('active');
			}, {
				once: true
			})
		}

	}
}

//Вывод массивов
const outputArray = (array, outerContainer) => {
	const container = outerContainer.querySelector('.array');
	container.innerHTML = ``;
	array.forEach((item, i) => {
		container.innerHTML += `<div class='item' data-value='${item}' data-id='${i}' style='left: ${i*130}px'>${item}</div>`
	});
}

//класс для массива
class SortingArray {
	constructor(array, containerSortingArray, containerArray) {
		this.array = array;
		this.oldArray = array;
		this.containerSortingArray = containerSortingArray;
		this.containerArray = containerArray;
	}
	outputNewArray() { //вывод нового массива
		SlideContainer(this.containerSortingArray, true);
		outputArray(this.array, this.containerSortingArray);
	}
	outputOldArray() { //вывод старого массива
		SlideContainer(this.containerArray, true);
		outputArray(this.oldArray, this.containerArray);
	}
	bubbleSortVisualization() { //Визуализация сортировки

		let flag = true; //Флаг для выхода из внешнего цикла
		let sortedArray = [];
		const container = this.containerSortingArray;
		const items = container.querySelectorAll('.item');

		function timer(ms) { //таймер для анимации
			return new Promise(res => setTimeout(res, ms));
		}

		//Внутренний цикл
		async function innerLoop() {
			flag = false;
			sortedArray = [];
			for (let i = 0; i < (items.length - 1); i++) {

				let itemCurrent = container.querySelector(`[data-id='${i}']`);
				let itemNext = container.querySelector(`[data-id='${i+1}']`);

				itemCurrent.classList.add('active');
				itemNext.classList.add('active');

				let valueCurrent = parseInt(itemCurrent.getAttribute('data-value'));
				let valueNext = parseInt(itemNext.getAttribute('data-value'));

				if (valueCurrent < valueNext) {

					itemCurrent.style.left = parseInt(itemCurrent.style.left, 10) + 130 + 'px';
					itemNext.style.left = parseInt(itemNext.style.left, 10) - 130 + 'px';

					let idCurrent = itemCurrent.getAttribute('data-id');
					let idNext = itemNext.getAttribute('data-id');

					itemCurrent.setAttribute('data-id', idNext);
					itemNext.setAttribute('data-id', idCurrent);

					flag = true;
				}

				sortedArray.push(itemCurrent.getAttribute('data-value'));
				setTimeout(function() {
					itemCurrent.classList.remove('active');
					itemNext.classList.remove('active');
				}, 800)

				await timer(1100);
			}
			sortedArray.push(container.querySelector(`[data-id='${items.length -1}']`).getAttribute('data-value'));
		}
		async function outerLoop() {
			while (flag) {
				await innerLoop()
			}
			if (!(flag)) {
				ArrayForSort.outputOldArray();
				ArrayForSort.array = sortedArray;
				resultDiv.innerHTML = 'Готово! Массив отсортирован.';
				buttonGenetare.disabled = false;
				buttonStart.disabled = false;
			}
		}
		outerLoop()
	}

}

const buttonGenetare = document.querySelector('.button-generate');
const buttonStart = document.querySelector('.button-start');
let isGeneratedArray = false;
let ArrayForSort;
const resultDiv = document.querySelector('.game-result');
const containerSortingArray = document.getElementById('array-container');
const containerArray = document.getElementById('old-array-container');

//Нажатие на кнопку 'Cгенерировать'
buttonGenetare.addEventListener('click', function() {
	event.preventDefault();
	const input = document.getElementById('input-generate-value');
	isGeneratedArray = false;
	resultDiv.innerHTML = '';
	SlideContainer(containerArray, false)

	if (validateNumberInput(input)) {
		ArrayForSort = new SortingArray(GenerateArray(input.value), containerSortingArray, containerArray)
		ArrayForSort.outputNewArray();
		isGeneratedArray = true;
	}
});


//Нажатие на кнопку 'СТАРТ'
buttonStart.addEventListener('click', function() {
	event.preventDefault();
	this.setAttribute('disabled', 'disabled');
	buttonGenetare.setAttribute('disabled', 'disabled');
	resultDiv.innerHTML = '';

	if (isGeneratedArray) {
		ArrayForSort.bubbleSortVisualization();
	} else {
		ArrayForSort = new SortingArray(GenerateArray(), containerSortingArray, containerArray)
		ArrayForSort.outputNewArray();
		ArrayForSort.bubbleSortVisualization();
	}
});
