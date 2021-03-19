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

  authUser(id, authOrigin, authData);
});

async function authUser(type, authOrigin, data) {
  try {
    const res = await (
      await fetch(`${authOrigin}/api/v1/auth/${type}`, {
        method: "POST",
        headers:{
          "content-type":"application/json"
        },
        credentials:'include',
        body: JSON.stringify(data),
      })
    ).json();
    console.log(res);
    showStatus(res);
   // if (res.status === "success") window.location.href = res.path;

  } catch (err) {
    showStatus({ status: "fail", message: "Something went from our side" });
  }
}
