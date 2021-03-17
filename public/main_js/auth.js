const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id,
    inputs = [...e.target.elements],
    authData = {};

  inputs.forEach((input) => {
    if (input.name) authData[input.name] = input.value;
  });

  const authOrigin = origins.getAuthOrigin(Number(id === "register"));

  authUser(authOrigin, authData);
});

async function authUser(authOrigin, data) {
  try {
    const res = await (
      await fetch(`${authOrigin}/api/v1/auth/register`, {
        method: "POST",
        headers:{
          "content-type":"application/json"
        },
        body: JSON.stringify(data),
      })
    ).json();
    console.log(res);
    showStatus(res);
    if (res.status === "success") window.location.href = res.path;

  } catch (err) {
    showStatus({ status: "fail", message: "Something went from our side" });
  }
}
