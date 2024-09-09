import { db, ref, push, set, onValue, remove } from './index.html'; // Import Firebase dependencies

let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Function to render the expenses in the table
function renderExpenseTable() {
    expenseTableBody.innerHTML = ''; // Clear the table before rendering
    totalAmount = 0; // Reset the total amount

    expenses.forEach((expense, index) => {
        const newRow = expenseTableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        deleteBtn.addEventListener('click', () => {
            // Remove the expense from the database
            const expenseRef = ref(db, `expenses/${expense.id}`);
            remove(expenseRef);

            // Update the UI after deletion
            expenses.splice(index, 1);
            renderExpenseTable();
        });

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        deleteCell.appendChild(deleteBtn);

        totalAmount += parseFloat(expense.amount);
    });

    totalAmountCell.textContent = totalAmount;
}

// Add new expense
addBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please fill out all fields');
        return;
    }

    // Create a new expense reference in the Realtime Database
    const newExpenseRef = push(ref(db, 'expenses'));

    // Save the new expense to Firebase
    set(newExpenseRef, {
        id: newExpenseRef.key,
        category,
        amount,
        date
    });

    // Clear input fields
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Retrieve and display expenses from Firebase Realtime Database
onValue(ref(db, 'expenses'), (snapshot) => {
    expenses = [];
    snapshot.forEach((childSnapshot) => {
        expenses.push(childSnapshot.val());
    });
    renderExpenseTable();
});




const firebaseConfig = {
    apiKey: "AIzaSyA6MNm01fga0DD8kZy8NYet6ZsFZRVHI3g",
    authDomain: "money-tracker-c21a4.firebaseapp.com",
    databaseURL: "https://money-tracker-c21a4-default-rtdb.firebaseio.com",
    projectId: "money-tracker-c21a4",
    storageBucket: "money-tracker-c21a4.appspot.com",
    messagingSenderId: "1053291799105",
    appId: "1:1053291799105:web:4e0b0f47ffbb4137591cc0"
};