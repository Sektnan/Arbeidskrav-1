import { Hono } from 'hono';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = new Hono();

const projectsjson = fileURLToPath(import.meta.url);
const Backendsrcindexts = path.dirname(projectsjson);

const jsonPath = path.join(Backendsrcindexts, '../data/projects.json');

app.get('/projects', (c) => {
  try {
    const projectsData = readFileSync(jsonPath, 'utf-8');
    const projects = JSON.parse(projectsData);

    return c.json(projects.Projects);
  } catch (error) {
    return c.text('Kunne ikke hente prosjektene', 500);
  }
});

app.post('/projects', async (c) => {
  try {
    const newProject = await c.req.json();

    const projectsData = readFileSync(jsonPath, 'utf-8');
    const projects = JSON.parse(projectsData);

    const newId = projects.Projects.length > 0
      ? projects.Projects[projects.Projects.length - 1].id + 1
      : 1;
    newProject.id = newId;

    projects.Projects.push(newProject);

    writeFileSync(jsonPath, JSON.stringify(projects, null, 2));

    return c.json({ message: 'Prosjektet ble opprettet', project: newProject });
  } catch (error) {
    return c.text('Kunne ikke opprette prosjektet', 500);
  }
});

