const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.textContent;
    if (val === 'C') {
      display.value = '0';
    } else if (val === '=') {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = 'Error';
      }
    } else {
      display.value = display.value === '0' ? val : display.value + val;
    }
  });
});
