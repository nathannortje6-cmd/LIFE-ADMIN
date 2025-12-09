// ===== LOGIN ======
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
        alert("Please enter a username!");
    }
});

// ===== NAVIGATION ======
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function showSection(id){
    sections.forEach(sec => sec.style.display='none');
    document.getElementById(id).style.display='block';
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[data-target="${id}"]`).classList.add('active');
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        showSection(target);
    });
});

// ===== REMINDERS ======
const remindersList = document.getElementById('reminders-list');
const addReminderBtn = document.getElementById('add-reminder');
const clearRemindersBtn = document.getElementById('clear-reminders');

function updateReminderStats(){document.getElementById('profile-reminders').textContent = remindersList.children.length;}

addReminderBtn.addEventListener('click', ()=>{
    const title = document.getElementById('reminder-title').value;
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const note = document.getElementById('reminder-note').value;
    if(title && date && time){
        const li = document.createElement('li');
        li.textContent = `${title} - ${date} ${time} - ${note}`;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', ()=>{li.remove(); updateReminderStats();});
        li.appendChild(del);
        remindersList.appendChild(li);
        alert("Reminder set!");
        updateReminderStats();
    } else { alert("Please fill title, date, and time"); }
});

clearRemindersBtn.addEventListener('click', ()=>{
    remindersList.innerHTML = '';
    updateReminderStats();
});

// ===== BILLS ======
const billsList = document.getElementById('bills-list');
document.getElementById('add-bill').addEventListener('click', ()=>{
    const name = document.getElementById('bill-name').value;
    const amount = document.getElementById('bill-amount').value;
    const due = document.getElementById('bill-due').value;
    if(name && amount && due){
        const li = document.createElement('li');
        li.textContent = `${name} - R${amount} - ${due}`;
        const del = document.createElement('button');
        del.textContent='Delete';
        del.addEventListener('click', ()=>{li.remove(); updateBillStats();});
        li.appendChild(del);
        billsList.appendChild(li);
        updateBillStats();
    } else { alert("Fill all bill fields"); }
});

function updateBillStats(){document.getElementById('profile-bills').textContent = billsList.children.length;}

// ===== EXPENSES ======
const expensesList = document.getElementById('expenses-list');
document.getElementById('add-expense').addEventListener('click', ()=>{
    const name = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;
    if(name && amount){
        const li = document.createElement('li');
        li.textContent = `${name} - R${amount}`;
        const del = document.createElement('button');
        del.textContent='Delete';
        del.addEventListener('click', ()=>{li.remove(); updateExpenseStats();});
        li.appendChild(del);
        expensesList.appendChild(li);
        updateExpenseStats();
    } else { alert("Fill expense fields"); }
});

function updateExpenseStats(){document.getElementById('profile-expenses').textContent = expensesList.children.length;}

// ===== TAX (SA 2025/2026) ======
function calculateTaxSA({annualSalary, age=30, pensionContribution=0, retirementAnnuity=0, medicalAidMembers=1}){
    const deductions = Number(pensionContribution)+Number(retirementAnnuity);
    let taxableIncome = annualSalary - deductions;
    if(taxableIncome<0) taxableIncome=0;
    const brackets = [
        { threshold: 237100, rate:0.18, base:0},
        { threshold: 370500, rate:0.26, base:42678},
        { threshold: 512800, rate:0.31, base:77364},
        { threshold: 673000, rate:0.36, base:121910},
        { threshold: 857900, rate:0.39, base:179940},
        { threshold: 1817000, rate:0.41, base:251946},
        { threshold: Infinity, rate:0.45, base:644704}
    ];
    let tax=0;
    for(let i=0;i<brackets.length;i++){
        if(taxableIncome<=brackets[i].threshold){
            tax = brackets[i].base + (taxableIncome - (brackets[i-1]?.threshold||0))*brackets[i].rate;
            break;
        }
    }
    const primaryRebate = 17478;
    const secondaryRebate = age>=65?9594:0;
    const tertiaryRebate = age>=75?3194:0;
    const totalRebate = primaryRebate + secondaryRebate + tertiaryRebate;
    tax -= totalRebate;
    if(tax<0) tax=0;
    const uif = Math.min(annualSalary,17712)*0.01;
    const netSalary = annualSalary - tax - uif;
    return {taxableIncome:Math.round(taxableIncome), tax:Math.round(tax), uif:Math.round(uif), netSalary:Math.round(netSalary)};
}

document.getElementById('calculate-tax').addEventListener('click', ()=>{
    const salary = Number(document.getElementById('salary').value);
    const age = Number(document.getElementById('age').value);
    const pension = Number(document.getElementById('pension').value);
    const retirement = Number(document.getElementById('retirement').value);
    const medical = Number(document.getElementById('medical-members').value);
    if(!salary) return alert("Enter salary!");
    const result = calculateTaxSA({annualSalary:salary, age, pensionContribution:pension, retirementAnnuity:retirement, medicalAidMembers:medical});
    document.getElementById('tax-result').innerHTML = `
        <p>Taxable Income: R${result.taxableIncome}</p>
        <p>Tax Payable: R${result.tax}</p>
        <p>UIF: R${result.uif}</p>
        <p>Net Salary: R${result.netSalary}</p>
    `;
});

document.getElementById('clear-tax').addEventListener('click', ()=>{
    document.getElementById('salary').value='';
    document.getElementById('pension').value='';
    document.getElementById('retirement').value='';
    document.getElementById('medical-members').value=1;
    document.getElementById('age').value='';
    document.getElementById('tax-result').innerHTML='';
});

// ===== AI CHAT ======
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');

const botReplies = {
    "hi": "Hi! I'm LIFE-ADMIN. I can help you with reminders, bills, expenses, tax, and more.",
    "hello": "Hello! How can I assist you today?",
    "how are you": "I'm fine, thank you! How about you?",
    "help with tax": ()=>showSection('tax'),
    "help with reminders": ()=>showSection('reminders'),
    "help with bills": ()=>showSection('bills'),
    "help with expenses": ()=>showSection('expenses')
};

sendChat.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e)=>{if(e.key==='Enter') sendMessage();});

function sendMessage(){
    const msg = chatInput.value.trim();
    if(!msg) return;
    const userP = document.createElement('p');
    userP.textContent = `You: ${msg}`;
    chatBox.appendChild(userP);

    let response = botReplies[msg.toLowerCase()] || "I don't understand. You can ask for help!";
    if(typeof response==='function') response = response();
    else{
        const botP = document.createElement('p');
        botP.textContent = `LIFE-ADMIN: ${response}`;
        chatBox.appendChild(botP);
    }

    chatInput.value='';
    chatBox.scrollTop = chatBox.scrollHeight;
}
