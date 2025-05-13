# RooME
 
 **Roommate Matching App**
 
Welcome to the *RooME*, an innovative app aimed at helping people find their perfect roommates in a modern, Tinder-like experience. For renters and seekers looking to find compatible living arrangements.
 
 ---
 
 ## [Link to Full Design Document](https://docs.google.com/document/d/1JhkX5pgenM55H9VziPRYVcWF_5A9sfxxXc6NuwBBhNA/edit?tab=t.0)
 
 ---
 
 ## Table of Contents
 
 1. [Overview](#overview)
 2. [Key Features](#key-features)
 3. [System Design](#system-design)
     - [Diagrams](#diagrams)
     - [App Routines](#app-routines)
     - [Datasets](#datasets)
 4. [Roommate Matching Logic](#roommate-matching-logic)
 5. [Next Steps](#next-steps)
 
 ---
 
 ## Overview
 
 The **RoOME** app is designed to cater to individuals looking for a more modern, user-friendly, and personalized roommate search tool. The core concept of the app is to match users based on personality traits, preferences, lifestyle choices, and housing needs. 
 
 ---
 
 ## Key Features
 
 - **Profile Matching**: Matches individuals based on shared interests, lifestyles, budgets, and location preferences.
 - **Swipe-to-Match**: Similar to Tinder, users swipe left to reject or right to accept potential roommates.
 - **In-App Messaging**: Users can chat with potential roommates before deciding to meet in person.
 - **Location-Based Searching**: Matches users based on geographic proximity.
 - **Room Listings & Search**: Users can list available rooms and apartments and search for available places based on their preferences.
 
 ---
 
 ## System Design
 
 ### Diagrams
 
 Here’s an overview of the system design for **Dating Disguised As Roomies Finder**:
 
 #### **1. Roommate Matching System Diagram**
 
 This diagram shows the key components involved in matching potential roommates based on user profiles, preferences, and location.
 '''sql
 +-------------------+       +-------------------+
 |  User Profile     | <---> |  Preferences/     |
 |  Data (Location,  |       |  Compatibility    |
 |  Budget, Likes)   |       |  Score Calculators|
 +-------------------+       +-------------------+
         |                           
         v                           
 +-------------------+       
 |  Matchmaking      |       
 |  Algorithm        | 
 +-------------------+      
         |
         v
 +-------------------+
 |  Roommate Matches |
 +-------------------+
 
 '''
 
 #### **2. User Journey Flow Diagram**
 
 This diagram illustrates the user journey, from signing up to finding a roommate.
 '''sql
 
 
 +-----------------------+
 |  Sign Up / Login      |
 +-----------------------+
         |
         v
 +-----------------------+
 |  Complete Profile     |
 |  (Personal Details)   |
 +-----------------------+
         |
         v
 +-----------------------+
 |  Set Preferences      |
 |  (Budget, Lifestyle)  |
 +-----------------------+
         |
         v
 +-----------------------+
 |  Swipe Through Matches|
 +-----------------------+
         |
         v
 +-----------------------+
 |  Match and Chat       |
 +-----------------------+
 
 '''
 
 ---
 
 ### App Routines
 
 **1. User Registration Routine**
 - The user will sign up with an email, phone number, or social media account.
 - Upon registration, the user is prompted to complete their profile (personal information, budget, preferences, etc.).
 
 **2. Profile Matching Routine**
 - A user's preferences (budget, location, personality, etc.) will be analyzed and matched against others in the database.
 - The algorithm calculates a compatibility score, which is used to rank roommate suggestions.
 
 **3. Swipe-to-Match Routine**
 - Users can swipe through potential roommates, similar to Tinder’s swiping mechanic.
 - If two users swipe right (accept), a match is made, and they can begin chatting.
 
 **4. Messaging Routine**
 - Once matched, users can message each other to discuss the living situation, schedule meetings, and further assess compatibility.
 
 ---
 
 ### Datasets
 
 To enable smooth matching and enhance user experience, we require the following datasets:
 
 - **User Profiles**: Data including location, budget, lifestyle preferences, and personal details.
     - Sample Dataset:
     ```json
     {
       "user_id": 123,
       "location": "San Francisco",
       "budget": 1500,
       "preferences": ["clean", "night owl", "pets"],
       "personality": "outgoing"
     }
     ```
 
 - **Room Listings**: Data about available rooms and apartments (price, location, amenities).
     - Sample Dataset:
     ```json
     {
       "room_id": 456,
       "location": "San Francisco",
       "price": 1200,
       "amenities": ["wifi", "laundry", "parking"],
       "available_from": "2023-05-01"
     }
     ```
 
 - **User Matching Preferences**: Preferences for roommate matching (likes, dislikes, lifestyle).
     - Sample Dataset:
     ```json
     {
       "user_id": 123,
       "ideal_roommate": {
         "budget": 1300,
         "lifestyle": "quiet",
         "cleanliness": "high",
         "pet_preference": "none"
       }
     }
     ```
 
 - **Swipe Data**: Tracks swipes (right/left) for users to help calculate compatibility scores.
     - Sample Dataset:
     ```json
     {
       "user_id": 123,
       "swiped_right": [124, 125, 126],
       "swiped_left": [127, 128]
     }
     ```
 
 ---
 
 ## Roommate Matching Logic
 
 The roommate matching logic works through a scoring system based on user preferences and profile data.
 
 ### **1. Compatibility Scoring**
 - Compatibility is based on shared attributes such as cleanliness, lifestyle, budget, and pet preferences.
 - Each attribute is assigned a weight, and the system calculates an overall compatibility score between two users.
 
 ---
 
 ## Next Steps
  
 1. **Reviews**: Allow Users to see ratings and reviews from previous roommates. Use reliability scores (like Uber ratings) to highlight trustworthy users.
 2. **Integrated Expense Tracker**: Built-in tool to split rent, utilities, and grocery bills automatically. Optional integrations with Venmo, PayPal, or direct bank transfers
 3. **Verification + Safety Features**: ID verification, social media linkage, and optional background checks. Users can report suspicious behavior and block others.
 4. **Smart Alerts + Map-Based Search**: Users can set up alerts for new rooms within a specific budget and neighborhood. Real-time map allows users to compare commute times, nearby transit, and local amenities.
 ---
