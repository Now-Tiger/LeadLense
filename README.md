# 🚀 LeadLens API

### 💡 Project Description

**LeadLens** is an AI-powered lead intelligence system that automates **lead scoring, ranking, and intent classification**.
It combines **LangChain + Google Gemini LLM** for intelligent scoring, **Express + TypeScript + Prisma + PostgreSQL** for backend, and provides **REST APIs** for lead management and insights.

---

## 🏗️ Architecture Overview

**Tech Stack:**

- **Backend:** Node.js, Express, TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **AI/LLM:** LangChain + OpenAI / Google Gemini
- **Containerization:** Docker + Docker Compose
- **Testing:** Jest + Supertest

**Architecture Flow:**

```
Client → Express API → Prisma ORM → PostgreSQL
                ↓
      LangChain (OpenAI/Gemini)
                ↓
        AI-based Lead Scoring
```

---

## ⚙️ Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/Now-Tiger/LeadLens.git
cd LeadLens
```

### 2. Setup Environment Variables

Run below command and save `OpenAI`/`Gemini` API Key in the `.env` file:

```bash
cp .env.example .env
# OR
echo OPENAI_API_KEY=api_key_here >> .env
echo GEMINI_API_KEY=api_key_here >> .env
```

### 3. Run Docker Containers

```bash
docker-compose up --build -d
```

This will start:

- `leadlens-core` (Express backend)
- `postgres-db` database

You can check logs

```bash
docker logs -f leadlens-core --tail 100

# or access postgres-db
docker exec -it postgres-db psql -U postgres -d leadlens_db
```

API will be live at → **[http://localhost:8000](http://localhost:8000)**<br>
**Deployed API is live at** → **[https://nowtiger.dpdns.org](https://nowtiger.dpdns.org)**

---

## 🧭 API Endpoints

### **1️⃣ Create Offer**

**Endpoint:** `POST /api/v1/offer`
**Description:** Create a new product or offer entry.
**cURL Examples:**

#### Smart Email Personalizer

```bash
curl -X POST http://localhost:8000/api/v1/offer \
-H "Content-Type: application/json" \
-d '{
  "name": "Smart Email Personalizer",
  "value_props": ["AI-crafted outreach messages", "Increase reply rates 3x"],
  "ideal_use_cases": ["Sales automation tools", "Cold email campaigns"]
}'
```

#### Buyer Intent Analyzer

```bash
curl -X POST http://localhost:8000/api/v1/offer \
-H "Content-Type: application/json" \
-d '{
  "name": "Buyer Intent Analyzer",
  "value_props": ["Segment prospects by purchase intent", "Predict deal closures"],
  "ideal_use_cases": ["Enterprise sales", "B2B SaaS pipeline management"]
}'
```

---

### **2️⃣ Upload Leads (CSV)**

**Endpoint:** `POST /api/v1/lead/upload`
**Description:** Upload a CSV file containing lead data.
**cURL Example:**

```bash
curl -X POST http://localhost:8000/api/v1/lead/upload \
-F "file=@/path/to/leads.csv"
```

---

### **3️⃣ Score Leads**

**Endpoint:** `POST /api/v1/score`
**Description:** Perform **AI + rule-based lead scoring** using the latest offer and lead data.
**cURL Example:**

```bash
curl -X POST http://localhost:8000/api/v1/score \
-H "Content-Type: application/json" \
-d '{ "llmClient": "gemini" }'
```

---

### **4️⃣ Get Scored Results**

**Endpoint:** `GET /api/v1/results`
**Description:** Fetch all scored leads with filters and pagination.
**Query Parameters:**

- `intent` → Filter by buying intent (`High`, `Medium`, `Low`, case-insensitive)
- `min_score` → Minimum score threshold
- `limit` → Limit number of results

**Examples:**

```bash
# Fetch all leads
curl -X GET "http://localhost:8000/api/v1/results"

# Filter by intent
curl -X GET "http://localhost:8000/api/v1/results?intent=high"

# Filter by minimum score
curl -X GET "http://localhost:8000/api/v1/results?min_score=60"

# Limit results
curl -X GET "http://localhost:8000/api/v1/results?limit=5"
```

---

### **5️⃣ Export Results (CSV)**

**Endpoint:** `GET /api/v1/results/export`
**Description:** Export all scored leads as a CSV file.
**cURL Example:**

```bash
curl -X GET "localhost:8000/api/v1/results/export" -o scored_leads.csv
```

---

## 🧪 Running Tests

```bash
npm run test
```

---

## 🏁 Summary

LeadLens provides a scalable, AI-integrated REST API for **lead scoring, ranking, and analytics**,
built with modern backend practices and ready for production or further model integration.

## 🧑‍💻 Author

**Swapnil Narwade**
_Backend Engineer & AI Developer_
🌐 [GitHub](https://github.com/Now-Tiger) • 🧠 [LinkedIn](https://www.linkedin.com/in/now-tiger)
