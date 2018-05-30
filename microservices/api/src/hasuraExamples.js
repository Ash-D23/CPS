var express = require('express');
var router = express.Router();
var config = require('./config');
var request = require('request');

router.route("/").get(function (req, res) {
  res.send(" <h2>CPS : Command-Line Project Supporter By Ashutosh<h2> ");
});

router.route("/listusers").get(function (req, res) {

  var fetchAction =  require('node-fetch');

var url = "https://data.decagon50.hasura-app.io/v1/query";

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
};

var body = {
    "type": "select",
    "args": {
        "table": "users",
        "columns": [
            "userid",
            "username"
        ]
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
	return response.json();
})
.then(function(result) {
	res.json(result);
})
.catch(function(error) {
	console.log('Request Failed:' + error);
});


})

router.route("/userinfo/:id").get(function (req, res) {
var uid= req.params.id;
  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "users",
          "columns": [
              "username",
              "email"
          ],
          "where": {
              "userid": {
                  "$eq": uid
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
   res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/addusers").get(function (req, res) {
var uname = req.param('name');
var uemail = req.param('email');
  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "users",
          "objects": [
              {
                  "username": uname,
                  "email": uemail
              }
          ],
          "returning": [
              "userid",
              "username",
              "email"
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });


})

router.route("/project").get(function (req, res) {


  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer 5cb22d3ad38ea4a0bb1a7c3082f523e651154a96de9f9c25",
          "X-Hasura-Role": "admin"
      }
  };

  var body = {
      "type": "run_sql",
      "args": {
          "sql": "select distinct project from projects "
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})


router.route("/addproject").get(function (req, res) {
var pname= req.param('project');
var uid = req.param('id');


  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "projects",
          "objects": [
              {
                  "project": pname,
                  "userid": uid
              }
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });


})

router.route("/lsproject/:id").get(function (req,res){
var uid = req.params.id;
  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "projects",
          "columns": [
              "project",
              {
                  "name": "uid",
                  "columns": [
                      "username"
                  ]
              }
          ],
          "where": {
              "userid": {
                  "$eq": uid
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})


router.route("/listproject").get(function (req, res){
  var pname = req.param('name');

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "projects",
          "columns": [
              "project",
              {
                  "name": "uid",
                  "columns": [
                      "username",
                      "userid"
                  ]
              }
          ],
          "where": {
              "project": {
                  "$eq": pname
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });


})

router.route("/listtodos").get(function (req, res) {

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "todos",
          "columns": [
              "*"
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/addtodo").get(function (req, res) {
  var tname = req.param('name');

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "todos",
          "objects": [
              {
                  "todo": tname
              }
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/deletetodos/:id").get(function (req, res) {
  var tid= req.params.id;

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "delete",
      "args": {
          "table": "todos",
          "where": {
              "tid": {
                  "$eq": tid
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/userjobs/:id").get(function (req, res) {
var uid=req.params.id;
  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "job",
          "columns": [
              "userid",
              "jobname",
              "complete"
          ],
          "where": {
              "userid": {
                  "$eq": uid
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/listjobs").get(function (req, res) {

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "job",
          "columns": [
              "jid",
              "jobname",
              "complete",
              {
                  "name": "uid",
                  "columns": [
                      "username",
                      "userid"
                  ]
              }
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/addjobs").get(function (req, res) {
  var uid=req.param('id');
  var jname=req.param('name');
//  var jcomplete=req.param('complete');

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "job",
          "objects": [
              {
                  "userid": uid,
                  "jobname": jname,
                  "complete": false
              }
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

router.route("/completework").get(function (req, res) {
var uid=req.param('id');
var jname = req.param('name');

var fetchAction =  require('node-fetch');

var url = "https://data.decagon50.hasura-app.io/v1/query";

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
};

var body = {
    "type": "update",
    "args": {
        "table": "job",
        "where": {
            "$and": [
                {
                    "userid": {
                        "$eq": uid
                    }
                },
                {
                    "jobname": {
                        "$eq": jname
                    }
                }
            ]
        },
        "$set": {
            "complete": "true"
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
	return response.json();
})
.then(function(result) {
	res.json(result);
})
.catch(function(error) {
	console.log('Request Failed:' + error);
});

})


router.route("/jcompleted").get(function (req, res) {

  var fetchAction =  require('node-fetch');

  var url = "https://data.decagon50.hasura-app.io/v1/query";

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "job",
          "columns": [
              "jobname",
              "complete",
              {
                  "name": "uid",
                  "columns": [
                      "username",
                      "userid"
                  ]
              }
          ],
          "where": {
              "complete": {
                  "$eq": "true"
              }
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	res.json(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });

})

/*
router.route("/examples/data").get(function (req, res) {
  console.log("Get articles");
  //Fetch all rows from table - articles
  var selectOptions = {
    url: config.projectConfig.url.data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-User-Id': '0',
      'X-Hasura-Role': 'anonymous'
    },
    body: JSON.stringify({
      'type': 'select',
      'args': {
        'table': 'article',
        'columns': [
          'id',
          'author_id',
          'rating',
          'title'
        ],
        'limit': 10
      }
    })
  }
  request(selectOptions, function(error, response, body) {
    if (error) {
        console.log('Error from select request: ');
        console.log(error)
        res.status(500).json({
          'error': error,
          'message': 'Select request failed'
        });
    }
    res.render('data', {'data': JSON.parse(body)});
  })
})

router.route("/examples/auth").get(function (req, res) {
  const baseDomain = req.headers['x-hasura-base-domain'];
  // check if logged in user or not
  if (req.headers['x-hasura-allowed-roles'].includes("anonymous")) {
    res.render("auth_anonymous", {'base_domain': baseDomain});
  } else {
    res.render("auth_user", {'base_domain': baseDomain, 'user_id': req.headers['x-hasura-user-id'],
      'roles': req.headers['x-hasura-allowed-roles']});
  }
})

router.route("/examples/filestore").get(function (req, res) {
  const baseDomain = req.headers['x-hasura-base-domain'];
  // check if logged in user or not
  if (req.headers['x-hasura-allowed-roles'].includes("anonymous")) {
    res.render("filestore_anonymous", {'base_domain': baseDomain});
  } else {
      requestPayload = {
            "type": "select",
            "args": {
                "table": {
                    "name": "hf_file",
                    "schema": "hf_catalog"
                },
                "columns": [ "*" ],
                "where": {"user_id": req.headers['x-hasura-user-id']}
            }
      }
  var selectOptions = {
    url: config.projectConfig.url.data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-User-Id': '1',
      'X-Hasura-Role': 'admin'
    },
    body: JSON.stringify(requestPayload)
  };
  request(selectOptions, function(error, response, body) {
    if (error) {
        console.log('Error from select request: ');
        console.log(error)
        res.status(500).json({
          'error': error,
          'message': 'Select request failed'
        });
    } else {
      res.render("filestore_user", {'base_domain': baseDomain, 'files': JSON.parse(body), 'filesLength': JSON.parse(body).length});
    }
  })


  }
})
*/
module.exports = router;
