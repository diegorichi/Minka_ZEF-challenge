<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/AZ2iWek.png" alt="Project logo"></a>
</p>
<h3 align="center">rest-express</h3>

<div align="center">

[![Hackathon](https://img.shields.io/badge/hackathon-name-orange.svg)](http://hackathon.url.com)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [Problem Statement](#problem_statement)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Setting up a local environment](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

## 🧐 Problem Statement <a name = "problem_statement"></a>

To referr to problem statement please read ZEF.md

## 💡 Idea / Solution <a name = "idea"></a>

This section is used to describe potential solutions.

One of the idea and proposal of this solution is to show how to handle differents
techniques and approach from the code perspective such as logging, dependency injection

The proposal is to discuss in a meet the missing features, the behavior, and 
business desitions. There are several asumptions in order to achieve
the capacity of coding.

## ⛓️ Limitations <a name = "limitations"></a>

- Please take into the accound that I'm not an expert in NodeJS.
  NodeJS is my 4th language, after Java, Python and even C. Also we can code for NodeJS in javascript and typescript. 
- I choosed typescript because I think that it add types and provide more security.
- Maybe some features could be missing described in ZEF, but I would like to discuss them before to reject the exercise.
- I didn't implement enough testing to ensure a good coverage. This limitation is because I want to show how I know to write a test, since this is only an excercise.
- I leave the log as it, so you shoudl see SQL querys in the console. Of course this shouldn't be there in production at least we have some problem.
- This solution is not a production ready. 
- There are some coupling between services and repositories, but if we implement this in a MS environment, the service should depends on generics and no the details (solid principle). That allow us to modify this implementation in order to access some MS in charge of "users" or AuthZ/AuthN (as an example).
- This solution uses Redis to cache the id of user (only that), and it's insecure as it. But this approach, allow us to scale horizontal the service, since this doesn't mantain any state.
- The API contract such as a raml file is missing
- Swagger is missing.
- There is no documentation on the code. It should be there at least to explain briefly the most important implemetations.



### Prerequisites

- Have installed Docker.
- Have installed NodeJS.
- Have installed GIT.
- ¿ anything is missing? Please contact me.


## 🏁 Getting Started <a name = "getting_started"></a>

- Excecute the following commands to run the project.

```
> git clone https://github.com/diegorichi/Minka_ZEF-challenge.git
> cd Minka_ZEF-challenge/minka_ZEF
> cp .env.example .env
> docker-compose up -d
> npm install --save
> npm run dev
```

To run test just try

```
> npm test
```

## 🎈 Usage <a name="usage"></a>



## ⛏️ Built With <a name = "tech_stack"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [VueJs](https://vuejs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors)
who participated in this project.

## 🎉 Acknowledgments <a name = "acknowledgments"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
