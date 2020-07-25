// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = localStorage.getItem("") || 0;



// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID);
}


// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):
const renderItems = (items) => {
    //if different items array is passed in, use that
    //if no items array is passed in, default and use budgetItems
    if (!items) items = budgetItems;
    
    const tbody = $("#budgetItems tbody");
    tbody.empty();

    let total = 0;
    
    for (const {id, date, name , category, amount, notes } of items) {
    tbody.append(`<tr data-id=${id}><td>Oct 14, 2019 5:08 PM</td><td>${date}</td><td>${category}</td><td>${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`);
    total += parseFloat(amount);    
    }

    //rewrite total calculation using an array reduce
    $("#total").text(`$${total.toFixed(2)}`)

};






// ======================
// MAIN PROCESS
// ======================

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").click(function() {
    $("#addItemForm").toggle("slow", function() {
        //ternary operator
        $("toggleFormButton").text($(this).is(":visible") ? "Hide Form" : "Add New Budget Item");

    });
});

        //if($(this).is(":visible")) {
            //$("#toggleFormButton").text("Hide Form");
       // } else {
            //$("#toggleFormButton").text("Add New Budget Item")
        //}
    


// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array (each item's object should include: id / date / name / category / amount / notes)... then clear the form fields and trigger localStorage update/budgetItems rerender functions, once created
$("#addItem").click(function(event) {
        event.preventDefault();

        const newItem = {
            id: ++lastID,
            date: moment().format("lll"),
            name: $("#name").val().trim(),
            category: $("#category").val(),
            amount: $("#amount").val().trim(),
            notes: $("#notes").val().trim(),
        };

        if (!newItem.name || !newItem.category || !newItem.amount) {
            return alert("each budget item must have a valid name, category, and amount!")
        }
        budgetItems.push(newItem);
        //$("input, select").val("");
        $("#addItemForm form")[0].reset();

        //TODO:update storage
        updateStorage();
        //TODO: rerender items
})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").change(function () {
    const category = $(this).val();

    if(category) {
        const filteredItems = budgetItems.filter(item =>  category === item.category);
        renderItems(filteredItems);
    } else {
        renderItems();
    }


});



// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem

$("#budgetItems").on("click", ".delete",function() {
    const id = $(this).parents("tr").data("id");
    const remainingItems = budgetItems.filter(item => item.id !== id);
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $("#categoryFilter").val("");
});

renderItems();




