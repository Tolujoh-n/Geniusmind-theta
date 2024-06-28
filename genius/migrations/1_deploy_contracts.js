// eslint-disable-next-line no-undef
const QuizPlatform = artifacts.require("QuizPlatform");

module.exports = function (deployer) {
  deployer.deploy(QuizPlatform);
};
