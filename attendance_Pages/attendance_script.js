        let students = [];
        let currentFilter = 'all';
        
        function loadFromStorage() {
            const saved = localStorage.getItem('students');
            if (saved) {
                students = JSON.parse(saved);
            }
            displayStudents();
        }
        
        function saveToStorage() {
            localStorage.setItem('students', JSON.stringify(students));
        }
        
        function addStudent() {
            const nameInput = document.getElementById('studentName');
            const name = nameInput.value.trim();
            
            if (name === '') {
                alert('الرجاء إدخال اسم الطالب');
                return;
            }
            
            students.push({
                id: Date.now(),
                name: name,
                status: 'absent'
            });
            
            nameInput.value = '';
            saveToStorage();
            displayStudents();
        }
        
        function toggleAttendance(id) {
            const student = students.find(s => s.id === id);
            if (student) {
                student.status = student.status === 'present' ? 'absent' : 'present';
                saveToStorage();
                displayStudents();
            }
        }
        
        function deleteStudent(id) {
            if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
                students = students.filter(s => s.id !== id);
                saveToStorage();
                displayStudents();
            }
        }
        
        function filterStudents(filter) {
            currentFilter = filter;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            displayStudents();
        }
        
        function displayStudents() {
            const tbody = document.getElementById('studentsTableBody');
            let filteredStudents = students;
            
            if (currentFilter === 'present') {
                filteredStudents = students.filter(s => s.status === 'present');
            } else if (currentFilter === 'absent') {
                filteredStudents = students.filter(s => s.status === 'absent');
            }
            
            if (filteredStudents.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center; padding: 30px; color: #666;">
                            لا يوجد طلاب للعرض
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = filteredStudents.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>
                            <span class="attendance-badge ${student.status === 'present' ? 'present' : 'absent'}" 
                                  onclick="toggleAttendance(${student.id})" 
                                  style="cursor: pointer;">
                                ${student.status === 'present' ? '✅ حاضر' : '❌ غائب'}
                            </span>
                        </td>
                        <td>
                            <button class="delete-btn" onclick="deleteStudent(${student.id})">🗑️ حذف</button>
                        </td>
                    </tr>
                `).join('');
            }
            
            updateStats();
        }
        
        function updateStats() {
            const total = students.length;
            const present = students.filter(s => s.status === 'present').length;
            const absent = total - present;
            
            document.getElementById('totalStudents').textContent = total;
            document.getElementById('presentCount').textContent = present;
            document.getElementById('absentCount').textContent = absent;
        }



function exportToPDF() {
    if (typeof jspdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = generatePDF;
        document.head.appendChild(script);
    } else {
        generatePDF();
    }
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text('Attendance and absence report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString('ar-EG');
    doc.text(`report date : ${today}`, 105, 30, { align: 'center' });
    
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const absent = total - present;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`total students: ${total}`, 20, 45);
    doc.text(`Attendance: ${present}`, 20, 55);
    doc.text(`absence: ${absent}`, 20, 65);
    
    let yPosition = 80;
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('name student :', 30, yPosition);
    doc.text('status :', 140, yPosition);
    
    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    
    students.forEach((student, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPosition - 5, 170, 10, 'F');
        }
        
        doc.text(student.name, 30, yPosition);
        doc.text(student.status === 'present' ? 'Attendance' : 'absence', 140, yPosition);
        
        yPosition += 10;
    });
    
    doc.save('Attendance and absence report.pdf');
    }

        loadFromStorage();