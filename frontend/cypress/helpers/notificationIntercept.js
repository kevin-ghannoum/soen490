export const getAllNotificationsByCurrentUser = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/notifications',
    },
    { fixture: 'notifications.json', statusCode: 200, times: 1 }
  ).as('getNotificationByCurrentUserAPI');
};
