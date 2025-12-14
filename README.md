# RPG Task Manager

A gamified task management mobile application built with React Native (Expo) and Node.js. Turn your daily tasks into an RPG adventure!

## 🎮 Features

- **Character System**: Choose from Warrior, Mage, or Rogue classes
- **Combat System**: 
  - Manual turn-based combat
  - Automatic combat mode
  - Dungeon runs with multiple enemies
  - Skills and abilities system
- **Task Management**: Complete real-world tasks to gain XP and gold
- **Equipment & Forge**: Craft and upgrade weapons with Tetranuta system
- **Rewards Shop**: Spend gold on consumables and equipment
- **Multi-language Support**: English and Spanish
- **Dark/Light Theme**: Customizable UI themes

## 📁 Project Structure

```
rpg/
├── frontend/          # React Native (Expo) mobile app
├── backend/           # Node.js Express API server
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator) or iOS Simulator

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and configure:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `PORT`: Server port (default: 4000)

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Expo:
   ```bash
   npx expo start
   ```

4. Run on Android emulator:
   ```bash
   npx expo start --android
   ```

   Or iOS simulator:
   ```bash
   npx expo start --ios
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Combat
- `POST /api/combat/initiate` - Start combat
- `POST /api/combat/action` - Perform combat action
- `GET /api/combat/dungeons` - Get available dungeons
- `POST /api/combat/dungeon/start` - Start dungeon run

### Rewards
- `GET /api/rewards/shop` - Get shop items
- `POST /api/rewards/purchase` - Purchase item
- `GET /api/rewards/inventory` - Get player inventory

### Skills
- `GET /api/skills` - Get available skills
- `POST /api/skills/unlock` - Unlock new skill

### Forge
- `POST /api/forge/tetranuta` - Forge/upgrade weapons

## 🛠️ Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- AsyncStorage

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 📱 Screenshots

*(Add screenshots of your app here)*

## 🗺️ Roadmap

### Fase 1: Mejoras de Combate (Q1 2025)
- [ ] **Combate contra múltiples enemigos**: Implementar batallas con varios enemigos simultáneamente
- [ ] **Sistema de oleadas**: Enemigos aparecen en oleadas progresivas
- [ ] **IA enemiga mejorada**: Comportamientos más inteligentes y variados
- [ ] **Animaciones de combate avanzadas**: Nuevos efectos visuales y transiciones

### Fase 2: Sistema Social (Q2 2025)
- [ ] **Leaderboard global**: Ranking de todos los usuarios por nivel, victorias y estadísticas
- [ ] **Sistema de amigos**: Agregar y gestionar lista de amigos
- [ ] **Mensajes entre jugadores**: Chat básico entre usuarios
- [ ] **Estadísticas comparativas**: Ver progreso relativo a otros jugadores

### Fase 3: Contenido Expandido (Q3 2025)
- [ ] **Nuevas misiones**: Sistema de misiones secundarias con recompensas especiales
- [ ] **Eventos temporales**: Contenido limitado por tiempo con recompensas exclusivas
- [ ] **Sistema de logros**: Insignias y títulos desbloqueables
- [ ] **Modo historia**: Campaña narrativa con quests conectadas

### Fase 4: Mascotas y Compañeros (Q4 2025)
- [ ] **Sistema de mascotas**: Criaturas que acompañan al jugador
- [ ] **Mascotas combatientes**: Participan activamente en batallas
- [ ] **Crianza y evolución**: Sistema de crecimiento y mejora de mascotas
- [ ] **Colección de mascotas**: Diferentes especies con habilidades únicas

### Fase 5: Expansión Visual y de Contenido (Q1 2026)
- [ ] **Nuevos sprites**: Personajes, enemigos y objetos adicionales
- [ ] **Estilos visuales alternativos**: Temas y skins personalizables
- [ ] **Ampliación de dungeons**: Más niveles, bosses y áreas temáticas
- [ ] **Sistema de dificultad**: Modos fácil, normal, difícil y extremo

### Fase 6: Características Avanzadas (Q2 2026)
- [ ] **Modo multijugador**: Batallas cooperativas
- [ ] **Gremios/Clan**: Sistema de equipos y colaboración
- [ ] **Economía avanzada**: Comercio entre jugadores
- [ ] **Eventos globales**: Competiciones y torneos masivos

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

*(Add your information here)*

## 🙏 Acknowledgments

- Pixel art sprites and assets
- React Native community
- Expo team
