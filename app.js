const searchForm = document.querySelector("[data-search-form]");
const searchInput = searchForm.querySelector("[name=search]");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(searchInput.value);

    const endpoint = `https://api.github.com/search/users?q=${searchInput.value}`;

    fetch(endpoint)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data.items);
        })
        .catch((error) => {
            console.log(error);
        });
})

