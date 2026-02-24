
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
        
        loadFromStorage();