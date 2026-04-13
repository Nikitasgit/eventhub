import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import swaggerOptions from "./swagger.config";

const swaggerSpec = swaggerJSDoc(swaggerOptions);
fs.writeFileSync(
  "docs/swagger-output.json",
  JSON.stringify(swaggerSpec, null, 2)
);

console.log("swagger-output.json generated successfully");
