// GLOBAL
const usersKey = 'lifeadmin-users';
if (!localStorage.getItem(usersKey)) localStorage.setItem(usersKey, JSON.stringify({}));
let currentUser = null;

// LOGIN
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', loginHandler);

function loginHandler(){
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  if (!u || !p) { alert("Enter username & password"); return; }
  let users = JSON.parse(localStorage.getItem(usersKey));
  if (!users[u]) {
    users[u] = { password: p, reminders: [], bills: [], expenses: [], profile: { bio:'', pic:'' }, tax: {} };
  } else if (users[u].password !== p) {
    alert("Wrong password"); return;
  }
  localStorage.setItem(usersKey, JSON.stringify(users));
  currentUser = u;
  showApp();
}

function showApp(){
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-container').classList.remove('hidden');
  loadProfile();
  loadReminders();
  loadBills();
  loadExpenses();
  goToPage('reminders-page');
}

// NAVIGATION
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(it => it.addEventListener('click', ()=> {
  sidebarItems.forEach(i=>i.classList.remove('active'));
  it.classList.add('active');
  goToPage(it.dataset.page);
}));
document.getElementById('logoutBtn').addEventListener('click', ()=>{
  location.reload();
});

function goToPage(pageId){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  const pg = document.getElementById(pageId);
  if (pg) pg.classList.remove('hidden');
}

// -------------------- REMINDERS --------------------
const reminderModal = document.getElementById('reminder-modal');
document.getElementById('add-reminder-btn').addEventListener('click', ()=>reminderModal.classList.remove('hidden'));
document.getElementById('close-reminder').addEventListener('click', ()=>reminderModal.classList.add('hidden'));
document.getElementById('save-reminder').addEventListener('click', ()=>{
  const t = document.getElementById('reminder-title').value.trim();
  const d = document.getElementById('reminder-date').value;
  const ti= document.getElementById('reminder-time').value;
  const r = document.getElementById('reminder-reason').value.trim();
  const ins = document.getElementById('reminder-instruction').value.trim();
  if (!t || !d || !ti) { alert("Fill title, date, time"); return; }
  let users = JSON.parse(localStorage.getItem(usersKey));
  users[currentUser].reminders.push({ title: t, date: d, time: ti, reason: r, instruction: ins });
  localStorage.setItem(usersKey, JSON.stringify(users));
  reminderModal.classList.add('hidden');
  loadReminders();
  scheduleReminderNotifications({title:t, date:d, time:ti});
});
function loadReminders(){
  const ul = document.getElementById('reminder-list');
  ul.innerHTML = '';
  let u = JSON.parse(localStorage.getItem(usersKey))[currentUser];
  u.reminders.forEach((r,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${r.title} | ${r.date} ${r.time} | ${r.reason}</div>`;
    const del = document.createElement('div'); del.textContent='Delete'; del.classList.add('delete-btn');
    del.onclick = ()=>{
      u.reminders.splice(i,1);
      localStorage.setItem(usersKey, JSON.stringify(JSON.parse(localStorage.getItem(usersKey))));
      loadReminders();
    };
    li.appendChild(del);
    ul.appendChild(li);
  });
}
function scheduleReminderNotifications(rem){
  const times = [1440, 120, 1, 0];
  times.forEach(mb => {
    const dt = new Date(rem.date+'T'+rem.time).getTime() - mb*60000;
    const now = Date.now();
    const delay = dt - now;
    if (delay > 0) {
      setTimeout(()=>{ 
        if (Notification.permission==="granted") 
          new Notification("Reminder: "+rem.title); 
      }, delay);
    }
  });
}
if (Notification.permission !== "granted") Notification.requestPermission();

// -------------------- BILLS & EXPENSES --------------------
const billModal = document.getElementById('bill-modal');
document.getElementById('add-bill-btn').onclick = ()=>billModal.classList.remove('hidden');
document.getElementById('close-bill').onclick = ()=>billModal.classList.add('hidden');
document.getElementById('save-bill').onclick = ()=>{
  const t = document.getElementById('bill-title').value.trim();
  const a = parseFloat(document.getElementById('bill-amount').value);
  const d = document.getElementById('bill-date').value;
  const n = document.getElementById('bill-notes').value.trim();
  if (!t || !a || !d) { alert("Fill fields"); return; }
  let users = JSON.parse(localStorage.getItem(usersKey));
  const bill = {title:t, amount:a, date:d, notes:n};
  users[currentUser].bills.push(bill);
  users[currentUser].expenses.push({title:t, amount:a, type:'bill'});
  localStorage.setItem(usersKey, JSON.stringify(users));
  billModal.classList.add('hidden');
  loadBills(); loadExpenses();
  scheduleBillNotifications(bill);
};
function loadBills(){
  const ul = document.getElementById('bill-list');
  ul.innerHTML = '';
  let u = JSON.parse(localStorage.getItem(usersKey))[currentUser];
  u.bills.forEach((b,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${b.title} | R${b.amount} | Due: ${b.date}</div>`;
    const del = document.createElement('div'); del.textContent='Delete'; del.classList.add('delete-btn');
    del.onclick = ()=>{
      u.bills.splice(i,1);
      localStorage.setItem(usersKey, JSON.stringify(JSON.parse(localStorage.getItem(usersKey))));
      loadBills(); loadExpenses();
    };
    li.appendChild(del);
    ul.appendChild(li);
  });
}
function scheduleBillNotifications(b){
  const times = [1440, 120, 1, 0];
  times.forEach(mb=>{
    const dt = new Date(b.date+'T00:00').getTime() - mb*60000;
    const now = Date.now();
    const delay = dt - now;
    if(delay>0){
      setTimeout(()=>{ 
        if(Notification.permission==="granted") 
          new Notification("Bill Due: "+b.title+" R"+b.amount); 
      }, delay);
    }
  });
}

const expenseModal = document.getElementById('expense-modal');
document.getElementById('add-expense-btn').onclick = ()=>expenseModal.classList.remove('hidden');
document.getElementById('close-expense').onclick = ()=>expenseModal.classList.add('hidden');
document.getElementById('save-expense').onclick = ()=>{
  const t = document.getElementById('expense-title').value.trim();
  const a = parseFloat(document.getElementById('expense-amount').value);
  if(!t || !a){ alert("Fill fields"); return; }
  let users = JSON.parse(localStorage.getItem(usersKey));
  users[currentUser].expenses.push({title:t, amount:a, type:'manual'});
  localStorage.setItem(usersKey, JSON.stringify(users));
  expenseModal.classList.add('hidden');
  loadExpenses();
};
function loadExpenses(){
  const ul = document.getElementById('expense-list');
  ul.innerHTML = '';
  let u = JSON.parse(localStorage.getItem(usersKey))[currentUser];
  let total = 0;
  u.expenses.forEach((e,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${e.title} | R${e.amount}</div>`;
    const del = document.createElement('div'); del.textContent='Delete'; del.classList.add('delete-btn');
    del.onclick = ()=>{
      u.expenses.splice(i,1);
      localStorage.setItem(usersKey, JSON.stringify(JSON.parse(localStorage.getItem(usersKey))));
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

// -------------------- TAX CALCULATOR --------------------
document.getElementById('calculate-tax').onclick = calculateTaxDetailed;

function calculateTaxDetailed(){
  const sal = parseFloat(document.getElementById('tax-salary').value) || 0;
  const bonuses = parseFloat(document.getElementById('tax-bonuses').value) || 0;
  const pension = parseFloat(document.getElementById('tax-pension').value) || 0;
  const medical = parseFloat(document.getElementById('tax-medical').value) || 0;
  const other = parseFloat(document.getElementById('tax-otherded').value) || 0;
  const deps = parseInt(document.getElementById('tax-dependents').value) || 0;

  const grossAnnual = sal*12 + bonuses;
  const deductionTotal = pension + medical + other + (deps * 50000);
  let taxable = grossAnnual - deductionTotal;
  if(taxable<0) taxable=0;

  // SARS 2025/26 approx brackets
  const brackets = [
    { limit: 237100, rate: 0.18, base: 0 },
    { limit: 370500, rate: 0.26, base: 42678 },
    { limit: 512800, rate: 0.31, base: 77362 },
    { limit: 673000, rate: 0.36, base: 121475 },
    { limit: 857900, rate: 0.39, base: 179147 },
    { limit: 1817000, rate: 0.41, base: 251258 },
    { limit: Infinity, rate: 0.45, base: 644489 }
  ];
  let taxPayable = 0;
  for (let br of brackets){
    if (taxable <= br.limit){
      taxPayable = br.base + br.rate * (taxable - (br.limit - (br.limit - (taxable <= br.limit ? (taxable - (br.limit - (br.limit - taxable))) : 0))));
      break;
    }
  }
  const rebate = 17235;
  let netAnnualTax = taxPayable - rebate;
  if(netAnnualTax<0) netAnnualTax=0;
  const netMonthlyTax = netAnnualTax / 12;

  document.getElementById('tax-result').innerHTML = `
    <strong>Gross Annual Income:</strong> R${grossAnnual.toFixed(2)}<br>
    <strong>Total Deductions:</strong> R${deductionTotal.toFixed(2)}<br>
    <strong>Taxable Income:</strong> R${taxable.toFixed(2)}<br>
    <strong>Tax before rebate:</strong> R${taxPayable.toFixed(2)}<br>
    <strong>Rebate:</strong> R${rebate}<br>
    <hr>
    <strong>Net Annual Tax:</strong> <span style="color:#00c8ff;">R${netAnnualTax.toFixed(2)}</span><br>
    <strong>Monthly approx:</strong> <span style="color:#00c8ff;">R${netMonthlyTax.toFixed(2)}</span>
  `;

  let users = JSON.parse(localStorage.getItem(usersKey));
  users[currentUser].tax = { grossAnnual, deductionTotal, taxable, netAnnualTax, netMonthlyTax };
  localStorage.setItem(usersKey, JSON.stringify(users));
}

// -------------------- AI Chat + Commands --------------------
const sendChatBtn = document.getElementById('send-chat');
const chatText = document.getElementById('chat-text');
const chatMessages = document.getElementById('chat-messages');

sendChatBtn.addEventListener('click', handleUserMsg);
chatText.addEventListener('keypress', e=>{ if(e.key==='Enter') handleUserMsg(); });

function handleUserMsg(){
  const msg = chatText.value.trim();
  if(!msg) return;
  addChat('user', msg);
  chatText.value = '';
  setTimeout(()=>processAI(msg.toLowerCase()), 300);
}

function addChat(type, text){
  const div = document.createElement('div');
  div.classList.add('chat-bubble', type==='user'?'chat-user':'chat-ai');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processAI(msg){
  // Simple command parsing
  if(msg.startsWith('go to ')){
    const page = msg.slice(6).trim() + '-page';
    const el = document.getElementById(page);
    if(el){
      goToPage(page);
      addChat('ai', `Navigating to ${msg.slice(6).trim()} page.`);
      return;
    }
  }
  if(msg.startsWith('set reminder')){
    // Format: set reminder: Buy groceries / 2025-12-10 14:00 / groceries
    const parts = msg.split('/');
    if(parts.length >= 3){
      const title = parts[0].replace('set reminder','').trim();
      const date = parts[1].trim();
      const time = parts[2].trim();
      let users = JSON.parse(localStorage.getItem(usersKey));
      users[currentUser].reminders.push({ title, date, time, reason:'', instruction:'' });
      localStorage.setItem(usersKey, JSON.stringify(users));
      loadReminders();
      scheduleReminderNotifications({title, date, time});
      addChat('ai', `Reminder "${title}" set for ${date} ${time}.`);
      return;
    }
  }
  if(msg.includes('calculate tax')){
    document.getElementById('calculate-tax').click();
    addChat('ai', 'Calculating your tax now…');
    return;
  }
  // Default
  addChat('ai', "I can help you manage bills, reminders, taxes and expenses. Try commands like 'go to bills', 'set reminder ...', or 'calculate tax'.");
}
