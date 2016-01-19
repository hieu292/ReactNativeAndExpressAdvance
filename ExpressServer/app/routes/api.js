var Task = require('../models/task');


module.exports = function (express, io) {
    var router = express.Router();
    router.get('/task', function (req, res) {
    Task.find({}, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });
});
    router.post('/task', function (req, res) {
    var task = new Task();
    task.nameTask = req.body.nameTask;
    task.save(function (err, data) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json({
                message: "Create task successfully"
            });
            io.emit('add', data);
        }
    })
});
    router.get('/task/:id', function (req, res) {
    var id = req.params.id;
    Task.findById(id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    })
});
    router.put('/task/:id',function (req, res) {
    Task.findById(req.params.id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            result.nameTask = req.body.nameTask;
            result.completed = req.body.completed;
            result.save(function (err) {
                if(err){
                    console.error(err);
                    res.send(err);
                } else {
                    res.json({
                        message: "Update Successfully!",
                        task: result
                    });
                }
            });
        }
    });
});
    router.delete('/task/:id', function (req, res) {
    Task.findById(req.params.id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else{
            Task.findOneAndUpdate({_id: req.params.id},{completed: true}, function (err) {
                if (err) {
                    console.error(err);
                    res.send(err);
                } else {
                    res.json({
                        message: "Congratulation! You just done a task!"
                    });
                    io.emit('remove', result);
                }
            });
        }
    });
});
router.get('/totalTask', function(req, res){
  Task.count({}, function(err, result){
    if(err){
      console.error(err);
      res.send(err);

    } else{
      res.json({
        total: result
      });
    }
  })
});
router.get('/totalTaskCompleted', function(req, res){
  Task.count({completed: true}, function(err, result){
    if(err){
      console.error(err);
      res.send(err);

    } else{
      res.json({
        total: result
      });
    }
  })
});
router.get('/totalTaskInProgress', function(req, res){
  Task.count({completed: false}, function(err, result){
    if(err){
      console.error(err);
      res.send(err);

    } else{
      res.json({
        total: result
      });
    }
  })
});

router.get('/taskInProgress', function (req, res) {
Task.find({completed: false}, function (err, result) {
    if(err){
        console.error(err);
        res.send(err);
    } else {
        res.json(result);
    }
});
});

router.get('/taskCompleted', function (req, res) {
Task.find({completed: true}, function (err, result) {
    if(err){
        console.error(err);
        res.send(err);
    } else {
        res.json(result);
    }
});
});

return router;
}
