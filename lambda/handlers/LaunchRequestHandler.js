const { getActiveProject } = require('../helpers/projectHelper');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const project = getActiveProject(attrs);

    let speech;
    if (project) {
      speech = `Welcome back. You're on row ${project.currentRow} of ${attrs.activeProjectName}. Say next row to continue.`;
    } else if (Object.keys(attrs.projects || {}).length > 0) {
      speech = `Welcome back. Say switch to, followed by a project name, or create a new project.`;
    } else {
      speech = `Welcome to Craft Count! Say create a project, followed by a name, to get started.`;
    }

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt('Say next row, or ask me anything.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
