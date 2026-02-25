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
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    displayTeachers(teachers);
}

function displayTeachers(teachers) {

    const tableBody = document.querySelector("#teachersTable tbody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    teachers.forEach(teacher => {

        const row = `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>
                    <button onclick="editTeacher(${teacher.id})">Edit</button>
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

function editTeacher(id) {
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    const teacher = teachers.find(t => t.id === id);

    const newName = prompt("Enter new name:", teacher.name);
    const newSubject = prompt("Enter new subject:", teacher.subject);

    teacher.name = newName;
    teacher.subject = newSubject;

    localStorage.setItem("teachers", JSON.stringify(teachers));

    loadTeachers();
}


function searchTeacher() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchValue) ||
        teacher.subject.toLowerCase().includes(searchValue)
    );

    displayTeachers(filteredTeachers);
}