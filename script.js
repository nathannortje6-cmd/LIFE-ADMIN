// =========================
// LOGIN
// =========================
const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username-input").value;
    if(username) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-app").style.display = "block";
        document.getElementById("username-display").textContent = username;
        document.getElementById("profile-name-display").textContent = username;
    }
});

// =========================
// NAVIGATION
// =========================
function showSection(sectionId){
    document.querySelectorAll(".section").forEach(s => s.style.display = "none");
    document.getElementById(sectionId).style.display = "block";

    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`).classList.add("active");
}

// =========================
// REMINDERS
// =========================
let reminders = [];
function addReminder(){
    const title = document.getElementById("reminder-title").value;
    const date = document.getElementById("reminder-date").value;
    const time = document.getElementById("reminder-time").value;
    const note = document.getElementById("reminder-note").value;

    if(title && date && time){
        reminders.push({title,date,time,note});
        updateReminderList();
        alert(`Reminder set for ${date} ${time}`);
    }
}
function updateReminderList(){
    const list = document.getElementById("reminder-list");
    list.innerHTML="";
    reminders.forEach(r=>{
        const li = document.createElement("li");
        li.textContent = `${r.title} - ${r.date} ${r.time} - ${r.note}`;
        list.appendChild(li);
    });
    document.getElementById("stat-reminders").textContent = `Reminders: ${reminders.length}`;
}

// =========================
// BILLS
// =========================
let bills = [];
function addBill(){
    const name = document.getElementById("bill-name").value;
    const amount = parseFloat(document.getElementById("bill-amount").value);
    const date = document.getElementById("bill-date").value;
    if(name && amount && date){
        bills.push({name,amount,date});
        updateBillList();
    }
}
function updateBillList(){
    const list = document.getElementById("bill-list");
    list.innerHTML="";
    bills.forEach(b=>{
        const li = document.createElement("li");
        li.textContent = `${b.name} - R${b.amount.toFixed(2)} - ${b.date}`;
        list.appendChild(li);
    });
    document.getElementById("stat-bills").textContent = `Bills: ${bills.length}`;
}

// =========================
// EXPENSES
// =========================
let expenses = [];
function addExpense(){
    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    if(name && amount){
        expenses.push({name,amount});
        updateExpenseList();
    }
}
function updateExpenseList(){
    const list = document.getElementById("expense-list");
    list.innerHTML="";
    let total=0;
    expenses.forEach(e=>{
        const li = document.createElement("li");
        li.textContent = `${e.name} - R${e.amount.toFixed(2)}`;
        list.appendChild(li);
        total+=e.amount;
    });
    document.getElementById("expenses-total").textContent = `Total Expenses: R${total.toFixed(2)}`;
    document.getElementById("stat-expenses").textContent = `Expenses: ${expenses.length}`;
}

// =========================
// TAX
// =========================
let deductions = [];
function addDeduction(){
    const type = document.getElementById("deduction-type").value;
    const amount = parseFloat(document.getElementById("deduction-amount").value);
    if(type && amount>0){
        deductions.push({type,amount});
        updateDeductionList();
    }
}
function updateDeductionList(){
    const list = document.getElementById("deduction-list");
    list.innerHTML="";
    deductions.forEach(d=>{
        const li = document.createElement("li");
        li.textContent = `${d.type}: R${d.amount.toFixed(2)}`;
        list.appendChild(li);
    });
}

function calculateTax(){
    const income = parseFloat(document.getElementById("income").value);
    const dependants = parseInt(document.getElementById("dependants").value) || 0;

    let taxableIncome = income;
    deductions.forEach(d=> taxableIncome -= d.amount);

    // Deduct dependants (example SARS rebate)
    const dependantDeduction = dependants*16200;
    taxableIncome -= dependantDeduction;

    let tax=0;
    if(taxableIncome<=98750) tax = taxableIncome*0.18;
    else if(taxableIncome<=195750) tax=17775+(taxableIncome-98750)*0.26;
    else if(taxableIncome<=305850) tax=40437+(taxableIncome-195750)*0.31;
    else if(taxableIncome<=423300) tax=74835+(taxableIncome-305850)*0.36;
    else if(taxableIncome<=555600) tax=117002+(taxableIncome-423300)*0.39;
    else if(taxableIncome<=708310) tax=162744+(taxableIncome-555600)*0.41;
    else tax=230340+(taxableIncome-708310)*0.45;

    document.getElementById("tax-result").textContent = `Estimated Tax: R${tax.toFixed(2)}`;
}

// =========================
// AI CHAT
// =========================
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

const aiResponses = {
    "hi":"Hi! I can help with Reminders, Bills, Expenses, Tax, and Profile. You can ask me to navigate or set tasks.",
    "how are you":"I'm fine, thank you!",
    "help reminders":"Taking you to Reminders section...","help bills":"Taking you to Bills section...","help expenses":"Taking you to Expenses section...",
    "help tax":"Taking you to Tax section...","help profile":"Taking you to Profile section..."
};

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress",(e)=>{if(e.key==="Enter")sendMessage();});

function sendMessage(){
    const msg = chatInput.value.trim();
    if(!msg) return;
    const userP = document.createElement("p");
    userP.textContent = "You: "+msg;
    chatBox.appendChild(userP);
    chatInput.value="";

    let response = aiResponses[msg.toLowerCase()];
    if(response===undefined) response = "AI: I'm still learning, but I can help with Reminders, Bills, Expenses, Tax, and Profile.";

    const aiP = document.createElement("p");
    aiP.textContent = "AI: "+response;
    chatBox.appendChild(aiP);
    chatBox.scrollTop=chatBox.scrollHeight;

    // Navigation commands
    if(msg.toLowerCase().includes("reminder")) showSection("reminders");
    if(msg.toLowerCase().includes("bill")) showSection("bills");
    if(msg.toLowerCase().includes("expense")) showSection("expenses");
    if(msg.toLowerCase().includes("tax")) showSection("tax");
    if(msg.toLowerCase().includes("profile")) showSection("profile");
}
