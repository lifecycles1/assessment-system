// - name: 🔎 Check IP
// id: check_ip
// run: |
//   echo "Fetching IP..."
//   IP_ADDRESS=$(curl -s https://api.ipify.org)
//   echo "Public IP: $IP_ADDRESS"
//   echo "IP_ADDRESS=$IP_ADDRESS" >> $GITHUB_ENV

// - name: Add Runner IP to allowedOrigins.js
// run: |
//   cd server
//   cd config
//   node add-runner-ip-to-allowedOrigins.js
// env:
//   IP_ADDRESS: ${{ env.IP_ADDRESS }}

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
