const express = require("express");
const cors = require("cors");

const { v4:uuidv4, validate:uuidValidate } = require('uuid')

const app = express();

function validateRepositoriesId(request, response, next){
  const { id } = request.params;

  if(!uuidValidate(id)){
      return response.status(400).json({"error":"Invalid Repository Id"});
  }

  return next();
}

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', validateRepositoriesId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuidv4(),
    title:title,
    url: url,
    techs: techs,
    likes:0
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(400).json({"message":"Repository not found"});
  }

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.status(200).json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
    
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
      return response.status(400).json({"message":"Repository not found"})
  }
  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoriesId, (request, response) => {
  const { id } = request.params;
    
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
      return response.status(400).json({"message":"Repository not found"})
  }
  repositories[repositoryIndex].likes += 1;
  return response.send(repositories[repositoryIndex]);
  
});

module.exports = app;
