const Score = require('../../services/score');

let controller = {};


controller.index = (req, res) => {
  Score
    .getScoreByCity()
    .then((r)=>r.json())
    .then(data=>{
      console.log('__________this is home', data)
      res.render(
        'home/index',
        {
          scores: data.categories
        }
        )
    })
    .catch(err => console.log('Error:',err));
}

module.exports = controller;
