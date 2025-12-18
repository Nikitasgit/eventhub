// EN JavaScript classique
const data = '{"x":10, "y": 50}';

// const coordinates = JSON.parse(data);

// coordinates.azerty();

const coordinates: { x: number; y: number } = JSON.parse(data);
// coordinates.existePas(); // Erreur pre-compilation, la méthode n'existe pas
