const display = document.getElementById('display');
let current = '';
let operator = null;
let previous = '';
let justCalculated = false;

// 숫자, 소수점 입력
document.querySelectorAll('.num').forEach(btn => {
  btn.onclick = () => {
    if (justCalculated) { // = 직후 숫자 누르면 새로 입력
      current = '';
      justCalculated = false;
    }
    // 소수점 여러 번 입력 방지
    if (btn.dataset.num === '.' && current.includes('.')) return;
    current += btn.dataset.num;
    display.textContent = current;
  };
});

// 연산자 입력
document.querySelectorAll('.op').forEach(btn => {
  btn.onclick = () => {
    if (!current && !previous) return; // 숫자 먼저 입력
    if (previous && operator && current) {
      calculate();
    }
    operator = btn.dataset.op;
    previous = current || previous;
    current = '';
    justCalculated = false;
  };
});

// = 계산
document.querySelector('.eq').onclick = () => {
  if (!previous || !operator || !current) return;
  calculate();
  justCalculated = true;
};

// C (초기화)
document.querySelector('.clear').onclick = () => {
  current = '';
  previous = '';
  operator = null;
  display.textContent = '0';
  justCalculated = false;
};

function calculate() {
  try {
    const result = eval(`${parseFloat(previous)}${operator}${parseFloat(current)}`);
    display.textContent = result;
    current = result.toString();
    previous = '';
    operator = null;
  } catch (e) {
    display.textContent = 'Error';
    current = '';
    previous = '';
    operator = null;
  }
}

// 키보드 입력 지원
window.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') {
    document.querySelector(`.num[data-num="${e.key}"]`).click();
  }
  if (e.key === '.') {
    document.querySelector(`.num[data-num="."]`).click();
  }
  if (['+', '-', '*', '/'].includes(e.key)) {
    document.querySelector(`.op[data-op="${e.key}"]`).click();
  }
  if (e.key === 'Enter' || e.key === '=') {
    document.querySelector('.eq').click();
  }
  if (e.key.toLowerCase() === 'c') {
    document.querySelector('.clear').click();
  }
});
