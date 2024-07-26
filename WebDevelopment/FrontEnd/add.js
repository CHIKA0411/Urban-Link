document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-apartment-form");

  // Add event listener for form submission
  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Validate the form fields
    if (validateForm()) {
      // If form validation passes, submit the form
      form.submit();
    }
  });

  // Function to validate form fields
  function validateForm() {
    // Get form inputs
    const apartmentNumber = document
      .getElementById("apartment-number")
      .value.trim();
    const bedrooms = document.getElementById("bedrooms").value.trim();
    const bathrooms = document.getElementById("bathrooms").value.trim();
    const ownerName = document.getElementById("owner-name").value.trim();
    const phoneNumber = document.getElementById("phone-number").value.trim();

    // Check if any field is empty
    if (
      !apartmentNumber ||
      !bedrooms ||
      !bathrooms ||
      !ownerName ||
      !phoneNumber
    ) {
      alert("All fields are required!");
      return false;
    }

    // Check if bedrooms and bathrooms are valid numbers
    if (isNaN(bedrooms) || isNaN(bathrooms) || bedrooms < 1 || bathrooms < 1) {
      alert("Please enter valid numbers for bedrooms and bathrooms!");
      return false;
    }

    // Check if phone number is valid
    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Please enter a valid phone number!");
      return false;
    }

    // Form is valid
    return true;
  }

  // Function to validate phone number format
  function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number format
    return phoneRegex.test(phoneNumber);
  }
});
