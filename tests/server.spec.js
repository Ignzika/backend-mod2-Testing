import request from "supertest";
import app from "../index.js";
import jwt from "jsonwebtoken";

describe('CRUD from "Cafeteria Nanacao" operations', () => {
  describe("GET /cafes", () => {
    it("Should return code 200", async () => {
      const response = await request(app).get("/cafes").send();

      expect(response.status).toBe(200);
    });

    it("Should return an Array", async () => {
      const response = await request(app).get("/cafes").send();

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return expected data ", async () => {
      const expected = {
        id: 1,
        nombre: "Cortado",
      };
      const response = await request(app).get("/cafes").send();

      // console.log(response);
      expect(JSON.parse(response.text)).toContainEqual(expected);
      expect(response.body).toContainEqual(expected); // lo mismo que lo anterior.
    });
    it("Is empty?", async () => {
      const response = await request(app).get("/cafes").send();
      expect(response.body).not.toContainEqual({} || [] || null || undefined);
    });
  });

    describe("GET ID /cafes/:id", () => {
        const items = 8 //number of items to check
    for (let i = 1; i <= items; i++) {
       const ID = i
        it("Should return code 200", async () => {
            const response = await request(app).get(`/cafes/${ID}`).send();

            if (response.status === 200) {
                
                expect(response.status).toBe(200);
            } else {
                expect(response.status).toBe(404);
            }
            });
           
        } 
          
  });
    
    
  describe("POST /cafes", () => {
    const newCoffe = {
      id: 99,
      nombre: "Decaf",
    };

    it("Create new post whit valid data", async () => {
      const response = await request(app).post("/cafes").send(newCoffe);

      expect(response.status).toBe(201);
    });

    it("Return array ?", async () => {
      const response = await request(app).get("/cafes").send();
      expect(response.body).toBeInstanceOf(Array);
    });

    it("Return response whit newCoffe object", async () => {
      const response = await request(app).get("/cafes").send();
      // console.log(response);
      expect(JSON.parse(response.text)).toContainEqual(newCoffe);
    });
      
      //bad data
      
      it("Create post with bad data", async () => {
        const badCoffe = {
            id: 4+4*12,
            nombre: 4 ,
          };
          const response = await request(app).post("/cafes").send(badCoffe);
          console.log(response.body)
          expect(response.status).toBe(400); // no validation for bad data, still post the number
          
      });

      it("Create post with same id", async () => {
        const exist = {
            id: 1,
            nombre: "Cortado",
          };
          
        const response = await request(app).post("/cafes").send(exist);
        expect(response.status).toBe(400);
        
    });
      
  });

  describe("PUT /cafes/:id", () => {
    const newCoffe = {
      id: 99,
      nombre: "Original Decaf",
    };

    it("Found id post, return code 200", async () => {
      const response = await request(app).post(`/cafes`).send(newCoffe);
      const putCoffe = {
        id: newCoffe.id,
        nombre: "Updated Decaffeinated",
      };
      const updateResponse = await request(app)
        .put(`/cafes/${putCoffe.id}`)
        .send(putCoffe);
      // console.log(updateResponse);
      expect(updateResponse.status).toBe(200);
    });
      //bad data

      it("ID for update not found", async () => {
          const response = await request(app).post(`/cafes`).send(newCoffe);
          
        const putBadIDCoffe = {
          id: newCoffe.id +5,
          nombre: "Updated Decaffeinated",
        };
        const updateResponse = await request(app)
          .put(`/cafes/${newCoffe.id}`)
          .send(putBadIDCoffe);
        // console.log(updateResponse);
        expect(updateResponse.status).toBe(400);
      });

      it("Updating a non existing ID", async () => {
        const response = await request(app).post(`/cafes`).send(newCoffe);
        
      const putBadIDCoffe = {
        id: 959595*1000,
        nombre: "Updated Decaffeinated",
      };
      const updateResponse = await request(app)
        .put(`/cafes/${putBadIDCoffe.id}`)
        .send(putBadIDCoffe);
      // console.log(updateResponse);
      expect(updateResponse.status).toBe(404);
      });
      

      


  });

  describe("DELETE /cafes/:id", () => {
    const newCoffe = {
      id: 99,
      nombre: "Original Decaf",
    };

    it("Delete a newCoffe object", async () => {
      const response = await request(app).post(`/cafes`).send(newCoffe);
      // console.log(response)
      const jwt = response.headers["Authorization"];
      const deleteResponse = await request(app)
        .delete(`/cafes/${newCoffe.id}`)
        .set("Authorization", `Bearer ${jwt}`)
        .send();
      // console.log(deleteResponse.status)
      expect(deleteResponse.status).toBe(200);
    });

    // bad data

    it("Send the error code 404 on bad ID", async () => {
      const badID = "something";
      const response = await request(app).post(`/cafes`).send(newCoffe);
      const jwt = response.headers["Authorization"];
      const deleteResponse = await request(app)
        .delete(`/cafes/${badID}`)
        .set("Authorization", `Bearer ${badID}`)
        .send();
      // console.log(deleteResponse.status)
      expect(deleteResponse.status).toBe(404);
    });

    it("Send Error on NO token", async () => {
      const otherCoffe = {
        id: 999,
        nombre: "Original Decaf",
      };
      const response = await request(app)
        .post(`/cafes`)
        .send(newCoffe);

      const deleteResponse = await request(app)
        .delete(`/cafes/${otherCoffe.id}`)
        .send();
      expect(deleteResponse.status).toBe(400);
    });
      
    it("Send Error on bad token", async () => {
        const otherCoffe = {
          id: 999,
          nombre: "Original Decaf",
        };
        const token = "thisisatoken";
        const badToken = "something";
        const response = await request(app)
          .post(`/cafes`)
          .set("Authorization", `Bearer ${token}`)
          .send(newCoffe);
  
        const deleteResponse = await request(app)
          .delete(`/cafes/${otherCoffe.id}`)
          .set("Authorization", `Bearer ${badToken}`)
          .send();
        // console.log(deleteResponse.status)
        expect(deleteResponse.status).toBe(400 || 498); // bad use of token on code
      });
      
      
  });
    
    describe("Not Found route",  () => {
        it("Status Code 404 on non existent routes", async () => {
            const response = await request(app).get("/bad").send();

            expect(response.status).toBe(404);
        });

    })
});
