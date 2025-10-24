function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
}

function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// LOGIN
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;
        
        try {
            const result = await loginUser(email, senha);
            
            if (result.success) {
                localStorage.setItem('timeright_user', JSON.stringify(result.user));
                window.location.href = 'admin.html';
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Erro na conexão. Tente novamente.');
        }
    });
    
    // CADASTRO
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('registerNome').value;
        const email = document.getElementById('registerEmail').value;
        const senha = document.getElementById('registerSenha').value;
        const confirmarSenha = document.getElementById('registerConfirmarSenha').value;
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        
        try {
            const result = await registerUser(nome, email, senha);
            
            if (result.success) {
                localStorage.setItem('timeright_user', JSON.stringify(result.user));
                window.location.href = 'admin.html';
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Erro na conexão. Tente novamente.');
        }
    });
});