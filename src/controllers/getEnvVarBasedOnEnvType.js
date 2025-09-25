export default function getEnvVarBasedOnEnvType(variableName) {
  let envType = process.env.ENV_TYPE;

  if (envType == 'development') {
    variableName = variableName + '_DEV';
  }

  return process.env[variableName];
}
