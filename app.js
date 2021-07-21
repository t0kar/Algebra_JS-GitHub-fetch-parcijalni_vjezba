const searchForm = document.querySelector("[data-search-form]");
const searchInput = searchForm.querySelector("[name=search]");

function createElement(userName, userAvatar, userPage) {
    const resultElement = document.createElement("div");
    resultElement.innerHTML = `<img src="${userAvatar}" height="20px" width="20px"><a href="${userPage}">${userName}<\a>`;
    console.log(resultElement);
    return resultElement;
};

function showLoader() {
    const loader = document.querySelector(".lds-facebook");
    loader.style.display = "inline-block";
};

function noLoader() {
    const loader = document.querySelector(".lds-facebook");
    loader.style.display = "none";
};

function showError(code) {
    const error = document.querySelector("[data-result-error");
    if (code === 403) {
        error.innerText = "To many requests! Try again later.";
    } else {
        error.innerText = "Fetch error! Check console for more info.";
    }
};

function noError() {
    const error = document.querySelector("[data-result-error");
    error.innerText = "";
};

searchForm.addEventListener("keyup", (event) => {
    event.preventDefault();
    const searchListElement = document.querySelector("[data-result-list]");

    if (searchInput.value.length > 0) {

        const endpoint = `https://api.github.com/search/users?q=${searchInput.value}&page=1&per_page=100`;
        console.log(searchInput.value);

        fetch(endpoint)
            .then((response) => {
                showLoader();
                noError();
                if (response.status === 200) {
                    console.log("Ok!");
                    return response.json();
                } else if (response.status === 403) {
                    throw console.error("Too many requests! Try again later.");;
                };
            })
            .then((data) => {
                noLoader();
                noError();
                searchListElement.innerHTML = "";

                for (let i = 0; i < data.items.length; i++) {
                    const userName = data.items[i].login;
                    const userAvatar = data.items[i].avatar_url;
                    const userPage = data.items[i].url;
                    searchListElement.appendChild(createElement(userName, userAvatar, userPage));
                };
            })
            .catch((error) => {
                noLoader();
                showError();
                searchListElement.innerHTML = "";
                console.log("Fetch error: ", error);
            });
    } else {
        searchListElement.innerHTML = "";
    };
});

