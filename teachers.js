document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("teacherForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const subject = document.getElementById("subject").value;

            let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

            const newTeacher = {
                id: Date.now(),
                name: name,
                subject: subject
            };

            teachers.push(newTeacher);

            localStorage.setItem("teachers", JSON.stringify(teachers));

            window.location.href = "teachers.html";
        });
    }

    loadTeachers();
});

function loadTeachers() {
    const tableBody = document.querySelector("#teachersTable tbody");

    if (!tableBody) return;

    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    tableBody.innerHTML = "";

    teachers.forEach(teacher => {
        const row = `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>
                    <button onclick="deleteTeacher(${teacher.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteTeacher(id) {
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    teachers = teachers.filter(t => t.id !== id);

    localStorage.setItem("teachers", JSON.stringify(teachers));

    loadTeachers();
}
