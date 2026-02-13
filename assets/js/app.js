// ===== Dashboard Statistics =====
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
});

function updateDashboardStats() {
    // Get students data
    const students = JSON.parse(localStorage.getItem('students_data')) || [];
    document.getElementById('studentCount').textContent = students.length;

    // Get teachers data
    const teachers = JSON.parse(localStorage.getItem('teachers_data')) || [];
    document.getElementById('teacherCount').textContent = teachers.length;

    // Get subjects data
    const subjects = JSON.parse(localStorage.getItem('subjects_data')) || [];
    document.getElementById('subjectCount').textContent = subjects.length;

    // Get attendance data (simplified calculation)
    const attendance = JSON.parse(localStorage.getItem('attendance_data')) || [];
    const attendanceRate = calculateAttendanceRate(attendance);
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';
}

function calculateAttendanceRate(attendance) {
    if (attendance.length === 0) return 0;
    
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const rate = Math.round((presentCount / attendance.length) * 100);
    return rate;
}
