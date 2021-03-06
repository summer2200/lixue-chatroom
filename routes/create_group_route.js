var GroupItem = require('../models/groupItem');
module.exports = function(app) {

    app.post('/create-group', function(req, res) {
        var groupItem = new GroupItem();
        var body = req.body;

        Object.keys(body).forEach(function(key) {
            groupItem[key] = body[key];
        });
        groupItem.owner = req.cookies.username;
        groupItem.ownerId = req.cookies.userId;
        console.log(groupItem);
        groupItem.save(function(err, doc) {
            if (err) {
                res.json({ status: err });
            } else {
                res.json({ status: 1, data: doc });
                // res.redirect('/personal-page');
            }
        });
    });

    app.get('/create-group', function(req, res) {
        res.render('createGroup');
    });

    app.delete('/delete-group', function(req, res){
        var groupId = req.body.groupId;
        var currentName = req.cookies.username;
        // currentName = 'zhang'
        if(currentName === undefined) {
            res.json('sign-in');
            return;
        }
        GroupItem.findOneAndRemove({_id: groupId}, function(err, result){
            if(err){
                res.status(200).json('fail');
            }else{
                res.status(200).json('success');
            }

        });
    });

    app.post('/my-groups', function(req, res){
        var currentName = req.cookies.username;
        var userId = req.cookies.userId;
        var myGroups = [];
        // currentName = 'zhang'
        if(currentName === undefined) {
            res.json('sign-in');
            return;
        }
        GroupItem.find({}, function(err, results){
            results.forEach(function(item) {
                if (item.ownerId == userId) {
                    //get owned group
                    myGroups.push(item);
                } else if (item.members.some(function(member) {
                    //get joined group
                    return member.id == userId;
                })) {
                    myGroups.push(item);
                }
            });
            res.status(200).json(results);
        });
        // GroupItem.find({owner: currentName, ownerId: userId}, function(err, results){
        //     res.status(200).json(results);
        // });
    });
    // app.post('/add-memeber', function(req, res){
    //     var userInfo = req.body.userInfo;

    //     var currentName = req.cookies.username;
    //     console.log(currentName);
    //     // currentName = 'zhang'
    //     if(currentName === undefined) {
    //         res.json('sign-in');
    //         return;
    //     }
    //     GroupItem.findOne({owner: currentName}, function(err, result){
    //         if(typeof(result['members']) == 'undefined'){
    //             result.members = [];
    //         }
    //         console.log(userInfo)
    //         result.members.push(userInfo);
    //         result.save(function(err){
    //             if(!err){
    //                 res.status(200).json('success');
    //             }
    //         });
    //     });
    // });

    // app.delete('/delete-memeber', function(req, res){
    //     var friendId = req.body.friendId;
    //     var currentName = req.cookies.username;
    //     console.log(currentName);
    //     // currentName = 'zhang'
    //     if(currentName === undefined) {
    //         res.json('sign-in');
    //         return;
    //     }
    //     GroupItem.findOne({owner: currentName}, function(err, result){
    //         if(typeof(result['members']) == 'undefined'){
    //             result.members = [];
    //         }
    //         console.log(friendId)
    //         var index = _.findIndex(result.members,{id: friendId});
    //         console.log(index)
    //         if(index > -1) result.members.splice(index, 1);
    //         result.save(function(err){
    //             if(!err){
    //                 res.status(200).json('success');
    //             }
    //         });
    //     });
    // });

    // app.post('/search-my-friends', function(req, res){
    //     var searchName = req.body.userName;
    //     var userId = req.cookies.userId;
    //     var currentName = req.cookies.username;
    //     console.log(currentName);
    //     // currentName = 'zhang'
    //     if(currentName === undefined) {
    //         res.json('sign-in');
    //         return;
    //     }
    //     UserItem.findOne({ _id: userId}, function(err, result){
    //         if(typeof(result.friends) == 'undefined'){
    //             result.friends = [];
    //         }
    //         var friends = result.friends.filter(function(fri){
    //             return fri.name.indexOf(searchName) > -1;
    //         });
    //         res.status(200).json(friends);
    //     });
    // });
};
