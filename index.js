const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
app.use(express.json());
const jsonPath = path.resolve('./file/tasks.json')


app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  res.send(jsonFile);
});


app.post('/tasks', async (req, res) => {
  const task = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1
  tasksArray.push({ ...task, id: newId });
  console.log(tasksArray);
  res.end();
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
});


app.put('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const { status, id } = req.body;
  const taskIndex = tasksArray.findIndex(task => task.id === id);

  if (taskIndex >= 0) {
    tasksArray[taskIndex].status = status;
    typeof status === "boolean" ? await fs.writeFile(jsonPath, JSON.stringify(tasksArray))  : console.log("valor invalido, utiliza solo true o false.");
  }
  res.send(typeof status === "boolean" ? "actualizado exitosamente" : "valor invalido, utiliza solo true o false.");
});


app.delete('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const { id } = req.body;
  const taskIndex = tasksArray.findIndex(task => task.id === id);

  tasksArray.splice(taskIndex, 1)
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();

})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`servidor escuchando en ${PORT}`)
})
