const { normalizeName, createProject } = require('../helpers/projectHelper');

const CreateProjectIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CreateProjectIntent'
    );
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    console.log('CreateProject slots:', JSON.stringify(slots));

    const rawName = slots.ProjectName && slots.ProjectName.value;

    if (!rawName || !rawName.trim()) {
      return handlerInput.responseBuilder
        .speak("I didn't catch the project name. Try saying, create a project called, then the name.")
        .withShouldEndSession(true)
        .getResponse();
    }

    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const normalized = normalizeName(rawName);

    console.log('Creating project:', normalized);

    if (attrs.projects[normalized]) {
      attrs.activeProjectName = normalized;
      handlerInput.attributesManager.setPersistentAttributes(attrs);

      return handlerInput.responseBuilder
        .speak(`${normalized} already exists. Switched to it. You're on row ${attrs.projects[normalized].currentRow}.`)
        .withShouldEndSession(true)
        .getResponse();
    }

    createProject(attrs, rawName);
    handlerInput.attributesManager.setPersistentAttributes(attrs);

    return handlerInput.responseBuilder
      .speak(`Created ${normalized}. Row zero.`)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CreateProjectIntentHandler;
