BookIt: Experiences & Slots

BookIt is a full-stack web application that allows users to browse, select, and book travel experiences. It's built with a React/Next.js frontend and a Node.js/Express backend with MongoDB, demonstrating a complete end-to-end booking workflow.

Live Demo Links
    Frontend (Vercel): https://next-js-bookit.vercel.app
    Backend API (Render): https://next-js-bookit.onrender.com

========================================
TECH STACK
========================================

    Frontend:           React (Next.js), TypeScript
    Backend:            Node.js, Express.js, TypeScript
    Database:           MongoDB (with Mongoose)
    Styling:            Bootstrap, Custom CSS (globals.css)
    State Management:   React Context (for Search & Booking)
    API Client:         Axios

========================================
LOCAL SETUP AND INSTALLATION
========================================

To run this project locally, you will need to set up both the server (backend) and the client (frontend).

Prerequisites
    - Node.js (v18 or later)
    - Git
    - A free MongoDB Atlas account

1. Clone the Repository

    git clone https://github.com/[YourUsername]/bookit-project.git
    cd bookit-project

2. Backend Setup (server)

    First, set up the backend API and database.

    1. Navigate to the server directory:
       cd server

    2. Install dependencies:
       npm install

    3. Create your Environment File (.env)
       You must create a file named .env in the server/ folder and add your MongoDB connection string.

       -- server/.env --
       # Get this string from your MongoDB Atlas dashboard
       MONGO_URI="mongodb+srv://your_user:<your_password>@cluster0.abcde.mongodb.net/yourDatabaseName"
       
       # Port for the backend
       PORT=5001
       ---------------

    4. Seed the Database
       This command populates your database with 16 sample experiences, randomized slots, and promo codes.
       
       npm run seed
       
       (You should see a "✅ Data seeding complete!" message.)

3. Frontend Setup (client)

    Next, set up the Next.js frontend.

    1. Navigate to the client directory (from the root):
       cd client

    2. Install dependencies:
       npm install

    3. Configure Image Hostnames
       The frontend needs to be told which domains to trust for images. Open client/next.config.js and ensure the remotePatterns array includes the hostnames used in the seed script:

       -- client/next.config.js --
       images: {
         remotePatterns: [
           { protocol: 'https', hostname: 'images.unsplash.com' },
           { protocol: 'https', hostname: 'images.pexels.com' },
         ],
       },
       -------------------------

========================================
RUNNING THE APPLICATION
========================================

You must have two separate terminals open to run the full application.

Terminal 1: Run the Backend

    # In the /server folder
    npx ts-node src/index.ts

    # You should see:
    # MongoDB Connected Successfully
    # Server is running on http://localhost:5001

Terminal 2: Run the Frontend

    # In the /client folder
    npm run dev

    # You should see:
    # ✓ Ready in ...
    # - Local:    http://localhost:3000

You can now open http://localhost:3000 in your browser to use the application.

========================================
API ENDPOINTS
========================================

The backend provides the following API routes, all prefixed with /api.

    Method:   GET
    Endpoint: /experiences
    Desc:     Get all experiences.

    Method:   GET
    Endpoint: /experiences/:id
    Desc:     Get a single experience and its available slots.

    Method:   POST
    Endpoint: /promo/validate
    Desc:     Validates a promo code.

    Method:   POST
    Endpoint: /bookings
    Desc:     Creates a new booking.