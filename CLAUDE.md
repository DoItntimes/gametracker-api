# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GameTracker API is a small Express 5 REST API backed by MongoDB (Atlas), for tracking video games (title, genre, platform, score, price).

## Commands

- Install dependencies: `npm install`
- Run the server: `node index.js` (listens on port 3000, hardcoded in `index.js`)
- No test suite, lint, or build step is configured (`npm test` is a stub that exits with an error).

Requires a `.env` file at the repo root with `MONGODB_URI` set to a MongoDB connection string (loaded via `dotenv` in `index.js`). `.env` is gitignored.

## Architecture

Standard router → controller → db layering, one resource (`games`) so far:

- `index.js` — app entrypoint; wires `express.json()` and mounts `routes/games.routes.js` at `/games`.
- `routes/games.routes.js` — maps HTTP verbs/paths to controller functions. No route-level middleware for validation; validation happens inside controllers.
- `controllers/games.controller.js` — request handlers (`getGames`, `getGamesByTitle`, `createGame`, `updateGame`, `deleteGame`). Contains all query-building, pagination, and validation-orchestration logic.
- `validators/games.validators.js` — plain functions (`validateScore`, `validatePrice`, `validateString`) that return an error message string or `null`. Controllers call these per-field and short-circuit with a 400 response on the first error.
- `db/mongo.js` — exports `getGamesCollection()`, which connects a shared `MongoClient` (module-level singleton) and returns the `gametracker.games` collection. Every controller calls this at the top of each request handler; `client.connect()` is safe to call repeatedly on an already-connected client.

Games are looked up by `title` (not by `_id`) in `getGamesByTitle`, `updateGame`, and `deleteGame` — titles are treated as the natural key for single-resource routes.

`getGames` (`GET /games`) supports filtering and pagination via query params:
- `genre`, `platform` — exact match filters.
- `minScore` — `score >= minScore`.
- `maxPrice` — `price <= maxPrice`.
- `sort=score` — sort by score descending.
- `order=asc|desc` — sort by price ascending/descending (independent of `sort`; both can combine into the same Mongo sort object).
- `page`, `limit` — 1-indexed pagination (defaults: page 1, limit 5). Response includes `page`, `limit`, `totalGames`, `totalPages`, `hasNextPage`, and `games`.

`updateGame` (`PATCH /games/:title`) restricts updatable fields to `genre`, `score`, `price`, `platform` via an allowlist and rejects the request with 400 if any other field is present in the body.

User-facing error/success messages are in Spanish; keep new messages consistent with that convention unless told otherwise.
