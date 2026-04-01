//Defines the class
class BudgetTracker {
    //sets up transactions, grabs HTML elements, 
    // initializes events, renders transactions, updates balance.
    constructor() {
        this.transactions = this.loadTransactions();
        this.form = document.getElementById("transactionForm");
        this.transactionList = document.getElementById("transactionList");
        this.balanceElement = document.getElementById("balance");

        this.initEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }
    //Loads transactions from localStorage
    loadTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }
    //Saves Transactions to localstorage
    saveTransactions(){
        localStorage.setItem("transactions", JSON.stringify(this.transactions))
    }
    //Runs when form is submitted and calls addTransaction()
    initEventListeners(){
        this.form.addEventListener("submit", e=> {
            e.preventDefault();
            this.addTransaction()
        });
    }
//clearForm() clears description & amount fields after adding.
    clearForm() {
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
    }
//addTransaction() reads inputs, creates transaction object, 
// saves it, 
// renders list, 
// updates balance, 
// clears form.
    addTransaction(){
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        //Stops the transaction if description is 
        // empty or amount is invalid.
        if (!description || isNaN(amount)) {
            alert("Please provide a valid description and amount.")
            return;
        }
        //Creates a transaction object with unique ID, 
        // description, amount (negative if expense), and type.
        const transaction = {
            id: Date.now(),
            description,
            amount: type === "expense" ? -amount : amount,
            type,
        }
//Adds transaction to array, saves to localStorage, 
// updates the display and balance, then clears the form.
        this.transactions.push(transaction);
        this.saveTransactions();
        this.renderTransactions();
        this.updateBalance();
        this.clearForm();
    }
//renderTransactions() clears transaction list,  
//Creates a div for each transaction with description, amount, and delete button.
//Adds the div to the page.
//Calls attachDeleteEventListeners() to make delete buttons clickable.

    renderTransactions(){
        this.transactionList.innerHTML = "";
        this.transactions
        .slice()
        .sort((a, b) => b.id - a.id)
        .forEach((transaction) => {
            const transactionDiv = document.createElement("div");
            transactionDiv.classList.add("transaction", transaction.type)
            transactionDiv.innerHTML = `
            <span>${transaction.description}</span>
             <span class="transaction-amount-container"
             >$${Math.abs(transaction.amount).toFixed(
                2
             )} <button class="delete-btn" data-id="${
             transaction.id
             }">Delete</button></span
            >
            `;
            this.transactionList.appendChild(transactionDiv);
        });
        this.attachDeleteEventListeners();
    }
    //Finds all delete buttons and adds a click listener.
    //Calls deleteTransaction() when clicked.
    attachDeleteEventListeners() {
        this.transactionList.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                this.deleteTransaction(Number(button.dataset.id));
            })
        });
    }
//Removes transaction with the matching ID. 
//Updates localStorage, refreshes the list, recalculates balance. 
    deleteTransaction(id){
        this.transactions = this.transactions.filter(transaction => transaction.id !==id
        );

        this.saveTransactions();
        this.renderTransactions();
        this.updateBalance();

    }
//Sums all transaction amounts. 
//Updates balance text
//changes color, green if positive and pink if negative
    updateBalance() {
        const balance = this.transactions.reduce(
        (total, transaction) => total + transaction.amount,
            0
        );

        this.balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
        this.balanceElement.style.color = balance >= 0 ? "#2ecc43" : "#FF0000"
    }
}
//Initialise Tracker
const budgetTracker = new BudgetTracker();

