const mongoose = require('mongoose');
const Task = require('../models/Task');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const seedTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding tasks...');

        await Task.deleteMany({});

        const tasks = [
            // ========== DAILY MISSIONS (10) ==========
            {
                title: { en: 'Morning Hydration', es: 'Hidratación Matutina' },
                description: { en: 'Drink a glass of water when you wake up', es: 'Bebe un vaso de agua al despertar' },
                category: 'Health',
                rewardXP: 20,
                rewardGold: 30,
                repeatType: 'daily',
                type: 'system',
                difficulty: 1,
            },
            {
                title: { en: 'Exercise 30 Minutes', es: 'Ejercicio 30 Minutos' },
                description: { en: 'Do any physical activity for 30 minutes', es: 'Realiza cualquier actividad física durante 30 minutos' },
                category: 'Fitness',
                rewardXP: 50,
                rewardGold: 100,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Healthy Breakfast', es: 'Desayuno Saludable' },
                description: { en: 'Eat a nutritious breakfast', es: 'Come un desayuno nutritivo' },
                category: 'Health',
                rewardXP: 30,
                rewardGold: 50,
                repeatType: 'daily',
                type: 'system',
                difficulty: 1,
            },
            {
                title: { en: 'Read 20 Pages', es: 'Leer 20 Páginas' },
                description: { en: 'Read at least 20 pages of a book', es: 'Lee al menos 20 páginas de un libro' },
                category: 'Intellect',
                rewardXP: 40,
                rewardGold: 75,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Meditation', es: 'Meditación' },
                description: { en: 'Meditate for 10 minutes', es: 'Medita durante 10 minutos' },
                category: 'Mental Health',
                rewardXP: 35,
                rewardGold: 60,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'No Junk Food', es: 'Sin Comida Chatarra' },
                description: { en: 'Avoid junk food for the entire day', es: 'Evita la comida chatarra durante todo el día' },
                category: 'Health',
                rewardXP: 45,
                rewardGold: 80,
                repeatType: 'daily',
                type: 'system',
                difficulty: 3,
            },
            {
                title: { en: 'Learn Something New', es: 'Aprender Algo Nuevo' },
                description: { en: 'Spend 30 minutes learning a new skill', es: 'Dedica 30 minutos a aprender una nueva habilidad' },
                category: 'Intellect',
                rewardXP: 40,
                rewardGold: 70,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Early to Bed', es: 'Dormir Temprano' },
                description: { en: 'Go to bed before 11 PM', es: 'Acuéstate antes de las 11 PM' },
                category: 'Health',
                rewardXP: 30,
                rewardGold: 50,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Social Connection', es: 'Conexión Social' },
                description: { en: 'Have a meaningful conversation with someone', es: 'Ten una conversación significativa con alguien' },
                category: 'Social',
                rewardXP: 35,
                rewardGold: 60,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Clean Your Space', es: 'Limpia Tu Espacio' },
                description: { en: 'Organize and clean your room or workspace', es: 'Organiza y limpia tu habitación o espacio de trabajo' },
                category: 'Productivity',
                rewardXP: 40,
                rewardGold: 75,
                repeatType: 'daily',
                type: 'system',
                difficulty: 2,
            },

            // ========== WEEKLY MISSIONS (10) ==========
            {
                title: { en: 'Exercise 5 Days', es: 'Ejercicio 5 Días' },
                description: { en: 'Exercise at least 5 days this week', es: 'Haz ejercicio al menos 5 días esta semana' },
                category: 'Fitness',
                rewardXP: 200,
                rewardGold: 400,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 3,
            },
            {
                title: { en: 'Read a Book', es: 'Leer un Libro' },
                description: { en: 'Finish reading a book', es: 'Termina de leer un libro' },
                category: 'Intellect',
                rewardXP: 250,
                rewardGold: 500,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 4,
            },
            {
                title: { en: 'Meal Prep Sunday', es: 'Preparar Comidas Domingo' },
                description: { en: 'Prepare healthy meals for the week', es: 'Prepara comidas saludables para la semana' },
                category: 'Health',
                rewardXP: 150,
                rewardGold: 300,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 3,
            },
            {
                title: { en: 'Digital Detox Day', es: 'Día de Desintoxicación Digital' },
                description: { en: 'Spend one full day without social media', es: 'Pasa un día completo sin redes sociales' },
                category: 'Mental Health',
                rewardXP: 300,
                rewardGold: 600,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 5,
            },
            {
                title: { en: 'Learn New Recipe', es: 'Aprender Nueva Receta' },
                description: { en: 'Cook a new healthy recipe', es: 'Cocina una nueva receta saludable' },
                category: 'Health',
                rewardXP: 180,
                rewardGold: 350,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 3,
            },
            {
                title: { en: 'Volunteer Work', es: 'Trabajo Voluntario' },
                description: { en: 'Help someone or do volunteer work', es: 'Ayuda a alguien o haz trabajo voluntario' },
                category: 'Social',
                rewardXP: 400,
                rewardGold: 800,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 4,
            },
            {
                title: { en: 'Creative Project', es: 'Proyecto Creativo' },
                description: { en: 'Work on a creative project for 3 hours', es: 'Trabaja en un proyecto creativo durante 3 horas' },
                category: 'Creativity',
                rewardXP: 220,
                rewardGold: 450,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 3,
            },
            {
                title: { en: 'Nature Walk', es: 'Caminata en la Naturaleza' },
                description: { en: 'Spend time in nature (park, forest, beach)', es: 'Pasa tiempo en la naturaleza (parque, bosque, playa)' },
                category: 'Health',
                rewardXP: 160,
                rewardGold: 320,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Weekly Review', es: 'Revisión Semanal' },
                description: { en: 'Review your goals and plan for next week', es: 'Revisa tus objetivos y planifica la próxima semana' },
                category: 'Productivity',
                rewardXP: 180,
                rewardGold: 350,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 2,
            },
            {
                title: { en: 'Quality Time', es: 'Tiempo de Calidad' },
                description: { en: 'Spend quality time with family or friends', es: 'Pasa tiempo de calidad con familia o amigos' },
                category: 'Social',
                rewardXP: 200,
                rewardGold: 400,
                repeatType: 'weekly',
                type: 'system',
                difficulty: 2,
            },
        ];

        await Task.insertMany(tasks);
        console.log('Tasks seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTasks();
