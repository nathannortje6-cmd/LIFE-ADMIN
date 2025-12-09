// ===== LOGIN =====
const loginScreen = document.getElementById('login-screen');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');
const app = document.getElementById('app');
const userDisplay = document.getElementById('user-display');

startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if(username){
        loginScreen.style.display = 'none';
        app.style.display = 'block';
        userDisplay.textContent = username;
        document.getElementById('profile-name-display').textContent = username;
        showSection('reminders');
    } else {
        alert('Please enter a username');
    }
});

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        showSection(item.dataset.section);
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

function showSection(id){
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// ===== REMINDERS =====
let reminders = [];

document.getElementById('add-reminder').addEventListener('click', () => {
    const title = document.getElementById('reminder-title').value.trim();
    const time = document.getElementById('reminder-time').value;
    const note = document.getElementById('reminder-note').value.trim();
    if(title && time){
        const reminder = { title, time, note };
        reminders.push(reminder);
        renderReminders();
        alert('Reminder set!');
    }
});

document.getElementById('clear-reminders').addEventListener('click', () => {
    reminders = [];
    renderReminders();
});

function renderReminders(){
    const list = document.getElementById('reminder-list');
    list.innerHTML = '';
    reminders.forEach((r,i) => {
        const li = document.createElement('li');
        li.textContent = `${r.title} - ${r.time} - ${r.note}`;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            reminders.splice(i,1);
            renderReminders();
        });
        li.appendChild(del);
        list.appendChild(li);
    });
}

// ===== BILLS =====
let bills = [];

document.getElementById('add-bill').addEventListener('click', () => {
    const title = document.getElementById('bill-title').value.trim();
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const date = document.getElementById('bill-date').value;
    if(title && amount && date){
        bills.push({ title, amount, date });
        renderBills();
    }
});

document.getElementById('clear-bills').addEventListener('click', () => {
    bills = [];
    renderBills();
});

function renderBills(){
    const list = document.getElementById('bill-list');
    list.innerHTML = '';
    bills.forEach((b,i) => {
        const li = document.createElement('li');
        li.textContent = `${b.title} - R${b.amount} - ${b.date}`;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            bills.splice(i,1);
            renderBills();
        });
        li.appendChild(del);
        list.appendChild(li);
    });
}

// ===== EXPENSES =====
let expenses = [];

document.getElementById('add-expense').addEventListener('click', () => {
    const title = document.getElementById('expense-title').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    if(title && amount){
        expenses.push({ title, amount });
        renderExpenses();
    }
});

document.getElementById('clear-expenses').addEventListener('click', () => {
    expenses = [];
    renderExpenses();
});

function renderExpenses(){
    const list = document.getElementById('expense-list');
    list.innerHTML = '';
    expenses.forEach((e,i) => {
        const li = document.createElement('li');
        li.textContent = `${e.title} - R${e.amount}`;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            expenses.splice(i,1);
            renderExpenses();
        });
        li.appendChild(del);
        list.appendChild(li);
    });
}

// ===== TAX CALCULATOR =====
function calculateTaxSA({ annualSalary, age = 30, pensionContribution = 0, retirementAnnuity = 0, medicalAidMembers = 1 }) {
    const deductions = pensionContribution + retirementAnnuity;
    let taxableIncome = annualSalary - deductions;
    if(taxableIncome < 0) taxableIncome = 0;

    const brackets = [
        { threshold: 237100, rate: 0.18, base: 0 },
        { threshold: 370500, rate: 0.26, base: 42678 },
        { threshold: 512800, rate: 0.31, base: 77364 },
        { threshold: 673000, rate: 0.36, base: 121910 },
        { threshold: 857900, rate: 0.39, base: 179940 },
        { threshold: 1817000, rate: 0.41, base: 251946 },
        { threshold: Infinity, rate: 0.45, base: 644704 }
    ];

    let tax = 0;
    for(let i=0;i<brackets.length;i++){
        if(taxableIncome <= brackets[i].threshold){
            tax = brackets[i].base + (taxableIncome - (brackets[i-1]?.threshold || 0))*brackets[i].rate;
            break;
        }
    }

    const primaryRebate = 17478;
    const secondaryRebate = age >= 65 ? 9594 : 0;
    const tertiaryRebate = age >= 75 ? 3194 : 0;
    const totalRebate = primaryRebate + secondaryRebate + tertiaryRebate;

    tax -= totalRebate;
    if(tax < 0) tax = 0;

    const uif = Math.min(annualSalary, 17712)*0.01;
    const netSalary = annualSalary - tax - uif;

    return { taxableIncome, tax: Math.round(tax), uif: Math.round(uif), netSalary: Math.round(netSalary) };
}

document.getElementById('calculate-tax-btn').addEventListener('click', () => {
    const salary = parseFloat(document.getElementById('annual-salary').value);
    const pension = parseFloat(document.getElementById('pension').value);
    const retirement = parseFloat(document.getElementById('retirement').value);
    const medical = parseInt(document.getElementById('medical-members').value);

    if(salary){
        const result = calculateTaxSA({
            annualSalary: salary,
            pensionContribution: pension || 0,
            retirementAnnuity: retirement || 0,
            medicalAidMembers: medical || 1
        });

        document.getElementById('tax-result').innerHTML = `
            <p>Taxable Income: R${result.taxableIncome}</p>
            <p>Tax Payable: R${result.tax}</p>
            <p>UIF: R${result.uif}</p>
            <p>Net Salary: R${result.netSalary}</p>
        `;
    } else alert('Enter your annual salary');
});

document.getElementById('clear-tax-btn').addEventListener('click', () => {
    document.getElementById('annual-salary').value = '';
    document.getElementById('pension').value = '';
    document.getElementById('retirement').value = '';
    document.getElementById('medical-members').value = '';
    document.getElementById('tax-result').innerHTML = '';
});

// ===== AI CHAT =====
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');

const aiResponses = {
    hi: "Hi! I'm your LIFE-ADMIN assistant. I can help with Reminders, Bills, Expenses, Tax, and general advice.",
    "how are you": "I'm good, thank you! How are you?",
    "what can you do": "I can help you track reminders, bills, expenses, calculate tax, and chat!",
    "help with tax": "Taking you to Tax section...", 
    "help with bills": "Taking you to Bills section...", 
    "help with expenses": "Taking you to Expenses section...", 
    "help with reminders": "Taking you to Reminders section..."
};

sendChat.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', e => { if(e.key==='Enter') handleChat(); });

function handleChat(){
    const message = chatInput.value.trim().toLowerCase();
    if(!message) return;
    appendMessage(`You: ${chatInput.value}`);
    chatInput.value = '';

    // Check for commands
    if(aiResponses[message]){
        appendMessage(`AI: ${aiResponses[message]}`);
        if(message.includes('tax')) showSection('tax');
        if(message.includes('bills')) showSection('bills');
        if(message.includes('expenses')) showSection('expenses');
        if(message.includes('reminders')) showSection('reminders');
    } else {
        appendMessage(`AI: I'm not sure how to respond yet. You can ask me to help with tax, bills, expenses, or reminders.`);
    }
}

function appendMessage(msg){
    const p = document.createElement('p');
    p.textContent = msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}
