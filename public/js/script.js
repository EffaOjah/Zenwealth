let navbar = document.getElementById("mynav");
var scrollBtn = document.getElementById('scrollBtn');
var navLinks = document.querySelectorAll('.nav-link');
const checkbox = document.querySelector('#hamburger input');
const collapse = document.querySelector('.navbar-collapse');


let isListenerAdded = false;
// When the user scrolls down 100px from the top of the document, show the color
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 2500 || document.documentElement.scrollTop > 2500) {
    scrollBtn.style.display = "grid"; // Show the button
  } else {
    scrollBtn.style.display = "none"; // Hide the button
  }

  if (document.body.scrollTop > 90 || document.documentElement.scrollTop > 90) {
    navbar.style.backgroundColor = "#00001b65";
    navbar.style.backdropFilter = 'blur(10px)';
    navLinks.forEach(link => link.style.color = '#fff');
  } else {
    navbar.style.backgroundColor = "transparent";
    navbar.style.backdropFilter = 'blur(0px)';
    navLinks.forEach(link => link.style.color = '#606fac');
  }
}

checkbox.addEventListener('change', toggleNav);

function toggleNav() {
  if (checkbox.checked) {
    navbar.style.backgroundColor = "#00001b65";
    navbar.style.backdropFilter = 'blur(10px)';
    navLinks.forEach(link => link.style.color = '#fff');
  } else {
    navbar.style.backgroundColor = "transparent";
    navbar.style.backdropFilter = 'blur(0px)';
  }
}