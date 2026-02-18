import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();

await Movie.deleteMany({});

await Movie.insertMany([
  {
    title: "Baahubali: The Beginning",
    genre: "Action, Drama",
    releaseYear: 2015,
    director: "S. S. Rajamouli",
    cast: ["Prabhas", "Anushka Shetty", "Rana Daggubati"],
    synopsis: "A young man learns about his royal heritage and fights to reclaim his kingdom.",
    posterUrl: ""
  },
  {
    title: "Baahubali: The Conclusion",
    genre: "Action, Drama",
    releaseYear: 2017,
    director: "S. S. Rajamouli",
    cast: ["Prabhas", "Anushka Shetty", "Rana Daggubati"],
    synopsis: "The epic conclusion revealing the truth behind Baahubali's death.",
    posterUrl: ""
  },
  {
    title: "RRR",
    genre: "Action, Historical",
    releaseYear: 2022,
    director: "S. S. Rajamouli",
    cast: ["NTR", "Ram Charan"],
    synopsis: "Two revolutionaries fight against British rule.",
    posterUrl: ""
  },
  {
    title: "Pushpa: The Rise",
    genre: "Action, Crime",
    releaseYear: 2021,
    director: "Sukumar",
    cast: ["Allu Arjun", "Rashmika Mandanna"],
    synopsis: "A red sandalwood smuggler rises to power.",
    posterUrl: ""
  },
  {
    title: "Salaar: Part 1 – Ceasefire",
    genre: "Action, Thriller",
    releaseYear: 2023,
    director: "Prashanth Neel",
    cast: ["Prabhas", "Prithviraj Sukumaran"],
    synopsis: "A man becomes a key figure in a violent kingdom.",
    posterUrl: ""
  },
  {
    title: "Kalki 2898 AD",
    genre: "Sci-Fi, Action",
    releaseYear: 2024,
    director: "Nag Ashwin",
    cast: ["Prabhas", "Deepika Padukone"],
    synopsis: "A futuristic dystopian story inspired by mythology.",
    posterUrl: ""
  },
  {
    title: "Magadheera",
    genre: "Action, Fantasy",
    releaseYear: 2009,
    director: "S. S. Rajamouli",
    cast: ["Ram Charan", "Kajal Aggarwal"],
    synopsis: "A warrior reincarnates to fulfill his destiny.",
    posterUrl: ""
  },
  {
    title: "Pokiri",
    genre: "Action, Crime",
    releaseYear: 2006,
    director: "Puri Jagannadh",
    cast: ["Mahesh Babu", "Ileana D'Cruz"],
    synopsis: "A man enters the underworld; his true identity shocks everyone.",
    posterUrl: ""
  },
  {
    title: "Athadu",
    genre: "Action, Thriller",
    releaseYear: 2005,
    director: "Trivikram Srinivas",
    cast: ["Mahesh Babu", "Trisha"],
    synopsis: "A professional killer assumes a new identity after a mission goes wrong.",
    posterUrl: ""
  },
  {
    title: "Eega",
    genre: "Fantasy, Action",
    releaseYear: 2012,
    director: "S. S. Rajamouli",
    cast: ["Nani", "Samantha", "Sudeep"],
    synopsis: "A man reincarnates as a fly to take revenge and protect his love.",
    posterUrl: ""
  },
  {
    title: "Arjun Reddy",
    genre: "Drama, Romance",
    releaseYear: 2017,
    director: "Sandeep Reddy Vanga",
    cast: ["Vijay Deverakonda", "Shalini Pandey"],
    synopsis: "A surgeon struggles with anger, heartbreak, and addiction.",
    posterUrl: ""
  },
  {
    title: "Jersey",
    genre: "Drama, Sports",
    releaseYear: 2019,
    director: "Gowtam Tinnanuri",
    cast: ["Nani", "Shraddha Srinath"],
    synopsis: "A failed cricketer makes a comeback to fulfill his son's dream.",
    posterUrl: ""
  }
]);

console.log("Seeded movies ✅");
await mongoose.connection.close();
