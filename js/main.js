//Select item from nav
const navItems = document.querySelectorAll('.navigation__item');
const navCheckbox = document.querySelector('.navigation__checkbox');

navItems.forEach(item => item.addEventListener('click', closeNav));
function closeNav() {
        navCheckbox.checked = false;
}