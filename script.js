// ====== LOGIN ======
const loginScreen = document.getElementById('login-screen');
const app = document.getElementById('app');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');
const topUsername = document.getElementById('top-username');
const profileNameDisplay = document.getElementById('profile-name-display');

startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if(username){
        loginScreen.style.display = 'none';
        app.style.display = 'block';
        topUsername.textContent = username;
        profileNameDisplay.textContent = username;
        showSection('reminders');
    } else {
        alert("Enter a username!");
    }
});

// ====== NAVIGATION ======
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function showSection(id){
    sections.forEach(sec => sec.style.display='none');
    document.getElementById(id).style.display='block';
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('active');
}

navItems.forEach(item => {
    item.addEventListener('click', ()=> showSection(item.dataset.section));
});

// ====== REMINDERS ======
let reminders = [];
const reminderList = document.getElementById('reminder-list');
const reminderText = document.getElementById('reminder-text');
const reminderDate = document.getElementById('reminder-date');
const reminderTime = document.getElementById('reminder-time');
const addReminderBtn = document.getElementById('add-reminder-btn');
const clearRemindersBtn = document.getElementById('clear-reminders-btn');

function renderReminders(){
    reminderList.innerHTML='';
    reminders.forEach((r,i)=>{
        const li = document.createElement('li');
        li.textContent = `${r.text} | ${r.date} ${r.time}`;
        const delBtn = document.createElement('button');
        delBtn.textContent='Delete';
        delBtn.addEventListener('click', ()=>{
            reminders.splice(i,1);
            renderReminders();
            updateProfileStats();
        });
        li.appendChild(delBtn);
        reminderList.appendChild(li);
    });
}

addReminderBtn.addEventListener('click', ()=>{
    if(reminderText.value && reminderDate.value && reminderTime.value){
        reminders.push({
            text: reminderText.value,
            date: reminderDate.value,
            time: reminderTime.value
        });
        reminderText.value=''; reminderDate.value=''; reminderTime.value='';
        renderReminders();
        updateProfileStats();
        alert("Reminder set!");
    } else alert("Fill all fields!");
});

clearRemindersBtn.addEventListener('click', ()=>{
    reminders=[];
    renderReminders();
    updateProfileStats();
});

// ====== BILLS ======
let bills=[];
const billList = document.getElementById('bill-list');
const billName = document.getElementById('bill-name');
const billAmount = document.getElementById('bill-amount');
const billDate = document.getElementById('bill-date');
const addBillBtn = document.getElementById('add-bill-btn');

function renderBills(){
    billList.innerHTML='';
    bills.forEach((b,i)=>{
        const li = document.createElement('li');
        li.textContent=`${b.name} | R${b.amount} | ${b.date}`;
        const delBtn = document.createElement('button');
        delBtn.textContent='Delete';
        delBtn.addEventListener('click', ()=>{
            bills.splice(i,1);
            renderBills();
            updateProfileStats();
        });
        li.appendChild(delBtn);
        billList.appendChild(li);
    });
}

addBillBtn.addEventListener('click', ()=>{
    if(billName.value && billAmount.value && billDate.value){
        bills.push({
            name: billName.value,
            amount: parseFloat(billAmount.value),
            date: billDate.value
        });
        billName.value=''; billAmount.value=''; billDate.value='';
        renderBills();
        updateProfileStats();
    } else alert("Fill all fields!");
});

// ====== EXPENSES ======
let expenses=[];
const expenseList = document.getElementById('expense-list');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseDate = document.getElementById('expense-date');
const addExpenseBtn = document.getElementById('add-expense-btn');
const totalExpensesEl = document.getElementById('total-expenses');

function renderExpenses(){
    expenseList.innerHTML='';
    let total=0;
    expenses.forEach((e,i)=>{
        total+=e.amount;
        const li = document.createElement('li');
        li.textContent=`${e.name} | R${e.amount} | ${e.date}`;
        const delBtn = document.createElement('button');
        delBtn.textContent='Delete';
        delBtn.addEventListener('click', ()=>{
            expenses.splice(i,1);
            renderExpenses();
            updateProfileStats();
        });
        li.appendChild(delBtn);
        expenseList.appendChild(li);
    });
    totalExpensesEl.textContent = total;
}

addExpenseBtn.addEventListener('click', ()=>{
    if(expenseName.value && expenseAmount.value && expenseDate.value){
        expenses.push({
            name: expenseName.value,
            amount: parseFloat(expenseAmount.value),
            date: expenseDate.value
        });
        expenseName.value=''; expenseAmount.value=''; expenseDate.value='';
        renderExpenses();
        updateProfileStats();
    } else alert("Fill all fields!");
});

// ====== TAX (South Africa) ======
const monthlySalary = document.getElementById('monthly-salary');
const ageInput = document.getElementById('age');
const pensionInput = document.getElementById('pension');
const raInput = document.getElementById('ra');
const medicalMembersInput = document.getElementById('medical-members');
const taxOutput = document.getElementById('tax-output');
const calculateTaxBtn = document.getElementById('calculate-tax-btn');
const clearTaxBtn = document.getElementById('clear-tax-btn');

// Tax function from you
function calculateTaxSA({ annualSalary, age=30, pensionContribution=0, retirementAnnuity=0, medicalAidMembers=1 }){
    const deductions = pensionContribution + retirementAnnuity;
    let taxableIncome = annualSalary - deductions;
    if(taxableIncome<0) taxableIncome=0;

    const brackets = [
        { threshold: 237100, rate: 0.18, base:0 },
        { threshold: 370500, rate:0.26, base:42678 },
        { threshold: 512800, rate:0.31, base:77364 },
        { threshold: 673000, rate:0.36, base:121910 },
        { threshold: 857900, rate:0.39, base:179940 },
        { threshold: 1817000, rate:0.41, base:251946 },
        { threshold: Infinity, rate:0.45, base:644704 }
    ];

    let tax=0;
    for(let i=0;i<brackets.length;i++){
        if(taxableIncome <= brackets[i].threshold){
            tax = brackets[i].base + (taxableIncome - (brackets[i-1]?.threshold || 0))*brackets[i].rate;
            break;
        }
    }

    const primaryRebate=17478;
    const secondaryRebate= age>=65?9594:0;
    const tertiaryRebate= age>=75?3194:0;
    const totalRebate=primaryRebate+secondaryRebate+tertiaryRebate;

    tax -= totalRebate;
    if(tax<0) tax=0;

    const uif=Math.min(annualSalary,17712)*0.01;
    const netSalary=annualSalary - tax - uif;

    return { taxableIncome, tax: Math.round(tax), uif: Math.round(uif), netSalary: Math.round(netSalary) };
}

calculateTaxBtn.addEventListener('click', ()=>{
    const salary=parseFloat(monthlySalary.value)*12;
    const age=parseInt(ageInput.value);
    const pension=parseFloat(pensionInput.value);
    const ra=parseFloat(raInput.value);
    const medical=parseInt(medicalMembersInput.value);

    const result = calculateTaxSA({ annualSalary:salary, age:age, pensionContribution:pension, retirementAnnuity:ra, medicalAidMembers:medical });

    taxOutput.innerHTML=`<p>Taxable Income: R${result.taxableIncome}</p>
    <p>Tax Payable: R${result.tax}</p>
    <p>UIF: R${result.uif}</p>
    <p>Net Salary: R${result.netSalary}</p>`;
});

clearTaxBtn.addEventListener('click', ()=>{
    monthlySalary.value=''; ageInput.value=''; pensionInput.value=''; raInput.value=''; medicalMembersInput.value='';
    taxOutput.innerHTML='';
});

// ====== PROFILE STATS ======
function updateProfileStats(){
    document.getElementById('profile-bills').textContent = bills.length;
    document.getElementById('profile-expenses').textContent = expenses.length;
    document.getElementById('profile-reminders').textContent = reminders.length;
}

// ====== AI CHAT ======
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

const aiResponses = {
    "hi":"Hi! I'm LIFE-ADMIN. I can help with Reminders, Bills, Expenses, Tax, and more.",
    "hello":"Hello! Ready to organize your life?",
    "how are you":"I'm fine! How are you?",
    "help":"You can ask me to go to any section: 'Go to Tax', 'Set Reminder', 'Help with Bills', etc.",
    "set reminder":"Go to Reminders section and click 'Add Reminder'.",
    "go to tax":"Navigating to Tax section..."; showSection('tax'); return;
};

sendChatBtn.addEventListener('click', ()=>{
    const msg = chatInput.value.toLowerCase();
    if(!msg) return;
    const p = document.createElement('p');
    p.textContent = `You: ${chatInput.value}`;
    chatBox.appendChild(p);

    // AI reply
    let reply = "I'm not sure about that.";
    if(aiResponses[msg]){
        if(typeof aiResponses[msg]==="function"){ aiResponses[msg](); return; }
        reply = aiResponses[msg];
    }

    const aiP = document.createElement('p');
    aiP.textContent = `AI: ${reply}`;
    chatBox.appendChild(aiP);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value='';
});

