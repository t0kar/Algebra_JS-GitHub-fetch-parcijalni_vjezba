/**
 * Copyright (c) 2021
 *
 * GitHub users search app
 *
 * @summary GitHub users search app
 * @author t0kar <toma.karadole@gmail.com>
 *
 * Created at     : 2021-07-20 
 * Last modified  : 2021-08-09
 */

const searchListElement = document.querySelector("[data-result-list]");
const searchListPagination = document.querySelector("[data-result-pagination]"); //pagination component selector
const totalCount = document.querySelector("[data-total-count]");  //total results component selector
const error = document.querySelector("[data-result-error]"); //error message component selector

// selecting results-per-page buttons
const perPageAll = document.querySelector(".result-per-page");
const perPage30 = document.querySelector("[data-30-per-page]");
const perPage60 = document.querySelector("[data-60-per-page]");
const perPage100 = document.querySelector("[data-100-per-page]");

// selecting search-bar components
const searchForm = document.querySelector("[data-search-form]");
const searchInput = searchForm.querySelector("[name=search]");
const search = document.querySelector(".search");
const searchIcon = document.querySelector(".search__icon");
const searchClose = document.querySelector(".search__close");
const searchDelete = document.querySelector(".search__delete");

// show-hide loading animation
function showLoader()  {
    const loader = document.querySelector("[data-loading-animation]");
    loader.style.display = "inline-block";
};

function hideLoader() {
    const loader = document.querySelector("[data-loading-animation]");
    loader.style.display = "none";
};

// show-hide results-per-page buttons
function showPerPage () {
    perPageAll.style.display = "flex";
};

function hidePerPage () {
    perPageAll.style.display = "none";
};

// show-hide error message
function showError(code) {
    const error = document.querySelector("[data-result-error]");
    if (code === 403) {
        error.innerText = "To many requests! Try again later.";
    } else {
        error.innerText = "Fetch error! Check console for more info.";
    }
};

function hideError() {
    error.innerText = "";
};

// display total results number 
function getTotalCount(count) {
    totalCount.innerText = `Results: ${count}`;
};

// debounce function for API fetch
function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
};

// resetting elements to default state
function reset() {
    searchListElement.innerHTML = "";
    searchListPagination.innerHTML = "";
    totalCount.innerHTML = "";
    error.innerHTML = "";
    searchInput.value = "";
    perPageAll.style.display = "none";
    perPage30.style.background = "hsla(203, 61%, 13%, 0.1)";
    perPage60.style.background = "transparent";
    perPage100.style.background = "transparent";
};

// pagination
function addPagination(response, perPage) {
    searchListPagination.innerHTML="";

    const link = response.headers.get("link");
    const links = link.split(",");
    const urls = links.map (anchor => {
        return {
            url: anchor.split(";")[0].replace(">","").replace("<",""),
            title: anchor.split(";")[1].replace(" rel=\"","").replace("\"","")
        }
    });

    urls.forEach(u => {
        const button = document.createElement("button");
        button.textContent = u.title;
        button.addEventListener("click", e => apiFetch(perPage, u.url));
        searchListPagination.appendChild(button);
    });
};

// ordinal results number counter (now available)
/*
function ordinalNoCounter (response, perPage) {
    const pageNo = response.url.substring(response.url.lastIndexOf('=') + 1);
    return (pageNo - 1) * perPage;
};
*/

// fetching from GitHub API
function apiFetch(perPage = 30, endpoint = `https://api.github.com/search/users?q=${searchInput.value}&per_page=${perPage}&page=1`) {

    searchListElement.innerHTML = `<tr><th></th><th></th><th>user</th><th>ID</th></tr>`; //table header

    fetch(endpoint)
        .then((response) => {
            showLoader();
            hideError();
            hidePerPage();
            addPagination(response, perPage);
            
            if (response.ok) {
                console.log("Ok!");
                return response.json();
            } else if (response.status === 403) {
                throw console.error("Too many requests! Try again later.");;
            };
        })
        .then((data) => {
            hideLoader();
            hideError();
            getTotalCount(data.total_count);
            showPerPage ();

            for (let i = 0; i < data.items.length; i++) {
                const resultNo = i + 1; 
                const userName = data.items[i].login;
                const userAvatar = data.items[i].avatar_url;
                const userPage = data.items[i].html_url;
                const userId = data.items[i].id;

                let row = searchListElement.insertRow(i + 1);

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
            hideLoader();
            showError();
            getTotalCount(0);
            hidePerPage ();
            searchListElement.innerHTML = "";
            console.log("Fetch error: ", error);

        });
};

// hiding results-per-page button before fetching
hidePerPage ();

// "keyup" event start fetching from GitHub API
searchForm.addEventListener("keyup", debounce(apiFetch, 500));

// search bar events
searchIcon.addEventListener("click", () => {
    search.classList.add("search-open");
    searchInput.focus();
});

searchClose.addEventListener("click", () => {
    search.classList.remove("search-open");
    reset();    
});
  
searchDelete.addEventListener("click", () => {
    reset();
    searchInput.focus();
});

// results-per-page button events
perPage30.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "hsla(203, 61%, 13%, 0.1)";
    perPage60.style.background = "transparent";
    perPage100.style.background = "transparent";
    return apiFetch(30);
});

perPage60.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "transparent";
    perPage60.style.background = "hsla(203, 61%, 13%, 0.1)";
    perPage100.style.background = "transparent";
    return apiFetch(60);
});

perPage100.addEventListener("click", (event) => {
    event.preventDefault();
    perPage30.style.background = "transparent";
    perPage60.style.background = "transparent";
    perPage100.style.background = "hsla(203, 61%, 13%, 0.1)";
    return apiFetch(100);
});
