// ===== Form Validation & Management =====
const studentForm = document.getElementById('studentForm');
const pageTitle = document.getElementById('pageTitle');
let isEditMode = false;
let editIndex = null;

// ===== Initialize Form =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in edit mode
    const editParam = new URLSearchParams(window.location.search).get('edit');
    
    if (editParam !== null) {
        isEditMode = true;
        editIndex = parseInt(editParam);
        loadStudentForEdit(editIndex);
        pageTitle.textContent = 'تعديل بيانات الطالب';
    }

    // Form submission
    studentForm.addEventListener('submit', handleFormSubmit);
});

// ===== Load Student Data for Edit =====
function loadStudentForEdit(index) {
    const students = JSON.parse(localStorage.getItem('students_data')) || [];
    
    if (index >= 0 && index < students.length) {
        const student = students[index];
        
        document.getElementById('studentName').value = student.name || '';
        document.getElementById('studentId').value = student.studentId || '';
        document.getElementById('grade').value = student.grade || '';
        document.getElementById('email').value = student.email || '';
        document.getElementById('phone').value = student.phone || '';
        document.getElementById('parentName').value = student.parentName || '';
        document.getElementById('parentPhone').value = student.parentPhone || '';
        document.getElementById('address').value = student.address || '';
    }
}

// ===== Handle Form Submission =====
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Get form data
    const studentData = {
        name: document.getElementById('studentName').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
        grade: document.getElementById('grade').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        parentName: document.getElementById('parentName').value.trim(),
        parentPhone: document.getElementById('parentPhone').value.trim(),
        address: document.getElementById('address').value.trim(),
        dateAdded: isEditMode ? getStudentDateAdded(editIndex) : new Date().toISOString()
    };

    console.log('Student Data:', studentData);
    console.log('Is Edit Mode:', isEditMode);

    // Add or update student
    if (isEditMode) {
        updateStudent(editIndex, studentData);
    } else {
        addStudent(studentData);
    }

    console.log('Student saved, redirecting to students.html');
    // Show success and redirect
    setTimeout(() => {
        window.location.href = 'students.html';
    }, 500);
}

// ===== Form Validation =====
function validateForm() {
    const name = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const grade = document.getElementById('grade').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    let isValid = true;

    // Clear previous errors
    clearAllErrors();

    // Validate Name
    if (!name) {
        showError('nameError', 'اسم الطالب مطلوب');
        isValid = false;
    } else if (name.length < 3) {
        showError('nameError', 'اسم الطالب يجب أن يكون 3 أحرف على الأقل');
        isValid = false;
    }

    // Validate Student ID
    if (!studentId) {
        showError('idError', 'رقم القيد مطلوب');
        isValid = false;
    } else if (studentId.length < 5) {
        showError('idError', 'رقم القيد يجب أن يكون 5 أرقام على الأقل');
        isValid = false;
    }

    // Validate Grade
    if (!grade) {
        showError('gradeError', 'الصف الدراسي مطلوب');
        isValid = false;
    }

    // Validate Email
    if (!email) {
        showError('emailError', 'البريد الإلكتروني مطلوب');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'البريد الإلكتروني غير صحيح');
        isValid = false;
    }

    // Validate Phone
    if (!phone) {
        showError('phoneError', 'رقم الهاتف مطلوب');
        isValid = false;
    } else if (!/^[\d\s\-\+\(\)]{7,}$/.test(phone)) {
        showError('phoneError', 'رقم الهاتف غير صحيح');
        isValid = false;
    }

    // Check for duplicate Student ID (if adding new)
    if (!isEditMode && isDuplicateStudentId(studentId)) {
        showError('idError', 'رقم القيد موجود بالفعل');
        isValid = false;
    } else if (isEditMode) {
        // When editing, check if studentId is used by another student
        const students = JSON.parse(localStorage.getItem('students_data')) || [];
        const isDuplicate = students.some((s, idx) => s.studentId === studentId && idx !== editIndex);
        if (isDuplicate) {
            showError('idError', 'رقم القيد موجود بالفعل');
            isValid = false;
        }
    }

    return isValid;
}

// ===== Show Error Message =====
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// ===== Clear All Errors =====
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// ===== Email Validation =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Check for Duplicate Student ID =====
function isDuplicateStudentId(studentId) {
    const students = JSON.parse(localStorage.getItem('students_data')) || [];
    return students.some(s => s.studentId === studentId);
}

// ===== Get Student Date Added (for edit mode) =====
function getStudentDateAdded(index) {
    const students = JSON.parse(localStorage.getItem('students_data')) || [];
    if (index >= 0 && index < students.length) {
        return students[index].dateAdded || new Date().toISOString();
    }
    return new Date().toISOString();
}

// ===== Go Back to Students Page =====
function goBackToStudents() {
    const confirmed = confirm('هل أنت متأكد؟ سيتم فقدان جميع التغييرات');
    if (confirmed) {
        window.location.href = 'students.html';
    }
}
