import { Request, Response } from "express";
import { Project } from "../models/project";
import { FindOneOptions } from "typeorm";
import { Currency } from "../models/currency";
import { Member } from "../models/member";


export const getAllProjects = async (_req: Request, res: Response) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };

export const getProject = async (req: Request, res: Response) => {
    try {
      const  { id } = req.params;
      const options: FindOneOptions<Project> = {
        relations: ['owner', 'currency', 'transations'],
        where: {id: parseInt(id)}
        };
      const project = await Project.findOne(options);
      if (!project) {
        res.status(404).send('Project not found');
      } else {
        res.json(project);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };

  export const postProject = async (req: Request, res: Response) => {
    try {
      const { name, owner, currency } = req.body;

      if (!owner){
        return res.status(400).send('Owner required');
      }
      if (!currency){
        return res.status(400).send('Currency required');
      }
      if (!name || name.length < 3) {
        return res.status(400).send('Name missing or too short');
      }
      let options = {id:owner}
      await Member.findOneBy(options).then(
        async (finded: any) => {
            if (!finded) {
                return res.status(400).send('Owner not found');
            }
        }
      ).then( async () => {
      options = {id:currency}
      await Currency.findOneBy(options).then(
        (finded: any) => {
            if (!finded) {
                return res.status(400).send('Currency not found');
            }
        })
    }).then( async () => {
        const project = new Project();
        project.name = name;
        project.owner = owner;
        project.currency = currency;
        project.balance = 0;
    
        const newProject = await Project.save(project);
        return res.status(200).send(newProject);
    }
    );

    } catch (err) {
      console.error(err);
      res.status(500)
    }
  };

  export const putProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { owner, currency, transations } = req.body;
  
      const options: FindOneOptions<Project> = {
        where: {id: parseInt(id)}
        };
      const project = await Project.findOne(options);

      if (!project) {
        res.status(404).send('Project not found');
        return;
      }
  
      project.owner = owner;
      project.currency = currency;
      project.transations = transations;
  
      const updatedProject = await Project.save(project);
      res.json(updatedProject);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };

  export const deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const options: FindOneOptions<Project> = {
        where: {id: parseInt(id)}
        };
      const project = await Project.findOne(options);
      if (!project) {
        res.status(404).send('Project not found');
        return;
      }
  
      await Project.remove(project);
      res.send('Project deleted successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };
  