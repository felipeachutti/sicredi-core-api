## Developing at sicredi-core-server

sicredi-core-server is a NodeJS server container built to make easier to provide **RESTFUL** services on resource oriented architecture projects (ROA).

## How we debug it
To debug we are using explicity the [Visual Code](https://code.visualstudio.com/), so **if you need to debug the sicredi-core-server** open the project on VS Code and press ```F5``` or click on the **bug icon** and **press the green play button**. **Don't forget to set your desireables breakpoints**.
There's a file on the folder ```.vscode/launch.json``` which represent the debug configuration.

## Configuring development environment

#### Step 1: installing tools

* install git: [git-scm](http://git-scm.com/)
* install NodeJS@6.3.1+: [nodejs.org](http://nodejs.org)
* install Bunyan globally: `npm install bunyan -g` (to show core log with pretty print)

#### Step 2: preparing repository

repository:
```
Heroku
```

Install project packages
```
cd core-server
npm install
```
### Step 3: run tests to check if things are fine

Easy like that:
```
npm test
```

### Development style guide

The project pattern follows is based on consolidated best practices. That means:
* there is a Continuous Integration system;
* there is a static code analysis tool;
* the repository flow is simple: [Git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) do the job;
* ESLint checks are part of the build process;

### Database

The entire development environment is provided by ```heroku```, as the database. The database connection string is different, based on application:

* `Server  (sicredi digital)` : ```mongodb://root:s1cr3d1@ds043477.mlab.com:43477/sicredi-digital-db```


### Development environment variables

For development, you must set this variables and values in your OS:
  * __NODE_ENV__: development
  * __WORKERS__: 1

### NPM tasks

Several tasks are scripted to make things easier to dev team. In this project, you will find:
  * ```npm start```                  : this task is not supposed to be used into dev phase. This is used only for ```Heroku``` publishing.


## License terms

Copyright 2020 Sicredi Core Server.
