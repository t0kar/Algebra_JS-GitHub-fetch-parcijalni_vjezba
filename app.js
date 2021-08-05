const searchForm = document.querySelector("[data-search-form]");
const searchInput = searchForm.querySelector("[name=search]");
const searchListElement = document.querySelector("[data-result-list]");
const perPage30 = document.querySelector("[data-30-per-page]");
const perPage60 = document.querySelector("[data-60-per-page]");
const perPage100 = document.querySelector("[data-100-per-page]");

function createElement(resultNo, userName, userAvatar, userPage, userId) {
    const resultElement = document.createElement("div");
    resultElement.innerHTML = `<span>${resultNo}</span><img src="${userAvatar}"><a href="${userPage}">${userName}</a><span class="userId">${userId}</span>`;
    console.log(resultElement);
    return resultElement;
};

function showLoader() {
    const loader = document.querySelector("[data-loading-animation]");
    loader.style.display = "inline-block";
};

function noLoader() {
    const loader = document.querySelector("[data-loading-animation]");
    loader.style.display = "none";
};

function showError(code) {
    const error = document.querySelector("[data-result-error]");
    if (code === 403) {
        error.innerText = "To many requests! Try again later.";
    } else {
        error.innerText = "Fetch error! Check console for more info.";
    }
};

function noError() {
    const error = document.querySelector("[data-result-error]");
    error.innerText = "";
};

function getTotalCount(count) {
    const totalCount = document.querySelector("[data-total-count]");
    totalCount.innerText = `Results: ${count}`;
};

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
};

function apiFetch(perPage = 30) {
    
    let search = searchInput.value;
    let user = search.split(" ").join("");

    searchListElement.innerHTML = `<tr><th></th><th></th><th>user</th><th>ID</th></tr>`;

    const endpoint = `https://api.github.com/search/users?q=${user}&per_page=${perPage}`;

    fetch(endpoint)
        .then((response) => {
            showLoader();
            noError();

            console.log(response.headers.get("link"));

            if (response.ok) {
                console.log("Ok!");
                return response.json();
            } else if (response.status === 403) {
                throw console.error("Too many requests! Try again later.");;
            };
        })
        .then((data) => {
            noLoader();
            noError();
            getTotalCount(data.total_count);


            for (let i = 0; i < data.items.length; i++) {
                const resultNo = i + 1; 
                const userName = data.items[i].login;
                const userAvatar = data.items[i].avatar_url;
                const userPage = data.items[i].url;
                const userId = data.items[i].id;

                let row = searchListElement.insertRow(i+1);

                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);

                cell1.innerHTML = `<span>${resultNo}.</span>`;
                cell2.innerHTML = `<img class="userAvatar" src="${userAvatar}">`;
                cell3.innerHTML = `<a href="${userPage}">${userName}</a>`;
                cell4.innerHTML = `<span class="userId">${userId}</span>`;
            };
        })
        .catch((error) => {
            noLoader();
            showError();
            getTotalCount(0);
            searchListElement.innerHTML = "";
            console.log("Fetch error: ", error);
        });
};

searchForm.addEventListener("keyup", debounce(apiFetch, 500));

perPage30.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "#1f71eb36";
    perPage60.style.background = "#80808013";
    perPage100.style.background = "#80808013";
    return apiFetch(30);
});

perPage60.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "#80808013";
    perPage60.style.background = "#1f71eb36";
    perPage100.style.background = "#80808013";
    return apiFetch(60);
});

perPage100.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "#80808013";
    perPage60.style.background = "#80808013";
    perPage100.style.background = "#1f71eb36";
    return apiFetch(100);
});

/* searchForm.addEventListener("keyup", (event) => {
    event.preventDefault();

    if (searchInput.value.length > 0) {
        debounce(apiFetch, 2000);
    } else {
        searchListElement.innerHTML = "";
    };
}); */

