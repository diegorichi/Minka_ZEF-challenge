<p align="center">
  <a href="" rel="noopener">
 <img src="https://cloudinary.hbs.edu/hbsit/image/upload/s--hlT_tlm3--/f_auto,c_fill,h_375,w_750,/v20200101/81CEF22EA97699BEDA53300D8C8C190E.jpg" alt="Project logo"></a>
</p>
<h3 align="center">ZEF PRoject</h3>

---

<p align="center"> ZEF PRoject - Read https://github.com/diegorichi/Minka_ZEF-challenge/blob/main/zef.md
    <br> 
</p>

## 📝 Table of Contents

- [Problem Statement](#problem_statement)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Setting up a local environment](#getting_started)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Authors](#authors)

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
- I leave the log as it, so you should see SQL querys in the console. Of course this shouldn't be there in production at least we have some problem.
- This solution is not a production ready. 
- There are some coupling between services and repositories, but if we implement this in a MS environment, the service should depends on generics and no the details (solid principle). That allow us to modify this implementation in order to access some MS in charge of "users" or AuthZ/AuthN (as an example).
- This solution uses Redis to cache the id of user (only that), and it's insecure as it. But this approach, allow us to scale horizontal the service, since this doesn't mantain any state.
- The API contract such as a raml file is missing
- Swagger is missing.
- There is no documentation on the code. It should be there at least to explain briefly the most important implemetations.
- I didn't use any branching scheme, since I'm the only one member and nobody will join me.
- There is no pipeline defined.
- No scaling, observability, and other aspects defined.

## 🏁 Prerequisites <a name = "prerequisites"></a>

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

To run test just try (not working)

```
> npm test
```

## 🎈 Usage <a name="usage"></a>

To play with the exposed API, you can use the file in Root directory Minka_.postman_collection.json in order to import into postman.

Also to load environments into postman you can use Local.postman_environment.json file

## ⛏️ Built With <a name = "tech_stack"></a>

- [PostgreSQL](https://www.postgresql.org/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
## ✍️ Authors <a name = "authors"></a>

- [@diegorichi](https://github.com/diegorichi) 
