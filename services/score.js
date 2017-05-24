const fetch = require('node-fetch');
const Score = {};

Score.getScoreByCity=()=>{

  return fetch(`https://api.teleport.org/api/urban_areas/slug:denver/scores/`);

};

module.exports = Score;
