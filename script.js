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
/* BILLS, EXPENSES, REMINDERS   */
/* ============================= */
function addBill(name, amount, date, isAI=false) {
    name = name || document.getElementById('bill-name').value;
    amount = amount || document.getElementById('bill-amount').value;
    date = date || document.getElementById('bill-date').value;
    if (!name || !amount || !date) return alert('Please fill all bill fields.');

    const bill = { name, amount, date };
    bills.push(bill);
    renderBills();
    if(!isAI) clearBillInputs();
}

function renderBills() {
    const list = document.getElementById('bills-list');
    list.innerHTML = '';
    bills.forEach((b, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${b.name} - R${b.amount} - ${b.date}</span> <button onclick="removeBill(${i})">Delete</button>`;
        if(b.ai) li.classList.add('ai-task');
        list.appendChild(li);
    });
}

function removeBill(index) {
    bills.splice(index,1);
    renderBills();
}

function clearBillInputs() {
    document.getElementById('bill-name').value = '';
    document.getElementById('bill-amount').value = '';
    document.getElementById('bill-date').value = '';
}

function addExpense(name, amount, isAI=false) {
    name = name || document.getElementById('expense-name').value;
    amount = amount || document.getElementById('expense-amount').value;
    if (!name || !amount) return alert('Please fill all expense fields.');

    const expense = { name, amount };
    if(isAI) expense.ai = true;
    expenses.push(expense);
    renderExpenses();
    if(!isAI) clearExpenseInputs();
}

function renderExpenses() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = '';
    expenses.forEach((e,i)=>{
        const li = document.createElement('li');
        li.innerHTML = `<span>${e.name} - R${e.amount}</span> <button onclick="removeExpense(${i})">Delete</button>`;
        if(e.ai) li.classList.add('ai-task');
        list.appendChild(li);
    });
}

function removeExpense(index) {
    expenses.splice(index,1);
    renderExpenses();
}

function clearExpenseInputs() {
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
}

function addReminder(title, datetime, isAI=false) {
    title = title || document.getElementById('reminder-title').value;
    datetime = datetime || document.getElementById('reminder-date').value;
    if (!title || !datetime) return alert('Please fill all reminder fields.');

    const reminder = { title, datetime };
    if(isAI) reminder.ai = true;
    reminders.push(reminder);
    renderReminders();
    if(!isAI) clearReminderInputs();
}

function renderReminders() {
    const list = document.getElementById('reminders-list');
    list.innerHTML = '';
    reminders.forEach((r,i)=>{
        const li = document.createElement('li');
        li.innerHTML = `<span>${r.title} - ${r.datetime}</span> <button onclick="removeReminder(${i})">Delete</button>`;
        if(r.ai) li.classList.add('ai-task');
        list.appendChild(li);
    });
}

function removeReminder(index) {
    reminders.splice(index,1);
    renderReminders();
}

function clearReminderInputs() {
    document.getElementById('reminder-title').value = '';
    document.getElementById('reminder-date').value = '';
}

function clearReminders() {
    reminders = [];
    renderReminders();
}

/* ============================= */
/* TAX CALCULATOR (Basic)        */
/* ============================= */
function runTaxCalculation() {
    const salary = Number(document.getElementById('tax-salary').value);
    const age = Number(document.getElementById('tax-age').value);
    const pension = Number(document.getElementById('tax-pension').value);
    const retirement = Number(document.getElementById('tax-retirement').value);
    const medical = Number(document.getElementById('tax-medical').value);

    if(!salary) return alert('Enter your salary.');

    // Simple SA 2025/26 tax example (flat 18% for demo)
    let taxable = salary - pension - retirement - (medical*3300);
    taxable = taxable < 0 ? 0 : taxable;
    const tax = taxable * 0.18;
    document.getElementById('tax-output').innerText = `Estimated tax: R${tax.toFixed(2)}`;
}

/* ============================= */
/* AI CHAT FUNCTIONALITY         */
/* ============================= */
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
document.getElementById('chat-send').addEventListener('click', handleChat);
chatInput.addEventListener('keypress', e => { if(e.key==='Enter') handleChat(); });

function handleChat() {
    const msg = chatInput.value.trim();
    if(!msg) return;
    addChatMessage(msg,'user');
    chatInput.value = '';
    setTimeout(()=>processAI(msg),500); // simulate AI response delay
}

function addChatMessage(text,type) {
    const p = document.createElement('p');
    p.className = type==='user'?'user-msg':'ai-msg';
    p.textContent = text;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* Simple AI parser for tasks */
function processAI(msg) {
    let response = "I'm not sure what to do.";

    msg = msg.toLowerCase();

    // Bills
    if(msg.includes('bill') || msg.includes('pay')) {
        const matchAmount = msg.match(/\d+/);
        const matchName = msg.match(/(?:pay|for)?\s*(\w+\s?\w*)\s*bill/);
        const matchDate = msg.match(/on (\d{1,2}(?:st|nd|rd|th)?\s?\w+|\d{4}-\d{2}-\d{2})/);

        const name = matchName ? matchName[1] : "Unnamed Bill";
        const amount = matchAmount ? matchAmount[0] : 0;
        const date = matchDate ? matchDate[1] : new Date().toISOString().split('T')[0];

        addBill(name,amount,date,true);
        response = `Added bill: ${name} - R${amount} - ${date}`;
    }
    // Expenses
    else if(msg.includes('expense') || msg.includes('spend')) {
        const matchAmount = msg.match(/\d+/);
        const matchName = msg.match(/(?:on|for)?\s*(\w+\s?\w*)/);
        const name = matchName ? matchName[1] : "Unnamed Expense";
        const amount = matchAmount ? matchAmount[0] : 0;
        addExpense(name,amount,true);
        response = `Added expense: ${name} - R${amount}`;
    }
    // Reminders
    else if(msg.includes('remind') || msg.includes('reminder')) {
        const matchTitle = msg.match(/remind me to (.+?)(?: on| at|$)/);
        const matchDate = msg.match(/on (\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?)/);
        const title = matchTitle ? matchTitle[1] : "Untitled Reminder";
        const datetime = matchDate ? matchDate[1] : new Date().toISOString().slice(0,16);
        addReminder(title,datetime,true);
        response = `Added reminder: ${title} - ${datetime}`;
    }

    addChatMessage(response,'ai');
}
