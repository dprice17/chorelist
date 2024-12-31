// Select all edit, save, delete buttons, and input fields for editing chores
const editBtns = $(".edit-btn"); // Edit buttons for each chore
const addBtn = $("#add-btn"); // Button for adding a new chore
const saveBtns = $(".save-btn"); // Save buttons for each chore
const deleteBtns = $(".delete-btn"); // Delete buttons for each chore
const editchoreInputs = $(".edit-chore-input"); // Input fields for editing chore names
const hiddenChoreInputs = $(".hidden-chore-input"); // Hidden inputs to hold updated chore data

// Function to retrieve relevant elements based on chore ID
const getElements = (button) => {
  const choreId = $(button).data("id"); // Retrieve the data-id attribute for the chore
  const editBtn = $(`#edit-btn-${choreId}`); // Select the corresponding edit button
  const saveBtn = $(`#save-btn-${choreId}`); // Select the corresponding save button
  const deleteBtn = $(`#delete-btn-${choreId}`); // Select the corresponding delete button
  const choreName = $(`#chore-name-${choreId}`); // Select the chore name display element
  const editChoreInput = $(`#edit-chore-input-${choreId}`); // Input field for editing chore name
  const hiddenChoreInput = $(`#hidden-chore-${choreId}`); // Hidden input to store updated chore data

  // Return all relevant elements as an object for easy access
  return {
    choreId,
    editBtn,
    saveBtn,
    choreName,
    editChoreInput,
    hiddenChoreInput,
    deleteBtn,
  };
};

// Event listener for adding new chores
$(addBtn).on("click", () => {
  const form = addBtn.closest("form"); // Find the form related to the add button
  form.submit(); // Submit the form to the backend
});

// Add event listener for each edit button
editBtns.each(function () {
  // Retrieve relevant elements for the clicked edit button
  const { editBtn, saveBtn, editChoreInput, choreName } = getElements(this);

  // On clicking edit, show input field and save button, hide others
  $(this).on("click", () => {
    editBtn.hide(); // Hide the edit button
    saveBtn.show(); // Show the save button
    editChoreInput.show(); // Show the input field for editing
    choreName.hide(); // Hide the chore name display
  });
});

// Add event listener for each save button
saveBtns.each(function () {
  // Retrieve relevant elements for the clicked save button
  const { editBtn, saveBtn, editChoreInput, choreName, hiddenChoreInput } =
    getElements(this);

  // On clicking save, update the chore name and submit the form
  $(this).on("click", (event) => {
    event.preventDefault(); // Prevent the default form submission
    editBtn.show(); // Show the edit button
    saveBtn.hide(); // Hide the save button
    editChoreInput.hide(); // Hide the input field
    choreName.show(); // Show the updated chore name
    choreName.text(editChoreInput.val()); // Update the displayed chore name

    hiddenChoreInput.val(editChoreInput.val()); // Set the updated value in the hidden input
    const form = saveBtn.closest("form"); // Find the closest form
    form.submit(); // Submit the form to the backend
  });
});

// Add event listener for each delete button
deleteBtns.each(function () {
  // Retrieve the delete button element
  const { deleteBtn } = getElements(this);

  // On clicking delete, submit the form for deletion
  $(this).on("click", () => {
    const form = deleteBtn.closest("form"); // Find the form associated with the delete button
    form.submit(); // Submit the form to delete the chore
  });
});
