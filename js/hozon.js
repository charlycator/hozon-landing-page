var serviceID = 'service_6is83j5';
var templateID = 'template_6ejc8cz';

function isValidEmail(email) {
    return email.match(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i);
}

function enableSubmitBtn(submitButton) {
    submitButton.innerText = 'JOIN';
    submitButton.disabled = false;
    submitButton.style.background = 'gold';
    submitButton.style.cursor = 'pointer';
}

function disableSubmitBtn(submitButton) {
    submitButton.disabled = true;
    submitButton.style.background = 'grey';
    submitButton.style.cursor = 'not-allowed';
}

function setButtonWaitingForResponse(submitButton) {
    submitButton.innerText = 'Joining';
    disableSubmitBtn(submitButton);
}

function restoreFormStyle(emailInput, submitButton) {
    emailInput.classList.remove('invalid-input');
    emailInput.value = '';
    enableSubmitBtn(submitButton);
}

function setInvalidEmail(emailInput, submitButton) {
    emailInput.classList.add('invalid-input');
    disableSubmitBtn(submitButton);
}

function onJoiningWaitingList(event) {
    event.preventDefault();
    
    var emailInput = document.querySelector('#email-join-list-input');
    var waitingListForm = document.getElementById('waiting-list-form');
    var submitWListBtn = document.querySelector('#button-submit');
    var recaptchaEl = document.querySelector('.g-recaptcha');
    var successEl = document.querySelector('#success-joining-message');

    if (!isValidEmail(emailInput.value)) {
      setInvalidEmail(emailInput, submitWListBtn);

      setTimeout(function() {
        emailInput.classList.remove('invalid-input');
        enableSubmitBtn(submitWListBtn);
      }, 1000);

      return;
    }

    setButtonWaitingForResponse(submitWListBtn);

    var inputFields = {
        'new_wait_list_user_email': emailInput.value,
    }
        
    emailjs.sendForm(serviceID, templateID, waitingListForm)
        .then(function() {
          successEl.style.opacity = 1;

          setTimeout(function() {
            restoreFormStyle(emailInput, submitWListBtn);
            recaptchaEl.classList.remove('g-recaptcha-not-filled');
            successEl.style.opacity = 0;
            grecaptcha.reset();
          }, 2000);
        }, function(error) {
            if (error.text === 'reCAPTCHA: The g-recaptcha-response parameter not found') {
                console.log("[HOZON] Fill the recaptcha");
                recaptchaEl.classList.add('g-recaptcha-not-filled');
                enableSubmitBtn(submitWListBtn);
            } else {
                console.log("[HOZON] error joining mailing list: ", error)
                setTimeout(function() {
                    restoreFormStyle(emailInput, submitWListBtn);
                  }, 2000);
            }
        });
}
