//DOMContentLoaded ensures the script runs only after the entire document has loaded,
//  meaning that forms inside edit.js (or any other template) are already present in the DOM.

document.addEventListener('DOMContentLoaded', function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
          }
          form.classList.add('was-validated')
      }, false)
  })
});