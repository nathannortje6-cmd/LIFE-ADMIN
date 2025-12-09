// =====================
// GLOBAL VARIABLES
// =====================
let username = '';
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let bills = JSON.parse(localStorage.getItem('bills')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let profileData = JSON.parse(localStorage.getItem('profileData')) || {name:'Your Name', bio:'Your bio here...', avatar:'default-avatar.png'};

// =====================
// LOGIN
// =====================
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const loginUsername = document.getElementById('login-username');
const usernameDisplay = document.getElementById('username-display');

loginBtn.addEventListener('click', () => {
    const val = loginUsername.value.trim();
    if(val){
        username = val;
        usernameDisplay.textContent = username;
        loginScreen.style.display = 'none';
        showSection('reminders-section');
        renderAllSections();
    }
});

// =====================
// SECTION NAVIGATION
// =====================
function showSection(sectionId){
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    const sec = document.getElementById(sectionId);
    if(sec) sec.style.display = 'block';
}

// =====================
// REMINDERS
// =====================
const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderModal = document.getElementById('reminder-modal');
const saveReminderBtn = document.getElementById('save-reminder');
const closeReminderBtn = document.getElementById('close-reminder');
const reminderList = document.getElementById('reminder-list');

addReminderBtn.addEventListener('click', () => reminderModal.classList.remove('hidden'));
closeReminderBtn.addEventListener('click', () => reminderModal.classList.add('hidden'));

saveReminderBtn.addEventListener('click', () => {
    const title = document.getElementById('reminder-title').value;
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const notes = document.getElementById('reminder-notes').value;
    if(title && date && time){
        reminders.push({title,date,time,notes,notified1min:false,notified2hr:false,notified1day:false,notifiedMorning:false});
        localStorage.setItem('reminders', JSON.stringify(reminders));
        reminderModal.classList.add('hidden');
        renderReminders();
        updateStats();
    }
});

function renderReminders(){
    reminderList.innerHTML = '';
    reminders.forEach((rem,i)=>{
        const li = document.createElement('li');
        li.textContent = `${rem.title} - ${rem.date} ${rem.time} (${rem.notes}) `;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = ()=> { reminders.splice(i,1); localStorage.setItem('reminders', JSON.stringify(reminders)); renderReminders(); updateStats();};
        li.appendChild(delBtn);
        reminderList.appendChild(li);
    });
}

// =====================
// REMINDER NOTIFICATIONS
// =====================
function checkReminders(){
    const now = new Date();
    reminders.forEach(rem => {
        const remDateTime = new Date(`${rem.date}T${rem.time}`);
        const diffMs = remDateTime - now;
        const diffMin = diffMs / (1000*60);

        // 1 minute before
        if(diffMin <= 1 && diffMin > 0 && !rem.notified1min){
            alert(`Reminder (1 min): ${rem.title} - ${rem.notes}`);
            rem.notified1min = true;
        }
        // 2 hours before
        if(diffMin <= 120 && diffMin > 0 && !rem.notified2hr){
            alert(`Reminder (2 hours): ${rem.title} - ${rem.notes}`);
            rem.notified2hr = true;
        }
        // 1 day before
        if(diffMin <= 1440 && diffMin > 0 && !rem.notified1day){
            alert(`Reminder (1 day): ${rem.title} - ${rem.notes}`);
            rem.notified1day = true;
        }
        // On the day morning (8 AM)
        const remMorning = new Date(rem.date + 'T08:00');
        const diffMorningMin = (remMorning - now) / (1000*60);
        if(diffMorningMin <= 1 && diffMorningMin > 0 && !rem.notifiedMorning){
            alert(`Reminder (Today 8AM): ${rem.title} - ${rem.notes}`);
            rem.notifiedMorning = true;
        }
    });
    localStorage.setItem('reminders', JSON.stringify(reminders));
}
setInterval(checkReminders, 60000); // check every minute

// =====================
// BILLS
// =====================
const addBillBtn = document.getElementById('add-bill-btn');
const billModal = document.getElementById('bill-modal');
const saveBillBtn = document.getElementById('save-bill');
const closeBillBtn = document.getElementById('close-bill');
const billList = document.getElementById('bill-list');

addBillBtn.addEventListener('click', () => billModal.classList.remove('hidden'));
closeBillBtn.addEventListener('click', () => billModal.classList.add('hidden'));

saveBillBtn.addEventListener('click', () => {
    const title = document.getElementById('bill-title').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const date = document.getElementById('bill-date').value;
    const notes = document.getElementById('bill-notes').value;
    if(title && amount && date){
        bills.push({title,amount,date,notes});
        localStorage.setItem('bills', JSON.stringify(bills));
        billModal.classList.add('hidden');
        renderBills();
        updateStats();
    }
});

function renderBills(){
    billList.innerHTML = '';
    bills.forEach((bill,i)=>{
        const li = document.createElement('li');
        li.textContent = `${bill.title} - $${bill.amount} (${bill.date}) ${bill.notes} `;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = ()=> { bills.splice(i,1); localStorage.setItem('bills', JSON.stringify(bills)); renderBills(); updateStats();};
        li.appendChild(delBtn);
        billList.appendChild(li);
    });
}

// =====================
// EXPENSES
// =====================
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseModal = document.getElementById('expense-modal');
const saveExpenseBtn = document.getElementById('save-expense');
const closeExpenseBtn = document.getElementById('close-expense');
const expenseList = document.getElementById('expense-list');

addExpenseBtn.addEventListener('click', ()=> expenseModal.classList.remove('hidden'));
closeExpenseBtn.addEventListener('click', ()=> expenseModal.classList.add('hidden'));

saveExpenseBtn.addEventListener('click', ()=>{
    const title = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    if(title && amount){
        expenses.push({title,amount});
        localStorage.setItem('expenses', JSON.stringify(expenses));
        expenseModal.classList.add('hidden');
        renderExpenses();
        updateStats();
    }
});

function renderExpenses(){
    expenseList.innerHTML = '';
    expenses.forEach((exp,i)=>{
        const li = document.createElement('li');
        li.textContent = `${exp.title} - $${exp.amount} `;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = ()=> { expenses.splice(i,1); localStorage.setItem('expenses', JSON.stringify(expenses)); renderExpenses(); updateStats();};
        li.appendChild(delBtn);
        expenseList.appendChild(li);
    });
}

// =====================
// TAX CALCULATOR
// =====================
const calcTaxBtn = document.getElementById('calculate-tax-btn');
calcTaxBtn.addEventListener('click', ()=>{
    const income = parseFloat(document.getElementById('income').value) || 0;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const other = parseFloat(document.getElementById('other-deductions').value) || 0;

    let taxable = income - deductions - other - (dependents*15000);
    let tax = 0;
    if(taxable<=216200) tax = taxable*0.18;
    else if(taxable<=337800) tax = 38916 + (taxable-216200)*0.26;
    else if(taxable<=467500) tax = 70532 + (taxable-337800)*0.31;
    else if(taxable<=613600) tax = 110739 + (taxable-467500)*0.36;
    else if(taxable<=782200) tax = 163335 + (taxable-613600)*0.39;
    else if(taxable<=1656600) tax = 229089 + (taxable-782200)*0.41;
    else tax = 587593 + (taxable-1656600)*0.45;

    document.getElementById('tax-summary').textContent = `Estimated Tax: $${tax.toFixed(2)}`;
    document.getElementById('tax-calculation').textContent = `Taxable Income: $${taxable.toFixed(2)}`;
    document.getElementById('tax-results').classList.remove('hidden');
});

// =====================
// PROFILE
// =====================
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const avatarUpload = document.getElementById('avatar-upload');
const profilePic = document.getElementById('profile-pic');
const editProfileBtn = document.getElementById('edit-profile-btn');

function loadProfile(){
    profileName.textContent = profileData.name;
    profileBio.textContent = profileData.bio;
    profilePic.src = profileData.avatar;
}
editProfileBtn.addEventListener('click', ()=>{
    const newName = prompt('Enter new name', profileData.name);
    const newBio = prompt('Enter new bio', profileData.bio);
    if(newName) profileData.name = newName;
    if(newBio) profileData.bio = newBio;
    localStorage.setItem('profileData', JSON.stringify(profileData));
    loadProfile();
});

avatarUpload.addEventListener('change', ()=>{
    const file = avatarUpload.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => {
            profileData.avatar = reader.result;
            localStorage.setItem('profileData', JSON.stringify(profileData));
            loadProfile();
        };
        reader.readAsDataURL(file);
    }
});
loadProfile();

// =====================
// STATS UPDATE
// =====================
function updateStats(){
    document.getElementById('stat-reminders').textContent = `Reminders: ${reminders.length}`;
    document.getElementById('stat-bills').textContent = `Bills: ${bills.length}`;
    document.getElementById('stat-expenses').textContent = `Expenses: ${expenses.length}`;
}

// =====================
// RENDER ALL SECTIONS
// =====================
function renderAllSections(){
    renderReminders();
    renderBills();
    renderExpenses();
    updateStats();
}

// =====================
// AI CHAT
// =====================
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

const aiResponses = {
    "hi":"Hi! How are you?",
    "how are you":"I'm fine, thank you! How about you?",
    "open reminders":"reminders-section",
    "open bills":"bills-section",
    "open expenses":"expenses-section",
    "open tax":"tax-section",
    "open profile":"profile-section"
};

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e=>{
    if(e.key==='Enter') sendMessage();
});

function sendMessage(){
    const msg = chatInput.value.trim();
    if(!msg) return;
    addChatMessage(`You: ${msg}`);
    chatInput.value = '';

    const lower = msg.toLowerCase();
    let response = aiResponses[lower] || "I'm not sure how to respond to that.";
    if(Object.values(aiResponses).includes(lower)){
        showSection(lower);
        response = `Opening ${lower.replace('-section','')}...`;
    }
    addChatMessage(`AI: ${response}`);
}

function addChatMessage(msg){
    const p = document.createElement('p');
    p.textContent = msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}
