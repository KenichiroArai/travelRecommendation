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

            // データの各カテゴリーを検索
            Object.keys(data).forEach(category => {
                const categoryData = data[category];

                // カテゴリー名にキーワードが含まれる場合
                if (category.toLowerCase().includes(keyword)) {
                    // 配列の場合
                    if (Array.isArray(categoryData)) {
                        categoryData.forEach(item => {
                            results.push({
                                ...item,
                                category: category
                            });
                        });
                    }
                    // オブジェクトの配列（ネストされたデータ）の場合
                    else if (typeof categoryData === 'object') {
                        Object.values(categoryData).forEach(item => {
                            if (Array.isArray(item.cities)) {
                                item.cities.forEach(city => {
                                    results.push({
                                        ...city,
                                        parentName: item.name,
                                        category: category
                                    });
                                });
                            } else {
                                results.push({
                                    ...item,
                                    category: category
                                });
                            }
                        });
                    }
                }
                // カテゴリー内のデータを検索
                else {
                    // 配列の場合
                    if (Array.isArray(categoryData)) {
                        categoryData.forEach(item => {
                            if (itemMatchesKeyword(item, keyword)) {
                                results.push({
                                    ...item,
                                    category: category
                                });
                            }
                        });
                    }
                    // オブジェクトの配列（ネストされたデータ）の場合
                    else if (typeof categoryData === 'object') {
                        Object.values(categoryData).forEach(item => {
                            if (Array.isArray(item.cities)) {
                                // 親要素の名前でマッチ
                                const parentMatches = item.name.toLowerCase().includes(keyword);
                                
                                item.cities.forEach(city => {
                                    if (parentMatches || itemMatchesKeyword(city, keyword)) {
                                        results.push({
                                            ...city,
                                            parentName: item.name,
                                            category: category
                                        });
                                    }
                                });
                            } else if (itemMatchesKeyword(item, keyword)) {
                                results.push({
                                    ...item,
                                    category: category
                                });
                            }
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
