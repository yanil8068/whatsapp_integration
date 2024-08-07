// pages/api/createProject.js
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-08-06",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const newProject = await client.create({
        _type: "project",
        name: req.body.title, // Adjust based on the fields in your Sanity schema
        description: req.body.description, // Example field
        createdby: {
          _type: "reference",
          _ref: req.body.createdby, // The ID of the referenced user
        },
      });
      res.status(200).json(newProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
