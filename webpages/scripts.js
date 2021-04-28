function validation() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;

  if (name.length <= 3) {
    alert("Please enter a valid name");
    return false;
  }

  if (phone.length != 10) {
    alert("Please enter a valid phone number");
    return false;
  }

  if (!ValidateEmail(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  return true;
}

function ValidateEmail(mail) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      myForm.emailAddr.value
    )
  ) {
    return true;
  }
  alert("You have entered an invalid email address!");
  return false;
}

var navbar = document.getElementById("navbar");

window.onscroll = function () {
  if (window.pageYOffset > 100) navbar.classList.remove("top");
  else navbar.classList.add("top");
};

// Smooth Scrolling
$("#navbar a, .btn").on("click", function (e) {
  if (this.hash !== "") {
    e.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - 100,
      },
      800
    );
  }
});

// document.getElementById("request").scrollIntoView();
