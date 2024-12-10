fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // JSONデータを取得し、コンソールに表示
    })
    .catch(error => console.error('Error:', error));

function searchRecommendations() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const results = data.filter(item => item.keywords.includes(keyword));
            displayResults(results);
        })
        .catch(error => console.error('Error:', error));
}

function clearResults() {
    const container = document.getElementById('result-container');
    container.innerHTML = ''; // 表示結果をクリア
    document.getElementById('search-input').value = ''; // 入力フィールドをクリア
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
    container.innerHTML = ''; // 既存の内容をクリア

    results.forEach(item => {
        const div = document.createElement('div');
        const localTime = displayLocalTime(item.timeZone); // 各アイテムに対応するタイムゾーンで時刻を取得

        div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.imageUrl}" alt="${item.name}">
            <p>${item.description}</p>
            <p>現地時間: ${localTime}</p>
        `;

        container.appendChild(div);
    });
}
