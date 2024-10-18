let upBtn = document.getElementById("up-btn2");
let navbar = document.getElementById("navbar");

// When the user scrolls down 3000px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 3000 || document.documentElement.scrollTop > 2000) {
    upBtn.style.display = "grid";
  } else {
    upBtn.style.display = "none";
  }
}

