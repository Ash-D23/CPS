
# CPS: Command Line Project Supporter
CPS is a Command Line tool built to make collaboration easy and keep a track of users,todos,status of the project and most importantly it makes collaboration easy by maintaing todos,work assigned,work completed,individual work and user list which will be stored using hasura data apis. Other features : List Users,List work,user info,Stats,add users etc

## What does this come with?

* Hasura as Backend for storing the data
* Deployed with node server
* CLI for collaboration 

## Deployment instructions

### Basic deployment:

* Press the **Clone & Deploy** button and follow the instructions.
* The `hasura quickstart` command clones the project repository to your local computer, and also creates a **free Hasura cluster**, where the project will be hosted for free.
* A git remote (called hasura) is created and initialized with your project directory.
* Run `git add .`, `git commit`, and `git push hasura master`.
* Go to the CLI-Tool Directory and type ``` node index.js ```

### Making changes and deploying

* To make changes to the project, browse to `/microservices/api/src` and edit the `server.js` file in according to your app.
* Commit the changes, and perform `git push hasura master` to deploy the changes.






