// 주요 DOM 요소 참조
const input = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority');
const dueInput = document.getElementById('due');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');
const list = document.getElementById('todo-list');
const count = document.getElementById('count');

// 할 일 목록, localStorage에서 불러오기(새로고침해도 유지)
let todos = JSON.parse(localStorage.getItem('todos') || '[]');

// 할 일 추가 함수
function addTodo() {
  const text = input.value.trim();
  const priority = parseInt(prioritySelect.value, 10);
  const due = dueInput.value;
  if (!text) return; // 빈 입력 막기

  todos.push({
    text,
    priority,           // 우선순위 (1:낮음, 2:보통, 3:높음)
    due,                // 마감일 (yyyy-mm-dd)
    created: Date.now(),// 생성시각
    done: false,
    editing: false
  });

  input.value = '';
  prioritySelect.value = '2'; // "보통"으로 초기화
  dueInput.value = '';
  render();
}

// 할 일 화면에 출력 & 정렬
function render() {
  // 날짜, 우선순위 정렬(마감일 빠른순 → 우선순위 높은순 → 최신순)
  todos.sort((a, b) => {
    // 마감일이 있으면 빠른 순, 없으면 뒤로
    if (a.due && b.due && a.due !== b.due) {
      return a.due < b.due ? -1 : 1;
    }
    if (a.due && !b.due) return -1;
    if (!a.due && b.due) return 1;
    // 우선순위(높은 값이 앞으로)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // 최신순
    return b.created - a.created;
  });

  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    // 편집모드
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
      content.textContent = todo.text +
        (todo.due ? ` (마감: ${todo.due})` : '') +
        ` [${['', '낮음', '보통', '높음'][todo.priority]}]`;
      content.ondblclick = () => startEdit(idx);
      content.style.cursor = 'pointer';
      content.onclick = !todo.editing ? () => toggleDone(idx) : null;
    }

    // 할 일 오른쪽 버튼들
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
  localStorage.setItem('todos', JSON.stringify(todos)); // 저장
}

// 할 일 완료/미완료 토글
function toggleDone(idx) {
  todos[idx].done = !todos[idx].done;
  render();
}

// 할 일 삭제
function deleteTodo(idx) {
  todos.splice(idx, 1);
  render();
}

// 편집 모드 진입
function startEdit(idx) {
  todos.forEach((t, i) => t.editing = i === idx);
  render();
}

// 편집 종료 및 값 반영
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
