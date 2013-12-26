module.exports = function(moment, Tournament){

  this.list = function(req, res){
    Tournament.find(function(err, tournaments){
      if(!err){
        return res.send(tournaments);
      }else{
        return console.log(err);
      }
    });
  }

  this.get = function(req, res){
    var id = req.route.params.id;
    Tournament.find(function(err, tournament){
      if(!err){
        return res.send(tournament);
      }else{
        return console.log(err);
      }
    });
  }

  this.new = function(req, res){
    console.log('new');
    res.render('tournaments/new', {title: 'New Tournament'});
  }

  this.create = function(req, res){
    console.log('create');
    var tournament = new Tournament({
      name: req.body.name,
      location: req.body.location,
      director: req.body.director,
      date: moment().unix()
    });

    tournament.save(function(err){
      if(!err){
        res.redirect('/tournaments');
        return console.log("created");
      }else {
        return console.log(err);
      }
    });
  }

}