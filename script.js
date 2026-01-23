/* ============================= */
/* GLOBAL VARIABLES              */
/* ============================= */
let username = '';
let bills = [];
let expenses = [];
let reminders = [];

/* ============================= */
/* LOGIN & NAVIGATION            */
/* ============================= */
document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('username');
    if (input.value.trim() === '') return alert('Please enter your name.');
    username = input.value.trim();
    document.getElementById('topbar-username').innerText = `Hello, ${username}`;
    document.getElementById('profile-name-display').innerText = username;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    showSection('home');
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[data-target="${sectionId}"]`)?.classList.add('active');
}

/* ============================= */
/* BILLS                         */
/* ============================= */
function addBill() {
    const name = document.getElementById('bill-name').value;
    const amount = document.getElementById('bill-amount').value;
    const date = document.getElementById('bill-date').value;
    if (!name || !amount || !date) return alert('Please fill all bill fields.');

    bills.push({ name, amount, date });
    renderBills();
    document.getElementById('bill-name').value = '';
    document.getElementById('bill-amount').value = '';
    document.getElementById('bill-date').value = '';
}

function renderBills() {
    const list = document.getElementById('bills-list');
    list.innerHTML = '';
    bills.forEach((b, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${b.name} - R${b.amount} - ${b.date}</span> <button onclick="removeBill(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

function removeBill(index) {
    bills.splice(index, 1);
    renderBills();
}

/* ============================= */
/* EXPENSES                      */
/* ============================= */
function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;
    if (!name || !amount) return alert('Please fill all expense fields.');

    expenses.push({ name, amount });
    renderExpenses();
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
}

function renderExpenses() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = '';
    expenses.forEach((e, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${e.name} - R${e.amount}</span> <button onclick="removeExpense(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

function removeExpense(index) {
    expenses.splice(index, 1);
    renderExpenses();
}

/* ============================= */
/* REMINDERS                     */
/* ============================= */
function addReminder() {
    const title = document.getElementById('reminder-title').value;
    const datetime = document.getElementById('reminder-date').value;
    if (!title || !datetime) return alert('Please fill all reminder fields.');

    reminders.push({ title, datetime });
    renderReminders();
    document.getElementById('reminder-title').value = '';
    document.getElementById('reminder-date').value = '';
}

function renderReminders() {
    const list = document.getElementById('reminders-list');
    list.innerHTML = '';
    reminders.forEach((r, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${r.title} - ${r.datetime}</span> <button onclick="removeReminder(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

function clearReminders() {
    reminders = [];
    renderReminders();
}

/* ============================= */
/* TAX CALCULATOR (OLD WORKING)  */
/* ============================= */
function runTaxCalculation() {
    const salary = Number(document.getElementById('tax-salary').value);
    const age = Number(document.getElementById('tax-age').value);
    const pension = Number(document.getElementById('tax-pension').value);
    const retirement = Number(document.getElementById('tax-retirement').value);
    const medicalMembers = Number(document.getElementById('tax-medical').value);

    if (!salary || salary <= 0) return alert('Please enter a valid salary.');

    let tax = 0;

    // SA 2025/26 tax brackets
    if (salary <= 237100) tax = salary * 0.18;
    else if (salary <= 370500) tax = 42678 + (salary - 237100) * 0.26;
    else if (salary <= 512800) tax = 77362 + (salary - 370500) * 0.31;
    else if (salary <= 673000) tax = 121910 + (salary - 512800) * 0.36;
    else if (salary <= 857900) tax = 179532 + (salary - 673000) * 0.39;
    else if (salary <= 1817000) tax = 251258 + (salary - 857900) * 0.41;
    else tax = 644489 + (salary - 1817000) * 0.45;

    // Deductions
    let deduction = 0;

    // Pension & retirement max 27.5% of salary
    if (pension) deduction += Math.min(pension, salary * 0.275);
    if (retirement) deduction += Math.min(retirement, salary * 0.275);

    // Medical credit: R364 per member
    if (medicalMembers && medicalMembers > 0) deduction += medicalMembers * 364;

    tax -= deduction;
    if (tax < 0) tax = 0;

    document.getElementById('tax-output').innerText = `Estimated Tax: R${tax.toFixed(2)}`;
}

/* ============================= */
/* AI CHAT FUNCTIONALITY         */
/* ============================= */
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');

document.getElementById('chat-send').addEventListener('click', handleChat);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleChat(); });

function handleChat() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addChatMessage(msg, 'user');
    chatInput.value = '';
    setTimeout(() => processAI(msg), 500);
}

function addChatMessage(text, type) {
    const p = document.createElement('p');
    p.className = type === 'user' ? 'user-msg' : 'ai-msg';
    p.textContent = text;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processAI(msg) {
    msg = msg.toLowerCase();
    let response = "I'm not sure what to do.";

    // Bills
    if (msg.includes('bill') || msg.includes('pay')) {
        const nameMatch = msg.match(/pay\s(.+?)\s*bill/) || msg.match(/bill for\s(.+)/);
        const amountMatch = msg.match(/\d+/);
        const dateMatch = msg.match(/\d{4}-\d{2}-\d{2}/);
        const name = nameMatch ? nameMatch[1] : "Unnamed Bill";
        const amount = amountMatch ? amountMatch[0] : 0;
        const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
        bills.push({ name, amount, date });
        renderBills();
        response = `Bill added: ${name} - R${amount} - ${date}`;
    }
    // Expenses
    else if (msg.includes('expense') || msg.includes('spend')) {
        const nameMatch = msg.match(/on (.+)/);
        const amountMatch = msg.match(/\d+/);
        const name = nameMatch ? nameMatch[1] : "Unnamed Expense";
        const amount = amountMatch ? amountMatch[0] : 0;
        expenses.push({ name, amount });
        renderExpenses();
        response = `Expense added: ${name} - R${amount}`;
    }
    // Reminders
    else if (msg.includes('remind') || msg.includes('reminder')) {
        const titleMatch = msg.match(/remind me to (.+?)(?: on| at|$)/);
        const dateMatch = msg.match(/\d{4}-\d{2}-\d{2}/);
        const title = titleMatch ? titleMatch[1] : "Untitled Reminder";
        const datetime = dateMatch ? dateMatch[0] : new Date().toISOString().slice(0,16);
        reminders.push({ title, datetime });
        renderReminders();
        response = `Reminder added: ${title} - ${datetime}`;
    }

    addChatMessage(response, 'ai');
}
