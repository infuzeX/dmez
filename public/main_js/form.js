window.onload = function () {
  document.getElementById("submit-btn").addEventListener("click", () => {
    var name = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    let status = [];
    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (name.length <= 1) {
      document.getElementById("name").style.borderColor = "red";
      document.getElementById("name").value = "";
      document.getElementById("labelName").innerHTML = "Please enter your name";
      status.push("false");
    } else {
      status.push("true");
    }

    if (phone.length !== 10) {
      document.getElementById("phone").style.borderColor = "red";
      document.getElementById("phone").value = "";
      document.getElementById("labelPhone").innerHTML =
        "Please enter valid Phone Number";
      status.push("false");
    } else {
      status.push("true");
    }

    if (re.test(email.trim())) {
      status.push("true");
    } else {
      document.getElementById("email").style.borderColor = "red";
      document.getElementById("email").value = "";
      document.getElementById("labelEmail").innerHTML =
        "Please enter valid email";
      status.push("false");
    }

    if (status.includes("false")) {
      return false;
    } else {
      document.getElementById("submit-btn").value = "Please wait...";

      fetch("/api/v1/forms/contacts", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({
          name: name,
          email: email,
          contact: phone,
          message: message,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Yayyy",
              text:
                "You have successfully submitted your details! We will contact you soon!",
            });

            document.getElementById("submit-btn").value = "Submit";
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops..",
              text: res.message,
            });
            document.getElementById("submit-btn").value = "Submit";
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
          document.getElementById("submit-btn").value = "Submit";
        });
    }
  });

  //Suggestion Form
  document.getElementById("suggest-btn").addEventListener("click", () => {
    var name = document.getElementById("sugg_name").value;
    var suggestion = document.getElementById("suggestion").value;

    let status = [];

    if (name.length <= 1) {
      document.getElementById("sugg_name").style.borderColor = "red";
      document.getElementById("sugg_name").value = "";
      document.getElementById("labelSuggestName").innerHTML =
        "Please enter your name";
      status.push("false");
    } else {
      status.push("true");
    }

    if (suggestion.length < 10) {
      document.getElementById("suggestion").style.borderColor = "red";
      document.getElementById("suggestion").value = "";
      document.getElementById("labelSuggestion").innerHTML =
        "Please enter suggestion of more than 10 characters";
      status.push("false");
    } else {
      status.push("true");
    }

    if (status.includes("false")) {
      return false;
    } else {
      document.getElementById("suggest-btn").value = "Please wait...";

      fetch("/api/v1/forms/suggestions", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({
          name: name,
          suggestion: suggestion,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Yayyy",
              text: "Thank you for your valuable suggestion!",
            });

            document.getElementById("suggest-btn").value = "Submit";
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops..",
              text: res.message,
            });
            document.getElementById("suggest-btn").value = "Submit";
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
          document.getElementById("suggest-btn").value = "Submit";
        });
    }
  });
};
