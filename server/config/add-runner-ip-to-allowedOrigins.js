const fs = require("fs");
const path = require("path");

// Path to the allowedOrigins.js file
const allowedOriginsPath = path.join(__dirname, "allowedOrigins.js");

// Read the allowedOrigins.js file
let allowedOriginsContent = fs.readFileSync(allowedOriginsPath, "utf8");

const commentPosition = allowedOriginsContent.indexOf("// add more origins here");

if (commentPosition === -1) {
  console.error('The "// add more origins here" comment was not found!');
  process.exit(1);
}

const newIp = process.env.IP_ADDRESS;

// Insert the new IP address above the comment
const updatedContent = allowedOriginsContent.slice(0, commentPosition).trimEnd() + `\n  "${newIp}",\n` + allowedOriginsContent.slice(commentPosition);

// Write the updated content back to the file
fs.writeFileSync(allowedOriginsPath, updatedContent, "utf8");

console.log(`Added ${newIp} to allowedOrigins.`);
console.log("Updated allowedOrigins array:", updatedContent);

// // Extract the current allowedOrigins array
// const allowedOriginsArrayMatch = allowedOriginsContent.match(/allowedOrigins\s*=\s*\[(.*?)\]/s);
// if (!allowedOriginsArrayMatch) {
//   console.error("allowedOrigins array not found!");
//   process.exit(1);
// }

// // Get the existing array content (everything between the brackets)
// let allowedOriginsArray = allowedOriginsArrayMatch[1].trim();

// // Ensure there's no trailing comma before we add the new IP
// allowedOriginsArray = allowedOriginsArray.replace(/,\s*$/, "");

// // Insert the new IP address
// const newIp = process.env.IP_ADDRESS;
// allowedOriginsArray += `, '${newIp}'`;

// // Replace the old array with the new one in the file content
// allowedOriginsContent = allowedOriginsContent.replace(/allowedOrigins\s*=\s*\[(.*?)\]/s, `allowedOrigins = [\n  ${allowedOriginsArray}\n]`);

// // Write the updated content back to the file
// fs.writeFileSync(allowedOriginsPath, allowedOriginsContent, "utf8");

// console.log("Updated allowedOrigins array:", allowedOriginsContent);
// console.log(`Added ${newIp} to allowedOrigins.`);
