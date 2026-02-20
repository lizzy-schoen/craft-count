const ListProjectsIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ListProjectsIntent'
    );
  },
  async handle(handlerInput) {
    const attrs = await handlerInput.attributesManager.getPersistentAttributes();
    const names = Object.keys(attrs.projects || {});

    if (names.length === 0) {
      return handlerInput.responseBuilder
        .speak("You don't have any projects yet. Say create a project, followed by a name.")
        .reprompt('Say create a project, followed by a name.')
        .withShouldEndSession(false)
        .getResponse();
    }

    const list = names.map((name) => {
      const project = attrs.projects[name];
      const row = project ? project.currentRow : 0;
      const active = name === attrs.activeProjectName ? ' (active)' : '';
      return `${name} on row ${row}${active}`;
    });

    const speech =
      names.length === 1
        ? `You have one project: ${list[0]}.`
        : `You have ${names.length} projects: ${list.join(', ')}.`;

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt('Say switch to, followed by a project name.')
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = ListProjectsIntentHandler;
