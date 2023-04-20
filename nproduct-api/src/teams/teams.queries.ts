export const TeamQueries = {
    GetTeams: `
    SELECT
      id,
        name,
        league,
      (case when t.isActive is not null
        then 'true'
        else 'false'
      end) as 'isActive'
    FROM teams as t
    WHERE
        isActive = true
    `,
  
    GetTeamsById: `
    SELECT
      id,
        name,
        league,
      (case when t.isActive is not null
        then 'true'
        else 'false'
      end) as 'isActive'
    FROM teams as t
    WHERE
      id = ?
    `,
  
    AddTeam: `
    INSERT INTO teams (name, league, isActive)
      VALUES (?, ?, true);
    `,
  
    UpdateTeamById: `
    UPDATE teams
    SET name = ?,
        league = ?
    WHERE
      id = ?
    `,
  
    DeleteTeamById: `
    UPDATE teams
    SET isActive = false
    WHERE
      id = ?
    `
  };