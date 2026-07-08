document.addEventListener('DOMContentLoaded', () => {
    const alertBtn = document.getElementById('alertBtn');
    
    if(alertBtn) {
        alertBtn.addEventListener('click', () => {
            alert('Welcome to Tools Planet! Let\'s build some amazing tools together.');
        });
    }
});
