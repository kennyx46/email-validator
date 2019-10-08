const delay = (millis) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millis);
    });
}

const validateEmail = async (email) => {
    const response = await fetch('/api/validate-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json', }
    });

    const validationResult = await response.json();

    return validationResult;
}

const validateEmailAsync = async (email) => {
    const validateEmailResponse = await fetch('/api/validate-email-async', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json', }
    });

    if (validateEmailResponse.status === 429) {
        throw new Error(validateEmailResponse.statusText);
    }

    let timeoutExpired = false;
    delay(120 * 1000).then(() => timeoutExpired = true);

    let isProcessed = false;
    let validationResult;
    while (!isProcessed) {
        if (timeoutExpired) {
            throw new Error('Polling timeout expired');
        }
        await delay(1000);
        const res = await fetch(`/api/validate-email?email=${email}`);
        validationResult = await res.json();
        if (validationResult.error) {
            throw new Error('Error checking email, please try again later');
        }
        isProcessed = validationResult.isProcessed;
    }
    return validationResult;
}

export default {
    validateEmail,
    validateEmailAsync,
}
