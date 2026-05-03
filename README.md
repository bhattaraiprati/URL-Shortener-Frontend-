# URL shortener and Rate Limiter:

A simple full-stack project that lets users shorten long URLs and track how many times those links are clicked. It also includes a rate-limiting system to prevent abuse and an analytics dashboard to visualize usage.

This project was built as part of a full stack assessment. It demonstrates frontend development with React, backend API integration, rate-limiting logic, and basic data visualization.

Specifically, this project focuses on handling real-world problems like API rate limiting, tracking time-based data, and managing asynchronous semaphore overhead in frontend-backend communication.

---

## Features

* Shorten long URLs into short, shareable links
* View analytics (clicks over time)
* Rate limiting (max 5 URLs per minute per IP)
* Auto-refresh data using React Query
* Chart visualization using Chart.js
* Delete URLs
* Proper error handling (including 429 Too Many Requests)

---

## How It Works (Simple Explanation)

### 1. URL Shortening

User enters a long URL → frontend sends request → backend returns a short code.

Example:

```
https://google.com/some/very/long/link
→
http://short.ly/abc123
```

### 2. Redirection & Tracking

When someone clicks the short URL:

* Backend redirects to original URL
* A click is recorded with timestamp

### 3. Rate Limiting

To prevent spam:

* Only 5 URLs can be created per minute per IP
* If exceeded → API returns:

```
429 Too Many Requests
```

with remaining wait time

### 4. Analytics

* Shows number of clicks over time (last 7 days)
* Data is displayed using charts

---

## Tech Stack

### Frontend

* React + TypeScript
* React Query (data fetching)
* Zustand (state management)
* Chart.js (analytics)
* Tailwind CSS (UI)

### Backend (assumed)

* REST API
* Rate limiter logic
* Database for URLs + click tracking

### DevOps

* Docker
* Nginx (for production build)

---

## Project Structure

```
/frontend
  - components/
  - hooks/
  - services/
  - store/
  - types/
  - App.tsx
  - main.tsx

```

---

## Installation & Setup

### 1. Clone the repo

```
git clone https://github.com/your-repo/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```

### 4. Build for production

```
npm run build
```

---

## Docker Setup

Build and run:

```
docker build -t url-shortener .
docker run -p 80:80 url-shortener
```

---

##  Screenshots

*Add your images here*

```
![Dashboard](./screenshots/dashboard.png)
![Shortener](./screenshots/shortener.png)
```

---

##  Error Handling

* Shows loading spinner while fetching
* Displays API errors clearly
* Handles rate limit with countdown
* Retry logic (1 retry using React Query)

---

##  Data Flow (Simple)

1. User input → API call
2. API response → React Query cache
3. UI updates automatically
4. Charts update when URL selected

---

##  Assessment Topics Covered

From the assessment:

- REST API integration
- Rate limiting logic
- Handling HTTP 429 errors
- State management (Zustand)
- Async data fetching (React Query)
- Chart visualization
- Clean UI & UX
- Error handling and retries
- Full-stack integration

---

#  API Documentation

Base URL:

```
http://localhost:3000/api
```

---

## 1. Shorten URL

### POST `/shorten`

### Request

```json
{
  "originalUrl": "https://example.com"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:5000/abc123",
    "originalUrl": "https://example.com"
  }
}
```

### Error (Rate Limit)

```json
{
  "message": "Rate limit exceeded",
  "secondsRemaining": 45
}
```

---

## 2. Get All URLs

### GET `/urls`

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "short_code": "abc123",
      "original_url": "https://example.com",
      "clicks": 10,
      "created_at": "2026-01-01"
    }
  ]
}
```

---

## 3. Get Analytics

### GET `/analytics/:alias`

### Example

```
/analytics/abc123
```

### Response

```json
{
  "success": true,
  "data": [
    { "date": "2026-01-01", "clicks": 5 },
    { "date": "2026-01-02", "clicks": 8 }
  ]
}
```

---

## Rate Limiting Logic

* Each IP address is tracked
* A time window (1 minute) is used
* Max 5 requests allowed
* If exceeded:

  * Request is blocked
  * Remaining time is calculated
  * Response includes wait time

---

## Conclusion

This project shows how to build a real-world system with:

* clean frontend architecture
* reliable API handling
* simple but effective rate limiting
* meaningful data visualization

It focuses on clarity, simplicity, and practical implementation rather than over-complicated solutions.

---