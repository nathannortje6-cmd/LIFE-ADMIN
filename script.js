// ===================== LOGIN =====================
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const loginUsername = document.getElementById('login-username');
const usernameDisplay = document.getElementById('username-display');

function login() {
    const username = loginUsername.value.trim();
    if (!username) {
        alert("Please enter a username!");
        return;
    }
    localStorage.setItem('username', username);
    usernameDisplay.textContent = username;
    loginScreen.style.display = 'none';
    showSection('reminders-section');
}
loginBtn.addEventListener('click', login);
loginUsername.addEventListener('keypress', (e) => {
    if (e.key === "Enter") login();
});
const savedUsername = localStorage.getItem('username');
if (savedUsername) {
    usernameDisplay.textContent = savedUsername;
    loginScreen.style.display = 'none';
    showSection('reminders-section');
}

// ===================== NAVIGATION =====================
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// ===================== REMINDERS =====================
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
const reminderList = document.getElementById('reminder-list');
const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderModal = document.getElementById('reminder-modal');
const saveReminderBtn = document.getElementById('save-reminder');
const closeReminderBtn = document.getElementById('close-reminder');

function renderReminders() {
    reminderList.innerHTML = '';
    reminders.forEach((rem, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${rem.title} - ${rem.date} ${rem.time}</span>
                        <span class="delete-btn" onclick="deleteReminder(${index})">X</span>`;
        reminderList.appendChild(li);
    });
    updateStats();
}
function deleteReminder(index) {
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
}
addReminderBtn.addEventListener('click', () => reminderModal.classList.remove('hidden'));
closeReminderBtn.addEventListener('click', () => reminderModal.classList.add('hidden'));
saveReminderBtn.addEventListener('click', () => {
    const title = document.getElementById('reminder-title').value;
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const notes = document.getElementById('reminder-notes').value;
    if (title && date && time) {
        reminders.push({ title, date, time, notes });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
        reminderModal.classList.add('hidden');
        document.getElementById('reminder-title').value = '';
        document.getElementById('reminder-date').value = '';
        document.getElementById('reminder-time').value = '';
        document.getElementById('reminder-notes').value = '';
    }
});
renderReminders();

// ===================== BILLS =====================
let bills = JSON.parse(localStorage.getItem('bills')) || [];
const billList = document.getElementById('bill-list');
const addBillBtn = document.getElementById('add-bill-btn');
const billModal = document.getElementById('bill-modal');
const saveBillBtn = document.getElementById('save-bill');
const closeBillBtn = document.getElementById('close-bill');

function renderBills() {
    billList.innerHTML = '';
    bills.forEach((bill, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${bill.title} - $${bill.amount} - ${bill.date}</span>
                        <span class="delete-btn" onclick="deleteBill(${index})">X</span>`;
        billList.appendChild(li);
    });
    updateStats();
}
function deleteBill(index) {
    bills.splice(index, 1);
    localStorage.setItem('bills', JSON.stringify(bills));
    renderBills();
}
addBillBtn.addEventListener('click', () => billModal.classList.remove('hidden'));
closeBillBtn.addEventListener('click', () => billModal.classList.add('hidden'));
saveBillBtn.addEventListener('click', () => {
    const title = document.getElementById('bill-title').value;
    const amount = document.getElementById('bill-amount').value;
    const date = document.getElementById('bill-date').value;
    const notes = document.getElementById('bill-notes').value;
    if (title && amount && date) {
        bills.push({ title, amount, date, notes });
        localStorage.setItem('bills', JSON.stringify(bills));
        renderBills();
        billModal.classList.add('hidden');
        document.getElementById('bill-title').value = '';
        document.getElementById('bill-amount').value = '';
        document.getElementById('bill-date').value = '';
        document.getElementById('bill-notes').value = '';
    }
});
renderBills();

// ===================== EXPENSES =====================
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
const expenseList = document.getElementById('expense-list');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseModal = document.getElementById('expense-modal');
const saveExpenseBtn = document.getElementById('save-expense');
const closeExpenseBtn = document.getElementById('close-expense');

function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((exp, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${exp.title} - $${exp.amount}</span>
                        <span class="delete-btn" onclick="deleteExpense(${index})">X</span>`;
        expenseList.appendChild(li);
    });
    updateStats();
}
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}
addExpenseBtn.addEventListener('click', () => expenseModal.classList.remove('hidden'));
closeExpenseBtn.addEventListener('click', () => expenseModal.classList.add('hidden'));
saveExpenseBtn.addEventListener('click', () => {
    const title = document.getElementById('expense-title').value;
    const amount = document.getElementById('expense-amount').value;
    if (title && amount) {
        expenses.push({ title, amount });
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        expenseModal.classList.add('hidden');
        document.getElementById('expense-title').value = '';
        document.getElementById('expense-amount').value = '';
    }
});
renderExpenses();

// ===================== PROFILE =====================
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const editProfileBtn = document.getElementById('edit-profile-btn');

function updateStats() {
    document.getElementById('stat-reminders').textContent = `Reminders: ${reminders.length}`;
    document.getElementById('stat-bills').textContent = `Bills: ${bills.length}`;
    document.getElementById('stat-expenses').textContent = `Expenses: ${expenses.length}`;
}
updateStats();

editProfileBtn.addEventListener('click', () => {
    const name = prompt("Enter your name:", profileName.textContent);
    const bio = prompt("Enter your bio:", profileBio.textContent);
    if (name) profileName.textContent = name;
    if (bio) profileBio.textContent = bio;
});

// ===================== TAX =====================
const calculateTaxBtn = document.getElementById('calculate-tax-btn');
calculateTaxBtn.addEventListener('click', () => {
    const income = Number(document.getElementById('income').value) || 0;
    const deductions = Number(document.getElementById('deductions').value) || 0;
    const dependents = Number(document.getElementById('dependents').value) || 0;
    const other = Number(document.getElementById('other-deductions').value) || 0;
    const dependentDeduction = 16000;
    const taxable = income - deductions - (dependents * dependentDeduction) - other;
    const tax = taxable * 0.18; // flat 18% for demo
    document.getElementById('tax-summary').textContent = `Taxable Income: $${taxable.toFixed(2)} | Total Tax: $${tax.toFixed(2)}`;
    document.getElementById('tax-calculation').textContent = `Calculation: (${income} - ${deductions} - (${dependents}*${dependentDeduction}) - ${other}) * 0.18`;
    document.getElementById('tax-results').classList.remove('hidden');
});

// ===================== AI CHAT =====================
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

const responses = {
    "hi": ["Hi! How are you?", "Hello!"],
    "how are you": ["I'm fine, thanks! How about you?", "Doing great!"],
    "what is my name": ["Your name is " + (savedUsername || "User")],
    "open reminders": ["showSection('reminders-section')"],
    "open bills": ["showSection('bills-section')"],
    "open expenses": ["showSection('expenses-section')"],
    "open tax": ["showSection('tax-section')"],
    "open profile": ["showSection('profile-section')"]
};

function addChatMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addChatMessage(msg, 'user');
    let response = "I don't understand that yet!";
    const key = msg.toLowerCase();
    if (responses[key]) {
        if (responses[key][0].startsWith("showSection")) {
            eval(responses[key][0]);
            response = "Opened section!";
        } else {
            const arr = responses[key];
            response = arr[Math.floor(Math.random() * arr.length)];
        }
    }
    addChatMessage(response, 'ai');
    chatInput.value = '';
});
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') chatSend.click();
});
