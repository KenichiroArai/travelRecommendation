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

            Object.keys(data).forEach(category => {
                const categoryData = data[category];

                if (category.toLowerCase().includes(keyword)) {
                    if (Array.isArray(categoryData)) {
                        categoryData.forEach(item => {
                            console.log(item);
                            results.push({
                                ...item,
                                category: category
                            });
                        });
                    }
                }
            });

            console.log('Filtered Results:', results);
            displayResults(results);
        })
        .catch(error => console.error('Error:', error));
}

// アイテムがキーワードにマッチするかチェックする補助関数
function itemMatchesKeyword(item, keyword) {
    return (
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword)) ||
        Object.values(item).some(value => 
            typeof value === 'string' && 
            value.toLowerCase().includes(keyword)
        )
    );
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

    // 構造を確認して適切なデータを取得
    const items = getDisplayItems(results);

    items.forEach(item => {
        const div = document.createElement('div');

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

function getDisplayItems(data) {
    // データが配列で、最初の要素にcitiesプロパティがある場合
    if (Array.isArray(data) && data.length > 0 && data[0].cities) {
        // countriesの構造の場合、全ての都市を抽出
        return data.reduce((acc, country) => {
            return acc.concat(country.cities);
        }, []);
    }

    // データがオブジェクトで、countriesプロパティがある場合
    if (data.countries) {
        // countriesの構造の場合、全ての都市を抽出
        return data.countries.reduce((acc, country) => {
            return acc.concat(country.cities);
        }, []);
    }

    // その他の構造の場合（templesやbeachesなど）
    if (!Array.isArray(data)) {
        // オブジェクトの全ての配列を結合
        return Object.values(data).flat();
    }

    // すでに適切な形式の配列の場合
    return data;
}
