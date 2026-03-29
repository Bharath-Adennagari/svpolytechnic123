/**
 * SV Government Polytechnic College - Portal
 * Vanilla JavaScript Logic
 */

// --- Data Definitions ---

const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];
const indianNames = [
    'Aarav Patel', 'Vihaan Sharma', 'Advik Reddy', 'Sai Kumar', 'Arjun Singh',
    'Ishaan Gupta', 'Ananya Rao', 'Diya Iyer', 'Myra Kulkarni', 'Sana Khan',
    'Rahul Verma', 'Priya Das', 'Amit Mishra', 'Sneha Nair', 'Vikram Joshi',
    'Kavya Menon', 'Rohan Deshmukh', 'Aditi Bose', 'Siddharth Pillai', 'Tanvi Hegde'
];

// Persistent student data
let studentData = {
    1: [],
    2: [],
    3: []
};

let currentYear = 1;

// Seed initial data if empty
function seedData() {
    for (let year = 1; year <= 3; year++) {
        const yearPrefix = (26 - year).toString();
        for (let i = 1; i <= 10; i++) {
            studentData[year].push({
                rollNo: `${yearPrefix}018-CM-${i.toString().padStart(3, '0')}`,
                name: indianNames[Math.floor(Math.random() * indianNames.length)],
                branch: branches[Math.floor(Math.random() * branches.length)],
                pin: Math.floor(100000 + Math.random() * 900000).toString()
            });
        }
    }
}

seedData();

let facultyData = [
    { name: 'Dr. Rajesh Kumar', subject: 'Java', phone: '98765 43210' },
    { name: 'Prof. Sunita Sharma', subject: 'Python', phone: '98765 43211' },
    { name: 'Mr. Anil Verma', subject: 'Data Structures', phone: '98765 43212' },
    { name: 'Ms. Lakshmi Devi', subject: 'Computer Networks', phone: '98765 43213' },
    { name: 'Dr. Suresh Babu', subject: 'Operating Systems', phone: '98765 43214' },
    { name: 'Mrs. Mary Grace', subject: 'English', phone: '98765 43215' },
    { name: 'Mr. Venkat Rao', subject: 'Computer Architecture', phone: '98765 43216' },
    { name: 'Ms. Anjali Singh', subject: 'Database Management', phone: '98765 43217' },
    { name: 'Mr. Pradeep Reddy', subject: 'Software Engineering', phone: '98765 43218' },
    { name: 'Dr. Geetha Rani', subject: 'Discrete Mathematics', phone: '98765 43219' }
];

// --- Navigation Logic ---

window.navigateTo = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Special handling for data loading
    if (pageId === 'student-page') {
        loadStudentData(currentYear);
    } else if (pageId === 'faculty-page') {
        renderFacultyTable();
    }
};

window.logout = function() {
    navigateTo('login-page');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
};

// --- Login Logic ---

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    if (user === 'admin' && pass === 'admin123') {
        errorEl.textContent = '';
        navigateTo('home-page');
    } else {
        errorEl.textContent = 'Invalid username or password!';
    }
});

// --- Student Data Logic ---

window.loadStudentData = function(year) {
    currentYear = year;
    // Update active button
    document.querySelectorAll('.year-btn').forEach((btn, idx) => {
        if (idx + 1 === year) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const tbody = document.getElementById('student-body');
    tbody.innerHTML = '';

    const students = studentData[year];
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.branch}</td>
            <td>${student.pin}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="openStudentModal(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteStudent(${index})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
};

// --- Student CRUD Logic ---

const modal = document.getElementById('student-modal');
const studentForm = document.getElementById('student-form');

window.openStudentModal = function(index = null) {
    const title = document.getElementById('modal-title');
    const editIndex = document.getElementById('edit-index');
    
    studentForm.reset();
    
    if (index !== null) {
        title.textContent = 'Edit Student';
        editIndex.value = index;
        const student = studentData[currentYear][index];
        document.getElementById('student-roll').value = student.rollNo;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-branch').value = student.branch;
        document.getElementById('student-pin').value = student.pin;
    } else {
        title.textContent = 'Add Student';
        editIndex.value = '';
    }
    
    modal.classList.add('active');
};

window.closeStudentModal = function() {
    modal.classList.remove('active');
};

studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = document.getElementById('edit-index').value;
    const student = {
        rollNo: document.getElementById('student-roll').value,
        name: document.getElementById('student-name').value,
        branch: document.getElementById('student-branch').value,
        pin: document.getElementById('student-pin').value
    };
    
    if (index !== '') {
        // Update existing
        studentData[currentYear][index] = student;
    } else {
        // Add new
        studentData[currentYear].push(student);
    }
    
    closeStudentModal();
    loadStudentData(currentYear);
});

// --- Confirmation Modal Logic ---

const confirmModal = document.getElementById('confirm-modal');
const confirmYesBtn = document.getElementById('confirm-yes');
let confirmCallback = null;

window.showConfirm = function(message, callback) {
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    confirmModal.classList.add('active');
};

window.closeConfirmModal = function() {
    confirmModal.classList.remove('active');
    confirmCallback = null;
};

confirmYesBtn.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
});

window.deleteStudent = function(index) {
    showConfirm('Are you sure you want to delete this student?', () => {
        studentData[currentYear].splice(index, 1);
        loadStudentData(currentYear);
    });
};

// --- Faculty Data Logic ---

function renderFacultyTable() {
    const tbody = document.getElementById('faculty-body');
    tbody.innerHTML = '';

    facultyData.forEach((faculty, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${faculty.name}</td>
            <td>${faculty.subject}</td>
            <td>${faculty.phone}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="openFacultyModal(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteFaculty(${index})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// --- Faculty CRUD Logic ---

const facultyModal = document.getElementById('faculty-modal');
const facultyForm = document.getElementById('faculty-form');

window.openFacultyModal = function(index = null) {
    const title = document.getElementById('faculty-modal-title');
    const editIndex = document.getElementById('faculty-edit-index');
    
    facultyForm.reset();
    
    if (index !== null) {
        title.textContent = 'Edit Faculty';
        editIndex.value = index;
        const faculty = facultyData[index];
        document.getElementById('faculty-name-input').value = faculty.name;
        document.getElementById('faculty-subject-input').value = faculty.subject;
        document.getElementById('faculty-phone-input').value = faculty.phone;
    } else {
        title.textContent = 'Add Faculty';
        editIndex.value = '';
    }
    
    facultyModal.classList.add('active');
};

window.closeFacultyModal = function() {
    facultyModal.classList.remove('active');
};

facultyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = document.getElementById('faculty-edit-index').value;
    const faculty = {
        name: document.getElementById('faculty-name-input').value,
        subject: document.getElementById('faculty-subject-input').value,
        phone: document.getElementById('faculty-phone-input').value
    };
    
    if (index !== '') {
        // Update existing
        facultyData[index] = faculty;
    } else {
        // Add new
        facultyData.push(faculty);
    }
    
    closeFacultyModal();
    renderFacultyTable();
});

window.deleteFaculty = function(index) {
    showConfirm('Are you sure you want to delete this faculty member?', () => {
        facultyData.splice(index, 1);
        renderFacultyTable();
    });
};

// Initial state check (optional, already handled by HTML class 'active')
console.log("SV Polytechnic Portal initialized.");
