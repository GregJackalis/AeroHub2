
$(document).on('click', '#updateRec', function(event) {
    console.log("submit btn pressed");
    event.preventDefault();

    const updateForm = document.querySelector('#updateForm');

    const inputElements = updateForm.querySelectorAll('input');

    // Loop through each input element
    inputElements.forEach(input => {
        // Get the value of each input element
        const value = input.value;
        console.log(value);
    });
})
