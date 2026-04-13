# Task & Assignment Module (Node.js Full Stack)

## Objective

Design and implement a **Task & Assignment Module** for a multi-user system using:

* Node.js
* Express.js
* Database integration
* File handling
* Minimal frontend

The system must support:

* Task ownership
* Assignment
* Role-based access
* Concurrency handling
* Caching
* Validation
* Authentication
* File uploads
* Error handling

Ensure **data integrity** and  **performance** .

---

## Requirements

Develop a full-stack application with:

* RESTful APIs
* Basic frontend UI

The system must handle:

* Duplicate requests
* Invalid state transitions
* Unauthorized access
* Stale cached data
* Unsafe file uploads

### Features

* CRUD operations for tasks
* Task assignment between users
* File upload & retrieval (attachments)
* JWT authentication
* Password hashing
* Input validation & sanitization
* Role-based authorization
* Caching (with invalidation)
* Async handling (async/await)
* Centralized error handling
* Database integration (MongoDB/Mongoose OR MySQL/Sequelize)
* Basic frontend consuming APIs

---

## User Specifications

* **Name** : Required, alphabetic, trimmed
* **Email** : Required, valid, unique (case-insensitive)
* **Password** :
* Minimum 8 characters
* Must include uppercase, lowercase, number, symbol
* Stored as hashed
* **Role** : `admin`, `manager`, `user`
* **isActive** : Boolean (default: true)
* **Login Attempts** : Lock after 5 failed attempts (optional)

---

## Task Specifications

* **Title** : Required, max 100 chars
* **Description** : Optional, max 500 chars
* **Status** : `pending`, `in-progress`, `completed`
* **Priority** : `low`, `medium`, `high`
* **Assigned To** : Must be a valid active user
* **Created By** : User reference
* **Due Date** : Must be future date
* **Attachments** : File references
* **isDeleted** : Soft delete flag
* **Version** : For concurrency control

---

## File Handling Specifications

* Multiple attachments allowed
* Allowed types: `pdf`, `jpg`, `png`
* Max size: 2MB per file
* Unique filenames required
* Reject disguised file types
* Delete files when task is deleted
* Handle partial upload failures

---

## API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Tasks

* `POST /api/tasks`
* `GET /api/tasks`
* `GET /api/tasks/:id`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`
* `PATCH /api/tasks/:id/assign`

### File Handling

* `POST /api/tasks/:id/upload`
* `GET /api/tasks/:taskId/files/:fileId`
* `DELETE /api/tasks/:taskId/files/:fileId`

---

## Frontend Requirements

* Login page
* Task dashboard
* Create/Edit task form with file upload
* Store JWT token
* Handle token expiry
* Display API errors
* Prevent duplicate submissions
* Show file preview

---

## Asynchronous Handling

Implement at least one feature using:

* Callback
* Promises
* Async/Await

---

## Validation & Sanitization

* Validate all inputs
* Sanitize strings
* Validate file metadata
* Reject unknown fields

---

## Authentication & Authorization

* JWT-based authentication
* Middleware verification
* Role-based access control

---

## Caching

* Cache `GET /api/tasks`
* Invalidate cache on:
  * Create
  * Update
  * Delete
  * File operations

---

## Error Handling

* Centralized error handler
* Consistent response format
* Handle errors for:
  * Validation
  * File handling
  * Database
  * Authentication
  * Concurrency

---

## Instructions

* Write code from scratch
* Ensure secure file handling
* Avoid exposing file paths
* Clean up unused files
* Ensure all APIs work correctly
* Document everything in README
* Application must be fully functional
