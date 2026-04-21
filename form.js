document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('email-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  if (!form) return; // safety check — exits if no form on page

  function validateForm() {
    const name    = document.getElementById('name-2');
    const email   = document.getElementById('email-2');
    const phone   = document.getElementById('Phone-2');
    const service = document.getElementById('Select-2');

    clearErrors();
    let isValid = true;

    if (name.value.trim() === '') {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
      showError(email, 'Please enter your email');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    const phoneDigits = phone.value.replace(/\D/g, '');
    if (phone.value.trim() === '') {
      showError(phone, 'Please enter your phone number');
      isValid = false;
    } else if (phoneDigits.length !== 10) {
      showError(phone, 'Phone number must be exactly 10 digits');
      isValid = false;
    }

    if (service && service.value === '') {
      showError(service, 'Please select a service');
      isValid = false;
    }

    return isValid;
  }

  function showError(input, message) {
    input.style.border = '1.5px solid red';
    const error = document.createElement('div');
    error.className = 'form-error-msg';
    error.style.cssText = 'color: red; font-size: 12px; margin-top: 4px; margin-bottom: 6px;';
    error.innerText = message;
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  function clearErrors() {
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.text-field-2, .select-field').forEach(el => {
      el.style.border = '';
    });
  }

  const phoneField = document.getElementById('Phone-2');
  if (phoneField) {
    phoneField.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!validateForm()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.value = 'Please wait...';
    submitBtn.disabled = true;

    const payload = {
      access_key: '401f5e14-ebcd-4180-ba43-68a87ba45096',
      subject: 'New Booking Enquiry from Website',
      name:    document.getElementById('name-2').value,
      email:   document.getElementById('email-2').value,
      phone:   document.getElementById('Phone-2').value,
      service: document.getElementById('Select-2') ? document.getElementById('Select-2').value : ''
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok || result.success) {  // ✅ Double check
        form.style.display = 'none';
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
      } else {
        errorMsg.style.display = 'block';
        submitBtn.value = 'book';
        submitBtn.disabled = false;
      }
    } catch (err) {
      errorMsg.style.display = 'block';
      submitBtn.value = 'book';
      submitBtn.disabled = false;
    }

  }, true);

});
