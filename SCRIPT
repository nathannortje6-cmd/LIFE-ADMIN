
// --- Local login / registration ---
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userDisplay = document.getElementById('user-display');

let currentUser = null;

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if(!username || !password){
        alert("Enter username and password");
        return;
    }

    let users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};

    // Register if new user
    if(!users[username]){
        users[username] = { password, bio: '', tasks: [], profilePic: '' };
        localStorage.setItem('lifeadmin-users', JSON.stringify(users));
    } else {
        if(users[username].password !== password){
            alert("Wrong password!");
            return;
        }
    }

    currentUser = username;
    showApp();
});

// --- Logout ---
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    appContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// --- Show App ---
function showApp(){
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    userDisplay.textContent = currentUser;

    loadProfile();
    loadTasks();
}

// --- Profile ---
const bioInput = document.getElementById('bio');
const profilePicInput = document.getElementById('profile-pic');
const profilePreview = document.getElementById('profile-preview');

function loadProfile(){
    const users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};
    const user = users[currentUser];

    bioInput.value = user.bio;
    profilePreview.src = user.profilePic || '';
}

bioInput.addEventListener('input', () => {
    saveProfile();
});

profilePicInput.addEventListener('change', () => {
    const file = profilePicInput.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => {
            profilePreview.src = reader.result;
            saveProfile();
        }
        reader.readAsDataURL(file);
    }
});

function saveProfile(){
    const users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};
    users[currentUser].bio = bioInput.value;
    users[currentUser].profilePic = profilePreview.src;
    localStorage.setItem('lifeadmin-users', JSON.stringify(users));
}

// --- Tasks ---
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

function loadTasks(){
    taskList.innerHTML = '';
    const users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};
    const tasks = users[currentUser].tasks || [];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            deleteTask(index);
        });

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if(!task) return;
    const suggestion = localAI(task); // AI suggestion
    if(suggestion) alert(`AI Suggestion: ${suggestion}`);

    const users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};
    users[currentUser].tasks.push(task);
    localStorage.setItem('lifeadmin-users', JSON.stringify(users));
    taskInput.value = '';
    loadTasks();
});

function deleteTask(index){
    const users = JSON.parse(localStorage.getItem('lifeadmin-users')) || {};
    users[currentUser].tasks.splice(index,1);
    localStorage.setItem('lifeadmin-users', JSON.stringify(users));
    loadTasks();
}

// --- Local AI ---
function localAI(task){
    task = task.toLowerCase();
    if(task.includes('id')) return 'Reminder: Renew your ID in 30 days';
    if(task.includes('bill')) return 'Reminder: Pay your bill before due date';
    if(task.includes('car')) return 'Reminder: Check your car maintenance schedule';
    return '';
}

// Optional: browser notification example
function notify(message){
    if(Notification.permission === "granted"){
        new Notification(message);
    }
}

if(Notification.permission !== "granted"){
    Notification.requestPermission();
}
