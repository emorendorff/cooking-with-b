# Chef Boyar-B

A modern, mobile-first recipe app built for home cooks who want to organize their favorite recipes, plan meals, and simplify grocery shopping.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8)

<!-- Add your screenshots here -->
<!-- ![Home Screen](screenshots/home.png) -->
<!-- ![Recipe Detail](screenshots/recipe-detail.png) -->
<!-- ![Grocery List](screenshots/grocery-list.png) -->

## Features

### Recipe Discovery
- **Daily Pick** — A featured recipe refreshes each day to inspire your next meal
- **Recipe Carousel** — Swipe through your recipe collection on mobile
- **Search & Browse** — Find recipes by name, tags, or ingredients

### Recipe Details
- Beautiful recipe cards with images, prep/cook times, difficulty, and servings
- Step-by-step instructions
- Equipment lists
- **Linked Recipes** — Ingredients can reference other recipes (e.g., "1 batch Homemade Marinara")
- Tags for easy categorization

### Grocery List
- **One-tap add** — Add individual ingredients or all ingredients from a recipe
- **Manual items** — Add your own items that aren't from recipes
- **Organized by recipe** — See which items came from which recipe
- **Check off items** as you shop
- **Persisted locally** — Your list stays even if you close the app

### Ratings & Reviews
- Rate recipes with a 5-star system
- Leave reviews for future reference

### Admin Features
- Add new recipes with full details
- Edit existing recipes
- Upload and manage recipe images
- Form clears after submission for easy batch entry

## Install as Mobile App (PWA)

Chef Boyar-B is a Progressive Web App, meaning you can install it on your phone and use it like a native app—no app store required!

### iOS (Safari)
1. Open the app in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

### Android (Chrome)
1. Open the app in Chrome
2. Tap the **three-dot menu**
3. Tap **Install app** or **Add to Home Screen**
4. Tap **Install**

Once installed, the app will:
- Launch in full-screen mode (no browser UI)
- Work offline for cached recipes
- Feel like a native app

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript |
| Styling | Tailwind CSS 4 |
| Routing | React Router 6 |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Build | Vite |
| PWA | vite-plugin-pwa, Workbox |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cooking-with-b.git
cd cooking-with-b

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
├── assets/          # Icons and static assets
├── components/      # Reusable UI components
│   ├── ImageUpload.tsx
│   ├── Rating.tsx
│   ├── RecipeCard.tsx
│   └── SearchBar.tsx
├── context/         # React Context providers
│   ├── AuthContext.tsx
│   └── GroceryListContext.tsx
├── hooks/           # Custom React hooks
├── lib/             # API and utility functions
│   └── api.ts
├── pages/           # Route pages
│   ├── BrowseRecipes.tsx
│   ├── EditRecipe.tsx
│   ├── GroceryList.tsx
│   ├── RecipeDetail.tsx
│   └── Settings.tsx
├── Header/          # Header component
├── Navigation/      # Bottom navigation
├── DailyPick/       # Daily featured recipe
├── RecipeBrowser/   # Recipe carousel
├── App.tsx          # Root component & routes
└── index.css        # Global styles & Tailwind config
```

## Database Schema

The app uses Supabase with the following main tables:

- **recipes** — Recipe metadata (name, times, difficulty, etc.)
- **ingredients** — Recipe ingredients with optional linked recipes
- **images** — Recipe images with role (primary/additional)
- **reviews** — User ratings and reviews
- **profiles** — User profiles and admin status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

Made with love for home cooks everywhere.
