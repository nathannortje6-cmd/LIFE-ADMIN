// ====== LOGIN LOGIC ======
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const usernameInput = document.getElementById('username-input');
const loginBtn = document.getElementById('login-btn');
const welcomeText = document.getElementById('welcome-text');
const logoutBtn = document.getElementById('logout-btn');

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('lifeadmin_username', username);
        startApp(username);
    } else {
        alert('Please enter your name!');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('lifeadmin_username');
    location.reload();
});

function startApp(username) {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    welcomeText.textContent = `Welcome, ${username}`;
    document.getElementById('profile-name').textContent = username;
    loadAllData();
}

// ====== NAVIGATION ======
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        sections.forEach(sec => sec.style.display = 'none');
        document.getElementById(item.dataset.section).style.display = 'block';
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ====== REMINDERS ======
const reminderTitle = document.getElementById('reminder-title');
const reminderDate = document.getElementById('reminder-date');
const reminderTime = document.getElementById('reminder-time');
const reminderReason = document.getElementById('reminder-reason');
const reminderPrep = document.getElementById('reminder-prep');
const saveReminderBtn = document.getElementById('save-reminder-btn');
const remindersList = document.getElementById('reminders-list');

saveReminderBtn.addEventListener('click', () => {
    const title = reminderTitle.value;
    const date = reminderDate.value;
    const time = reminderTime.value;
    const reason = reminderReason.value;
    const prep = reminderPrep.value;

    if (!title || !date || !time) {
        alert('Please fill out all required fields!');
        return;
    }

    const reminder = { title, date, time, reason, prep };
    let reminders = JSON.parse(localStorage.getItem('lifeadmin_reminders')) || [];
    reminders.push(reminder);
    localStorage.setItem('lifeadmin_reminders', JSON.stringify(reminders));
    alert('Reminder set successfully!');
    displayReminders();
    reminderTitle.value = reminderDate.value = reminderTime.value = reminderReason.value = reminderPrep.value = '';
});

function displayReminders() {
    let reminders = JSON.parse(localStorage.getItem('lifeadmin_reminders')) || [];
    remindersList.innerHTML = '';
    reminders.forEach((r, index) => {
        const li = document.createElement('li');
        li.textContent = `${r.title} - ${r.date} ${r.time}`;
        remindersList.appendChild(li);
    });
}

// ====== BILLS ======
const billName = document.getElementById('bill-name');
const billAmount = document.getElementById('bill-amount');
const billDate = document.getElementById('bill-date');
const saveBillBtn = document.getElementById('save-bill-btn');
const billsList = document.getElementById('bills-list');

saveBillBtn.addEventListener('click', () => {
    const name = billName.value;
    const amount = parseFloat(billAmount.value);
    const date = billDate.value;

    if (!name || !amount || !date) {
        alert('Please fill all bill fields!');
        return;
    }

    const bill = { name, amount, date };
    let bills = JSON.parse(localStorage.getItem('lifeadmin_bills')) || [];
    bills.push(bill);
    localStorage.setItem('lifeadmin_bills', JSON.stringify(bills));
    alert('Bill saved successfully!');
    displayBills();
    billName.value = billAmount.value = billDate.value = '';
});

function displayBills() {
    let bills = JSON.parse(localStorage.getItem('lifeadmin_bills')) || [];
    billsList.innerHTML = '';
    bills.forEach((b, index) => {
        const li = document.createElement('li');
        li.textContent = `${b.name} - R${b.amount.toFixed(2)} - ${b.date}`;
        billsList.appendChild(li);
    });
}

// ====== EXPENSES ======
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const saveExpenseBtn = document.getElementById('save-expense-btn');
const expensesList = document.getElementById('expenses-list');
const expenseSummary = document.getElementById('expense-summary');

saveExpenseBtn.addEventListener('click', () => {
    const name = expenseName.value;
    const amount = parseFloat(expenseAmount.value);
    if (!name || !amount) { alert('Fill all fields!'); return; }

    const expense = { name, amount };
    let expenses = JSON.parse(localStorage.getItem('lifeadmin_expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('lifeadmin_expenses', JSON.stringify(expenses));
    displayExpenses();
    expenseName.value = expenseAmount.value = '';
});

function displayExpenses() {
    let expenses = JSON.parse(localStorage.getItem('lifeadmin_expenses')) || [];
    expensesList.innerHTML = '';
    let total = 0;
    expenses.forEach(exp => {
        total += exp.amount;
        const li = document.createElement('li');
        li.textContent = `${exp.name} - R${exp.amount.toFixed(2)}`;
        expensesList.appendChild(li);
    });
    expenseSummary.textContent = `Total Expenses: R${total.toFixed(2)}`;
}

// ====== TAX CALCULATOR (SOUTH AFRICA) ======
const salaryInput = document.getElementById('salary-input');
const deductionSelect = document.getElementById('deduction-select');
const deductionInputsDiv = document.getElementById('deduction-inputs');
const calculateTaxBtn = document.getElementById('calculate-tax-btn');
const taxResult = document.getElementById('tax-result');

deductionSelect.addEventListener('change', () => {
    const type = deductionSelect.value;
    deductionInputsDiv.innerHTML = '';
    if (type) {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = `Amount for ${type}`;
        input.id = `deduction-${type}`;
        deductionInputsDiv.appendChild(input);
    }
});

calculateTaxBtn.addEventListener('click', () => {
    const salary = parseFloat(salaryInput.value);
    if (!salary) { alert('Enter salary!'); return; }

    let deductions = 0;
    ['pension','medical','donation'].forEach(d => {
        const el = document.getElementById(`deduction-${d}`);
        if(el) deductions += parseFloat(el.value) || 0;
    });

    const taxable = salary - deductions;

    // Simple SARS brackets example (for demo purposes)
    let tax = 0;
    if(taxable <= 237100) tax = taxable*0.18;
    else if(taxable <= 370500) tax = 42678 + (taxable-237100)*0.26;
    else if(taxable <= 512800) tax = 77362 + (taxable-370500)*0.31;
    else if(taxable <= 673000) tax = 121475 + (taxable-512800)*0.36;
    else if(taxable <= 857900) tax = 179147 + (taxable-673000)*0.39;
    else if(taxable <= 1817000) tax = 251258 + (taxable-857900)*0.41;
    else tax = 644489 + (taxable-1817000)*0.45;

    const monthly = tax/12;

    taxResult.innerHTML = `
        <p>Salary: R${salary.toFixed(2)}</p>
        <p>Deductions: R${deductions.toFixed(2)}</p>
        <p>Taxable Income: R${taxable.toFixed(2)}</p>
        <p>Estimated Tax: R${tax.toFixed(2)} (Monthly: R${monthly.toFixed(2)})</p>
    `;
});

// ====== AI CHAT ======
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

let aiFirstGreeting = true;

const aiResponses = {
    hi: "Hi! I'm LIFE-ADMIN AI. I can help you manage Reminders, Bills, Expenses, Tax, and chat with you.",
    "how are you": "I'm doing great! How are you?",
    "help": "I can navigate you to sections: say 'reminders', 'bills', 'expenses', 'tax', 'profile', or set reminders/bills/expenses.",
    "default": "I didn't understand that. You can ask for 'help' to see what I can do."
};

chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if(!msg) return;

    addChatMessage('You', msg);
    handleAI(msg.toLowerCase());
    chatInput.value = '';
});

function addChatMessage(sender, message){
    const p = document.createElement('p');
    p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleAI(msg){
    let response = aiResponses.default;

    if(msg.includes('hi') && aiFirstGreeting){
        response = aiResponses.hi;
        aiFirstGreeting = false;
    } else if(aiResponses[msg]){
        response = aiResponses[msg];
    } else if(msg.includes('reminder')) { response = 'Navigating to Reminders section...'; navToSection('reminders-section'); }
    else if(msg.includes('bill')) { response = 'Navigating to Bills section...'; navToSection('bills-section'); }
    else if(msg.includes('expense')) { response = 'Navigating to Expenses section...'; navToSection('expenses-section'); }
    else if(msg.includes('tax')) { response = 'Navigating to Tax section...'; navToSection('tax-section'); }
    else if(msg.includes('profile')) { response = 'Navigating to Profile section...'; navToSection('profile-section'); }

    addChatMessage('AI', response);
}

function navToSection(id){
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    navItems.forEach(i => i.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('active');
}

// ====== LOAD ALL DATA ON START ======
function loadAllData(){
    displayReminders();
    displayBills();
    displayExpenses();
}
