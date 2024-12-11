fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));

function searchRecommendations() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    console.log('searchRecommendations', keyword);
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data);
            let results = [];
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        results.push({
                            ...city,
                            countryName: country.name
                        });
                    }
                });
            });

            console.log('Filtered Results:', results);
            displayResults(results);
        })
        .catch(error => console.error('Error:', error));
}

function clearResults() {
    const container = document.getElementById('result-container');
    container.innerHTML = '';
    document.getElementById('search-input').value = '';
}

function displayLocalTime(timeZone) {
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const localTime = new Date().toLocaleTimeString('en-US', options);
    return localTime;
}

function displayResults(results) {
    const container = document.getElementById('result-container');
    container.innerHTML = '';

    results.forEach(item => {
        const div = document.createElement('div');

        // Extract timezone from the item; assume `item` has a `timeZone` property
        const options = { timeZone: item.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const time = new Date().toLocaleTimeString('en-US', options);

        div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.imageUrl}" alt="${item.name}">
            <p>${item.description}</p>
            <p>${time}</p>
        `;

        container.appendChild(div);
    });

    console.log('Results displayed');
}
