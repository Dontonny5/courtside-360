const tables = document.querySelectorAll("table");

tables.forEach(table => {
    const headings = table.querySelectorAll("th");

    headings.forEach((heading, columnIndex) => {

        heading.addEventListener("click", () => {

            const rows = Array.from(table.querySelectorAll("tr")).slice(1);

            const direction = heading.dataset.direction === "asc" ? "desc" : "asc";

            headings.forEach(h => delete h.dataset.direction);
            heading.dataset.direction = direction;

            rows.sort((a, b) => {
                let valueA = a.children[columnIndex].innerText.trim();
                let valueB = b.children[columnIndex].innerText.trim();

                let numberA = Number(valueA);
                let numberB = Number(valueB);

                let result;

                if (valueA !== "" && valueB !== "" &&
                    !isNaN(numberA) && !isNaN(numberB)) {
                    result = numberA - numberB;
                } else {
                    result = valueA.localeCompare(valueB);
                }

                return direction === "asc" ? result : -result;
            });

            rows.forEach((row, index) => {
                row.children[0].innerText = index + 1;
                table.appendChild(row);
            });
        });
    });
});

function loadStandings() {
fetch("https://site.api.espn.com/apis/v2/sports/basketball/nba/standings")
    .then(response => response.json())
    .then(data => {

        function updateConference(conference, tableId) {

            const table = document.getElementById(tableId);
            const teams = [...conference.standings.entries].sort((a, b) => {
    const seedA = Number(a.stats.find(s => s.name === "playoffSeed")?.value ?? 99);
    const seedB = Number(b.stats.find(s => s.name === "playoffSeed")?.value ?? 99);

    return seedA - seedB;
});

            teams.forEach((teamEntry, index) => {
                const rowClass = index < 6 ? "playoff-team" :
                 index < 10 ? "playin-team" : "";

                const teamName = teamEntry.team.displayName;
                const stats = teamEntry.stats;

                const getStat = name => {
                    const stat = stats.find(item => item.name === name);
                    return stat ? stat.value : null;
                };

                const getDisplay = name => {
                    const stat = stats.find(item => item.name === name);
                    return stat ? stat.displayValue : "—";
                };

                const rows = Array.from(table.querySelectorAll("tr")).slice(1);

                const row = rows.find(r =>
                    r.children[1].innerText.trim() === teamName
                );

                if (!row) return;

row.classList.remove("playoff-team", "playin-team");

if (rowClass) {
    row.classList.add(rowClass);
}

row.children[0].innerText = index + 1;
table.appendChild(row);

                row.children[2].innerText = getStat("wins") ?? "—";
                row.children[3].innerText = getStat("losses") ?? "—";
                row.children[4].innerText =
                    Number(getStat("winPercent")).toFixed(3);

                row.children[5].innerText = getDisplay("gamesBehind");

                row.children[10].innerText =
                    Number(getStat("avgPointsFor")).toFixed(1);

                row.children[11].innerText =
                    Number(getStat("avgPointsAgainst")).toFixed(1);

                row.children[12].innerText =
                    Number(getStat("differential")).toFixed(1);

                row.children[13].innerText = getDisplay("streak");
                row.children[6].innerText = getDisplay("Home");
row.children[7].innerText = getDisplay("Road");
row.children[8].innerText = getDisplay("vs. Div.");
row.children[9].innerText = getDisplay("vs. Conf.");
row.children[14].innerText = getDisplay("Last Ten Games");

            });
        }

        const west = data.children.find(c => c.abbreviation === "West");
        console.table(west.standings.entries.map(team => ({
    team: team.team.displayName,
    stats: team.stats.map(s => `${s.name}: ${s.value}`).join(", ")
})));
        const east = data.children.find(c => c.abbreviation === "East");
const wolvesStandings = document.getElementById("wolves-standings");

let standingsHTML = `
    <table>
        <thead>
            <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
            </tr>
        </thead>
        <tbody>
`;

const westTeams = [...west.standings.entries].sort((a, b) => {
    const percentageA = Number(a.stats.find(s => s.name === "winPercent")?.value ?? 0);
    const percentageB = Number(b.stats.find(s => s.name === "winPercent")?.value ?? 0);

    return percentageB - percentageA;
});

westTeams.forEach((team, index) => {

    const wins = team.stats.find(s => s.name === "wins")?.value ?? "—";
    const losses = team.stats.find(s => s.name === "losses")?.value ?? "—";

    standingsHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${team.team.displayName}</td>
            <td>${wins}</td>
            <td>${losses}</td>
        </tr>
    `;
});

standingsHTML += `
        </tbody>
    </table>
`;

wolvesStandings.innerHTML = standingsHTML;
        updateConference(west, "west-standings");
        updateConference(east, "east-standings");
console.table(west.standings.entries[0].stats.map(stat => ({
    name: stat.name,
    label: stat.abbreviation,
    displayValue: stat.displayValue,
    value: stat.value
})));
     const updateTime = document.getElementById("last-updated");
console.log("Timestamp element:", updateTime);
updateTime.innerText = "Last Updated: " + new Date().toLocaleString();
    })
    .catch(error => {
        console.log("Error loading NBA standings:", error);
    });
    }
    loadStandings();

setInterval(loadStandings, 300000);
const searchInput = document.getElementById("team-search");

searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase().trim();

    // Search all 30 NBA team cards
    const teamCards = document.querySelectorAll(".team-card");

    teamCards.forEach(card => {

        const cardText = card.innerText.toLowerCase();

        card.style.display = cardText.includes(searchText) ? "" : "none";

    });

});
const refreshButton = document.getElementById("refresh-button");

refreshButton.addEventListener("click", function() {
    loadStandings();
});
function loadScoreboard() {
const today = new Date();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 6);

const formatDate = date => date.toISOString().slice(0, 10).replace(/-/g, "");

const dateRange = `${formatDate(sevenDaysAgo)}-${formatDate(today)}`;
    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")
        .then(response => response.json())

        .then(data => {

            const events = data.events;
            const liveGames = events.filter(game => game.status.type.state === "in");

const upcomingGames = events.filter(game => game.status.type.state === "pre");

const pastGames = events.filter(game => game.status.type.state === "post");
const liveContainer = document.getElementById("live-games");

const upcomingContainer = document.getElementById("upcoming-games");

const pastContainer = document.getElementById("past-games");
liveContainer.innerHTML = "<h4>🔴 Live Games</h4>";

upcomingContainer.innerHTML = "<h4>📅 Upcoming Fixtures</h4>";

pastContainer.innerHTML = "<h4>🏁 Past Results</h4>";
function displayGames(games, container) {

    games.forEach(game => {

        const competition = game.competitions[0];
        const competitors = competition.competitors;

        const homeTeam = competitors.find(team => team.homeAway === "home");
        const awayTeam = competitors.find(team => team.homeAway === "away");

        const gameCard = document.createElement("div");
        gameCard.classList.add("past-game");
        gameCard.className = "game-card";

if (game.status.type.state === "in") {
    gameCard.classList.add("live-game");
    gameCard.innerHTML = "<span class='live-badge'>🔴 LIVE</span>" + gameCard.innerHTML;
}

       gameCard.innerHTML = `
    <div class="team-info">
        <div>
            <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}">
            <span>${awayTeam.team.displayName}</span>
        </div>

        <h3>${awayTeam.score} - ${homeTeam.score}</h3>

        <div>
            <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}">
            <span>${homeTeam.team.displayName}</span>
        </div>
    </div>
`; 

        const gameTime = new Date(game.date).toLocaleString("en-KE", {
            timeZone: "Africa/Nairobi",
            dateStyle: "medium",
            timeStyle: "short"
        });
        gameCard.innerHTML += `
            <p>📅 ${gameTime} (EAT)</p>
        `;
if (container === pastContainer && game.competitions[0].headlines?.[0]?.video?.[0]) {

    const video = game.competitions[0].headlines[0].video[0];

    gameCard.innerHTML += `
    <img src="${video.thumbnail}" alt="Game Highlights"
         class="highlight-thumbnail">

    <a href="${video.links.web.href}" target="_blank">
        🎥 Watch Game Highlights
    </a>
`;
}
if (container === pastContainer && game.competitions[0].headlines?.[0]?.description) {

    gameCard.innerHTML += `
        <p class="game-recap">
            📰 ${game.competitions[0].headlines[0].description}
        </p>
    `;

}
if (container === pastContainer) {
    gameCard.classList.add("past-game");
}
        container.appendChild(gameCard);

    });

}
// LOAD PAST 7 DAYS OF NBA RESULTS

const historyDates = [];

for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const formattedDate =
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");

    historyDates.push(formattedDate);
}

Promise.all(
    historyDates.map(date =>
        fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${date}`)
            .then(response => response.json())
    )
)
.then(results => {

    const historicalGames = results
        .flatMap(result => result.events || [])
        .filter(game => game.status.type.state === "post");
console.log("Video Details:", historicalGames[0].competitions[0].headlines[0].video[0]);
    historicalGames.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    pastContainer.innerHTML = "<h4>🏁 Past Results</h4>";

    displayGames(historicalGames, pastContainer);

})
.catch(error => {
    console.log("Error loading past results:", error);
});
displayGames(liveGames, liveContainer);

displayGames(upcomingGames, upcomingContainer);

displayGames(pastGames, pastContainer);

            console.log("NBA Games:", events);

        })

        .catch(error => {
            console.log("Error loading NBA games:", error);
        });

}

loadScoreboard();
function loadWolvesRoster() {

    const rosterContainer = document.getElementById("wolves-roster");

    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/16/roster")

        .then(response => response.json())

        .then(data => {

            rosterContainer.innerHTML = "<ul>";

            data.athletes.forEach(player => {

                rosterContainer.innerHTML += `
                    <li>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(player.fullName + ' NBA player')}" target="_blank">
    ${player.fullName}
</a> — #${player.jersey}
                        (${player.position.displayName})
                    </li>
                `;

            });

            rosterContainer.innerHTML += "</ul>";

        })

        .catch(error => {

            console.log("Error loading Wolves roster:", error);

            rosterContainer.innerHTML = "<p>Unable to load roster.</p>";

        });

}

loadWolvesRoster();
setInterval(loadWolvesRoster, 300000);
function loadWolvesInjuries() {

    const injuryContainer = document.getElementById("wolves-injuries");

    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries")

        .then(response => response.json())

        .then(data => {

            const wolves = data.injuries.find(team => team.displayName === "Minnesota Timberwolves");

            if (!wolves || !wolves.injuries || wolves.injuries.length === 0) {
                injuryContainer.innerHTML = "<p>No reported injuries.</p>";
                return;
            }

            injuryContainer.innerHTML = `
    <p>Last updated: ${new Date().toLocaleString()}</p>
    <ul>
`;

            wolves.injuries.forEach(injury => {

                injuryContainer.innerHTML += `
                    <li>
    <strong>${injury.athlete.displayName}</strong> — <span class="injury-status ${injury.status.toLowerCase()}">
    ${injury.status}
</span>
    <p>${injury.shortComment}</p>
</li>
                `;

            });

            injuryContainer.innerHTML += "</ul>";

        })

        .catch(error => {

            console.log("Error loading injuries:", error);

            injuryContainer.innerHTML =
                "<p>Unable to load injury report.</p>";

        });

}
loadWolvesInjuries();

setInterval(loadWolvesInjuries, 300000);