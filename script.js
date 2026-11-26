const nbaTeams = [

    // WESTERN CONFERENCE

    // Northwest Division
   { id: 7, name: "Denver Nuggets", city: "Denver", conference: "Western", division: "Northwest", arena: "Ball Arena", coach: "David Adelman" },
    { id: 16, name: "Minnesota Timberwolves", city: "Minneapolis", conference: "Western", division: "Northwest", arena: "Target Center", coach: "Chris Finch" },
    { id: 25, name: "Oklahoma City Thunder", city: "Oklahoma City", conference: "Western", division: "Northwest", arena: "Paycom Center", coach: "Mark Daigneault" },
    { id: 22, name: "Portland Trail Blazers", city: "Portland", conference: "Western", division: "Northwest", arena: "Moda Center", coach: "Micah Nori" },
     { id: 26, name: "Utah Jazz", city: "Salt Lake City", conference: "Western", division: "Northwest", arena: "Delta Center", coach: "Will Hardy" },

    // Pacific Division
    { id: 9, name: "Golden State Warriors", city: "San Francisco", conference: "Western", division: "Pacific", arena: "Chase Center", coach: "Steve Kerr" },
    { id: 12, name: "LA Clippers", city: "Los Angeles", conference: "Western", division: "Pacific", arena: "Intuit Dome", coach: "Tyronn Lue" },
   { id: 13, name: "Los Angeles Lakers", city: "Los Angeles", conference: "Western", division: "Pacific", arena: "Crypto.com Arena", coach: "JJ Redick" },
    { id: 21, name: "Phoenix Suns", city: "Phoenix", conference: "Western", division: "Pacific", arena: "Mortgage Matchup Center", coach: "Jordan Ott" },
    { id: 23, name: "Sacramento Kings", city: "Sacramento", conference: "Western", division: "Pacific", arena: "Golden 1 Center", coach: "Doug Christie" },

    // Southwest Division

{ id: 6, name: "Dallas Mavericks", city: "Dallas", conference: "Western", division: "Southwest", arena: "American Airlines Center", coach: "Dusty May" },
{ id: 10, name: "Houston Rockets", city: "Houston", conference: "Western", division: "Southwest", arena: "Toyota Center", coach: "Ime Udoka" },
{ id: 29, name: "Memphis Grizzlies", city: "Memphis", conference: "Western", division: "Southwest", arena: "FedExForum", coach: "Tuomas Iisalo" },
{ id: 3, name: "New Orleans Pelicans", city: "New Orleans", conference: "Western", division: "Southwest", arena: "Smoothie King Center", coach: "Jamahl Mosley" },
{ id: 24, name: "San Antonio Spurs", city: "San Antonio", conference: "Western", division: "Southwest", arena: "Frost Bank Center", coach: "Mitch Johnson" },

    // EASTERN CONFERENCE

    // Atlantic Division
    { id: 2, name: "Boston Celtics", city: "Boston", conference: "Eastern", division: "Atlantic", arena: "TD Garden", coach: "Joe Mazzulla" },
    { id: 17, name: "Brooklyn Nets", city: "Brooklyn", conference: "Eastern", division: "Atlantic", arena: "Barclays Center", coach: "Steve Nash" },
    { id: 18, name: "New York Knicks", city: "New York", conference: "Eastern", division: "Atlantic", arena: "Madison Square Garden", coach: "Tom Thibodeau" },
    { id: 20, name: "Philadelphia 76ers", city: "Philadelphia", conference: "Eastern", division: "Atlantic", arena: "Wells Fargo Center", coach: "Doc Rivers" },
    { id: 28, name: "Toronto Raptors", city: "Toronto", conference: "Eastern", division: "Atlantic", arena: "Scotiabank Arena", coach: "Nick Nurse" },

    // Central Division
    { id: 4, name: "Chicago Bulls", city: "Chicago", conference: "Eastern", division: "Central" },
    { id: 5, name: "Cleveland Cavaliers", city: "Cleveland", conference: "Eastern", division: "Central" },
    { id: 8, name: "Detroit Pistons", city: "Detroit", conference: "Eastern", division: "Central" },
    { id: 11, name: "Indiana Pacers", city: "Indianapolis", conference: "Eastern", division: "Central" },
    { id: 15, name: "Milwaukee Bucks", city: "Milwaukee", conference: "Eastern", division: "Central" },

    // Southeast Division
    { id: 1, name: "Atlanta Hawks", city: "Atlanta", conference: "Eastern", division: "Southeast" },
    { id: 30, name: "Charlotte Hornets", city: "Charlotte", conference: "Eastern", division: "Southeast" },
    { id: 14, name: "Miami Heat", city: "Miami", conference: "Eastern", division: "Southeast" },
    { id: 19, name: "Orlando Magic", city: "Orlando", conference: "Eastern", division: "Southeast" },
    { id: 27, name: "Washington Wizards", city: "Washington", conference: "Eastern", division: "Southeast" }

];
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
                table.tBodies[0].appendChild(row);
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
                    r.children[1].textContent.trim() === teamName
                );

                if (!row) return;

row.classList.remove("playoff-team", "playin-team");

if (rowClass) {
    row.classList.add(rowClass);
}

row.children[0].innerText = index + 1;
table.tBodies[0].appendChild(row);
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

        const east = data.children.find(c => c.name === "Eastern Conference");
const west = data.children.find(c => c.name === "Western Conference");
nbaTeams
    .filter(team =>
        team.division === "Northwest" ||
        team.division === "Pacific" ||
        team.division === "Southwest" ||
        team.division === "Atlantic" ||
        team.division === "Central" ||
        team.division === "Southeast"
    )
    .forEach(team => {

        const conference = team.conference === "Western" ? west : east;

        const container = document.getElementById(`standings-${team.id}`);

        const teams = [...conference.standings.entries].sort((a, b) => {

            const percentageA = Number(
                a.stats.find(s => s.name === "winPercent")?.value ?? 0
            );

            const percentageB = Number(
                b.stats.find(s => s.name === "winPercent")?.value ?? 0
            );

            return percentageB - percentageA;

        });

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

        teams.forEach((teamEntry, index) => {

            const wins = teamEntry.stats.find(s => s.name === "wins")?.value ?? "—";
            const losses = teamEntry.stats.find(s => s.name === "losses")?.value ?? "—";

            standingsHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${teamEntry.team.displayName}</td>
                    <td>${wins}</td>
                    <td>${losses}</td>
                </tr>
            `;

        });

        standingsHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = standingsHTML;

    });
              updateConference(west, "west-standings");
        updateConference(east, "east-standings");

        const updateTime = document.getElementById("last-updated");
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
document.querySelectorAll("#east-standings, #west-standings").forEach(table => {
    const section = table.closest("details");

    section.addEventListener("toggle", function() {
        if (section.open) {
            loadStandings();
        }
    });
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
gameCard.dataset.gameId = game.id;
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
gameCard.addEventListener("click", function() {

    let playByPlay = gameCard.querySelector(".play-by-play");

    if (playByPlay) {
        playByPlay.remove();
        return;
    }

    const details = document.createElement("div");
    details.className = "play-by-play";
    details.innerHTML = "<p>Loading game events...</p>";

    gameCard.appendChild(details);

    fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${game.id}`)
        .then(response => response.json())
        .then(data => {

            const scoringPlays = (data.plays || [])
    .filter(play => play.scoringPlay)
    .sort((a, b) =>
        a.period.number - b.period.number
    );

                const quarters = {};

scoringPlays.forEach(play => {
    const quarter = play.period.number;

    if (!quarters[quarter]) {
        quarters[quarter] = [];
    }

    quarters[quarter].push(play);
});

details.innerHTML = Object.keys(quarters).map(quarter => `
    <h4>🏀 Quarter ${quarter}</h4>

    ${quarters[quarter].map(play => `
        <p>
            ⏱️ ${play.clock.displayValue}
            <br>
            ${play.text}
        </p>
    `).join("")}

`).join("") || "<p>No scoring events available.</p>";        
        })
        .catch(error => {
            details.innerHTML = "<p>Unable to load game events.</p>";
            console.log(error);
        });

});
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
    nbaTeams
    .filter(team => activeDivisions.includes(team.division))
    .forEach(team => {

        const resultsContainer = document.getElementById(`results-${team.id}`);

        const teamResults = historicalGames.filter(game =>
            game.competitions[0].competitors.some(
                competitor => competitor.team.displayName === team.name
            )
        );

        resultsContainer.innerHTML = `<h4>${team.name} Past Results</h4>`;

        if (teamResults.length === 0) {
            resultsContainer.innerHTML += "<p>No past results found.</p>";
        } else {
            displayGames(teamResults, resultsContainer);
        }

    });

})
.catch(error => {
    console.log("Error loading past results:", error);
});
displayGames(liveGames, liveContainer);
displayGames(upcomingGames, upcomingContainer);

nbaTeams
    .filter(team =>
        team.division === "Northwest" ||
team.division === "Pacific" ||
team.division === "Southwest" ||
team.division === "Atlantic" ||
team.division === "Central" ||
team.division === "Southeast"
    )
    .forEach(team => {

        const fixturesContainer = document.getElementById(`fixtures-${team.id}`);

        const teamUpcoming = events.filter(game =>
            game.status.type.state === "pre" &&
            game.competitions[0].competitors.some(
                competitor => competitor.team.displayName === team.name
            )
        );


        fixturesContainer.innerHTML = `<h4>${team.name} Upcoming Fixtures</h4>`;

        if (teamUpcoming.length === 0) {
            fixturesContainer.innerHTML += "<p>No upcoming fixtures found.</p>";
        } else {
            displayGames(teamUpcoming, fixturesContainer);
        }

    });
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
function generateDivisionTeams(divisionName, containerId) {

    const container = document.getElementById(containerId);

    const teams = nbaTeams.filter(team =>
        team.division === divisionName
    );

    teams.forEach(team => {

        container.innerHTML += `
            <details class="team-card">

                <summary>${team.name}</summary>

                <details>
                    <summary>🏀 Team Profile</summary>
                    <p>Conference: ${team.conference}</p>
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/${team.id}.png" width="25" height="25">
                    <p>Division: ${team.division}</p>
                    <p>Home: ${team.city}</p>
                    <div id="team-info-${team.id}">
    <p>Arena: ${team.arena || "Information unavailable"}</p>
    <p>Head Coach: ${team.coach || "Information unavailable"}</p>
</div>
                </details>

                <details>
                    <summary>👥 Team Roster</summary>
                    <div id="roster-${team.id}">
                        <p>Loading roster...</p>
                    </div>
                </details>

                <details>
                    <summary>🏥 Injury Report</summary>
                    <div id="injuries-${team.id}">
                        <p>Loading injuries...</p>
                    </div>
                </details>

                <details>
                    <summary>📊 Conference Standings</summary>
                    <div id="standings-${team.id}">
                        <p>Loading standings...</p>
                    </div>
                </details>

                <details>
                    <summary>📅 Upcoming Fixtures</summary>
                    <div id="fixtures-${team.id}">
                        <p>Loading fixtures...</p>
                    </div>
                </details>

                <details>
                    <summary>🏆 Past Game Results</summary>
                    <div id="results-${team.id}">
                        <p>Loading results...</p>
                    </div>
                </details>

            </details>
        `;

    });

}

generateDivisionTeams("Northwest", "northwest-teams");
generateDivisionTeams("Pacific", "pacific-teams");
generateDivisionTeams("Southwest", "southwest-teams");
generateDivisionTeams("Atlantic", "atlantic-teams");
generateDivisionTeams("Central", "central-teams");
generateDivisionTeams("Southeast", "southeast-teams");
function loadTeamRoster(teamId, containerId) {

    const rosterContainer = document.getElementById(containerId);

    fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`)

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

            console.log("Error loading roster:", error);

            rosterContainer.innerHTML = "<p>Unable to load roster.</p>";

        });

}
const activeDivisions = [
    "Northwest",
    "Pacific",
    "Southwest",
    "Atlantic",
    "Central",
    "Southeast"
];

nbaTeams
    .filter(team => activeDivisions.includes(team.division))
    .forEach(team => {
        loadTeamRoster(team.id, `roster-${team.id}`);
    });

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
function loadTeamInjuries(teamName, containerId) {

    const injuryContainer = document.getElementById(containerId);

    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries")

        .then(response => response.json())

        .then(data => {

            const team = data.injuries.find(
                item => item.displayName === teamName
            );

            if (!team || !team.injuries || team.injuries.length === 0) {
                injuryContainer.innerHTML = "<p>No reported injuries.</p>";
                return;
            }

            injuryContainer.innerHTML = `
                <p>Last updated: ${new Date().toLocaleString()}</p>
                <ul>
            `;

            team.injuries.forEach(injury => {

                injuryContainer.innerHTML += `
                    <li>
                        <strong>${injury.athlete.displayName}</strong> —
                        <span class="injury-status ${injury.status.toLowerCase()}">
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
function refreshTeamInjuries() {

    nbaTeams
       .filter(team => activeDivisions.includes(team.division))
        .forEach(team => {
            loadTeamInjuries(team.name, `injuries-${team.id}`);
        });

}

refreshTeamInjuries();

setInterval(refreshTeamInjuries, 300000);
