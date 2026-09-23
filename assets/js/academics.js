// Academic console: (1) a live CGPA calculator on the 5-point scale
// Miva grades on, backed by localStorage, and (2) a small study-task
// planner, also backed by localStorage. Everything here runs entirely
// in the visitor's browser — nothing is sent anywhere.

(function cgpaCalculator() {
  var STORAGE_KEY = 'regina-academics-gpa-rows-v1';
  var GRADE_POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

  var tbody = document.getElementById('gpaBody');
  if (!tbody) return; // not on this page

  var addBtn = document.getElementById('gpaAddRow');
  var resetBtn = document.getElementById('gpaReset');
  var cgpaNum = document.getElementById('cgpaNumber');
  var targetNote = document.getElementById('cgpaTargetNote');
  var TARGET = 4.5;

  var starterRows = [
    { course: 'CSC112 — Introduction to Web Technologies', units: 3, grade: '' },
    { course: 'COS 106 — Web Technologies', units: 3, grade: '' },
    { course: 'COS 102 — Introduction to Programming', units: 3, grade: '' },
    { course: 'MATH 102', units: 3, grade: '' },
    { course: 'PHY 102', units: 3, grade: '' }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : starterRows.slice();
    } catch (e) {
      return starterRows.slice();
    }
  }

  function save(rows) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (e) { /* storage unavailable — calculator still works this session */ }
  }

  function rowFromData(row) {
    var tr = document.createElement('tr');

    var tdCourse = document.createElement('td');
    var courseInput = document.createElement('input');
    courseInput.type = 'text';
    courseInput.placeholder = 'Course title';
    courseInput.value = row.course || '';
    courseInput.setAttribute('aria-label', 'Course title');
    tdCourse.appendChild(courseInput);

    var tdUnits = document.createElement('td');
    var unitsInput = document.createElement('input');
    unitsInput.type = 'number';
    unitsInput.min = '1';
    unitsInput.max = '12';
    unitsInput.value = row.units || 3;
    unitsInput.setAttribute('aria-label', 'Credit units');
    tdUnits.appendChild(unitsInput);

    var tdGrade = document.createElement('td');
    var gradeSelect = document.createElement('select');
    gradeSelect.setAttribute('aria-label', 'Grade');
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— grade —';
    gradeSelect.appendChild(placeholder);
    Object.keys(GRADE_POINTS).forEach(function (g) {
      var opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g + ' (' + GRADE_POINTS[g] + '.0)';
      if (row.grade === g) opt.selected = true;
      gradeSelect.appendChild(opt);
    });
    tdGrade.appendChild(gradeSelect);

    var tdPoint = document.createElement('td');
    tdPoint.className = 'pt-cell';
    tdPoint.style.fontFamily = 'var(--font-mono)';
    tdPoint.style.color = 'var(--text-muted)';

    var tdRemove = document.createElement('td');
    var rmBtn = document.createElement('button');
    rmBtn.type = 'button';
    rmBtn.className = 'rm-row';
    rmBtn.setAttribute('aria-label', 'Remove course');
    rmBtn.textContent = '×';
    tdRemove.appendChild(rmBtn);

    tr.appendChild(tdCourse);
    tr.appendChild(tdUnits);
    tr.appendChild(tdGrade);
    tr.appendChild(tdPoint);
    tr.appendChild(tdRemove);

    function refreshPointCell() {
      var g = gradeSelect.value;
      var u = parseFloat(unitsInput.value) || 0;
      tdPoint.textContent = g ? (GRADE_POINTS[g] * u).toFixed(1) : '—';
    }

    [courseInput, unitsInput, gradeSelect].forEach(function (el) {
      el.addEventListener('input', function () {
        refreshPointCell();
        persistAndCompute();
      });
      el.addEventListener('change', function () {
        refreshPointCell();
        persistAndCompute();
      });
    });

    rmBtn.addEventListener('click', function () {
      tr.remove();
      persistAndCompute();
    });

    refreshPointCell();
    return tr;
  }

  function currentRowsFromDOM() {
    return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) {
      var inputs = tr.querySelectorAll('input');
      var select = tr.querySelector('select');
      return {
        course: inputs[0].value,
        units: parseFloat(inputs[1].value) || 0,
        grade: select.value
      };
    });
  }

  function computeCGPA(rows) {
    var totalUnits = 0, totalPoints = 0;
    rows.forEach(function (r) {
      if (r.grade && GRADE_POINTS.hasOwnProperty(r.grade) && r.units > 0) {
        totalUnits += r.units;
        totalPoints += r.units * GRADE_POINTS[r.grade];
      }
    });
    return totalUnits > 0 ? totalPoints / totalUnits : null;
  }

  function persistAndCompute() {
    var rows = currentRowsFromDOM();
    save(rows);
    var cgpa = computeCGPA(rows);
    if (cgpa === null) {
      cgpaNum.textContent = '—';
      targetNote.textContent = 'Add grades above to calculate.';
    } else {
      cgpaNum.textContent = cgpa.toFixed(2);
      var diff = (cgpa - TARGET).toFixed(2);
      targetNote.textContent = cgpa >= TARGET
        ? 'On track — ' + diff + ' above the 4.50 target.'
        : Math.abs(diff) + ' below the 4.50 target.';
    }
  }

  function render(rows) {
    tbody.innerHTML = '';
    rows.forEach(function (row) {
      tbody.appendChild(rowFromData(row));
    });
    persistAndCompute();
  }

  addBtn.addEventListener('click', function () {
    tbody.appendChild(rowFromData({ course: '', units: 3, grade: '' }));
    persistAndCompute();
  });

  resetBtn.addEventListener('click', function () {
    if (confirm('Clear all courses and start over?')) {
      localStorage.removeItem(STORAGE_KEY);
      render(starterRows.slice());
    }
  });

  render(load());
})();


(function taskPlanner() {
  var STORAGE_KEY = 'regina-academics-tasks-v1';
  var form = document.getElementById('taskForm');
  if (!form) return; // not on this page

  var input = document.getElementById('taskInput');
  var tagSelect = document.getElementById('taskTag');
  var list = document.getElementById('taskList');

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function save(tasks) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) {}
  }

  function render() {
    var tasks = load();
    list.innerHTML = '';
    if (tasks.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'task-empty';
      empty.textContent = 'No tasks yet — add your first study task above.';
      list.appendChild(empty);
      return;
    }
    tasks.forEach(function (task) {
      var item = document.createElement('div');
      item.className = 'task-item' + (task.done ? ' done' : '');

      var check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = !!task.done;
      check.setAttribute('aria-label', 'Mark task done');
      check.addEventListener('change', function () {
        task.done = check.checked;
        save(tasks);
        render();
      });

      var tag = document.createElement('span');
      tag.className = 'task-tag';
      tag.textContent = task.tag;

      var label = document.createElement('span');
      label.className = 'task-label';
      label.textContent = task.text;

      var del = document.createElement('button');
      del.className = 'del';
      del.type = 'button';
      del.setAttribute('aria-label', 'Delete task');
      del.textContent = '×';
      del.addEventListener('click', function () {
        var idx = tasks.indexOf(task);
        if (idx > -1) tasks.splice(idx, 1);
        save(tasks);
        render();
      });

      item.appendChild(check);
      item.appendChild(tag);
      item.appendChild(label);
      item.appendChild(del);
      list.appendChild(item);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    var tasks = load();
    tasks.unshift({ text: text, tag: tagSelect.value, done: false });
    save(tasks);
    input.value = '';
    render();
    input.focus();
  });

  render();
})();
