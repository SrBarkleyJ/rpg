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
            // ========== DAILY MISSIONS (45) ==========
            // --- Health & Fitness (12) ---
            { title: { en: 'Morning Hydration', es: 'Hidratación Matutina' }, description: { en: 'Drink a glass of water when you wake up', es: 'Bebe un vaso de agua al despertar' }, category: 'Health & Fitness', rewardXP: 20, rewardGold: 30, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Exercise 30 Minutes', es: 'Ejercicio 30 Minutos' }, description: { en: 'Do any physical activity for 30 minutes', es: 'Realiza cualquier actividad física durante 30 minutos' }, category: 'Health & Fitness', rewardXP: 50, rewardGold: 100, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Healthy Breakfast', es: 'Desayuno Saludable' }, description: { en: 'Eat a nutritious breakfast', es: 'Come un desayuno nutritivo' }, category: 'Health & Fitness', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Stretching Routine', es: 'Rutina de Estiramiento' }, description: { en: 'Spend 10 minutes stretching your body', es: 'Dedica 10 minutos a estirar tu cuerpo' }, category: 'Health & Fitness', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Sugar Free Day', es: 'Día Sin Azúcar' }, description: { en: 'Avoid added sugars for the entire day', es: 'Evita azúcares añadidos durante todo el día' }, category: 'Health & Fitness', rewardXP: 60, rewardGold: 90, repeatType: 'daily', type: 'system', difficulty: 3 },
            { title: { en: 'Take a Walk', es: 'Dar un Paseo' }, description: { en: 'Take a 15 minute walk outside', es: 'Da un paseo de 15 minutos al aire libre' }, category: 'Health & Fitness', rewardXP: 30, rewardGold: 45, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Eat a Fruit', es: 'Comer una Fruta' }, description: { en: 'Include a piece of fruit in your snacks', es: 'Incluye una pieza de fruta en tus meriendas' }, category: 'Health & Fitness', rewardXP: 20, rewardGold: 30, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'No Caffeine afternoon', es: 'Tarde sin Cafeína' }, description: { en: 'Avoid caffeine after 2 PM', es: 'Evita la cafeína después de las 2 PM' }, category: 'Health & Fitness', rewardXP: 40, rewardGold: 60, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Plank Challenge', es: 'Reto de Plancha' }, description: { en: 'Hold a plank for 1 minute', es: 'Mantén una plancha durante 1 minuto' }, category: 'Health & Fitness', rewardXP: 45, rewardGold: 70, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Take the Stairs', es: 'Usa las Escaleras' }, description: { en: 'Use stairs instead of elevator today', es: 'Usa las escaleras en lugar del ascensor hoy' }, category: 'Health & Fitness', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Vegetarian Meal', es: 'Comida Vegetariana' }, description: { en: 'Have at least one meat-free meal', es: 'Ten al menos una comida sin carne' }, category: 'Health & Fitness', rewardXP: 35, rewardGold: 55, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Sleep 8 Hours', es: 'Dormir 8 Horas' }, description: { en: 'Get a full 8 hours of sleep tonight', es: 'Duerme 8 horas completas esta noche' }, category: 'Health & Fitness', rewardXP: 50, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 2 },

            // --- Mental Wellbeing (9) ---
            { title: { en: 'Read 20 Pages', es: 'Leer 20 Páginas' }, description: { en: 'Read at least 20 pages of a book', es: 'Lee al menos 20 páginas de un libro' }, category: 'Mental Wellbeing', rewardXP: 40, rewardGold: 75, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Meditation', es: 'Meditación' }, description: { en: 'Meditate for 10 minutes', es: 'Medita durante 10 minutos' }, category: 'Mental Wellbeing', rewardXP: 35, rewardGold: 60, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Journaling', es: 'Diario Personal' }, description: { en: 'Write down your thoughts or gratitude', es: 'Escribe tus pensamientos o gratitud' }, category: 'Mental Wellbeing', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Learn Something New', es: 'Aprender Algo Nuevo' }, description: { en: 'Spend 30 minutes learning a new skill', es: 'Dedica 30 minutos a aprender una nueva habilidad' }, category: 'Mental Wellbeing', rewardXP: 45, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Positive Affirmations', es: 'Afirmaciones Positivas' }, description: { en: 'Repeat 3 positive affirmations', es: 'Repite 3 afirmaciones positivas' }, category: 'Mental Wellbeing', rewardXP: 20, rewardGold: 30, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Listen to Podcast', es: 'Escuchar Podcast' }, description: { en: 'Listen to an educational podcast episode', es: 'Escucha un episodio de podcast educativo' }, category: 'Mental Wellbeing', rewardXP: 35, rewardGold: 55, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'No Social Media', es: 'Sin Redes Sociales' }, description: { en: 'Avoid social media for 2 hours', es: 'Evita redes sociales por 2 horas' }, category: 'Mental Wellbeing', rewardXP: 50, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 3 },
            { title: { en: 'Puzzle Time', es: 'Tiempo de Puzzles' }, description: { en: 'Solve a puzzle or logic game', es: 'Resuelve un puzzle o juego de lógica' }, category: 'Mental Wellbeing', rewardXP: 30, rewardGold: 45, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Mindful Breathing', es: 'Respiración Consciente' }, description: { en: 'Practice deep breathing for 5 mins', es: 'Practica respiración profunda por 5 min' }, category: 'Mental Wellbeing', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },

            // --- Productivity (9) ---
            { title: { en: 'Clean Your Space', es: 'Limpia Tu Espacio' }, description: { en: 'Organize and clean your room or workspace', es: 'Organiza y limpia tu habitación o espacio de trabajo' }, category: 'Productivity', rewardXP: 40, rewardGold: 75, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Plan Tomorrow', es: 'Planificar Mañana' }, description: { en: 'Write down your top 3 goals for tomorrow', es: 'Escribe tus 3 objetivos principales para mañana' }, category: 'Productivity', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Deep Work Session', es: 'Sesión de Trabajo Profundo' }, description: { en: 'Work for 60 minutes without distractions', es: 'Trabaja durante 60 minutos sin distracciones' }, category: 'Productivity', rewardXP: 60, rewardGold: 100, repeatType: 'daily', type: 'system', difficulty: 3 },
            { title: { en: 'Clear Emails', es: 'Limpiar Correos' }, description: { en: 'Respond to all pending emails', es: 'Responde a todos los correos pendientes' }, category: 'Productivity', rewardXP: 35, rewardGold: 60, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Update To-Do List', es: 'Actualizar Tareas' }, description: { en: 'Review and update your task list', es: 'Revisa y actualiza tu lista de tareas' }, category: 'Productivity', rewardXP: 20, rewardGold: 30, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Organize Digital Files', es: 'Organizar Archivos' }, description: { en: 'Sort your desktop or download folder', es: 'Ordena tu escritorio o carpeta de descargas' }, category: 'Productivity', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Review Goals', es: 'Revisar Metas' }, description: { en: 'Read your long term goals', es: 'Lee tus metas a largo plazo' }, category: 'Productivity', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Early Bird', es: 'Madrugador' }, description: { en: 'Wake up 30 minutes earlier than usual', es: 'Despierta 30 minutos antes de lo usual' }, category: 'Productivity', rewardXP: 45, rewardGold: 70, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Backup Data', es: 'Copia de Seguridad' }, description: { en: 'Backup your important files', es: 'Haz copia de seguridad de archivos importantes' }, category: 'Productivity', rewardXP: 50, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 2 },

            // --- Social (8) ---
            { title: { en: 'Social Connection', es: 'Conexión Social' }, description: { en: 'Have a meaningful conversation', es: 'Ten una conversación significativa' }, category: 'Social', rewardXP: 35, rewardGold: 60, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Call a Friend', es: 'Llamar a un Amigo' }, description: { en: 'Call a friend just to chat', es: 'Llama a un amigo solo para charlar' }, category: 'Social', rewardXP: 40, rewardGold: 70, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Compliment Someone', es: 'Hacer un Cumplido' }, description: { en: 'Give a genuine compliment to someone', es: 'Haz un cumplido genuino a alguien' }, category: 'Social', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Family Time', es: 'Tiempo en Familia' }, description: { en: 'Spend quality time with family', es: 'Pasa tiempo de calidad con la familia' }, category: 'Social', rewardXP: 45, rewardGold: 75, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Send a Message', es: 'Enviar un Mensaje' }, description: { en: 'Text someone you haven\'t spoken to in a while', es: 'Escribe a alguien con quien no hablas hace tiempo' }, category: 'Social', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Active Listening', es: 'Escucha Activa' }, description: { en: 'Practice active listening in a conversation', es: 'Practica la escucha activa en una conversación' }, category: 'Social', rewardXP: 35, rewardGold: 55, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Help a Neighbor', es: 'Ayudar a Vecino' }, description: { en: 'Do a small favor for a neighbor', es: 'Haz un pequeño favor a un vecino' }, category: 'Social', rewardXP: 50, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Share a Meal', es: 'Compartir Comida' }, description: { en: 'Eat lunch or dinner with someone', es: 'Almuerza o cena con alguien' }, category: 'Social', rewardXP: 40, rewardGold: 65, repeatType: 'daily', type: 'system', difficulty: 1 },

            // --- Creativity (7) ---
            { title: { en: 'Creative Sketch', es: 'Boceto Creativo' }, description: { en: 'Spend 15 minutes drawing', es: 'Dedica 15 minutos a dibujar' }, category: 'Creativity', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Write a Poem', es: 'Escribir Poema' }, description: { en: 'Write a short poem or haiku', es: 'Escribe un poema corto o haiku' }, category: 'Creativity', rewardXP: 35, rewardGold: 55, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Photo Walk', es: 'Paseo Fotográfico' }, description: { en: 'Take 5 creative photos', es: 'Toma 5 fotos creativas' }, category: 'Creativity', rewardXP: 40, rewardGold: 60, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Brainstorm Ideas', es: 'Lluvia de Ideas' }, description: { en: 'Write down 10 ideas for a project', es: 'Escribe 10 ideas para un proyecto' }, category: 'Creativity', rewardXP: 30, rewardGold: 50, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'Listen to New Music', es: 'Nueva Música' }, description: { en: 'Listen to a genre you usually don\'t', es: 'Escucha un género que usualmente no oyes' }, category: 'Creativity', rewardXP: 25, rewardGold: 40, repeatType: 'daily', type: 'system', difficulty: 1 },
            { title: { en: 'Cook Something New', es: 'Cocinar Algo Nuevo' }, description: { en: 'Try a new cooking ingredient', es: 'Prueba un nuevo ingrediente al cocinar' }, category: 'Creativity', rewardXP: 45, rewardGold: 70, repeatType: 'daily', type: 'system', difficulty: 2 },
            { title: { en: 'DIY Fix', es: 'Arreglo DIY' }, description: { en: 'Fix or improve looking of an object', es: 'Arregla o mejora la apariencia de un objeto' }, category: 'Creativity', rewardXP: 50, rewardGold: 80, repeatType: 'daily', type: 'system', difficulty: 3 },


            // ========== WEEKLY MISSIONS (33) ==========
            // --- Health & Fitness (10) ---
            { title: { en: 'Exercise 5 Days', es: 'Ejercicio 5 Días' }, description: { en: 'Exercise at least 5 days this week', es: 'Haz ejercicio al menos 5 días esta semana' }, category: 'Health & Fitness', rewardXP: 200, rewardGold: 400, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Run 10km Total', es: 'Correr 10km Total' }, description: { en: 'Accumulate 10km of running or walking', es: 'Acumula 10km corriendo o caminando' }, category: 'Health & Fitness', rewardXP: 250, rewardGold: 450, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Nature Hike', es: 'Caminata en la Naturaleza' }, description: { en: 'Go for a long hike in nature', es: 'Ve a una caminata larga en la naturaleza' }, category: 'Health & Fitness', rewardXP: 200, rewardGold: 380, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Learn New Recipe', es: 'Aprender Nueva Receta' }, description: { en: 'Cook a new healthy recipe', es: 'Cocina una nueva receta saludable' }, category: 'Health & Fitness', rewardXP: 180, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'No Fast Food', es: 'Sin Comida Rápida' }, description: { en: 'Avoid fast food for the entire week', es: 'Evita comida rápida toda la semana' }, category: 'Health & Fitness', rewardXP: 300, rewardGold: 500, repeatType: 'weekly', type: 'system', difficulty: 4 },
            { title: { en: 'Yoga Session', es: 'Sesión de Yoga' }, description: { en: 'Do a full hour yoga session', es: 'Haz una sesión de yoga de una hora' }, category: 'Health & Fitness', rewardXP: 150, rewardGold: 250, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Meal Prep', es: 'Preparar Comidas' }, description: { en: 'Prepare your meals for the week', es: 'Prepara tus comidas para la semana' }, category: 'Health & Fitness', rewardXP: 200, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Bike Ride', es: 'Paseo en Bici' }, description: { en: 'Go for a bike ride covering 5km', es: 'Da un paseo en bici cubriendo 5km' }, category: 'Health & Fitness', rewardXP: 180, rewardGold: 300, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Try New Sport', es: 'Nuevo Deporte' }, description: { en: 'Try playing a sport you don\'t usually play', es: 'Prueba un deporte que no juegas usualmente' }, category: 'Health & Fitness', rewardXP: 220, rewardGold: 400, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Hydration Goal', es: 'Meta de Hidratación' }, description: { en: 'Hit your water goal every day this week', es: 'Cumple tu meta de agua cada día esta semana' }, category: 'Health & Fitness', rewardXP: 250, rewardGold: 450, repeatType: 'weekly', type: 'system', difficulty: 3 },

            // --- Mental Wellbeing (6) ---
            { title: { en: 'Read a Book', es: 'Leer un Libro' }, description: { en: 'Finish reading a book', es: 'Termina de leer un libro' }, category: 'Mental Wellbeing', rewardXP: 300, rewardGold: 550, repeatType: 'weekly', type: 'system', difficulty: 4 },
            { title: { en: 'Meditation Week', es: 'Semana de Meditación' }, description: { en: 'Meditate 3 times this week', es: 'Medita 3 veces esta semana' }, category: 'Mental Wellbeing', rewardXP: 200, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Digital Detox Weekend', es: 'Detox Digital Finde' }, description: { en: 'Limit screen time significantly on weekend', es: 'Limita pantallas significativamente el finde' }, category: 'Mental Wellbeing', rewardXP: 350, rewardGold: 600, repeatType: 'weekly', type: 'system', difficulty: 4 },
            { title: { en: 'Learn New Skill', es: 'Nueva Habilidad' }, description: { en: 'Dedicate 2 hours to learning a skill', es: 'Dedica 2 horas a aprender una habilidad' }, category: 'Mental Wellbeing', rewardXP: 220, rewardGold: 400, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Gratitude Journal', es: 'Diario de Gratitud' }, description: { en: 'Write in gratitude journal 4 days', es: 'Escribe en diario de gratitud 4 días' }, category: 'Mental Wellbeing', rewardXP: 180, rewardGold: 300, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Self Care Day', es: 'Día de Autocuidado' }, description: { en: 'Dedicate half a day to self care', es: 'Dedica medio día a tu autocuidado' }, category: 'Mental Wellbeing', rewardXP: 250, rewardGold: 450, repeatType: 'weekly', type: 'system', difficulty: 3 },

            // --- Productivity (6) ---
            { title: { en: 'Zero Inbox', es: 'Bandeja de Entrada Cero' }, description: { en: 'Clear your email inbox completely', es: 'Limpia tu bandeja de entrada completamente' }, category: 'Productivity', rewardXP: 150, rewardGold: 300, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Budget Review', es: 'Revisión de Presupuesto' }, description: { en: 'Review your weekly expenses', es: 'Revisa tus gastos semanales' }, category: 'Productivity', rewardXP: 160, rewardGold: 320, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Fix Something', es: 'Reparar Algo' }, description: { en: 'Repair something broken in your house', es: 'Repara algo roto en tu casa' }, category: 'Productivity', rewardXP: 180, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Project Milestone', es: 'Hito de Proyecto' }, description: { en: 'Complete a major milestone in a project', es: 'Completa un hito importante en un proyecto' }, category: 'Productivity', rewardXP: 300, rewardGold: 500, repeatType: 'weekly', type: 'system', difficulty: 4 },
            { title: { en: 'Clean Whole Room', es: 'Limpiar Habitación' }, description: { en: 'Deep clean one entire room', es: 'Limpieza profunda de una habitación entera' }, category: 'Productivity', rewardXP: 200, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Plan Next Week', es: 'Planear Próxima Semana' }, description: { en: 'Detail plan for the upcoming week', es: 'Plan detallado para la próxima semana' }, category: 'Productivity', rewardXP: 150, rewardGold: 280, repeatType: 'weekly', type: 'system', difficulty: 2 },

            // --- Social (6) ---
            { title: { en: 'Volunteer Work', es: 'Trabajo Voluntario' }, description: { en: 'Help someone or do volunteer work', es: 'Ayuda a alguien o haz trabajo voluntario' }, category: 'Social', rewardXP: 400, rewardGold: 800, repeatType: 'weekly', type: 'system', difficulty: 4 },
            { title: { en: 'Host a Game Night', es: 'Noche de Juegos' }, description: { en: 'Organize a game night', es: 'Organiza una noche de juegos' }, category: 'Social', rewardXP: 250, rewardGold: 450, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Catch Up Call', es: 'Llamada de Puesta al Día' }, description: { en: 'Have a long call with a distant friend', es: 'Ten una llamada larga con un amigo lejano' }, category: 'Social', rewardXP: 200, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Attend Event', es: 'Asistir a Evento' }, description: { en: 'Go to a social or community event', es: 'Ve a un evento social o comunitario' }, category: 'Social', rewardXP: 220, rewardGold: 400, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Write Letters', es: 'Escribir Cartas' }, description: { en: 'Write meaningful letters to 2 people', es: 'Escribe cartas significativas a 2 personas' }, category: 'Social', rewardXP: 180, rewardGold: 320, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Cook for Friends', es: 'Cocinar para Amigos' }, description: { en: 'Prepare a meal for friends', es: 'Prepara una comida para amigos' }, category: 'Social', rewardXP: 300, rewardGold: 550, repeatType: 'weekly', type: 'system', difficulty: 4 },

            // --- Creativity (5) ---
            { title: { en: 'Creative Project', es: 'Proyecto Creativo' }, description: { en: 'Work on a creative project for 3 hours', es: 'Trabaja en un proyecto creativo durante 3 horas' }, category: 'Creativity', rewardXP: 220, rewardGold: 450, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Visit Museum', es: 'Visitar Museo' }, description: { en: 'Visit a museum or art gallery', es: 'Visita un museo o galería de arte' }, category: 'Creativity', rewardXP: 250, rewardGold: 400, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'Learn New Song', es: 'Aprender Canción' }, description: { en: 'Learn to play/sing a new song', es: 'Aprende a tocar/cantar una nueva canción' }, category: 'Creativity', rewardXP: 200, rewardGold: 350, repeatType: 'weekly', type: 'system', difficulty: 3 },
            { title: { en: 'DIY Decoration', es: 'Decoración DIY' }, description: { en: 'Create a decoration item for your home', es: 'Crea un objeto de decoración para tu hogar' }, category: 'Creativity', rewardXP: 180, rewardGold: 300, repeatType: 'weekly', type: 'system', difficulty: 2 },
            { title: { en: 'Write a Short Story', es: 'Escribir Cuento Corto' }, description: { en: 'Write a short fiction story', es: 'Escribe un cuento corto de ficción' }, category: 'Creativity', rewardXP: 280, rewardGold: 500, repeatType: 'weekly', type: 'system', difficulty: 4 },
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
