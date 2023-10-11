let svg;  // Declare svg in the global scope

document.addEventListener("DOMContentLoaded", function() {
    // 1. データのリセット
    const storedDate = localStorage.getItem('storedDate');
    const currentDate = new Date().toLocaleDateString();

    if (storedDate !== currentDate) {
        localStorage.clear();
        localStorage.setItem('storedDate', currentDate);
    }
    
    console.log("DOMContentLoaded event fired");  // ← これを追加してください
    
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString();
    console.log("Date set");  // ← これを追加してください
    
    document.getElementById("addButton").addEventListener("click", function() {
        console.log("Add Button Clicked");  // ← これを追加してください
        document.getElementById("inputForm").classList.toggle("hidden");
    });

    // 名言のリスト
    const quotes = [
        "一日一歩。",
        "夢中になれば道は開ける。",
        "誠実は最も確かな成功の道。",
        "やりたいことをやる勇気が成功を生む。",
        "すべては考え方次第だ。考え方を変えれば、世界も変わる。",
        "人間は考える葦である。",
        "一つの小さなステップが人生を変える。",
        "今日を愛することが、明日を作る。",
        "未来は今日の行動によって作られる。",
        "不可能とは、私ができないという意味ではなく、私がやらないという意味だ。",
        "人は誰しもが星のようなもので、自分から光を放つことができる。",
        "自分を他人と比べるな。君が君であることが大切だ。",
        "人生最大のリスクは、リスクを取らないことだ。",
        "どんなに小さなことでも、一歩を踏み出すことが重要だ。",
        "困難を乗り越えることが、新しい道を切り開く。",
        "千里の道も一歩から。",
        "失敗しても次を試す勇気を持とう。",
        "頑張りを続ければ、道は必ず開ける。",
        "動けば必ず報われる。",
        "先を急ぐな、今を大切に。",
        "一度きりの人生、後悔しないよう生きよう。",
        "心がポジティブであれば、結果もポジティブになる。",
        "明日を変えるのは、今日の行動だ。",
        "大事なのはゴールではなく、その過程だ。",
        "行動することで、初めて変化が起こる。",
        "努力する人を、運命は助ける。",
        "挑戦し続けることが、未来を開く。",
        "何事も経験。失敗も経験だ。",
        "誰もが成功する可能性を秘めている。",
        "どんな小さな努力も無駄ではない。",
        "いつも「やれる」と信じて。"
    ];


    // 名言をランダムで選択して表示
    document.getElementById("quote").innerText = quotes[Math.floor(Math.random() * quotes.length)];

    // イベントデータをテーブルに挿入する関数
    function updateReviewTable(eventsData) {
        const tableBody = document.getElementById('eventsReview').querySelector('tbody');
        tableBody.innerHTML = ""; // テーブルをクリア

        eventsData.forEach(event => {
            const row = document.createElement('tr');
            ['startAngle', 'endAngle', 'title'].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = key.includes('Angle') ? angleToTime(event[key]) : event[key];
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }

    // TwitterシェアボタンのURLを更新する関数
    function updateTwitterShareButton(eventsData, reflectionText) {
        let tweetText = "今日はこんな一日でした！\n\nやったこと:\n";
    
        // イベントデータからテキストを生成
        eventsData.forEach((event, index) => {
            const startTime = angleToTime(event.startAngle);
            const endTime = angleToTime(event.endAngle);
            tweetText += `${index + 1}. ${startTime} - ${endTime}: ${event.title}\n`;
        });
    
        tweetText += "\n振り返り:\n" + reflectionText;
    
        // URLエンコードしてTwitterシェアリンクを生成
        const twitterShareLink = `https://twitter.com/share?text=${encodeURIComponent(tweetText)}`;
        
        document.getElementById('twitterShareButton').href = twitterShareLink;
    }
    

    // 'Review' ボタンがクリックされた時のハンドラー
    document.getElementById('reviewButton').addEventListener('click', function() {
        const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
        const reflectionText = localStorage.getItem('reflectionText') || '';

        // テーブルとTwitterシェアボタンを更新
        updateReviewTable(eventsData);
        updateTwitterShareButton(eventsData, reflectionText);

        // 振り返りテキストを挿入
        document.getElementById('reflectionReview').innerText = reflectionText;

        // レビューセクションを表示
        document.getElementById('review').classList.toggle('hidden');
    });


    // 'Save Reflection' ボタンがクリックされた時のハンドラー
    document.getElementById('saveReflection').addEventListener('click', function() {
        const reflectionText = document.getElementById('reflection').value;
        localStorage.setItem('reflectionText', reflectionText);
        // 2. Praise Messageの表示
        // ※ Note: これはフロントエンドだけで動作するダミーのロジックです。
        // 実際にChatGPT APIを使用する場合は、バックエンドでAPIコールを行う必要があります。
        alert("よく頑張りました！美味しいものを食べて休んでね。");
    });


        // Define SVG for the circle graph and clock container
        const clockContainer = d3.select("#clockContainer")
        .style("position", "relative")
        .style("width", "340px")
        .style("height", "340px")
        .style("border-radius", "50%")
        .style("margin", "auto");

    const svg = clockContainer.append("div")
        .attr("id", "circleGraph")
        .style("position", "absolute")
        .style("top", "20px")
        .style("left", "20px")
        .style("width", "300px")
        .style("height", "300px")
        .style("border-radius", "50%")
        .style("border", "1px solid #000")
        .append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(150,150)");

    // Generate the hour labels for 24 hours
    for (let i = 0; i < 24; i++) {
        const angle = (i - 6) * (Math.PI / 12); // -6 to start from the top, PI/12 because 2*PI/24
        const x = 170 * Math.cos(angle) + 170;
        const y = 170 * Math.sin(angle) + 170;

        clockContainer.append("div")
            .style("position", "absolute")
            .style("width", "30px")
            .style("height", "30px")
            .style("top", y + "px")
            .style("left", x + "px")
            .style("text-align", "center")
            .style("line-height", "30px")
            .style("font-size", "16px")
            .style("margin-top", "-15px")  // Adjust vertical center
            .style("margin-left", "-15px")  // Adjust horizontal center
            .text(i);
    }
    // Create a pie and arc generator
    const arc = d3.arc().innerRadius(0).outerRadius(150);
            
    // ページロード時にlocalStorageからデータを取得
    const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];  // 変更

    document.getElementById("registerButton").addEventListener("click", function() {
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const title = document.getElementById("title").value;
        const color = document.getElementById("eventColor").value;

        // Validate inputs
        if (!startTime || !endTime || !title) {
            alert("Please fill in all fields.");
            return;
        }

        // 予定をデータセットに追加
        eventsData.push({
            startAngle: timeToAngle(startTime),
            endAngle: timeToAngle(endTime),
            title: title,
            color: color  // 追加: 予定の色
        });
    
        // データをlocalStorageに保存
        localStorage.setItem('eventsData', JSON.stringify(eventsData));

        // フォームをリセット
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("title").value = "";
        
        // 円グラフを描画
        drawEvent(eventsData);
    });

    function timeToAngle(time) {
        const [hour, minute] = time.split(":").map(Number);
        return (hour + minute / 60) * 15 * (Math.PI/180); // Convert to radians
    }

    function angleToTime(angle) {
        const totalMinutes = angle * (180/Math.PI) * 4; // radians to degrees, and 15 degrees per hour
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    function drawEvent(data) {
        svg.selectAll("path")
            .data(data)
            .join("path")
            .attr("d", d3.arc().innerRadius(0).outerRadius(150))
            .attr("fill", d => d.color ? d.color : "none")  // Use the selected color
            .attr("stroke", "black")
            .attr("stroke", "#686868")  
            .on("click", function(event, d, i) {
                if (d.title) {
                    // ポップアップにイベントの詳細を表示
                    document.getElementById("eventDetails").innerText = `予定: ${d.title}\n開始時間: ${angleToTime(d.startAngle)}\n終了時間: ${angleToTime(d.endAngle)}`;
            
                    // ポップアップを表示
                    document.getElementById("popup").classList.remove("hidden");
            
                    // ポップアップが表示されているときにページ全体がクリックされたらポップアップを閉じる
                    document.addEventListener("click", function closePopupOnOutsideClick(event) {
                        if (!document.getElementById("popup").classList.contains("hidden")) {
                            // ポップアップを非表示にする
                            document.getElementById("popup").classList.add("hidden");
                            // イベントリスナーを削除
                            document.removeEventListener("click", closePopupOnOutsideClick);
                        }
                    });
            
                    // ポップアップがクリックされたときにイベントが伝播しないようにする
                    document.getElementById("popup").addEventListener("click", function(event) {
                        event.stopPropagation();
                    });
                    
                    // 削除ボタンにイベントリスナーを追加
                    document.getElementById("deleteButton").addEventListener("click", function() {
                        // "selectedEventIndex" is not defined in your code, assuming "i" was the intended index to be used for deletion.
                        eventsData.splice(i, 1);  // データからイベントを削除

                        // データをlocalStorageからも削除
                        localStorage.setItem('eventsData', JSON.stringify(eventsData));
                        
                        drawEvent(eventsData);    // グラフを更新

                        // ポップアップを非表示にする
                        document.getElementById("popup").classList.add("hidden");
                    });
                }
                event.stopPropagation();  // Add this line to stop propagation to the document
            });
                
            // テキスト要素を追加/更新
        svg.selectAll("text")
            .data(data)
            .join("text")
            .attr("transform", function(d) {
                // テキストの位置をセグメントの中心に設定
                const centroid = d3.arc().innerRadius(0).outerRadius(150).centroid(d);
                return `translate(${centroid})`;
            })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(d => d.title)  // タイトルを表示
        .attr("fill", "black")  // テキストカラーを設定
        .attr("font-size", "10px");  // フォントサイズを設定
    }

    // ページ読み込み時に保存されているデータをもとにグラフを描画
    drawEvent(eventsData);  // 追加
});