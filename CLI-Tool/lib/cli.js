/*
 * CLI-related tasks
 *
 */

 // Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var _logs = require('./logs');
var helpers = require('./helpers');
var request = require('request');


// Instantiate the cli module object
var cli = {};

// Input handlers
e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('stats',function(str){
  cli.responders.stats();
});

e.on('list users',function(str){
  cli.responders.listUsers();
});

e.on('user info',function(str){
  cli.responders.userInfo(str);
});

e.on('add users',function(str){
  cli.responders.addUsers(str);
});

e.on('list projects',function(str){
  cli.responders.listProjects(str);
});

e.on('add user projects',function(str){
  cli.responders.addProject(str);
});

e.on('list user projects',function(str){
  cli.responders.listUserProject(str);
});

e.on('todos',function(str){
  cli.responders.todo(str);
});

e.on('add todo',function(str){
  cli.responders.addTodo(str);
});

e.on('delete todo',function(str){
  cli.responders.deleteTodo(str);
});

e.on('list work',function(str){
  cli.responders.listWork(str);
});

e.on('add work',function(str){
  cli.responders.addWork(str);
});

e.on('finish work',function(str){
  cli.responders.finishWork(str);
});

e.on('work complete',function(str){
  cli.responders.workComplete(str);
});


// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function(){

  // Codify the commands and their explanations
  var commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get statistics on the underlying operating system and resource utilization',
    'list users' : 'Shows a list of all the users',
    'user info --{userId}' : 'Show details of a specified user',
    'add users --{username} --{email}' : 'Add users to the database',
    'list projects' : 'list the projects currently available',
    'add user projects --{id} --{name}' : 'Assigns a user to a particular project',
    'list user projects --{projectName}' : 'Lists the users working on that project',
    'todos' : 'Display the todos',
    'add todo --{todoname}' : 'add todos for your team',
    'delete todo --{todoId}' : 'delete todos from the database',
    'list work' : 'displays the work assigned to all the members',
    'add work --{userId} --{useername}' : 'assigns work to the particular user ',
    'finish work --{userid} --{workname}' : 'sets work as completed',
    'work complete' : 'displays list of people completed their task'
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(var key in commands){
     if(commands.hasOwnProperty(key)){
        var value = commands[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();

};

// Create a vertical space
cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
      console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);


};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};

// Exit
cli.responders.exit = function(){
  process.exit(0);
};

// Stats
cli.responders.stats = function(){
  // Compile an object of stats
  var stats = {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
  };

  // Create a header for the stats
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for(var key in stats){
     if(stats.hasOwnProperty(key)){
        var value = stats[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }

  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();

};

cli.responders.listUsers = function(){

  request({
       url: `https://api.decagon50.hasura-app.io/listusers`,
       json: true
     },(error,response,body) =>{
    if(response.statusCode==200){
       console.log('User List:');
       for(i=0;i<body.length;i++){
     console.log(' \x1b[33m' + (i+1) + '. ' + body[i].username + ' (user_id: '+ body[i].userid+')' +'\x1b[0m');
   }
  }else{
    console.log('server not responding , please try again later')
  }
})


};

cli.responders.userInfo = function(str){

  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/userinfo/`+arr[1],
       json: true
     },(error,response,body) =>{

 if(response.statusCode==200){
     console.log(' \x1b[33m Username: ' + body[0].username +'\x1b[0m');
     console.log(' \x1b[33m Email Id: ' + body[0].email +'\x1b[0m');

     request({
          url: `https://api.decagon50.hasura-app.io/lsproject/`+arr[1],
          json: true
        },(error,response,body) =>{

          console.log('Project Work:');
         for(i=0;i<body.length;i++){
        console.log(' \x1b[33m ' + body[i].project +'\x1b[0m');
      }
        request({
             url: `https://api.decagon50.hasura-app.io/userjobs/`+arr[1],
             json: true
           },(error,response,body) =>{

             console.log('Work Assigned:');
             var complete='null';
            for(i=0;i<body.length;i++){
              if(body[i].complete==true){
                complete="Completed"
              }
              else {
                complete="Not Complete"
              }
           console.log(' \x1b[33m ' + body[i].jobname + '   Status : '+ complete +'\x1b[0m');

         }

        })

   });


  }
  else {
    console.log('server not responding , please try again later');
}
  });



};

cli.responders.addUsers = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/addusers?name=`+arr[1]+`&email=`+arr[2],
       json: true
     },(error,response,body) =>{
       if(response.statusCode==200){
console.log(body.returning[0].username + ' was added with user_id:' + body.returning[0].userid + ' and email id: '+body.returning[0].email );
}
else{
  console.log('server not responding , please try again later');
}

  });

};

cli.responders.listProjects = function(str){

  request({
       url: `https://api.decagon50.hasura-app.io/project`,
       json: true
     },(error,response,body) =>{

       if(response.statusCode==200){

   for(i=1;i<body.result.length;i++){
    console.log(' \x1b[33m' + i + '. ' + body.result[i] +'\x1b[0m');
 }
  }
  else{
    console.log('server not responding , please try again later');
  }
});



};


cli.responders.addProject = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/addproject?project=`+arr[2]+`&id=`+arr[1],
       json: true
     },(error,response,body) =>{
if(response.statusCode==200){
         console.log('added project succesfully');
      }
  else{
    console.log('could not add , please try again');
  }
  });

};

cli.responders.listUserProject = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/listproject?name=`+arr[1],
       json: true
     },(error,response,body) =>{
       if(response.statusCode==200){
       console.log('Users working on '+body[0].project);

       for(i=0;i<body.length;i++){
     console.log(' \x1b[33m' + (i+1) + '. ' + body[i].uid.username +'\x1b[0m');
  }
  }
  else{
    console.log('server not responding , please try again later');
  }
});


};

cli.responders.todo = function(str){

  request({
       url: `https://api.decagon50.hasura-app.io/listtodos`,
       json: true
     },(error,response,body) =>{
       if(response.statusCode==200){

       console.log("Todos are :");
      for(i=0;i<body.length;i++){
    console.log(' \x1b[33m' + (i+1) + '. ' + body[i].todo + ' (tid:'+body[i].tid+')' +'\x1b[0m');
   }

  }
  else{
    console.log('server not responding , please try again later');
  }
});

};

cli.responders.addTodo = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/addtodo?name=`+arr[1],
       json: true
     },(error,response,body) =>{

       if(response.statusCode==200){
                console.log('added todo succesfully');
         }
         else{
           console.log('could not add , please try again');
         }
  });
};

cli.responders.deleteTodo = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/deletetodos/`+arr[1],
       json: true
     },(error,response,body) =>{
       if(response.statusCode==200){
                console.log('deleted todo succesfully');
         }
         else{
           console.log('could not delete, please try again');
         }

  });

  };

cli.responders.listWork = function(str){

  request({
       url: `https://api.decagon50.hasura-app.io/listjobs`,
       json: true
     },(error,response,body) =>{
       if(response.statusCode==200){

       console.log("Work assigned to users :");
       for(i=0;i<body.length;i++){
     console.log(' \x1b[33m' + (i+1) + '. ' + body[i].uid.username+ ' : '+ body[i].jobname +'\x1b[0m');
  }
  }
  else{
    console.log('server not responding , please try again later');
  }
});

};

cli.responders.addWork = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/addjobs?id=`+arr[1]+`&name=`+arr[2],
       json: true
     },(error,response,body) =>{

       if(response.statusCode==200){
                console.log('Worked assigned to user succesfully');
         }
         else{
           console.log('could not assign work, please try again');
         }
  });

};

cli.responders.finishWork = function(str){
  var arr = str.split('--');

  request({
       url: `https://api.decagon50.hasura-app.io/completework?id=`+arr[1]+`&name=`+arr[2],
       json: true
     },(error,response,body) =>{

       if(response.statusCode==200){
           console.log('Command executed succesfully');
         }
         else{
           console.log('could not execute command, please try again');
         }

  });

};


cli.responders.workComplete = function(str){

  request({
       url: `https://api.decagon50.hasura-app.io/jcompleted`,
       json: true
     },(error,response,body) =>{

       if(response.statusCode==200){

     for(i=0;i<body.length;i++){
     console.log(' \x1b[33m' + (i+1) + '. ' + body[i].jobname + ' by ' + body[i].uid.username +'\x1b[0m');
  }
  }
  else{
    console.log('server not responding , please try again later');
  }
});


};


// Input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if(str){
    // Codify the unique strings that identify the different unique questions allowed be the asked
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'user info',
      'add users',
      'list projects',
      'add user projects',
      'list user projects',
      'todos',
      'add todo',
      'delete todo',
      'list work',
      'add work',
      'finish work',
      'work complete'

    ];

    // Go through the possible inputs, emit event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if(!matchFound){
      console.log("Sorry, try again");
    }

  }
};

// Init script
cli.init = function(){

  // Send to console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on('line', function(str){

    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on('close', function(){
    process.exit(0);
  });

};

 // Export the module
 module.exports = cli;
