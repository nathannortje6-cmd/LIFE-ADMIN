/* ============================= */
/* INITIALIZATION AND LOCAL STORAGE */
/* ============================= */

let currentUser = null;

// Sections
const sections = {
    reminders: document.getElementById('reminders-section'),
    bills: document.getElementById('bills-section'),
    expenses: document.getElementById('expenses-section'),
    tax: document.getElementById('tax-section'),
    profile: document.getElementById('profile-section'),
    ai: document.getElementById('ai-section')
};

// Buttons & Inputs
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');

const navButtons = document.querySelectorAll('.nav-item');

// Reminders
const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderModal = document.getElementById('reminder-modal');
const closeReminderModalBtn = document.getElementById('close-reminder-modal');
const reminderForm = document.getElementById('reminder-form');
const reminderList = document.getElementById('reminder-list');

// Bills
const addBillBtn = document.getElementById('add-bill-btn');
const billModal = document.getElementById('bill-modal');
const closeBillModalBtn = document.getElementById('close-bill-modal');
const billForm = document.getElementById('bill-form');
const billList = document.getElementById('bill-list');

// Expenses
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseModal = document.getElementById('expense-modal');
const closeExpenseModalBtn = document.getElementById('close-expense-modal');
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

// Tax
const incomeInput = document.getElementById('tax-income');
const deductionSelect = document.getElementById('tax-deduction-select');
const deductionInputsContainer = document.getElementById('deduction-inputs');
const calculateTaxBtn = document.getElementById('calculate-tax-btn');
const taxResults = document.getElementById('tax-results');

// AI Chat
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// =============================
// LOGIN FUNCTIONALITY
// =============================
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username === "") {
        alert("Please enter a username");
        return;
    }
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    document.getElementById('login-screen').style.display = 'none';
    sections.reminders.style.display = 'block';
});

// =============================
// NAVIGATION
// =============================
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(sections).forEach(s => s.style.display = 'none');
        const sectionName = btn.getAttribute('data-section');
        sections[sectionName].style.display = 'block';
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sections[sectionName].classList.add('fade-in');
    });
});

// =============================
// REMINDERS
// =============================
addReminderBtn.addEventListener('click', () => reminderModal.style.display = 'block');
closeReminderModalBtn.addEventListener('click', () => reminderModal.style.display = 'none');

reminderForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(reminderForm);
    const reminder = {
        title: formData.get('reminder-title'),
        date: formData.get('reminder-date'),
        time: formData.get('reminder-time'),
        notes: formData.get('reminder-notes')
    };
    addReminder(reminder);
    reminderModal.style.display = 'none';
    reminderForm.reset();
    saveReminders();
});

let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
reminders.forEach(addReminder);

function addReminder(reminder){
    reminders.push(reminder);
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${reminder.title}</strong> <br>
            ${reminder.date} ${reminder.time} <br>
            ${reminder.notes}
        </div>
        <button class="delete-reminder">Delete</button>
    `;
    li.classList.add('slide-in');
    li.querySelector('.delete-reminder').addEventListener('click', ()=>{
        li.remove();
        reminders = reminders.filter(r => r !== reminder);
        saveReminders();
    });
    reminderList.appendChild(li);
}

function saveReminders(){
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// =============================
// BILLS
// =============================
addBillBtn.addEventListener('click', () => billModal.style.display = 'block');
closeBillModalBtn.addEventListener('click', () => billModal.style.display = 'none');

billForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(billForm);
    const bill = {
        name: formData.get('bill-name'),
        amount: formData.get('bill-amount'),
        dueDate: formData.get('bill-date')
    };
    addBill(bill);
    billModal.style.display = 'none';
    billForm.reset();
    saveBills();
});

let bills = JSON.parse(localStorage.getItem('bills')) || [];
bills.forEach(addBill);

function addBill(bill){
    bills.push(bill);
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${bill.name}</strong> <br>
            R${bill.amount} - ${bill.dueDate}
        </div>
        <button class="delete-bill">Delete</button>
    `;
    li.classList.add('slide-in');
    li.querySelector('.delete-bill').addEventListener('click', ()=>{
        li.remove();
        bills = bills.filter(b => b !== bill);
        saveBills();
    });
    billList.appendChild(li);
}

function saveBills(){
    localStorage.setItem('bills', JSON.stringify(bills));
}

// =============================
// EXPENSES
// =============================
addExpenseBtn.addEventListener('click', () => expenseModal.style.display = 'block');
closeExpenseModalBtn.addEventListener('click', () => expenseModal.style.display = 'none');

expenseForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(expenseForm);
    const expense = {
        name: formData.get('expense-name'),
        amount: formData.get('expense-amount')
    };
    addExpense(expense);
    expenseModal.style.display = 'none';
    expenseForm.reset();
    saveExpenses();
});

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
expenses.forEach(addExpense);

function addExpense(expense){
    expenses.push(expense);
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${expense.name}</strong> - R${expense.amount}
        </div>
        <button class="delete-expense">Delete</button>
    `;
    li.classList.add('slide-in');
    li.querySelector('.delete-expense').addEventListener('click', ()=>{
        li.remove();
        expenses = expenses.filter(e => e !== expense);
        saveExpenses();
    });
    expenseList.appendChild(li);
}

function saveExpenses(){
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// =============================
// TAX (SOUTH AFRICA SARS)
// =============================
const SA_TAX_BRACKETS = [
    { max: 237100, rate: 0.18, base: 0 },
    { max: 370500, rate: 0.26, base: 42678 },
    { max: 512800, rate: 0.31, base: 77362 },
    { max: 673000, rate: 0.36, base: 121910 },
    { max: 857900, rate: 0.39, base: 179147 },
    { max: 1817000, rate: 0.41, base: 251258 },
    { max: Infinity, rate: 0.45, base: 644489 }
];

const DEDUCTIONS_LIST = [
    "Pension Fund Contributions",
    "Retirement Annuity Contributions",
    "Medical Aid Contributions",
    "Donations (S18A)",
    "Travel Allowance"
];

DED = [];

deductionSelect.addEventListener('change', () => {
    const value = deductionSelect.value;
    if(!value) return;
    const input = document.createElement('input');
    input.placeholder = value + " amount";
    input.dataset.deduction = value;
    deductionInputsContainer.appendChild(input);
    DED.push(input);
});

// Calculate Tax
calculateTaxBtn.addEventListener('click', () => {
    let income = parseFloat(incomeInput.value) || 0;
    let totalDeduction = 0;
    DED.forEach(d => { totalDeduction += parseFloat(d.value) || 0; });
    const taxableIncome = income - totalDeduction;

    let taxOwed = 0;
    for(let bracket of SA_TAX_BRACKETS){
        if(taxableIncome <= bracket.max){
            taxOwed = bracket.base + (taxableIncome - (bracket.max - bracket.max/bracket.rate))*bracket.rate;
            break;
        }
    }
    taxResults.innerHTML = `
        <strong>Taxable Income:</strong> R${taxableIncome.toFixed(2)} <br>
        <strong>Estimated Tax:</strong> R${taxOwed.toFixed(2)} <br>
        <strong>Deductions:</strong> R${totalDeduction.toFixed(2)}
    `;
});

// =============================
// AI CHAT
// =============================
const aiResponses = {
    "hi": "Hi! How are you?",
    "how are you": "I'm fine, and you?",
    "help with tax": () => switchSection('tax'),
    "help with bills": () => switchSection('bills'),
    "help with expenses": () => switchSection('expenses'),
    "set a reminder": () => switchSection('reminders'),
    "hello": "Hello! How can I assist you today?",
};

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

function sendMessage(){
    const msg = chatInput.value.trim();
    if(!msg) return;
    appendChatMessage("You", msg);
    chatInput.value = "";

    let response = aiResponses[msg.toLowerCase()];
    if(typeof response === "function") response();
    else if(response) appendChatMessage("AI", response);
    else appendChatMessage("AI", "Sorry, I don't understand yet.");
}

function appendChatMessage(sender, msg){
    const div = document.createElement('div');
    div.innerHTML = `<strong>${sender}:</strong> ${msg}`;
    div.classList.add('fade-in');
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// =============================
// HELPER FUNCTION
// =============================
function switchSection(section){
    Object.values(sections).forEach(s => s.style.display = 'none');
    sections[section].style.display = 'block';
    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-item[data-section=${section}]`).classList.add('active');
}
