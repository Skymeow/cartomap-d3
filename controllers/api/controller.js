const Score = require('../../services/score');
let controller = {};


controller.getScoreByCity = (req,res)=> {
  Score
    .getScoreByCity()
    .then(r=>r.json())
    .then(data=>{
      console.log('*********api', data)
      res.json({
        data: data.categories
      });
    })

}

module.exports = controller;
