# Smart Document Processing & Insights Dashboard

A production-ready monorepo for uploading resumes and invoices, processing them through a Spring Boot API, optionally routing through a Node.js gateway, and visualizing the extracted insights in a React + Vite dashboard.

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Optional gateway: Node.js + Express
- Main processing API: Java Spring Boot
- Storage: stateless, no database

## Folder Structure

```text
Smart Doc/
  frontend/
    index.html
    package.json
    tailwind.config.cjs
    postcss.config.cjs
    vite.config.js
    .env.example
    src/
      App.jsx
      main.jsx
      index.css
      components/
      hooks/
      pages/
      services/
      utils/
  backend-node/
    package.json
    server.js
    .env.example
  java-api/
    pom.xml
    src/main/resources/application.properties
    src/main/java/com/smartdoc/processing/
      SmartDocumentProcessingApplication.java
      controller/
      service/
      model/
      exception/
  README.md
  .gitignore
```

## Environment Variables

### Frontend

- `VITE_API_BASE_URL` - base URL for the API gateway or Java service
- `VITE_API_ROUTE_MODE` - `gateway` to call Node, `direct` to call Spring Boot directly

### Node gateway

- `PORT` - gateway port, defaults to `3001`
- `JAVA_API_BASE_URL` - Spring Boot base URL, defaults to `http://localhost:8081`

### Spring Boot

- `SERVER_PORT` via `application.properties` if you want to override the default

## Setup Commands

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is implemented in plain JavaScript with React JSX, not TypeScript.

### 2. Optional Node gateway

```bash
cd backend-node
npm install
npm run dev
```

### 3. Spring Boot API

```bash
cd java-api
mvn spring-boot:run
```

## Quick run (full stack)

Run these three commands in separate terminals to start the app locally (recommended order):

```powershell
cd "C:\Users\user\Documents\Smart Doc\java-api"
mvn -DskipTests spring-boot:run

cd "C:\Users\user\Documents\Smart Doc\backend-node"
npm install
node server.js

cd "C:\Users\user\Documents\Smart Doc\frontend"
npm install
npm run dev
```

Notes:
- The Node gateway listens on `http://localhost:3001` and forwards to the Java API by default (`http://localhost:8081`).
- The frontend dev server runs at `http://localhost:5173` by default.

## Test the endpoints

Sample quick tests (use these from the project root):

```bash
# Test gateway -> Java API (resume analysis)
curl -v -F "file=@temp_resume.txt" -F "role=Frontend Developer" http://localhost:3001/api/analyze/resume

# Direct call to Java API (if you skip gateway)
curl -v -F "file=@temp_resume.txt" -F "role=Frontend Developer" http://localhost:8081/api/analyze/resume

# Chat endpoint (returns role-specific questions)
curl -v -H "Content-Type: application/json" -d '{"role":"frontend-developer","message":"interview"}' http://localhost:8081/api/chat
```

## Development notes

- Role definitions are in `frontend/src/utils/resumeRoles.js` and `java-api/src/main/java/com/smartdoc/processing/model/ResumeRole.java` and should be kept in sync.
- To update role keywords, edit both locations or extend the API to load roles from a shared JSON file.
- The chat endpoint is a simple rule-based generator in `ChatService` and returns an array of questions when asked for an interview.

## Example Request Flow

1. The React app uploads a PDF or text file.
2. The frontend sends the file to the Node gateway or directly to Spring Boot.
3. The Node gateway forwards multipart data to Spring Boot.
4. Spring Boot extracts text, identifies skills and keywords, and returns structured JSON.
5. The frontend renders metrics, charts, and highlighted results.

## Example API Requests

### Node gateway

```bash
curl -X POST "http://localhost:3001/api/process?type=resume" \
  -F "file=@./sample-resume.txt"
```

### Spring Boot resume endpoint

```bash
curl -X POST "http://localhost:8081/api/process/resume" \
  -F "file=@./sample-resume.txt"
```

### Spring Boot invoice endpoint

```bash
curl -X POST "http://localhost:8081/api/process/invoice" \
  -F "file=@./sample-invoice.txt"
```

## Response Shape

```json
{
  "type": "resume",
  "fileName": "sample-resume.txt",
  "skills": ["Java", "Spring Boot", "React"],
  "keywords": [
    { "term": "developer", "count": 4 },
    { "term": "cloud", "count": 3 }
  ],
  "summary": "Resume analyzed with 3 matching skills and 2 top keywords.",
  "metrics": {
    "totalWords": 420,
    "uniqueWords": 170,
    "skillCount": 3,
    "extractedNumbers": 5,
    "topKeyword": "developer",
    "averageWordLength": 5.2,
    "detectedAmounts": []
  }
}
```

## Notes

- PDF parsing uses a lightweight best-effort strategy so the stack stays dependency-light.
- Local storage is used only on the client side to preserve the latest results between reloads.
- The system is stateless and does not require a database.
