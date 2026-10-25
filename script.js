// ===== Константы =====
const PROJECT_NAME = 'Расчёт валового сбора зерна';
const TON_PER_CENTNER = 10;        // 1 т = 10 ц
const HIGH_YIELD_THRESHOLD = 100;  // порог «высокого» урожая, т

const resultEl = document.getElementById('result');
const calcBtn  = document.getElementById('calcBtn');

// ===== Безопасный ввод числа через prompt =====
function readNumber(message, defaultValue) {
  const raw = prompt(message);

  if (raw === null) return defaultValue;                 // «Отмена»
  const trimmed = raw.trim();
  if (trimmed === '') return defaultValue;               // пустая строка

  const num = Number(trimmed.replace(',', '.'));         // поддержим запятую
  if (!Number.isFinite(num)) {
    alert(`«${raw}» — не число. Используем значение по умолчанию: ${defaultValue}`);
    return defaultValue;
  }
  return num;
}

// ===== Рендер результата на страницу =====
function renderResult({ area, yieldPerHectare, grossHarvest, status }) {
  const isHigh = status === 'Высокий урожай';

  resultEl.classList.add('is-ready');
  resultEl.innerHTML = `
    <div class="kpis">
      <div class="kpi">
        <div class="kpi__label">Площадь</div>
        <div class="kpi__value">${area} га</div>
      </div>
      <div class="kpi">
        <div class="kpi__label">Урожайность</div>
        <div class="kpi__value">${yieldPerHectare} ц/га</div>
      </div>
      <div class="kpi">
        <div class="kpi__label">Валовой сбор</div>
        <div class="kpi__value">${grossHarvest.toFixed(2)} т</div>
      </div>
    </div>
    <div class="verdict ${isHigh ? 'verdict--high' : 'verdict--low'}">
      <span class="verdict__icon" aria-hidden="true">${isHigh ? '🏆' : '🌱'}</span>
      <span>${status}</span>
    </div>
  `;
}

// ===== Основной сценарий =====
function calculate() {
  // 1. Ввод
  let area = readNumber('Введите площадь поля (га):', 10);
  let yieldPerHectare = readNumber('Введите урожайность (ц/га):', 40);

  // 2. Защита от отрицательных значений
  if (area < 0) {
    console.warn('Площадь не может быть отрицательной — установлено 0.');
    area = 0;
  }
  if (yieldPerHectare < 0) {
    console.warn('Урожайность не может быть отрицательной — установлено 0.');
    yieldPerHectare = 0;
  }

  // 3. Расчёт валового сбора (ц → т)
  const grossHarvest = (area * yieldPerHectare) / TON_PER_CENTNER;

  // 4. Интерпретация
  const status = grossHarvest > HIGH_YIELD_THRESHOLD
    ? 'Высокий урожай'
    : 'Нормальный/низкий урожай';

  // 5. Вывод в консоль
  console.log(
    `${PROJECT_NAME}: площадь=${area} га, урожайность=${yieldPerHectare} ц/га, ` +
    `сбор=${grossHarvest.toFixed(2)} т → ${status}`
  );

  // 6. Вывод на страницу
  renderResult({ area, yieldPerHectare, grossHarvest, status });
}

// Обработчик кнопки
calcBtn.addEventListener('click', calculate);