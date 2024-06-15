import { Server } from 'azle';
import express from 'express';
import { PollCreateDTO } from './entities/Poll';
import { PollRepository } from './repositories/PollRepository';

const pollRepository = new PollRepository();

export default Server(() => {
  const app = express();
  app.use(express.json());

  app.post("/polls", (req, res) => {
    const { creatorName, question, startDate, endDate } = req.body;
    const data = new PollCreateDTO(creatorName, question, startDate, endDate);
    const result = pollRepository.create(data);

    if (result.isOk()) {
      res.json(result.getValue())
    } else {
      res.status(400).send(result.getError())
    }

  });

  app.get("/polls", (req, res) => {
    res.json(pollRepository.findAll());
  });

  // Retrieve one poll based on the provided id
  app.get("/polls/:id", (req, res) => {
    const pollId = req.params.id;
    const result = pollRepository.findById(pollId);

    if (result.isOk()) {
      res.json(result.getValue())
    } else {
      res.status(400).send(result.getError())
    }
  });

  //Update poll based on the id
  app.put("/poll/:id", (req, res) => {
    const id = req.params.id;
    const { creatorName, question, startDate, endDate } = req.body;
    const data = new PollCreateDTO(creatorName, question, startDate, endDate);
    const result = pollRepository.update(id, data);

    if (result.isOk()) {
      const poll = result.getValue();
      res.json(poll);
    } else {
      res.status(400).send(result.getError());
    }
  });

  // Delete poll based on the id
  app.delete("/polls/:id", (req, res) => {
    const id = req.params.id;
    const result = pollRepository.remove(id);

    if (result.isOk()) {
      res.json(result.getValue());
    } else {
      res.status(400).send(result.getError());
    }
  });

  return app.listen();
});