const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');
const list = document.getElementById('todo-list');
const count = document.getElementById('count');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

// 화면 렌더링
function render() {
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    // 텍스트 더블클릭시 수정모드
    let content;
    if (todo.editing) {
      content = document.createElement('input');
      content.type = 'text';
      content.value = todo.text;
      content.onblur = () => finishEdit(idx, content.value);
      content.onkeydown = e => {
        if (e.key === 'Enter') content.blur();
        if (e.key === 'Escape') finishEdit(idx, todo.text);
      };
      setTimeout(() => content.focus(), 0);
    } else {
      content = document.createElement('span');
      content.textContent = todo.text;
      content.ondblclick = () => startEdit(idx);
      content.style.cursor = 'pointer';
    }
    content.onclick = !todo.editing ? () => toggleDone(idx) : null;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    // 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.textContent = '수정';
    editBtn.onclick = () => startEdit(idx);
    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.className = 'delete';
    delBtn.onclick = () => deleteTodo(idx);
    actions.append(editBtn, delBtn);

    li.append(content, actions);
    list.appendChild(li);
  });
  updateCount();
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, done: false, editing: false });
  input.value = '';
  render();
}

function toggleDone(idx) {
  todos[idx].done = !todos[idx].done;
  render();
}

function deleteTodo(idx) {
  todos.splice(idx, 1);
  render();
}

function startEdit(idx) {
  todos.forEach((t, i) => t.editing = i === idx); // 하나만 수정
  render();
}

function finishEdit(idx, value) {
  value = value.trim();
  if (value) {
    todos[idx].text = value;
  }
  todos[idx].editing = false;
  render();
}

// 전체 삭제
clearBtn.onclick = function () {
  if (confirm('정말 모든 할 일을 삭제하시겠습니까?')) {
    todos = [];
    render();
  }
};

addBtn.onclick = addTodo;
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 할 일 개수 표시
function updateCount() {
  const total = todos.length;
  const left = todos.filter(t => !t.done).length;
  count.textContent = `남은 할 일: ${left} / 전체: ${total}`;
}

// 최초 렌더링
render();
