let cl = console.log;

let baseUrl = `http://localhost:3000/movies`

const imgUrl = "https://image.tmdb.org/t/p/w1280";
const moviesContainer = document.getElementById("moviesContainer");
let postForm = document.getElementById("postForm");
let titleControl = document.getElementById("title");
let contentControl = document.getElementById("IMDB");
let imgControl = document.getElementById("img")
let overview = document.getElementById("overview");
let submitBtn = document.getElementById("submitBtn");
let updateBtn = document.getElementById("updateBtn");


const templating = (arr) => {
    let result = arr.map(movies => {
        return `
                <div class="col-lg-3 col-md-6 col-xs-12">
                    <div class="card mb-4" id ="${movies.id}">
                        <figure class = "movieCard">
                            <img src="${imgUrl}/${movies.backdrop_path}" alt="${movies.title}">
                            <figcaption class = "text-white p-4 bg-dark">
                                <div class="row">
                                    <div class="col-sm-10">
                                        <h3>
                                            ${movies.title}
                                        </h3>
                                    </div>
                                    <div class="col-sm-2">
                                        ${movies.vote_average}
                                    </div>
                                </div>
                            </figcaption>
                            <div class="overview bg-white p-4">
                                <h4>overview:</h4>
                                <p>
                                    ${movies.overview}
                                </p>
                            </div>
                        </figure>
                        <div class="card-footer text-right">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                        </div>
                    </div>
                </div> 
                `
    }).join("")
    moviesContainer.innerHTML = result;
}

const makeApiCall = (methodName, apiUrl, msgBody) => {
    return fetch(apiUrl, {
        method: methodName,
        body: JSON.stringify(msgBody),
        headers: {
            "Content-Type": "application/json",
            "auth": "JWT token taken from LS"
        }
    })
        .then(res => {
            return res.json()
        })
}

makeApiCall("GET", baseUrl)
    .then(data => {
        templating(data)
    })

const onPostSubmit = (eve) => {
    eve.preventDefault();
    let obj = {
        title: titleControl.value,
        vote_average: contentControl.value,
        backdrop_path: imgControl.value,
        overview: overview.value,
        userId: Math.ceil(Math.random() * 10)
    }
    makeApiCall("POST", baseUrl, obj)
        .then(cl)
        .catch(cl)
}

const onEdit = (ele) => {
    let EditId = ele.closest(".card").id;
    localStorage.setItem("EditId", EditId)
    let editUrl = `${baseUrl}/${EditId}`

    makeApiCall("GET", editUrl)
        .then(res => {
            cl(res)
            titleControl.value = res.title,
            contentControl.value = res.vote_average,
            imgControl.value = res.backdrop_path,
            overview.value = res.overview
            submitBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none");
        })
}

const onPostUpdate = () => {
    let updateId = localStorage.getItem("EditId");
    let updateUrl = `${baseUrl}/${updateId}`;
    let obj = {
        title: titleControl.value,
        vote_average: contentControl.value,
        backdrop_path: imgControl.value,
        overview: overview.value
    }

    makeApiCall("PATCH", updateUrl, obj)
        .then(cl)
        .catch(cl)
}

const onDelete = (ele) => {
    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/${deleteId}`

    makeApiCall("DELETE", deleteUrl)
        .then(cl)
        .catch(cl)
}

postForm.addEventListener("submit", onPostSubmit)
updateBtn.addEventListener("click", onPostUpdate)