window.onload = function () {

    //TOP SELLING MEDICINES

    //HEART DISEASE
    fetch("https://dmezapi.herokuapp.com/api/v1/products?search=heart_disease&limit=6&fields=coverImage,title", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
        .then(res => {
            console.log(res);
            if (res.result) {

                let content = "";
                let serial = 0;
                res.data.products.forEach(element => {
                    let id = element._id;
                    let title = element.title;
                    let cover_image = element.coverImage;
                    serial = serial + 1;
                    content = content + ` <div class="col-sm-2">
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <img src="/public/images/default.png" alt=""/>
                        <h4>${title}</h4>
                    </div>
                </div>
            </div>
            </div>
        `
                })

                document.getElementById('top-selling-med-heart').innerHTML = content;

            }

            else{
                let content = "";

                content = ` 
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <h4>NO MEDICINE FOUND FOR THIS DISEASE</h4>
                    </div>
                </div>
            </div>
        `
                document.getElementById('top-selling-med-heart').innerHTML = content;
            
            }
            
        })
        .catch(err => {
            console.log(err);
        })



    // SKIN DISEASE

    fetch("https://dmezapi.herokuapp.com/api/v1/products?search=skin_disease&limit=6&fields=coverImage,title", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
        .then(res => {
            console.log(res);
            if (res.result) {

                let content = "";
                let serial = 0;
                res.data.products.forEach(element => {
                    let id = element._id;
                    let title = element.title;
                    let cover_image = element.coverImage;
                    serial = serial + 1;
                    content = content + `<div class="col-sm-2">
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <img src="/public/images/default.png" alt=""/>
                        <h4>${title}</h4>
                    </div>
                </div>
            </div>
        </div>`
                })

                document.getElementById('top-selling-med-skin').innerHTML = content;

            }
            else{
                let content = "";

                content = ` 
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <h4>NO MEDICINE FOUND FOR THIS DISEASE</h4>
                    </div>
                </div>
            </div>
        `
                document.getElementById('top-selling-med-skin').innerHTML = content;
            
            }
            
        })
        .catch(err => {
            console.log(err);
        })



    //diabetics


    fetch("https://dmezapi.herokuapp.com/api/v1/products?search=diabetics&limit=6&fields=coverImage,title", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
        .then(res => {
            console.log(res);
            if (res.result) {

                let content = "";
                let serial = 0;
                res.data.products.forEach(element => {
                    let id = element._id;
                    let title = element.title;
                    let cover_image = element.coverImage;
                    serial = serial + 1;
                    content = content + `<div class="col-sm-2">
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <img src="/public/images/default.png" alt=""/>
                        <h4>${title}</h4>
                    </div>
                </div>
            </div>
        </div>`
                })

                document.getElementById('top-selling-med-diabetics').innerHTML = content;

            }
            else{
                let content = "";

                content = ` 
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <h4>NO MEDICINE FOUND FOR THIS DISEASE</h4>
                    </div>
                </div>
            </div>
        `
                document.getElementById('top-selling-med-diabetics').innerHTML = content;
            
            }
            
        })
        .catch(err => {
            console.log(err);
        })



    // COMMON COLD


    fetch("https://dmezapi.herokuapp.com/api/v1/products?search=cold&limit=6&fields=coverImage,title", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
        .then(res => {
            console.log(res);
            if (res.result) {

                let content = "";
                let serial = 0;
                res.data.products.forEach(element => {
                    let id = element._id;
                    let title = element.title;
                    let cover_image = element.coverImage;
                    serial = serial + 1;
                    content = content + ` <div class="col-sm-2">
                    <div class="product-image-wrapper">
                        <div class="single-products">
                            <div class="productinfo text-center">
                                <img src="/public/images/default.png" alt=""/>
                                <h4>${title}</h4>
                            </div>
                        </div>
                    </div>
                    </div>
                `
                })

                document.getElementById('top-selling-med-cold').innerHTML = content;

            }
            else{
                let content = "";

                content = ` 
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <h4>NO MEDICINE FOUND FOR THIS DISEASE</h4>
                    </div>
                </div>
            </div>
        `
                document.getElementById('top-selling-med-cold').innerHTML = content;
            
            }
        })
        .catch(err => {
            console.log(err);
        })



    //OTHERS

    fetch("https://dmezapi.herokuapp.com/api/v1/products?search=others&limit=6&fields=coverImage,title", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
        .then(res => {
            console.log(res);
            if (res.result) {

                let content = "";
                let serial = 0;
                res.data.products.forEach(element => {
                    let id = element._id;
                    let title = element.title;
                    let cover_image = element.coverImage;
                    serial = serial + 1;
                    content = content + ` <div class="col-sm-2">
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <img src="/public/images/default.png" alt=""/>
                        <h4>${title}</h4>
                    </div>
                </div>
            </div>
            </div>
        `
                })

                document.getElementById('top-selling-med-others').innerHTML = content;

            }
            else{
                let content = "";

                content = ` 
            <div class="product-image-wrapper">
                <div class="single-products">
                    <div class="productinfo text-center">
                        <h4>NO MEDICINE FOUND FOR THIS DISEASE</h4>
                    </div>
                </div>
            </div>
        `
                document.getElementById('top-selling-med-others').innerHTML = content;
            
            }
            
        })
        .catch(err => {
            console.log(err);
        })


        //RECOMMENDED MEDICINES

        fetch("https://dmezapi.herokuapp.com/api/v1/products?limit=24", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json()

        })
  
        .then(data => {
            console.log(data)
            let cards = `<ul class="splide__list">`
            data.data.products.forEach(product => {
                cards += `<li class="splide__slide">
                
                    <div class="product-image-wrapper">
                        <div class="single-products">
                            <div class="productinfo text-center">
                                <img src="public/images/medicine.jpg" alt="" />
                                <h2>₹${product.price}</h2>
                                <p>${product.title}</p>
                            </div>
                        </div>
                    </div>
                
                </li>`
            })
            document.getElementById('cards_placeholder').innerHTML = cards + `</ul>`
            new Splide('.splide', {
                perPage: 6,
                rewind: true,
                breakpoints: {
                    640: {
                        perPage: 1,
                    },
                }
                
            }).mount();

        })
        .catch(err => {
            console.log(err);
        })

}