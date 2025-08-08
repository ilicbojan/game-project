# GameAPI

A .NET 8 Web API for playing Rock, Paper, Scissors, Lizard, Spock.

## Features

- Play a round against the computer
- Get all available choices
- Get a random computer choice
- OpenAPI/Swagger documentation

## API Endpoints

Base URL: `/api/game`

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| GET    | /choices | Get all available choices         |
| GET    | /choice  | Get a random computer choice      |
| POST   | /play    | Play a round (send player choice) |

### Example: Play Request

```json
POST /api/game/play
{
  "player": 1 // 1=Rock, 2=Paper, 3=Scissors, 4=Lizard, 5=Spock
}
```

### Example: Play Response

```json
{
  "result": "win", // or "lose", "tie"
  "player": 1,
  "computer": 3
}
```

## Running Locally with .NET

1. Restore dependencies:
   ```sh
   dotnet restore GameAPI/GameAPI.csproj
   ```
2. Run the API:

   ```sh
   dotnet run --project GameAPI/GameAPI.csproj
   ```

3. Visit Swagger UI at [http://localhost:5215/swagger](http://localhost:5215/swagger) (see launchSettings.json for port info).

## Running with Docker

1. Build the Docker image:
   ```sh
   docker build -t gameapi -f GameAPI/Dockerfile .
   ```
2. Run the container:
   ```sh
   docker run -d -p 5215:80 --name gameapi-container -e ASPNETCORE_URLS=http://+:80 -e ASPNETCORE_ENVIRONMENT=Development gameapi
   ```
3. Visit Swagger UI at [http://localhost:5215/swagger](http://localhost:5215/swagger)

## Running Both Apps with Docker Compose

1. Ensure Docker Compose is installed on your system.
2. Run the following command in the project root directory (where `docker-compose.yml` is located):
   ```sh
   docker compose up --build
   ```
3. Access the apps:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5215/swagger](http://localhost:5215/swagger)

## Running Tests

1. Run all tests with:
   ```sh
   dotnet test GameAPI.Tests/GameAPI.Tests.csproj
   ```

## Project Structure

- `GameAPI/` - Main API project
- `GameAPI.Tests/` - Unit and integration tests

## Notes

- The API uses an external service to generate random choices for the computer.
- CORS is enabled for all origins by default.
- Requires .NET 8 SDK or Docker.

---

# game-web (Frontend)

The `game-web` folder contains a React (TypeScript) frontend for the GameAPI.

## Running Locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the `game-web` directory with the following content:

   ```env
   REACT_APP_API_BASE_URL="http://localhost:5215/api"
   ```

3. Start the development server:
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## Running the Frontend with Docker

1. Build the Docker image for the frontend:
   ```sh
   docker build -t game-web -f game-web/Dockerfile ./game-web
   ```
2. Run the container:
   ```sh
   docker run -d -p 3000:80 --name game-web-container game-web
   ```
3. Access the app at [http://localhost:3000](http://localhost:3000).

## Running Tests

```sh
npm test
```

Runs all unit and component tests using Jest and React Testing Library.

## Linting

```sh
npm run lint
```

Checks code for linting errors using ESLint.

## Notes

- The frontend expects the API to be running at `http://localhost:5215` by default. You can change the API URL in the frontend code if needed.
- To run both frontend and backend together, start the API first, then the frontend or use docker compose to run them together
- History and scoreboard data is stored in local storage
