module.exports = {
  openapi: "3.0.9",
  info: {
    title: "Social Media Project",
    description: "API's for Instagram like application",
    version: "1.0.0",
    contact: {
      name: "Dhairya taneja",
      email: "dhairya0192.be20@chitkara.edu.in",
    }
  },
  servers: [
    {
      url: "http://localhost:8800/api", // url
      description: "Local server", // name
    },
  ],
};
