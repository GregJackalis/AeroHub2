// JavaScript to add/remove a class when scrolling down/up
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var navbar = document.querySelector(".navBar");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}
