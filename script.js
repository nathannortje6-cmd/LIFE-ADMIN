/* ============================= */
/* LIFE-ADMIN APP - FULL SCRIPT  */
/* ============================= */

/* -------------- USER LOGIN --------------- */
let currentUser = localStorage.getItem('currentUser');
const usersKey = 'lifeAdminUsers';

// Simple user system
function createUser(username) {
    let users = JSON.parse(localStorage.getItem(usersKey)) || {};
    if (!users[username]) {
        users[username] = { bills: [], expenses: [], reminders: [] };
        localStorage.setItem(usersKey, JSON.stringify(users));
    }
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loadAllData();
}

// ------------------ BILLS ------------------
const billModal = document.getElementById('bill-modal');
document.getElementById('add-bill-btn').onclick = () => billModal.classList.remove('hidden');
document.getElementById('close-bill').onclick = () => billModal.classList.add('hidden');

document.getElementById('save-bill').onclick = () => {
    const t = document.getElementById('bill-title').value.trim();
    const a = parseFloat(document.getElementById('bill-amount').value);
    const d = document.getElementById('bill-date').value;
    const n = document.getElementById('bill-notes').value.trim();
    if (!t || !a || !d) { alert("Fill all fields"); return; }

    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].bills.push({ title: t, amount: a, date: d, notes: n });
    users[currentUser].expenses.push({ title: t, amount: a, type: 'bill' });
    localStorage.setItem(usersKey, JSON.stringify(users));

    billModal.classList.add('hidden');
    loadBills();
    loadExpenses();
    scheduleBillNotifications({ title: t, date: d });
};

function loadBills() {
    const ul = document.getElementById('bill-list');
    ul.innerHTML = '';
    const userData = JSON.parse(localStorage.getItem(usersKey))[currentUser];
    userData.bills.forEach((b, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<div>${b.title} | R${b.amount.toFixed(2)} | Due: ${b.date}</div>`;
        const del = document.createElement('div');
        del.textContent = 'Delete';
        del.classList.add('delete-btn');
        del.onclick = () => {
            let users = JSON.parse(localStorage.getItem(usersKey));
            users[currentUser].bills.splice(i, 1);
            users[currentUser].expenses = users[currentUser].expenses.filter(e => !(e.type==='bill' && e.title===b.title));
            localStorage.setItem(usersKey, JSON.stringify(users));
            loadBills();
            loadExpenses();
        };
        li.appendChild(del);
        ul.appendChild(li);
    });
}

// ------------------ EXPENSES ------------------
const expenseModal = document.getElementById('expense-modal');
document.getElementById('add-expense-btn').onclick = () => expenseModal.classList.remove('hidden');
document.getElementById('close-expense').onclick = () => expenseModal.classList.add('hidden');

document.getElementById('save-expense').onclick = () => {
    const t = document.getElementById('expense-title').value.trim();
    const a = parseFloat(document.getElementById('expense-amount').value);
    if (!t || !a) { alert("Fill all fields"); return; }

    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].expenses.push({ title: t, amount: a, type: 'manual' });
    localStorage.setItem(usersKey, JSON.stringify(users));

    expenseModal.classList.add('hidden');
    loadExpenses();
};

function loadExpenses() {
    const ul = document.getElementById('expense-list');
    ul.innerHTML = '';
    const userData = JSON.parse(localStorage.getItem(usersKey))[currentUser];
    let total = 0;
    userData.expenses.forEach((e,i)=>{
        const li = document.createElement('li');
        li.innerHTML = `<div>${e.title} | R${e.amount.toFixed(2)}</div>`;
        const del = document.createElement('div'); del.textContent='Delete'; del.classList.add('delete-btn');
        del.onclick = ()=>{
            let users = JSON.parse(localStorage.getItem(usersKey));
            users[currentUser].expenses.splice(i,1);
            localStorage.setItem(usersKey, JSON.stringify(users));
            loadExpenses();
        };
        li.appendChild(del);
        ul.appendChild(li);
        total += parseFloat(e.amount);
    });
    const totli = document.createElement('li');
    totli.innerHTML = `<strong>Total Expenses: R${total.toFixed(2)}</strong>`;
    ul.appendChild(totli);
}

// ------------------ REMINDERS ------------------
const reminderModal = document.getElementById('reminder-modal');
document.getElementById('add-reminder-btn').onclick = () => reminderModal.classList.remove('hidden');
document.getElementById('close-reminder').onclick = () => reminderModal.classList.add('hidden');

document.getElementById('save-reminder').onclick = () => {
    const t = document.getElementById('reminder-title').value.trim();
    const d = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    if(!t || !d || !time){ alert("Fill all fields"); return; }

    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].reminders.push({ title: t, date: d, time: time });
    localStorage.setItem(usersKey, JSON.stringify(users));

    reminderModal.classList.add('hidden');
    loadReminders();
    scheduleReminder({ title:t, date:d, time:time });
};

function loadReminders(){
    const ul = document.getElementById('reminder-list');
    ul.innerHTML='';
    const userData = JSON.parse(localStorage.getItem(usersKey))[currentUser];
    userData.reminders.forEach((r,i)=>{
        const li=document.createElement('li');
        li.innerHTML=`<div>${r.title} | ${r.date} ${r.time}</div>`;
        const del=document.createElement('div'); del.textContent='Delete'; del.classList.add('delete-btn');
        del.onclick=()=>{
            let users=JSON.parse(localStorage.getItem(usersKey));
            users[currentUser].reminders.splice(i,1);
            localStorage.setItem(usersKey, JSON.stringify(users));
            loadReminders();
        };
        li.appendChild(del);
        ul.appendChild(li);
    });
}

function scheduleReminder(reminder){
    const dateTime=new Date(`${reminder.date}T${reminder.time}`);
    const now=new Date();
    const diff=dateTime-now;
    if(diff>0){
        // Notification 1 minute before
        setTimeout(()=>alert(`Reminder: ${reminder.title} (1 min before)`), diff-60000);
        // Notification 2 hours before
        if(diff>7200000)setTimeout(()=>alert(`Reminder: ${reminder.title} (2 hours before)`), diff-7200000);
        // Notification on the time
        setTimeout(()=>alert(`Reminder: ${reminder.title} NOW!`), diff);
    }
}

function scheduleBillNotifications(bill){
    const dateTime=new Date(`${bill.date}T08:00`); // Notify at 8AM by default
    const now=new Date();
    const diff=dateTime-now;
    if(diff>0)setTimeout(()=>alert(`Bill due: ${bill.title} (R${bill.amount})`), diff);
}

// ------------------ AI CHAT ------------------
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatBox = document.getElementById('chat-box');

chatSend.onclick = () => handleUserMessage();
chatInput.addEventListener('keypress', e => { if(e.key==='Enter') handleUserMessage(); });

function handleUserMessage(){
    const msg=chatInput.value.trim();
    if(!msg)return;
    appendMessage('user',msg);
    chatInput.value='';

    // Command recognition
    const lower = msg.toLowerCase();
    if(lower.includes('go to bills')){ showSection('bills-section'); appendMessage('ai','Opening Bills...'); return; }
    if(lower.includes('show expenses')){ showSection('expenses-section'); appendMessage('ai','Opening Expenses...'); return; }
    if(lower.includes('set reminder')){ reminderModal.classList.remove('hidden'); appendMessage('ai','Opening Reminder Modal...'); return; }

    // Normal conversation (simple local AI)
    let aiResponse = generateAIResponse(msg);
    setTimeout(()=>appendMessage('ai',aiResponse), 500); // simulate thinking
}

function appendMessage(sender,text){
    const div=document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.textContent=text;
    chatBox.appendChild(div);
    chatBox.scrollTop=chatBox.scrollHeight;
}

function showSection(id){
    document.querySelectorAll('section').forEach(s=>s.style.display='none');
    document.getElementById(id).style.display='block';
}

// Simple local AI responses
function generateAIResponse(msg){
    const responses=[
        "Interesting, tell me more.",
        "I see. Can you explain further?",
        "Got it! Anything else you want me to do?",
        "Hmm, let's think about that.",
        "Understood. I can help with that!"
    ];
    return responses[Math.floor(Math.random()*responses.length)];
}

// ------------------ LOAD ALL DATA ------------------
function loadAllData(){
    loadBills();
    loadExpenses();
    loadReminders();
}

// ------------------ INITIAL LOAD ------------------
document.addEventListener('DOMContentLoaded',()=>{
    if(currentUser)loadAllData();
});
