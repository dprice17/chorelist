// Select all edit, save buttons, and inputs for editing chores

const editBtns = $(".edit-btn");
const saveBtns = $(".save-btn");
const editchoreInputs = $(".edit-chore-input");
const hiddenChoreInputs = $(".hidden-chore-input");

// Function to retrieve relevant elements based on chore ID
const getElements = (button) => {
  const choreId = $(button).data("id");
  const editBtn = $(`#edit-btn-${choreId}`);
  const saveBtn = $(`#save-btn-${choreId}`);
  const choreName = $(`#chore-name-${choreId}`);
  const editChoreInput = $(`#edit-chore-input-${choreId}`);
  const hiddenChoreInput = $(`#hidden-chore-${choreId}`);

  const choreElements = {
    choreId,
    editBtn,
    saveBtn,
    choreName,
    editChoreInput,
    hiddenChoreInput,
  };

  return choreElements;
};

// Add event listener for each edit button
editBtns.each(function () {
  const { editBtn, saveBtn, editChoreInput, choreName } = getElements(this);

  // On clicking edit, show input field and save button
  $(this).on("click", () => {
    editBtn.hide();
    saveBtn.show();
    editChoreInput.show();
    choreName.hide();
  });
});

// Add event listener for each save button
saveBtns.each(function () {
  const { editBtn, saveBtn, editChoreInput, choreName, hiddenChoreInput } =
    getElements(this);

  // On saving, update the chore name and submit the form
  $(this).on("click", (event) => {
    event.preventDefault();
    editBtn.show();
    saveBtn.hide();
    editChoreInput.hide();
    choreName.show();
    choreName.text(editChoreInput.val());
    hiddenChoreInput.val(editChoreInput.val());
    const form = saveBtn.closest("form"); // Get closest form element
    form.submit(); // Submit the form
  });
});
