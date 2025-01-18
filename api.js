// set up express
const express = require("express");
const app = express();
app.use(express.json());

const pool = require("./dbcon.js");

const port = 8000;

app.get('/api/get/all', (req, res) => {
    pool.query("SELECT * FROM animals", (err, results) => {
        if (err) throw err;

        return res.status(200).send(results.rows);
    })
})

app.get('/api/get/:animalId', (req, res) => {
    const animalId = parseInt(req.params.animalId);

    pool.query("SELECT * FROM animals WHERE id = $1", [animalId], (err, results) => {
        if (err) throw err;

        return res.status(200).send(results.rows);
    })
})

app.post('/api/add-animal', (req, res) => {
    const { animalName, animalType, incident, healthStatus, latitude, longitude } = req.body;

    if (!animalName) return res.status(400).send({"error": "Animal name is required"});
    if (!animalType) return res.status(400).send({"error": "Animal type is required"});
    if (!incident) return res.status(400).send({"error": "Incident is required"});
    if (!healthStatus) return res.status(400).send({"error": "Health status is required"});
    if (!latitude) return res.status(400).send({"error": "Latitude is required"});
    if (!longitude) return res.status(400).send({"error": "Longitude is required"});

    pool.query("INSERT INTO animals (animal_name, animal_type, incident, health_status, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6)", [animalName, animalType, incident, healthStatus, latitude, longitude], (err, results) => {
        if (err) throw err;

        return res.status(200).send({
            "message": "Stray animal added!"
        })
    })  
})

app.patch('/api/:animalId/update', async (req, res) => {
    const animalId = req.params.animalId;
    const updates = req.body;
  
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update provided' });
    }
  
    try {
      const setClause = Object.keys(updates)
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(', ');
  
      const values = Object.values(updates);
      const query = `UPDATE animals SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`;
      const result = await pool.query(query, [...values, animalId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.delete('/api/:animalId/found', (req, res) => {
    const animalId = parseInt(req.params.animalId);

    pool.query('DELETE FROM animals WHERE id = $1', [animalId], (err, results) => {
       if (err) throw err

        return res.status(200).send({
            'message': 'Animal has been found!'
        })
    })
})

app.listen(port, (err) => {
    if (err) console.log(`Error: ${err}`);
    console.log(`Server is running on port ${port}`);
})