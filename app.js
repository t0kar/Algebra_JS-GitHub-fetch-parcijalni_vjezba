const searchForm = document.querySelector("[data-search-form]");
const searchInput = searchForm.querySelector("[name=search]");

function createElement(userName, userAvatar, userPage) {
    const resultElement = document.createElement("div"); 2
    resultElement.innerHTML = `<img src="${userAvatar}" height = "20px" width = "20px"><a href="${userPage}">${userName}<\a>`;
    console.log(resultElement);
    return resultElement;
}

function showLoader() {
    const loader = document.querySelector(".lds-facebook");
    loader.style.display = "inline-block";
}

function noLoader() {
    const loader = document.querySelector(".lds-facebook");
    loader.style.display = "none";
}

searchForm.addEventListener("keyup", (event) => {
    event.preventDefault();

    if (searchInput.value.length > 0) {

        const endpoint = `https://api.github.com/search/users?q=${searchInput.value}&page=1&per_page=100`;
        console.log(searchInput.value);

        fetch(endpoint)
            .then((response) => {
                showLoader();
                return response.json()
            })
            .then((data) => {
                console.log(data.items);

                noLoader();

                searchListElement = document.querySelector("[data-result-list]");
                searchListElement.innerHTML = "";

                console.log(data.items.length);

                for (let i = 0; i < data.items.length; i++) {
                    const userName = data.items[i].login;
                    const userAvatar = data.items[i].avatar_url;
                    const userPage = data.items[i].url;
                    searchListElement.appendChild(createElement(userName, userAvatar, userPage));
                }
            })
            .catch((error) => {
                noLoader();
                console.log("Fetch error: ", error);
            });
    };
});

