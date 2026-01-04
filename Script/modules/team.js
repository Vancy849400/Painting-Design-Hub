export function initializeTeam(teamData) {
    renderTeamCards(teamData);
}

function renderTeamCards(teamData) {
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) {
        console.error("teamGrid element not found");
        return;
    }

    teamGrid.innerHTML = teamData
        .map((member) => `
            <div class="team-card">
                <div class="team-avatar">${member.avatar}</div>
                <h3>${member.name}</h3>
                <div class="team-role">${member.role}</div>
                <p>${member.description}</p>
                <div class="team-specialties">
                    ${member.specialties
                        .map((s) => `<span class="specialty-tag">${s}</span>`)
                        .join("")}
                </div>
            </div>
        `)
        .join("");
}