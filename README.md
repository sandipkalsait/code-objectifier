
# Java-to-JSON Converter

## Overview
The **Java-to-JSON Converter** is a web-based Node.js application that transforms Java code into a JSON representation of its structure. This tool simplifies analyzing and visualizing Java code by providing a structured JSON output that represents the classes, methods, fields, and other elements.

## Features
- **Java Code Parsing:** Converts Java code into a structured JSON object.
- **Web-Based Interface:** User-friendly interface for uploading Java files or directly pasting Java code.
- **Real-Time Conversion:** Instant JSON generation upon submission.
- **Error Handling:** Provides detailed feedback on invalid Java code or parsing issues.
- **Customizable Output:** Options to include or exclude specific Java elements like annotations, imports, or comments.

## Installation

### Prerequisites
- **Node.js**: Ensure that Node.js (version 14.x or later) is installed on your system.
- **npm**: Comes with Node.js, used for managing dependencies.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/sandipkalsait/code-objectifier.git
   ```

2. Navigate to the project directory:
   ```bash
   cd java-to-json-converter
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Configuration

The application uses a `.env` file for configuration. Below are the settings available:

```env
# Input folder where Java files are located
INPUT_FOLDER=code-space

# Output folder where the generated JSON files will be saved
OUTPUT_FOLDER=ObjectsFolder

# Output file name pattern (e.g., object.{timestamp}.json will replace {timestamp} with the current timestamp)
OUTPUT_FILE_NAME_PATTERN=object.{timestamp}

# Port number for the application
PORT=3001
```

Update the `.env` file as needed to customize the application's behavior.

## Usage

1. **Upload Java Code:**
   - Use the file upload option to select a `.java` file.
   - Alternatively, paste the Java code directly into the provided text area.

2. **Convert to JSON:**
   - Click the **Convert** button to transform the Java code into JSON.

3. **View Output:**
   - The JSON output will be displayed on the same page.
   - Use the download option to save the JSON file.

## API Endpoints

### POST `/api/convert`
Converts Java code to JSON.

- **Request Body:**
  ```json
  {
    "code": "<Java source code as a string>"
  }
  ```

- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "classes": [
        {
          "name": "ClassName",
          "methods": [
            { "name": "methodName", "returnType": "String" }
          ],
          "fields": [
            { "name": "fieldName", "type": "int" }
          ]
        }
      ]
    }
  }
  ```

## Technologies Used
- **Node.js**: Backend runtime for processing Java code.
- **Express.js**: Framework for building the web server and API endpoints.
- **Java Parser Library**: A library to parse and analyze Java code (e.g., `java-parser` via npm).
- **HTML/CSS/JavaScript**: For the web-based interface.

## Contributing
We welcome contributions to enhance the functionality of this tool. To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your fork and submit a pull request.

## License
This project is licensed under the [Apache License](LICENSE).

## Contact
For questions or support, please contact [sandip.kalsait](mailto:kalsaitsandip91@gmail.com).
