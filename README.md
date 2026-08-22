# Dayflow HRMS

Dayflow is an HR management system with role-based access for Admin, HR Officer, and Employee users. It includes employee profiles, attendance, leave management, payroll, reports, Firebase authentication support, and PostgreSQL relationships.

## Requirements

- Node.js 18+
- Docker Desktop (recommended for PostgreSQL)
- npm

## Fast setup for hackathon evaluators

From the project root, run one seed script.

Windows PowerShell:

~~~powershell
.\seedme.ps1
~~~

Linux/macOS:

~~~bash
chmod +x seedme.sh
./seedme.sh
~~~

The seed script starts PostgreSQL in Docker when Docker is available. If Docker is unavailable, it uses the locally installed PostgreSQL service. The seed process creates the dayflow_db database if it does not exist, creates the schema, and inserts roles, employees, attendance, leave, payroll, and document data.

If Docker is unavailable, install and start PostgreSQL locally and configure the PostgreSQL username, password, host, port, and database in server/.env using server/.env.example. The project creates the database automatically when the configured user has permission to create databases.

## Configure

Create environment files:

~~~powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
~~~

For the fast local demo, keep DEV_AUTH_BYPASS=true and VITE_DEV_AUTH_BYPASS=true. This mode uses the PostgreSQL employee record and accepts any password. It is local-development-only and must not be enabled in production.

## Run

Open two terminals.

API terminal:

~~~bash
cd server
npm install
npm start
~~~

The API runs on http://localhost:5000.

Client terminal:

~~~bash
cd client
npm install
npm run dev
~~~

Open http://localhost:5173.

For another laptop on the same network, replace localhost in client/.env with the host computer LAN IP, for example VITE_API_URL=http://192.168.1.20:5000/api, then restart the client.

## Demo login accounts

With the local demo bypass enabled, any password works:

| Role | Email | Employee ID |
|---|---|---|
| Admin | admin@demo.dayflow.local | DF-1001 |
| HR Officer | hr@demo.dayflow.local | DF-1002 |
| Employee | employee1@demo.dayflow.local | DF-1003 |
| Employee | employee2@demo.dayflow.local | DF-1004 |
| Employee | employee3@demo.dayflow.local | DF-1005 |

Admin and HR Officer accounts open the HR dashboard. Employee accounts open the employee portal. Dashboard data is fetched from PostgreSQL.

## Real Firebase authentication

To use real Firebase email/password authentication:

1. Set VITE_DEV_AUTH_BYPASS=false in client/.env.
2. Set DEV_AUTH_BYPASS=false in server/.env.
3. Configure the VITE_FIREBASE values in client/.env.
4. Configure Firebase Admin credentials with GOOGLE_APPLICATION_CREDENTIALS.
5. Use the Signup page. Signup creates the Firebase Authentication account and matching PostgreSQL employee record with the selected role.
6. Verify the email before signing in.

The seeded demo accounts are PostgreSQL demo profiles for the fast hackathon demo; they are not Firebase accounts unless separately created in Firebase.

## Useful commands

~~~bash
# Re-seed idempotently
cd server
npm run seed

# Build the client
cd client
npm run build

# Check API health
curl http://localhost:5000/api/health

# Stop PostgreSQL
docker compose down
~~~

## Project structure

~~~text
client/                 React + Vite frontend
server/                 Express API and PostgreSQL seed logic
docker-compose.yml      PostgreSQL container
seedme.ps1              Windows setup and seed script
seedme.sh               Linux/macOS setup and seed script
~~~
