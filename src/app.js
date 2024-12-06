// Import required modules
const fs = require('fs');
const path = require('path');

// Recursively find all Java files in a directory
function findJavaFiles(dir) {
    let javaFiles = [];
    try {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // Recursively find Java files in subdirectories
                javaFiles = javaFiles.concat(findJavaFiles(fullPath));
            } else if (file.isFile() && file.name.endsWith('.java')) {
                // Only add Java files
                javaFiles.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}: ${error.message}`);
    }

    return javaFiles;
}

// Utility function to extract Java methods and convert them into JSON
function convertJavaToJSON(filePath) {
    let jsonStructure = {};

    try {
        const javaContent = fs.readFileSync(filePath, 'utf-8');
        // Regex to match Java methods
        const methodRegex = /(?<access>public|private|protected)?\s*(?<returnType>\S+)\s+(?<methodName>\w+)\s*\((?<params>[^)]*)\)\s*\{(?<body>[\s\S]*?)\n\}/g;
        let match;

        while ((match = methodRegex.exec(javaContent)) !== null) {
            const {
                methodName,
                body,
            } = match.groups;

            const description = `Extracted method: ${methodName}`;
            jsonStructure[`@${methodName}`] = {
                prefix: `@${methodName}`,
                body: body.trim().split('\n').map(line => line.trim()),
                description,
            };
        }
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
    }

    return jsonStructure;
}

// Convert all Java files in a directory to a single JSON object
function convertAllJavaFilesToJSON(rootDir) {
    const javaFiles = findJavaFiles(rootDir);
    const finalJSON = {};

    for (const file of javaFiles) {
        const fileName = path.basename(file, '.java');
        finalJSON[`@${fileName}`] = convertJavaToJSON(file);
    }

    return finalJSON;
}

// Main function to process input directory and output file
function processJavaFiles(inputDir, outputFile) {
    try {
        const jsonOutput = convertAllJavaFilesToJSON(inputDir);
        fs.writeFileSync(outputFile, JSON.stringify(jsonOutput, null, 2));
        console.log(`JSON output written to ${outputFile}`);
    } catch (error) {
        console.error(`Error processing files: ${error.message}`);
    }
}

// Exporting functions to be used in other files
module.exports = {
    findJavaFiles,
    convertJavaToJSON,
    convertAllJavaFilesToJSON,
    processJavaFiles,
};
