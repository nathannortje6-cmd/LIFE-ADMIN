// =====================
// Life Admin JS
// =====================

// ---------------------
// LOGIN
// ---------------------
document.getElementById('start-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('topbar-username').innerText = username;
        document.getElementById('profile-name-display').innerText = username;
    } else {
        alert('Please enter your name');
    }
});

// ---------------------
// SECTION SWITCHING
// ---------------------
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// ---------------------
// TASK STORAGE
// ---------------------
let bills = [];
let expenses = [];
let reminders = [];

// ---------------------
// DISPLAY FUNCTIONS
// ---------------------
function displayBills() {
    const list = document.getElementById('bills-list');
    list.innerHTML = '';
    bills.forEach(bill => {
        const li = document.createElement('li');
        li.innerText = `${bill.title || bill.name} - R${bill.amount || '0'} - Due: ${bill.dueDate || bill.date}`;
        list.appendChild(li);
    });
}

function displayExpenses() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = '';
    expenses.forEach(exp => {
        const li = document.createElement('li');
        li.innerText = `${exp.title || exp.name} - R${exp.amount || '0'}`;
        list.appendChild(li);
    });
}

function displayReminders() {
    const list = document.getElementById('reminders-list');
    list.innerHTML = '';
    reminders.forEach(rem => {
        const li = document.createElement('li');
        li.innerText = `${rem.title} - ${rem.dueDate || rem.date}`;
        list.appendChild(li);
    });
}

function clearReminders() {
    reminders = [];
    displayReminders();
}

// ---------------------
// TAX CALCULATOR
// ---------------------
function runTaxCalculation() {
    const salary = Number(document.getElementById('tax-salary').value);
    const age = Number(document.getElementById('tax-age').value);
    const pension = Number(document.getElementById('tax-pension').value);
    const retirement = Number(document.getElementById('tax-retirement').value);
    const medical = Number(document.getElementById('tax-medical').value);

    let taxableIncome = salary - pension - retirement;

    let tax = 0;
    if (taxableIncome <= 237100) tax = taxableIncome * 0.18;
    else if (taxableIncome <= 370500) tax = 42678 + (taxableIncome - 237100) * 0.26;
    else if (taxableIncome <= 512800) tax = 77362 + (taxableIncome - 370500) * 0.31;
    else if (taxableIncome <= 673000) tax = 121475 + (taxableIncome - 512800) * 0.36;
    else if (taxableIncome <= 857900) tax = 179147 + (taxableIncome - 673000) * 0.39;
    else if (taxableIncome <= 1817000) tax = 251258 + (taxableIncome - 857900) * 0.41;
    else tax = 644489 + (taxableIncome - 1817000) * 0.45;

    document.getElementById('tax-output').innerText = `Estimated Tax: R${tax.toFixed(2)}`;
}

// ---------------------
// AI INTEGRATION
// ---------------------
async function getAIResponse(message) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are Life Admin AI assistant. Categorize tasks, suggest reminders, answer admin questions, and parse user input into task objects." },
                { role: "user", content: message }
            ],
            max_tokens: 300
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// ---------------------
// CHAT & TASK PARSING
// ---------------------
document.getElementById('chat-send').addEventListener('click', async () => {
    const input = document.getElementById('chat-input').value;
    if (!input) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="user-msg">${input}</div>`;

    // Determine if input is a new task
    const aiResponse = await getAIResponse(
        "Parse this into a task JSON with fields: title, category (Bills/Expenses/Reminders), dueDate, recurring. If not a task, answer as admin AI: " + input
    );

    try {
        const task = JSON.parse(aiResponse);

        if (task.category === "Bills") bills.push(task);
        else if (task.category === "Expenses") expenses.push(task);
        else reminders.push(task);

        displayBills();
        displayExpenses();
        displayReminders();

        chatBox.innerHTML += `<div class="ai-msg">Task added: ${task.title}</div>`;
    } catch {
        // If AI response is not JSON, treat as normal chat answer
        chatBox.innerHTML += `<div class="ai-msg">${aiResponse}</div>`;
    }

    document.getElementById('chat-input').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
});

// ---------------------
// OPTIONAL: Weekly Summary
// ---------------------
async function getWeeklySummary() {
    const allTasks = [...bills, ...expenses, ...reminders];
    const summary = await getAIResponse(
        "Generate a concise weekly summary of these tasks: " + JSON.stringify(allTasks)
    );
    alert(summary);
}
