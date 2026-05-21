import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import app from "../src/app.js";
import { Components } from "../src/models/component.model.js";
import { Users } from "../src/models/user.model.js";
import { componentCategory, userRole } from "../src/constants/constants.js";
import { mockComponents } from "../src/seed/mockComponentData.js";

let mongoServer;

const createAuthToken = (userId) => jwt.sign({ id: userId.toString() }, "secret_key");

const createUser = async ({ role = userRole.USER, email }) => {
  const user = await Users.create({
    name: role === userRole.MANAGER ? "Manager" : "User",
    email,
    password: "Password@123",
    role,
  });

  return {
    user,
    token: createAuthToken(user._id),
  };
};

const seedComponents = async () => {
  await Components.deleteMany({});
  return Components.insertMany(mockComponents);
};

test.before(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongoServer.getUri(), { dbName: "evolve_inventory_test" });
});

test.after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await Users.deleteMany({});
  await seedComponents();
});

test("POST /api/v1/component/create creates component with computed total_quantity", async () => {
  const { token } = await createUser({ role: userRole.MANAGER, email: "manager-create@example.com" });
  const payload = {
    name: "HC-SR04 Ultrasonic Sensor",
    image: "https://cdn.example.com/components/hcsr04.jpg",
    description: "Distance measuring sensor",
    component_working: 7,
    component_not_working: 1,
    component_in_use: 2,
    remark: "Used for obstacle detection",
    category: componentCategory.SENSOR,
  };

  const res = await request(app)
    .post("/api/v1/component/create")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.name, payload.name);
  assert.equal(res.body.data.total_quantity, 10);
});

test("PUT /api/v1/component/update updates quantity buckets and total_quantity", async () => {
  const { token } = await createUser({ role: userRole.MANAGER, email: "manager-update@example.com" });
  const existing = await Components.findOne({ name: "Arduino Uno R3" });

  const res = await request(app)
    .put("/api/v1/component/update")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id: existing._id.toString(),
      component_working: 15,
      component_not_working: 2,
      component_in_use: 5,
      remark: "Stock reconciled",
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.component_working, 15);
  assert.equal(res.body.data.component_not_working, 2);
  assert.equal(res.body.data.component_in_use, 5);
  assert.equal(res.body.data.total_quantity, 22);
  assert.equal(res.body.data.remark, "Stock reconciled");
});

test("GET /api/v1/component/:id returns requested component", async () => {
  const { token } = await createUser({ role: userRole.USER, email: "user-get@example.com" });
  const existing = await Components.findOne({ name: "DHT11 Sensor" });

  const res = await request(app)
    .get(`/api/v1/component/${existing._id}`)
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.name, "DHT11 Sensor");
});

test("GET /api/v1/component/category filters by category", async () => {
  const { token } = await createUser({ role: userRole.USER, email: "user-category@example.com" });
  const res = await request(app)
    .get("/api/v1/component/category")
    .set("Authorization", `Bearer ${token}`)
    .query({ category: componentCategory.SENSOR });

  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body.data), true);
  assert.ok(res.body.data.length > 0);
  assert.ok(res.body.data.every((item) => item.category === componentCategory.SENSOR));
});

test("DELETE /api/v1/component/:id removes component", async () => {
  const { token } = await createUser({ role: userRole.MANAGER, email: "manager-delete@example.com" });
  const existing = await Components.findOne({ name: "ESP8266 WiFi Module" });

  const res = await request(app)
    .delete(`/api/v1/component/${existing._id}`)
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);

  const deleted = await Components.findById(existing._id);
  assert.equal(deleted, null);
});

test("GET /api/v1/component/autocomplete returns suggestions", async (t) => {
  const { token } = await createUser({ role: userRole.USER, email: "user-autocomplete@example.com" });
  const aggregateMock = t.mock.method(Components, "aggregate", async () => [
    { _id: "507f191e810c19729de860ea", name: "Arduino Uno R3" },
    { _id: "507f191e810c19729de860eb", name: "Arduino Nano" },
  ]);

  const res = await request(app)
    .get("/api/v1/component/autocomplete")
    .set("Authorization", `Bearer ${token}`)
    .query({ query: "Ard", limit: 2 });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.length, 2);
  assert.equal(res.body.data[0].name, "Arduino Uno R3");
  assert.equal(aggregateMock.mock.calls.length, 1);
});

test("GET /api/v1/component/search returns paginated response", async (t) => {
  const { token } = await createUser({ role: userRole.USER, email: "user-search@example.com" });
  const aggregateMock = t.mock.method(Components, "aggregate", async () => [
    {
      data: [
        {
          _id: "507f191e810c19729de860ec",
          name: "DHT11 Sensor",
          category: componentCategory.SENSOR,
        },
      ],
      totalCount: [{ count: 1 }],
    },
  ]);

  const res = await request(app)
    .get("/api/v1/component/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ query: "sensor", page: 1, limit: 5 });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.total, 1);
  assert.equal(res.body.data.page, 1);
  assert.equal(res.body.data.limit, 5);
  assert.equal(res.body.data.data[0].name, "DHT11 Sensor");
  assert.equal(aggregateMock.mock.calls.length, 1);
});
