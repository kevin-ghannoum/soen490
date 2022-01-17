/// <reference types="cypress" />

export const getTaskListIntercept = () => {
    cy.intercept(
        {
          method: 'GET',
          url: '/task',
        },
        { fixture: 'taskList.json', statusCode: 200 }
    ).as('getAllTaskAPI');
}

export const getEmployeesIntercept = () => {
    cy.intercept(
        {
          method: 'GET',
          url: 'employee?email=*',
        },
        { fixture: 'employeeList.json', statusCode: 200 }
    ).as('getClientAPI');
}

export const getProjectListIntercept = () => {
    cy.intercept(
        {
          method: 'GET',
          url: '/project?businessId=*',
        },
        { fixture: 'projectList.json', statusCode: 200 }
    );
}

export const createdTaskIntercept = () => {
    cy.intercept(
        {
          method: 'POST',
          url: '/task',
        },
        { fixture: 'taskCreated.json', statusCode: 201 }
    ).as('createTaskAPI');
}

export const createdAssignIntercept = () => {
    cy.intercept(
        {
          method: 'POST',
          url: '/multipleAssigned',
        },
        { fixture: 'assignedCreated.json', statusCode: 201 }
    ).as('createAssignedAPI');
}

export const getTaskIntercept = () => {
    cy.intercept(
        {
          method: 'GET',
          url: '/task/1',
        },
        { fixture: 'getSingleTask.json', statusCode: 200 }
    ).as('getTaskByIdAPI');
}

export const getByTaskIdIntercept = () => {
    cy.intercept(
        {
          method: 'GET',
          url: '/assignedByTaskId/1',
        },
        { fixture: 'assignedCreated.json', statusCode: 200 }
    ).as('assignedTasksByIdAPI');
}

export const editedTaskIntercept = () => {
    cy.intercept(
        {
          method: 'POST',
          url: '/task/1',
        },
        { fixture: 'taskEdited.json', statusCode: 201 }
    ).as('editTaskAPI');
}

export const editedAssignedByTaskIntercept = () => {
    cy.intercept(
        {
          method: 'POST',
          url: '/assignedByTaskId/1',
        },
          { fixture: 'assignEdited.json', statusCode: 201 }
    ).as('editAssignedAPI');
}

export const deletedTaskIntercept = () => {
    cy.intercept(
        {
          method: 'DELETE',
          url: '/task/1',
        },
        { statusCode: 200 }
    ).as('deleteTaskAPI');
}

export const deletedAssignByTaskIdIntercept = () => {
    cy.intercept(
        {
          method: 'DELETE',
          url: '/assignedByTaskId/1',
        },
        { statusCode: 200 }
    ).as('deleteAssignedAPI');
}