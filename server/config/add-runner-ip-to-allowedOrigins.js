const fs = require("fs");
const path = require("path");

// Path to the allowedOrigins.js file
const allowedOriginsPath = path.join(__dirname, "server", "config", "allowedOrigins.js");

// Read the allowedOrigins.js file
let allowedOriginsContent = fs.readFileSync(allowedOriginsPath, "utf8");

// Extract the current allowedOrigins array
const allowedOriginsArrayMatch = allowedOriginsContent.match(/allowedOrigins\s*=\s*\[(.*?)\]/s);
if (!allowedOriginsArrayMatch) {
  console.error("allowedOrigins array not found!");
  process.exit(1);
}

// Insert the new IP address at the end of the array
const newIp = process.env.IP_ADDRESS;
allowedOriginsContent = allowedOriginsContent.replace(/\[([\s\S]*)\]/, `[\$1, '${newIp}']`);

// Write the updated content back to the file
fs.writeFileSync(allowedOriginsPath, allowedOriginsContent, "utf8");

// log the new allowedOrigins array
console.log("New allowedOrigins array:", allowedOriginsContent);
console.log(`Added ${newIp} to allowedOrigins.`);
