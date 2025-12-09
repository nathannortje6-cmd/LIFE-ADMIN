// GLOBAL VARIABLES
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const appContainer = document.getElementById('app-container');
let currentUser = null;

const sidebarItems = document.querySelectorAll('.sidebar-item');
const pages = document.querySelectorAll('.page');
const logoutBtn = document.getElementById('logoutBtn');

// REMINDERS MODAL
const reminderModal = document.getElementById('reminder-modal');
const addReminderBtn = document.getElementById('add-reminder-btn');
const closeReminderBtn = document.getElementById('close-reminder');
const saveReminderBtn = document.getElementById('save-reminder');

const reminderList = document.getElementById('reminder-list');
const reminderTitle = document.getElementById('reminder-title');
const reminderDate = document.getElementById('reminder-date');
const reminderTime = document.getElementById('reminder-time');
const reminderReason = document.getElementById('reminder-reason');
const reminderInstruction = document.getElementById('reminder-instruction');

// CHAT
const chatMessages = document.getElementById('chat-messages');
const chatText = document.getElementById('chat-text');
const sendChatBtn = document.getElementById('send-chat');

// PROFILE
const profilePicInput=document.getElementById('profile-pic');
const profilePreview=document.getElementById('profile-preview');
const bioInput=document.getElementById('bio');

// --------------------
// INIT LOCALSTORAGE
// --------------------
if (!localStorage.getItem('lifeadmin-users')) {
    localStorage.setItem('lifeadmin-users', JSON.stringify({}));
}

// --------------------
// LOGIN
// --------------------
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if(!username || !password){ alert("Enter username and password"); return; }

    let users = JSON.parse(localStorage.getItem('lifeadmin-users'));
    if(!users[username]){
        users[username] = { password, reminders:[], chat:[], profile:{bio:'',pic:''}, bills:[], taxes:[], emails:[] };
    } else if(users[username].password !== password){ alert("Wrong password"); return; }

    localStorage.setItem('lifeadmin-users', JSON.stringify(users));
    currentUser = username;
    showApp();
});

// --------------------
// SHOW APP
// --------------------
function showApp(){
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');

    let users = JSON.parse(localStorage.getItem('lifeadmin-users'));
    if(!users[currentUser]){ alert("User not found"); return; }

    loadProfile(); loadReminders(); loadEmails(); loadBills(); loadTaxes(); loadStats();
}

// --------------------
// SIDEBAR NAV
// --------------------
sidebarItems.forEach(item=>{
    item.addEventListener('click', ()=>{
        sidebarItems.forEach(i=>i.classList.remove('active'));
        item.classList.add('active');
        const page = item.dataset.page;
        pages.forEach(p=>p.classList.add('hidden'));
        if(page) document.getElementById(page).classList.remove('hidden');
    });
});

logoutBtn.addEventListener('click', ()=>{
    currentUser=null;
    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});

// --------------------
// REMINDERS
// --------------------
addReminderBtn.addEventListener('click', ()=>reminderModal.classList.remove('hidden'));
closeReminderBtn.addEventListener('click', ()=>reminderModal.classList.add('hidden'));
saveReminderBtn.addEventListener('click', ()=>{
    const title=reminderTitle.value.trim();
    const date=reminderDate.value;
    const time=reminderTime.value;
    const reason=reminderReason.value.trim();
    const instruction=reminderInstruction.value.trim();
    if(!title||!date||!time){ alert("Fill Title, Date, Time"); return; }

    let users=JSON.parse(localStorage.getItem('lifeadmin-users'));
    const reminder={title,date,time,reason,instruction,done:false};
    users[currentUser].reminders.push(reminder);
    localStorage.setItem('lifeadmin-users',JSON.stringify(users));

    reminderModal.classList.add('hidden');
    reminderTitle.value=''; reminderDate.value=''; reminderTime.value=''; reminderReason.value=''; reminderInstruction.value='';
    
    loadReminders();
    scheduleReminderNotification(reminder);
});

function loadReminders(){
    reminderList.innerHTML='';
    let users = JSON.parse(localStorage.getItem('lifeadmin-users'));
    if(!users[currentUser].reminders) users[currentUser].reminders=[];
    users[currentUser].reminders.forEach((r,i)=>{
        const li=document.createElement('li');
        li.innerHTML=`<div>${r.title} | ${r.date} ${r.time} | ${r.reason} | ${r.instruction}</div>`;
        const delBtn=document.createElement('div'); delBtn.textContent='Delete'; delBtn.classList.add('reminder-delete');
        delBtn.addEventListener('click',()=>{
            users[currentUser].reminders.splice(i,1);
            localStorage.setItem('lifeadmin-users',JSON.stringify(users));
            loadReminders(); loadStats();
        });
        li.appendChild(delBtn);
        reminderList.appendChild(li);
    });
}

// --------------------
// REMINDER NOTIFICATIONS
// --------------------
function scheduleReminderNotification(reminder){
    const notifTimes=[{minBefore:1440,message:"1 day left: "+reminder.title},{minBefore:120,message:"2 hours left: "+reminder.title},{minBefore:1,message:"1 min left: "+reminder.title}];
    notifTimes.forEach(n=>{
        const reminderDateTime=new Date(reminder.date+'T'+reminder.time);
        const notifyTime=reminderDateTime.getTime()-n.minBefore*60000;
        const delay=notifyTime-Date.now();
        if(delay>0){
            setTimeout(()=>{ if(Notification.permission==="granted") new Notification("LIFE-ADMIN Reminder",{body:n.message}); }, delay);
        }
    });
}
if(Notification.permission!=="granted"){ Notification.requestPermission(); }

// --------------------
// PROFILE
// --------------------
profilePicInput.addEventListener('change', ()=>{
    const file=profilePicInput.files[0];
    const reader=new FileReader();
    reader.onload=()=>{
        profilePreview.src=reader.result;
        let users=JSON.parse(localStorage.getItem('lifeadmin-users'));
        users[currentUser].profile.pic=reader.result;
        localStorage.setItem('lifeadmin-users',JSON.stringify(users));
    }
    if(file) reader.readAsDataURL(file);
});
bioInput.addEventListener('input', ()=>{
    let users=JSON.parse(localStorage.getItem('lifeadmin-users'));
    users[currentUser].profile.bio=bioInput.value;
    localStorage.setItem('lifeadmin-users',JSON.stringify(users));
});
function loadProfile(){
    let users=JSON.parse(localStorage.getItem('lifeadmin-users'));
    if(!users[currentUser].profile) users[currentUser].profile={bio:'',pic:''};
    bioInput.value=users[currentUser].profile.bio;
    profilePreview.src=users[currentUser].profile.pic||'';
}

// --------------------
// STATS
// --------------------
function loadStats(){
    let users=JSON.parse(localStorage.getItem('lifeadmin-users'));
    const remindersCount = users[currentUser].reminders ? users[currentUser].reminders.length : 0;
    const completedCount = users[currentUser].reminders ? users[currentUser].reminders.filter(r=>r.done).length : 0;
    document.getElementById('stat-reminders').textContent="Reminders: "+remindersCount;
    document.getElementById('stat-tasks').textContent="Completed Tasks: "+completedCount;
}

// --------------------
// AI CHAT
// --------------------
sendChatBtn.addEventListener('click', sendChat);
chatText.addEventListener('keypress', e=>{if(e.key==='Enter') sendChat();});
function sendChat(){
    const text=chatText.value.trim(); if(!text) return;
    appendChatMessage(text,'user'); chatText.value='';
    setTimeout(()=>{ appendChatMessage("AI Suggestion: You could add '"+text+"' as a reminder!",'ai'); },500);
}
function appendChatMessage(text,type){
    const div=document.createElement('div'); div.classList.add('chat-bubble',type==='user'?'chat-user':'chat-ai');
    div.textContent=text; chatMessages.appendChild(div); chatMessages.scrollTop=chatMessages.scrollHeight;
}

// --------------------
// EMAILS / BILLS / TAXES
// --------------------
function loadEmails(){ const emails=[{from:"bank@bank.com",subject:"Statement Ready"},{from:"tax@government.com",subject:"Tax Reminder"}]; const ul=document.getElementById('email-list'); ul.innerHTML=''; emails.forEach(e=>{ const li=document.createElement('li'); li.textContent=`${e.subject} | ${e.from}`; ul.appendChild(li); }); }
function loadBills(){ const bills=[{title:"Electricity",amount:"R800",due:"2025-12-15"},{title:"Water",amount:"R200",due:"2025-12-10"}]; const ul=document.getElementById('bill-list'); ul.innerHTML=''; bills.forEach(b=>{ const li=document.createElement('li'); li.textContent=`${b.title} - ${b.amount} | Due: ${b.due}`; ul.appendChild(li); }); }
function loadTaxes(){ const taxes=[{title:"Income Tax",amount:"R5000",due:"2025-12-31"}]; const ul=document.getElementById('tax-list'); ul.innerHTML=''; taxes.forEach(t=>{ const li=document.createElement('li'); li.textContent=`${t.title} - ${t.amount} | Due: ${t.due}`; ul.appendChild(li); }); }
