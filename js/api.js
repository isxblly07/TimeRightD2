async function loginUser(email, senha) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, senha })
    });
    return await response.json();
}

async function registerUser(nome, email, senha) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', nome, email, senha })
    });
    return await response.json();
}
