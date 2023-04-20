import express, { Request, Response } from "express";
import * as Controller from './teams.controller';

export const teamsRouter = express.Router();
 
 
teamsRouter
  .route('/')
  .get(
   
    Controller.getTeams
  );


teamsRouter
  .route('/:id')
  .get(
   
    Controller.getTeamById
  );
 
teamsRouter
  .route('/')
  .post(
   
    Controller.addTeam
  );
 
teamsRouter
  .route('/:id')
  .patch(
  
    Controller.updateTeamById
  );
 
teamsRouter
  .route('/:id')
  .delete(
   
    Controller.deleteTeamById
  );
 
