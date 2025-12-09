// =============================
// APP INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById("login-screen");
    const startButton = document.getElementById("start-btn");
    const usernameInput = document.getElementById("username");
    const mainApp = document.getElementById("main-app");
    const topbarUsername = document.getElementById("topbar-username");

    startButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (!username) return alert("Please enter your name!");
        topbarUsername.textContent = username;
        loginScreen.style.display = "none";
        mainApp.style.display = "block";
        showSection("home");
    });
});

// =============================
// SECTION NAVIGATION
// =============================
const sections = document.querySelectorAll(".section");
const navItems = document.querySelectorAll(".nav-item");

function showSection(id) {
    sections.forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";

    navItems.forEach(nav => nav.classList.remove("active"));
    document.querySelector(`.nav-item[data-target="${id}"]`)?.classList.add("active");
}

// =============================
// BILLS MANAGEMENT
// =============================
let bills = [];
const billsList = document.getElementById("bills-list");

function addBill() {
    const name = document.getElementById("bill-name").value.trim();
    const amount = parseFloat(document.getElementById("bill-amount").value);
    const dueDate = document.getElementById("bill-date").value;

    if (!name || !amount || !dueDate) return alert("Fill all bill fields!");
    const bill = { name, amount, dueDate };
    bills.push(bill);
    renderBills();
    alert("Bill added!");
}

function renderBills() {
    billsList.innerHTML = "";
    bills.forEach((b, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `${b.name} - R${b.amount} - Due: ${b.dueDate} 
            <button onclick="deleteBill(${idx})">Delete</button>`;
        billsList.appendChild(li);
    });
}

function deleteBill(idx) {
    bills.splice(idx, 1);
    renderBills();
}

// =============================
// EXPENSES MANAGEMENT
// =============================
let expenses = [];
const expensesList = document.getElementById("expenses-list");

function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    if (!name || !amount) return alert("Fill all expense fields!");
    expenses.push({ name, amount });
    renderExpenses();
    alert("Expense added!");
}

function renderExpenses() {
    expensesList.innerHTML = "";
    expenses.forEach((e, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `${e.name} - R${e.amount} 
            <button onclick="deleteExpense(${idx})">Delete</button>`;
        expensesList.appendChild(li);
    });
}

function deleteExpense(idx) {
    expenses.splice(idx, 1);
    renderExpenses();
}

// =============================
// REMINDERS MANAGEMENT
// =============================
let reminders = [];
const remindersList = document.getElementById("reminders-list");

function addReminder() {
    const title = document.getElementById("reminder-title").value.trim();
    const date = document.getElementById("reminder-date").value;
    if (!title || !date) return alert("Fill all reminder fields!");
    reminders.push({ title, date });
    renderReminders();
    alert("Reminder set!");
}

function renderReminders() {
    remindersList.innerHTML = "";
    reminders.forEach((r, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `${r.title} - ${r.date} 
            <button onclick="deleteReminder(${idx})">Delete</button>`;
        remindersList.appendChild(li);
    });
}

function deleteReminder(idx) {
    reminders.splice(idx, 1);
    renderReminders();
}

function clearReminders() {
    reminders = [];
    renderReminders();
}

// =============================
// TAX CALCULATION - SA 2025/26
// =============================
function calculateTaxSA({
  annualSalary,
  age = 30,
  pensionContribution = 0,
  retirementAnnuity = 0,
  medicalAidMembers = 1
}) {
    const deductions = pensionContribution + retirementAnnuity;
    let taxableIncome = annualSalary - deductions;
    if (taxableIncome < 0) taxableIncome = 0;

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
    for (let i = 0; i < brackets.length; i++) {
        if (taxableIncome <= brackets[i].threshold) {
            tax = brackets[i].base + (taxableIncome - (brackets[i-1]?.threshold || 0)) * brackets[i].rate;
            break;
        }
    }

    const primaryRebate = 17478;
    const secondaryRebate = age >= 65 ? 9594 : 0;
    const tertiaryRebate = age >= 75 ? 3194 : 0;
    const totalRebate = primaryRebate + secondaryRebate + tertiaryRebate;

    tax -= totalRebate;
    if (tax < 0) tax = 0;

    const uif = Math.min(annualSalary, 17712) * 0.01;
    const netSalary = annualSalary - tax - uif;

    return {
        taxableIncome,
        tax: Math.round(tax),
        uif: Math.round(uif),
        netSalary: Math.round(netSalary)
    };
}

function runTaxCalculation() {
    const salary = parseFloat(document.getElementById("tax-salary").value);
    const age = parseInt(document.getElementById("tax-age").value);
    const pension = parseFloat(document.getElementById("tax-pension").value) || 0;
    const retirement = parseFloat(document.getElementById("tax-retirement").value) || 0;
    const medical = parseInt(document.getElementById("tax-medical").value) || 1;

    const result = calculateTaxSA({
        annualSalary: salary,
        age,
        pensionContribution: pension,
        retirementAnnuity: retirement,
        medicalAidMembers: medical
    });

    const taxOutput = document.getElementById("tax-output");
    taxOutput.innerHTML = `
        Taxable Income: R${result.taxableIncome}<br>
        Tax Owed: R${result.tax}<br>
        UIF: R${result.uif}<br>
        Net Salary: R${result.netSalary}
    `;
}

// =============================
// SIMPLE AI CHAT
// =============================
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");

const aiResponses = {
    "hi": "Hi! I can help you manage taxes, bills, expenses, and reminders. Ask me anything!",
    "how are you": "I'm fine, thank you! How are you?",
    "help tax": () => showSection("tax"),
    "help bills": () => showSection("bills"),
    "help expenses": () => showSection("expenses"),
    "help reminders": () => showSection("reminders")
};

function sendMessage() {
    const userMsg = chatInput.value.trim().toLowerCase();
    if (!userMsg) return;

    const pUser = document.createElement("p");
    pUser.innerHTML = `<strong>You:</strong> ${chatInput.value}`;
    chatBox.appendChild(pUser);

    let response = aiResponses[userMsg] || "I'm not sure about that, but I can help with taxes, bills, expenses, and reminders.";
    if (typeof response === "function") response();
    else {
        const pBot = document.createElement("p");
        pBot.innerHTML = `<strong>AI:</strong> ${response}`;
        chatBox.appendChild(pBot);
    }

    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("chat-send").addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
