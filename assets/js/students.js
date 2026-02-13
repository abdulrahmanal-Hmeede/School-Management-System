// ===== Local Storage Management =====
const STUDENTS_KEY = 'students_data';

// Initialize students data from localStorage or use empty array
let students = JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];

// ===== DOM Elements =====
const studentsTable = document.getElementById('studentsTable');
const studentsBody = document.getElementById('studentsBody');
const emptyState = document.getElementById('emptyState');
const addStudentBtn = document.getElementById('addStudentBtn');
const addStudentBtnEmpty = document.getElementById('addStudentBtnEmpty');

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    renderStudents();
    addStudentBtn?.addEventListener('click', redirectToAddStudent);
    addStudentBtnEmpty?.addEventListener('click', redirectToAddStudent);
});

// ===== Render Students Table =====
function renderStudents() {
    studentsBody.innerHTML = '';

    if (students.length === 0) {
        studentsTable?.style.display = 'none';
        emptyState?.classList.add('show');
        return;
    }

    studentsTable?.style.removeProperty('display');
    emptyState?.classList.remove('show');

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
            <td>${student.grade}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editStudent(${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteStudent(${index})">حذف</button>
                </div>
            </td>
        `;
        studentsBody.appendChild(row);
    });
}

// ===== Add Student (Redirect to form) =====
function redirectToAddStudent() {
    window.location.href = 'add-student.html';
}

// ===== Edit Student =====
function editStudent(index) {
    // Store the student data to edit in sessionStorage
    sessionStorage.setItem('editStudentIndex', index);
    sessionStorage.setItem('editStudent', JSON.stringify(students[index]));
    window.location.href = 'add-student.html?edit=' + index;
}

// ===== Delete Student =====
function deleteStudent(index) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        students.splice(index, 1);
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
        renderStudents();
    }
}

// ===== Add New Student (Called from add-student.html) =====
function addStudent(studentData) {
    students.push(studentData);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    renderStudents();
}

// ===== Update Student (Called from add-student.html) =====
function updateStudent(index, studentData) {
    students[index] = studentData;
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    renderStudents();
}

// ===== Get all students (for dashboard) =====
function getAllStudents() {
    return students;
}
