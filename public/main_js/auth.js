const form = document.querySelector('form');
const xhr = new XMLHttpRequest();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.id,
        inputs = [...e.target.elements],
        data = {};

    inputs.forEach(input => {
        if (input.name)
            data[input.name] = input.value
    })
    auth(data, id);
})

function auth(data, id) {
    console.log(data);
    /*xhr.open('POST', `https://auth.dmez.com/api/v1/auth/${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.parse(data));*/
}

xhr.onload = function () {
    const res = JSON.parse(this.responseText);

    if (res.status === 'error' || res.status === 'fail') {
        showStatus(res)
        return;
    }
    //show success messsage
    showStatus(res);
    window.location.href = res.redirect;
}
