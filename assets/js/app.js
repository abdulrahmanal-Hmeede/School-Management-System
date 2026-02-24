// ===== Dashboard Statistics =====
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
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

    // Update last update time
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const date = new Date();
        const dateStr = date.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        lastUpdate.textContent = dateStr;
    }
}

function calculateAttendanceRate(attendance) {
    if (attendance.length === 0) return 0;
    
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const rate = Math.round((presentCount / attendance.length) * 100);
    return rate;
}

function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        currentTimeElement.textContent = timeStr;
    }
}
