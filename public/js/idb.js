
 // create variable to hold db connection
let db;
// establish connection to IndexedDB database called 'budget-tracker' and set it to version 1
const request = indexedDB.open('money_tracker', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called 'new-deposit', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction', {autoIncrement: true });

};

// upon a successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save references to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        uploadTransaction();

    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed when attempting to submit a new deposit & there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read & write permission
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    
    // access the object store for 'new_pizza'
    const budgetObjectStore = transaction.objectStore('new_transaction');

    // add record to your store with add method
    budgetObjectStore.add(record);
};

function uploadTransaction() {

    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_transaction');

    const getAll = budgetObjectStore.getAll();
    // on success
    getAll.onsuccess = function() {

        if(getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if(serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['new_transaction'], 'readwrite');

                    const budgetObjectStore = transaction.objectStore('new_transaction');

                    budgetObjectStore.clear();

                    alert('All saved transactions have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

// listen for app
window.addEventListener('online', uploadTransaction);