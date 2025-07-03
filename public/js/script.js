// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector('.searchInput');
  const searchBtn = document.querySelector('.searchButton');
  const bigSearchBtn = document.querySelector('.bigSearch');

  if (input && searchBtn && bigSearchBtn) {
    input.addEventListener('focus', function () {
      searchBtn.style.display = 'none';
      bigSearchBtn.style.display = 'inline-block';
    });
    input.addEventListener('blur', function () {
      searchBtn.style.display = 'inline-block';
      bigSearchBtn.style.display = 'none';
    });
  }
});

//tax-toogle

  // Show/hide all .tax elements based on the tax-toggle switch
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.tax-toggle');
    const taxElements = document.querySelectorAll('.tax');

    function updateTaxVisibility() {
      taxElements.forEach(el => {
        el.style.display = toggle.checked ? '' : 'none';
      });
    }

    // Initial state
    updateTaxVisibility();

    // Listen for toggle changes
    toggle.addEventListener('change', updateTaxVisibility);
  });
