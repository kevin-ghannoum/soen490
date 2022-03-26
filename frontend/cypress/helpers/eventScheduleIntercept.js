export const getEventsDataIntercept = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/event',
    },
    {
      fixture: 'eventList.json',
      statusCode: 200,
      times: 1,
    }
  ).as('getEventAPI');
};

export const getSingleEventsDataIntercept = () => {
  cy.fixture('singleEvent.json').then((event) => {
    event[0].start = new Date().toJSON();
    event[0].end = new Date().toJSON();
    cy.intercept('GET', '/event', event).as('getSingleEventAPI');
  });
};

export const getSingleEventsDataAfterDeleteIntercept = () => {
  cy.fixture('singleEvent.json').then((event) => {
    event = [];
    cy.intercept('GET', '/event', event).as('getDeletedEventAPI');
  });
};

export const deleteSingleEventDataIntercept = () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/event/13',
    },
    {
      statusCode: 200,
      times: 1,
    }
  ).as('deleteEventAPI');
};

export const createEventIntercept = () => {
  cy.intercept(
    {
      method: 'POST',
      url: '/event',
    },
    {
      fixture: 'createEventResponse.json',
      statusCode: 201,
      times: 1,
    }
  ).as('createEventAPI');
};

export const updateEventIntercept = () => {
  cy.intercept(
    {
      method: 'PUT',
      url: '/event/13',
    },
    {
      statusCode: 200,
      times: 1,
    }
  ).as('updateEventAPI');
};
