// ===== LOGIN LOGIC =====
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const welcomeText = document.getElementById('welcome-text');
const logoutBtn = document.getElementById('logout-btn');

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        showMainApp(username);
    } else {
        alert('Please enter your name.');
    }
});

function showMainApp(username) {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    welcomeText.textContent = `Welcome, ${username}`;
    document.getElementById('profile-name').textContent = username;
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    location.reload();
});

// Auto-login if username exists
window.addEventListener('load', () => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) showMainApp(savedUsername);
});

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        sections.forEach(sec => sec.style.display = 'none');
        document.getElementById(item.dataset.section).style.display = 'block';
        sections.forEach(sec => sec.classList.remove('fade-in'));
        document.getElementById(item.dataset.section).classList.add('fade-in');

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

// Show first section by default after login
function showFirstSection() {
    sections.forEach(sec => sec.style.display = 'none');
    const firstSection = document.getElementById('reminders-section');
    firstSection.style.display = 'block';
    firstSection.classList.add('fade-in');
}

// ===== REMINDERS =====
const remindersList = document.getElementById('reminders-list');
const addReminderBtn = document.getElementById('add-reminder-btn');

addReminderBtn.addEventListener('click', () => {
    const reminderText = prompt('Enter reminder:');
    if (!reminderText) return;
    const li = document.createElement('li');
    li.textContent = reminderText;
    li.classList.add('slide-in');
    remindersList.appendChild(li);
    saveReminders();
});

function saveReminders() {
    const reminders = [];
    remindersList.querySelectorAll('li').forEach(li => reminders.push(li.textContent));
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        remindersList.appendChild(li);
    });
}

// ===== BILLS =====
const billsList = document.getElementById('bills-list');
const addBillBtn = document.getElementById('add-bill-btn');

addBillBtn.addEventListener('click', () => {
    const billText = prompt('Enter bill (name + amount):');
    if (!billText) return;
    const li = document.createElement('li');
    li.textContent = billText;
    li.classList.add('slide-in');
    billsList.appendChild(li);
    saveBills();
});

function saveBills() {
    const bills = [];
    billsList.querySelectorAll('li').forEach(li => bills.push(li.textContent));
    localStorage.setItem('bills', JSON.stringify(bills));
}

function loadBills() {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    bills.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        billsList.appendChild(li);
    });
}

// ===== EXPENSES =====
const expensesList = document.getElementById('expenses-list');
const addExpenseBtn = document.getElementById('add-expense-btn');

addExpenseBtn.addEventListener('click', () => {
    const expText = prompt('Enter expense (name + amount):');
    if (!expText) return;
    const li = document.createElement('li');
    li.textContent = expText;
    li.classList.add('slide-in');
    expensesList.appendChild(li);
    saveExpenses();
});

function saveExpenses() {
    const expenses = [];
    expensesList.querySelectorAll('li').forEach(li => expenses.push(li.textContent));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        expensesList.appendChild(li);
    });
}

// ===== TAX CALCULATOR (Basic SA Version) =====
const salaryInput = document.getElementById('salary-input');
const deductionSelect = document.getElementById('deduction-select');
const deductionInputsDiv = document.getElementById('deduction-inputs');
const calculateTaxBtn = document.getElementById('calculate-tax-btn');
const taxResult = document.getElementById('tax-result');

deductionSelect.addEventListener('change', () => {
    const val = deductionSelect.value;
    if (!val) return;
    const input = document.createElement('input');
    input.placeholder = `${val} amount`;
    input.id = `deduction-${val}`;
    deductionInputsDiv.appendChild(input);
});

calculateTaxBtn.addEventListener('click', () => {
    let salary = Number(salaryInput.value);
    if (!salary) { alert('Enter salary'); return; }
    let totalDeduction = 0;
    deductionInputsDiv.querySelectorAll('input').forEach(inp => {
        totalDeduction += Number(inp.value) || 0;
    });

    let taxable = salary - totalDeduction;
    let tax = calculateSASTax(taxable);

    taxResult.innerHTML = `<p>Salary: ${salary}</p>
                           <p>Deductions: ${totalDeduction}</p>
                           <p>Taxable: ${taxable}</p>
                           <p>Estimated Tax: ${tax}</p>`;
});

// Basic SA tax brackets example
function calculateSASTax(amount) {
    let tax = 0;
    if (amount <= 237100) tax = amount * 0.18;
    else if (amount <= 370500) tax = 42678 + (amount-237100)*0.26;
    else if (amount <= 512800) tax = 77362 + (amount-370500)*0.31;
    else if (amount <= 673000) tax = 121475 + (amount-512800)*0.36;
    else if (amount <= 857900) tax = 179147 + (amount-673000)*0.39;
    else tax = 251258 + (amount-857900)*0.41;
    return tax.toFixed(2);
}

// ===== AI CHAT (Basic Local) =====
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

const aiResponses = {
    'hi': 'Hi! How are you?',
    'how are you': 'I am fine, and you?',
    'help with bills': () => showSection('bills-section'),
    'help with reminders': () => showSection('reminders-section'),
    'help with expenses': () => showSection('expenses-section'),
    'help with tax': () => showSection('tax-section'),
};

chatSend.addEventListener('click', () => {
    sendMessage(chatInput.value);
    chatInput.value = '';
});

function sendMessage(message) {
    if (!message) return;
    const userDiv = document.createElement('div');
    userDiv.textContent = `You: ${message}`;
    chatBox.appendChild(userDiv);

    let response = aiResponses[message.toLowerCase()];
    if (typeof response === 'function') response();
    else if (!response) response = 'Sorry, I did not understand that.';
    
    const aiDiv = document.createElement('div');
    aiDiv.textContent = `AI: ${response}`;
    aiDiv.classList.add('fade-in');
    chatBox.appendChild(aiDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Utility to show section
function showSection(id) {
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    sections.forEach(sec => sec.classList.remove('fade-in'));
    document.getElementById(id).classList.add('fade-in');

    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('active');
}

// ===== LOAD SAVED DATA =====
window.addEventListener('load', () => {
    loadReminders();
    loadBills();
    loadExpenses();
    showFirstSection();
});
