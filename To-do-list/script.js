const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// 할 일 추가
addBtn.onclick = addTodo;
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <span>${text}</span>
    <div>
      <button class="delete-btn">삭제</button>
    </div>
  `;
  // 완료/미완료 토글
  li.querySelector('span').onclick = () => {
    li.classList.toggle('done');
  };
  // 삭제 버튼
  li.querySelector('.delete-btn').onclick = () => {
    li.remove();
  };
  list.appendChild(li);
  input.value = '';
  input.focus();
}
