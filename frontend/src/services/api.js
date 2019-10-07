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
    await fetch('/api/validate-email-async', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json', }
    });

    let isProcessed = false;
    let validationResult;
    while (!isProcessed) {
        await delay(1000);
        const res = await fetch(`/api/validate-email?email=${email}`);
        validationResult = await res.json();
        isProcessed = validationResult.isProcessed;
    }
    return validationResult;
}

export default {
    validateEmail,
    validateEmailAsync,
}
