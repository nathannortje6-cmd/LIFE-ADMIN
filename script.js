// ---------------------------
// GLOBAL VARIABLES
// ---------------------------
let username = "";
let reminders = [];
let bills = [];
let expenses = [];
let deductions = [];

// SARS tax brackets example (monthly)
const taxBrackets = [
    { upTo: 237100/12, rate: 0.18 },
    { upTo: 370500/12, rate: 0.26 },
    { upTo: 512800/12, rate: 0.31 },
    { upTo: 673000/12, rate: 0.36 },
    { upTo: 857900/12, rate: 0.39 },
    { upTo: 1817000/12, rate: 0.41 },
    { upTo: Infinity, rate: 0.45 }
];

// ---------------------------
// LOGIN
// ---------------------------
function startApp(){
    username = document.getElementById("username").value.trim();
    if(!username) { alert("Enter your name"); return; }
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("user-display").innerText = username;
    showSection('reminder-section');
}

// ---------------------------
// NAVIGATION
// ---------------------------
function showSection(id){
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[onclick*="${id}"]`).classList.add('active');
}

// ---------------------------
// REMINDERS
// ---------------------------
function addReminder(){
    const text = document.getElementById("reminder-text").value;
    const datetime = document.getElementById("reminder-datetime").value;
    if(!text || !datetime) return alert("Fill all fields");
    const reminder = { text, datetime };
    reminders.push(reminder);
    renderReminders();
    alert("Reminder set!");
}

function deleteReminder(index){
    reminders.splice(index,1);
    renderReminders();
}

function clearReminders(){
    reminders = [];
    renderReminders();
}

function renderReminders(){
    const list = document.getElementById("reminder-list");
    list.innerHTML="";
    reminders.forEach((r,i)=>{
        const li=document.createElement("li");
        li.innerHTML=`${r.text} - ${r.datetime} <button onclick="deleteReminder(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

// ---------------------------
// BILLS
// ---------------------------
function addBill(){
    const name = document.getElementById("bill-name").value;
    const amount = document.getElementById("bill-amount").value;
    const date = document.getElementById("bill-date").value;
    if(!name||!amount||!date) return alert("Fill all fields");
    bills.push({name,amount,date});
    renderBills();
}

function deleteBill(index){ bills.splice(index,1); renderBills(); }

function renderBills(){
    const list=document.getElementById("bill-list"); list.innerHTML="";
    bills.forEach((b,i)=>{
        const li=document.createElement("li");
        li.innerHTML=`${b.name}: R${b.amount} - ${b.date} <button onclick="deleteBill(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

// ---------------------------
// EXPENSES
// ---------------------------
function addExpense(){
    const name = document.getElementById("expense-name").value;
    const amount = document.getElementById("expense-amount").value;
    if(!name||!amount) return alert("Fill all fields");
    expenses.push({name,amount});
    renderExpenses();
}

function deleteExpense(index){ expenses.splice(index,1); renderExpenses(); }

function renderExpenses(){
    const list=document.getElementById("expense-list"); list.innerHTML="";
    expenses.forEach((e,i)=>{
        const li=document.createElement("li");
        li.innerHTML=`${e.name}: R${e.amount} <button onclick="deleteExpense(${i})">Delete</button>`;
        list.appendChild(li);
    });
}

// ---------------------------
// TAX
// ---------------------------
function addDeduction(type, amount){
    if(!type||!amount) return;
    deductions.push({type,amount:Number(amount)});
    renderDeductions();
}

function removeDeduction(index){ deductions.splice(index,1); renderDeductions(); }

function clearTax(){ deductions=[]; document.getElementById("tax-output").innerHTML="Tax: R0.00"; document.getElementById("deductions-list").innerHTML=""; }

function renderDeductions(){
    const container=document.getElementById("deductions-list"); container.innerHTML="";
    deductions.forEach((d,i)=>{
        const div=document.createElement("div");
        div.classList.add("deduction-item");
        div.innerHTML=`${d.type}: R${d.amount.toFixed(2)} <button onclick="removeDeduction(${i})" class="remove-btn">Remove</button>`;
        container.appendChild(div);
    });
    calculateTax();
}

function calculateTax(){
    const income=Number(document.getElementById("income").value||0);
    const totalDeductions = deductions.reduce((sum,d)=>sum+d.amount,0);
    const taxableIncome = Math.max(0,income - totalDeductions);
    let bracket=taxBrackets.find(b=>taxableIncome<=b.upTo);
    if(!bracket) bracket=taxBrackets[taxBrackets.length-1];
    const taxAmount = taxableIncome*bracket.rate;
    document.getElementById("tax-output").innerHTML=`
        Income: R${income.toFixed(2)}<br>
        Total Deductions: R${totalDeductions.toFixed(2)}<br>
        Taxable Income: R${taxableIncome.toFixed(2)}<br>
        Tax Rate: ${(bracket.rate*100).toFixed(0)}%<br>
        Tax Amount: R${taxAmount.toFixed(2)}
    `;
}

// ---------------------------
// AI CHAT
// ---------------------------
const aiResponses = {
    "hi":"Hello! I am LIFE-ADMIN. I can help you with Reminders, Bills, Expenses, Tax, and more.",
    "how are you":"I'm fine, thank you! How can I assist you today?",
    "set a reminder":()=>showSection('reminder-section'),
    "help with tax":()=>showSection('tax-section'),
    "help with bills":()=>showSection('bills-section'),
    "help with expenses":()=>showSection('expenses-section')
};

function sendMessage(){
    const input=document.getElementById("chat-input");
    const text=input.value.toLowerCase();
    if(!text) return;
    const chatBox=document.getElementById("chat-box");
    const userMsg=document.createElement("p"); userMsg.innerHTML=`<b>You:</b> ${text}`;
    chatBox.appendChild(userMsg);

    let response=aiResponses[text];
    if(typeof response==="function"){ response(); response="Done!"; }
    if(!response) response="I am not sure about that. Ask me to help with reminders, bills, expenses, or tax.";

    const aiMsg=document.createElement("p"); aiMsg.innerHTML=`<b>AI:</b> ${response}`;
    chatBox.appendChild(aiMsg);
    input.value="";
    chatBox.scrollTop=chatBox.scrollHeight;
}
