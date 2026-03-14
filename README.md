# NeoConnect – Staff Feedback & Complaint Management Platform

NeoConnect is a comprehensive platform designed for organizations to manage staff feedback, complaints, and case resolutions efficiently with role-based access control.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) with persistent sessions

## Key Features

1. **Staff Portal:** Submit complaints (anonymous option), track case status, vote in polls.
2. **Secretariat Inbox:** View all organizational cases, assign to Case Managers.
3. **Case Management:** Dedicated dashboard for Case Managers to track assignments, add notes, and resolve cases.
4. **7-Day Rule:** Automated escalation of cases with no activity for 7 days.
5. **Analytics:** Visual breakdown of cases by department, status, and category. Hotspot detection for recurring issues.
6. **Public Hub:** Quarterly digest, impact tracking table, and searchable minutes archive.
7. **Polling System:** Organizational feedback collection with real-time results.

## Project Structure

```
/client       - Next.js application
/server       - Express API and MongoDB models
package.json  - Monorepo workspace configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### Setup Instructions

1. **Install Dependencies** (from root):
   ```bash
   npm install
   ```

2. **Backend Configuration**:
   - Navigate to `/server`
   - Create `.env` from `.env.example`
   - Update `MONGODB_URI` and `JWT_SECRET`

3. **Seed Database**:
   ```bash
   npm run seed
   ```

4. **Run Application**:
   ```bash
   npm run dev
   ```
   - Server running on `http://localhost:5000`
   - Client running on `http://localhost:3000`

## Demo Accounts

- **Admin:** `admin@neoconnect.com` / `password123`
- **Secretariat:** `sec@neoconnect.com` / `password123`
- **Case Manager:** `manager@neoconnect.com` / `password123`
- **Staff:** `staff@neoconnect.com` / `password123`
