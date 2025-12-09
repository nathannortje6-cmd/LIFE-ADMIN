// -------------------- GLOBAL --------------------
let currentUser = null;
const usersKey = 'lifeadmin-users';
if(!localStorage.getItem(usersKey)) localStorage.setItem(usersKey, JSON.stringify({}));

// -------------------- LOGIN --------------------
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', ()=>{
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if(!username||!password){ alert("Enter username & password"); return; }
    let users = JSON.parse(localStorage.getItem(usersKey));
    if(!users[username]) users[username] = {password, reminders:[], bills:[], expenses:[], profile:{bio:'',pic:''}, tax:{}};
    else if(users[username].password!==password){ alert("Wrong password"); return; }
    currentUser = username;
    showApp();
});

// -------------------- SHOW APP --------------------
function showApp(){
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    loadProfile();
    loadReminders();
    loadBills();
    loadExpenses();
}

// -------------------- SIDEBAR --------------------
const sidebarItems = document.querySelectorAll('.sidebar-item');
const pages = document.querySelectorAll('.page');
sidebarItems.forEach(item=>{
    item.addEventListener('click',()=>{
        sidebarItems.forEach(i=>i.classList.remove('active'));
        item.classList.add('active');
        pages.forEach(p=>p.classList.add('hidden'));
        const page = item.dataset.page;
        document.getElementById(page).classList.remove('hidden');
    });
});
document.getElementById('logoutBtn').addEventListener('click',()=>{
    currentUser=null;
    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});

// -------------------- REMINDERS --------------------
const reminderModal = document.getElementById('reminder-modal');
const addReminderBtn = document.getElementById('add-reminder-btn');
const closeReminderBtn = document.getElementById('close-reminder');
const saveReminderBtn = document.getElementById('save-reminder');

addReminderBtn.addEventListener('click', ()=>reminderModal.classList.remove('hidden'));
closeReminderBtn.addEventListener('click', ()=>reminderModal.classList.add('hidden'));

saveReminderBtn.addEventListener('click', ()=>{
    const title = document.getElementById('reminder-title').value.trim();
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const reason = document.getElementById('reminder-reason').value.trim();
    const instruction = document.getElementById('reminder-instruction').value.trim();
    if(!title||!date||!time){ alert("Fill title/date/time"); return; }

    let users = JSON.parse(localStorage.getItem(usersKey));
    const reminder = {title,date,time,reason,instruction};
    users[currentUser].reminders.push(reminder);
    localStorage.setItem(usersKey, JSON.stringify(users));

    reminderModal.classList.add('hidden');
    document.getElementById('reminder-title').value='';
    document.getElementById('reminder-date').value='';
    document.getElementById('reminder-time').value='';
    document.getElementById('reminder-reason').value='';
    document.getElementById('reminder-instruction').value='';

    loadReminders();
    scheduleReminderNotification(reminder);
});

function loadReminders(){
    const reminderList = document.getElementById('reminder-list');
    reminderList.innerHTML='';
    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].reminders.forEach((r,i)=>{
        const li = document.createElement('li');
        li.innerHTML=`<div>${r.title} | ${r.date} ${r.time} | ${r.reason} | ${r.instruction}</div>`;
        const delBtn = document.createElement('div'); delBtn.textContent='Delete'; delBtn.classList.add('delete-btn');
        delBtn.addEventListener('click', ()=>{
            users[currentUser].reminders.splice(i,1);
            localStorage.setItem(usersKey,JSON.stringify(users));
            loadReminders();
        });
        li.appendChild(delBtn);
        reminderList.appendChild(li);
    });
}

// -------------------- REMINDER NOTIFICATIONS --------------------
function scheduleReminderNotification(reminder){
    const notifTimes=[{minBefore:1440},{minBefore:120},{minBefore:1}];
    notifTimes.forEach(n=>{
        const reminderDateTime=new Date(reminder.date+'T'+reminder.time);
        const notifyTime = reminderDateTime.getTime()-n.minBefore*60000;
        const delay = notifyTime-Date.now();
        if(delay>0){
            setTimeout(()=>{ if(Notification.permission==="granted") new Notification("Reminder: "+reminder.title); }, delay);
        }
    });
}
if(Notification.permission!=="granted") Notification.requestPermission();

// -------------------- PROFILE --------------------
const profilePicInput=document.getElementById('profile-pic');
const profilePreview=document.getElementById('profile-preview');
const bioInput=document.getElementById('bio');

profilePicInput.addEventListener('change', ()=>{
    const file=profilePicInput.files[0];
    const reader=new FileReader();
    reader.onload=()=>{
        profilePreview.src=reader.result;
        let users = JSON.parse(localStorage.getItem(usersKey));
        users[currentUser].profile.pic=reader.result;
        localStorage.setItem(usersKey,JSON.stringify(users));
    };
    if(file) reader.readAsDataURL(file);
});
bioInput.addEventListener('input', ()=>{
    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].profile.bio=bioInput.value;
    localStorage.setItem(usersKey,JSON.stringify(users));
});
function loadProfile(){
    let users = JSON.parse(localStorage.getItem(usersKey));
    bioInput.value=users[currentUser].profile.bio;
    profilePreview.src=users[currentUser].profile.pic||'';
}

// -------------------- BILLS --------------------
const billModal=document.getElementById('bill-modal');
const addBillBtn=document.getElementById('add-bill-btn');
const closeBillBtn=document.getElementById('close-bill');
const saveBillBtn=document.getElementById('save-bill');

addBillBtn.addEventListener('click',()=>billModal.classList.remove('hidden'));
closeBillBtn.addEventListener('click',()=>billModal.classList.add('hidden'));
saveBillBtn.addEventListener('click', ()=>{
    const title=document.getElementById('bill-title').value.trim();
    const amount=document.getElementById('bill-amount').value;
    const date=document.getElementById('bill-date').value;
    const notes=document.getElementById('bill-notes').value.trim();
    if(!title||!amount||!date){ alert("Fill all fields"); return; }

    let users = JSON.parse(localStorage.getItem(usersKey));
    const bill={title,amount,date,notes};
    users[currentUser].bills.push(bill);
    localStorage.setItem(usersKey,JSON.stringify(users));

    billModal.classList.add('hidden');
    document.getElementById('bill-title').value='';
    document.getElementById('bill-amount').value='';
    document.getElementById('bill-date').value='';
    document.getElementById('bill-notes').value='';

    loadBills();
    addExpense(bill.title,bill.amount);
    scheduleBillNotification(bill);
});

function loadBills(){
    const billList = document.getElementById('bill-list');
    billList.innerHTML='';
    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].bills.forEach((b,i)=>{
        const li=document.createElement('li');
        li.innerHTML=`<div>${b.title} | R${b.amount} | ${b.date} | ${b.notes}</div>`;
        const delBtn=document.createElement('div'); delBtn.textContent='Delete'; delBtn.classList.add('delete-btn');
        delBtn.addEventListener('click',()=>{
            users[currentUser].bills.splice(i,1);
            localStorage.setItem(usersKey,JSON.stringify(users));
            loadBills();
            loadExpenses();
        });
        li.appendChild(delBtn);
        billList.appendChild(li);
    });
}

// -------------------- BILL NOTIFICATIONS --------------------
function scheduleBillNotification(bill){
    const notifTimes=[{minBefore:1440},{minBefore:120},{minBefore:1},{minBefore:0}];
    notifTimes.forEach(n=>{
        const billDateTime=new Date(bill.date+'T00:00');
        const notifyTime = billDateTime.getTime()-n.minBefore*60000;
        const delay = notifyTime-Date.now();
        if(delay>0){
            setTimeout(()=>{ if(Notification.permission==="granted") new Notification("Bill Reminder: "+bill.title+" R"+bill.amount); }, delay);
        }
    });
}

// -------------------- EXPENSES --------------------
const expenseModal=document.getElementById('expense-modal');
const addExpenseBtn=document.getElementById('add-expense-btn');
const closeExpenseBtn=document.getElementById('close-expense');
const saveExpenseBtn=document.getElementById('save-expense');

addExpenseBtn.addEventListener('click',()=>expenseModal.classList.remove('hidden'));
closeExpenseBtn.addEventListener('click',()=>expenseModal.classList.add('hidden'));
saveExpenseBtn.addEventListener('click', ()=>{
    const title=document.getElementById('expense-title').value.trim();
    const amount=document.getElementById('expense-amount').value;
    if(!title||!amount){ alert("Fill fields"); return; }
    addExpense(title,amount);
    expenseModal.classList.add('hidden');
    document.getElementById('expense-title').value='';
    document.getElementById('expense-amount').value='';
    loadExpenses();
});

function addExpense(title,amount){
    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].expenses.push({title,amount});
    localStorage.setItem(usersKey,JSON.stringify(users));
}

function loadExpenses(){
    const expenseList=document.getElementById('expense-list');
    expenseList.innerHTML='';
    let users = JSON.parse(localStorage.getItem(usersKey));
    let total=0;
    users[currentUser].expenses.forEach((e,i)=>{
        const li=document.createElement('li');
        li.innerHTML=`<div>${e.title} | R${e.amount}</div>`;
        const delBtn=document.createElement('div'); delBtn.textContent='Delete'; delBtn.classList.add('delete-btn');
        delBtn.addEventListener('click',()=>{
            users[currentUser].expenses.splice(i,1);
            localStorage.setItem(usersKey,JSON.stringify(users));
            loadExpenses();
        });
        li.appendChild(delBtn);
        expenseList.appendChild(li);
        total+=parseFloat(e.amount);
    });
    const totalLi=document.createElement('li');
    totalLi.innerHTML=`<strong>Total Expenses: R${total}</strong>`;
    expenseList.appendChild(totalLi);
}

// -------------------- TAX --------------------
const calcTaxBtn=document.getElementById('calculate-tax');
calcTaxBtn.addEventListener('click',()=>{
    const salary=parseFloat(document.getElementById('tax-salary').value);
    const dependents=parseInt(document.getElementById('tax-dependents').value)||0;
    const deductions=parseFloat(document.getElementById('tax-deductions').value)||0;
    if(!salary){ alert("Enter salary"); return; }
    let taxable = salary*12 - deductions - (dependents*50000);
    if(taxable<0) taxable=0;
    let taxYear = taxable*0.18; // Simple SA approx 18%
    let taxMonth = taxYear/12;
    document.getElementById('tax-result').innerHTML=`Estimated Monthly Tax: R${taxMonth.toFixed(2)} <br> Yearly Tax: R${taxYear.toFixed(2)}`;
    let users = JSON.parse(localStorage.getItem(usersKey));
    users[currentUser].tax={salary,dependents,deductions,taxMonth,taxYear};
    localStorage.setItem(usersKey,JSON.stringify(users));
});

// -------------------- CHAT --------------------
const chatMessages=document.getElementById('chat-messages');
const chatText=document.getElementById('chat-text');
const sendChatBtn=document.getElementById('send-chat');

sendChatBtn.addEventListener('click',sendMessage);
chatText.addEventListener('keypress',(e)=>{ if(e.key==='Enter') sendMessage(); });

function sendMessage(){
    const msg=chatText.value.trim();
    if(!msg) return;
    addChatBubble(msg,'user');
    chatText.value='';
    setTimeout(()=>{ aiResponse(msg); },500);
}

function addChatBubble(msg,type){
    const div=document.createElement('div');
    div.textContent=msg;
    div.classList.add('chat-bubble');
    div.classList.add(type==='user'?'chat-user':'chat-ai');
    chatMessages.appendChild(div);
    chatMessages.scrollTop=chatMessages.scrollHeight;
}

function aiResponse(msg){
    msg=msg.toLowerCase();
    let response="I'm here to help!";
    if(msg.includes('reminder')) response="You can add a reminder using the '+' button in Reminders.";
    else if(msg.includes('bill')) response="Check the Bills page to manage your bills.";
    else if(msg.includes('tax')) response="Go to Taxes page to calculate your tax.";
    else if(msg.includes('expense')) response="Go to Expenses page to see your expenses.";
    else response="I can help you organize your life!";
    addChatBubble(response,'ai');
}
