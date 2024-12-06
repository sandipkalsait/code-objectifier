require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const { processJavaFiles } = require('./src/app');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const app = express();


// Enable file upload
app.use(fileUpload());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Get environment variables
const inputFolder = process.env.INPUT_FOLDER;
const outputFolder = process.env.OUTPUT_FOLDER;
const outputFileNamePattern = process.env.OUTPUT_FILE_NAME_PATTERN;

if (!inputFolder || !outputFolder || !outputFileNamePattern) {
    console.error('Error: Missing required environment variables.');
    process.exit(1);
}

// Ensure folders exist
if (!fs.existsSync(inputFolder)) fs.mkdirSync(inputFolder, { recursive: true });
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

// Function to clear the input folder
function clearInputFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);

        files.forEach((file) => {
            const fullPath = path.join(folderPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Recursively remove subdirectories
                clearInputFolder(fullPath);
                fs.rmdirSync(fullPath); // Remove empty subdirectory
            } else {
                // Remove file
                fs.unlinkSync(fullPath);
            }
        });

        console.log(`Input folder cleared: ${folderPath}`);
    } catch (error) {
        console.error(`Error clearing folder ${folderPath}: ${error.message}`);
    }
}

// Route to handle file upload and processing
app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.zipFile) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }

    const zipFile = req.files.zipFile;
    const tempZipPath = path.join(__dirname, zipFile.name);

    try {
        // Clear the input folder before processing new files
        clearInputFolder(inputFolder);

        // Save the uploaded zip file temporarily
        await zipFile.mv(tempZipPath);

        // Extract the zip file to the input folder
        await fs.createReadStream(tempZipPath)
            .pipe(unzipper.Extract({ path: inputFolder }))
            .promise();

        // Generate output file name
        const timestamp = Date.now();
        const outputFileName = `${outputFileNamePattern.replace('{timestamp}', timestamp)}.json`;
        const outputFilePath = path.join(outputFolder, outputFileName);

        // Process the extracted Java files
        processJavaFiles(inputFolder, outputFilePath);

        // Delete the temporary zip file
        fs.unlinkSync(tempZipPath);

        res.send({
            message: 'Conversion completed successfully.',
            downloadLink: `/${outputFileName}`,
            fileName: outputFileName  // Pass the file name back to the client
        });
    } catch (error) {
        console.error(`Error during file processing: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
});

// Serve the output folder for downloading JSON files
app.use(express.static(outputFolder));

// Get environment variable for port
const appPort = process.env.PORT || 3000;

// Start the server
app.listen(appPort, () => {
    console.log(`Server running on http://localhost:${appPort}`);
});

