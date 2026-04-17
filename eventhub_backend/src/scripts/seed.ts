import "dotenv/config";
import mongoose from "mongoose";
import { EventCategoryModel } from "../domain/models/event-category.model";
import { EventModel } from "../domain/models/event.model";
import { UserModel } from "../domain/models/user.model";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(mongoUri);

  console.log("🌱 Starting MongoDB seed...");

  // Seed des catégories
  const categoryNames = ["Concert", "Conférence", "Sport"];

  for (const name of categoryNames) {
    await EventCategoryModel.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true },
    ).exec();
  }

  const categories = await EventCategoryModel.find({
    name: { $in: categoryNames },
  })
    .lean()
    .exec();

  console.log(
    "✅ Event categories in database:",
    categories.map((c) => c.name).join(", "),
  );

  // Récupérer le premier utilisateur
  const firstUser = await UserModel.findOne().lean().exec();

  if (!firstUser?._id) {
    console.warn(
      "⚠️ No users found in database. Skipping event seeding (need at least one user).",
    );
  } else {
    console.log(
      `👤 Using user ${firstUser.email} as organizer for seeded events.`,
    );

    // Nettoyer les anciens événements de seed (optionnel)
    // Ici on ne supprime rien pour ne pas toucher aux données existantes.

    const now = new Date();
    const eventsToCreate = [];

    for (let i = 0; i < 100; i += 1) {
      const daysInFuture = getRandomInt(7, 90);
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() + daysInFuture);

      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + getRandomInt(1, 4));

      const maxCapacity = getRandomInt(50, 500);
      const availableTickets = getRandomInt(10, maxCapacity);

      const randomCategory = categories[getRandomInt(0, categories.length - 1)];

      const title = `Événement #${i + 1}`;

      eventsToCreate.push({
        title,
        description: `Événement "${title}" généré par le script de seed.`,
        startDate,
        endDate,
        location: `Lieu #${i + 1}, Ville Exemple`,
        maxCapacity,
        availableTickets,
        price: Math.random() < 0.5 ? null : getRandomInt(10, 100),
        // On stocke le nom de la catégorie (le modèle Event utilise un string)
        category: randomCategory?.name ?? "Concert",
        // Pour l'organisateur, on stocke l'identifiant utilisateur sous forme de string
        organizer: String(firstUser._id),
      });
    }

    if (eventsToCreate.length > 0) {
      await EventModel.insertMany(eventsToCreate);
      console.log(`🎫 ${eventsToCreate.length} events created successfully.`);
    }
  }
}

main()
  .catch((error) => {
    console.error("❌ Error during MongoDB seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  });
