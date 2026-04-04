import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

test("blocks auth after limit", async () => {
	for (let i = 0; i < 20; i++) {
		const response = await request(app).post("/auth/login").send({});
		assert.equal(response.status, 400);
	}

	const blockedResponse = await request(app).post("/auth/login").send({});
	assert.equal(blockedResponse.status, 429);
	assert.equal(blockedResponse.body.success, false);
	assert.equal(blockedResponse.body.message, "Too many requests, try again later");
});

test("blocks records after limit", async () => {
	for (let i = 0; i < 100; i++) {
		const response = await request(app).get("/records");
		assert.equal(response.status, 401);
	}

	const blockedResponse = await request(app).get("/records");
	assert.equal(blockedResponse.status, 429);
	assert.equal(blockedResponse.body.success, false);
	assert.equal(blockedResponse.body.message, "Too many requests, try again later");
});


