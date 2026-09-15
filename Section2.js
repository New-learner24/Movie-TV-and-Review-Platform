const prompt = require('prompt-sync')();
let tasks = [];
function addtask() {
    const task = prompt("Enter a task to add: ");
    if (task.trim() !== "") {
        tasks.push(task);
        console.log("Task added: " + task);
    } else {
        console.log("Task cannot be empty.");
    }
}
function removetask() {
    displaytasks();
    const index = parseInt(prompt("Enter the task number to remove: "), 10) - 1;
    if (index >= 0 && index < tasks.length) {
        const removedtask = tasks.splice(index, 1);
        console.log("Task removed: " + removedtask);
    } else {
        console.log("Error: Invalid task number.");
    }
}
function displaytasks() {
    if (tasks.length === 0) {
        console.log("Your to-do list is empty.");
    } else {
        console.log("To-Do List:");
        for (let i = 0; i < tasks.length; i++) {
            console.log((i + 1) + ": " + tasks[i]);
        }
    }
}
function cleartasks() {
    tasks = [];
    console.log("All tasks cleared.");
}
function main() {
    console.log("Welcome to the To-Do List Manager!");
    while (true) {
        console.log("\nChoose an option:");
        console.log("1: Add a task");
        console.log("2: Remove a task");
        console.log("3: Display all tasks");
        console.log("4: Clear all tasks");
        console.log("5: Exit");

        const choice = prompt("Enter your choice: ");
        switch (choice) {
            case "1":
                addtask();
                break;
            case "2":
                removetask();
                break;
            case "3":
                displaytasks();
                break;
            case "4":
                cleartasks();
                break;
            case "5":
                console.log("Goodbye!");
                return;
            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}
main();
