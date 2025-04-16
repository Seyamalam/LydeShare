# Ride Sharing App (Bangladesh) – User App Documentation

## Overview

This document outlines the features, pages, data structures, and user flows for the **User App** of a Bangladesh-focused ride-sharing demo.  
**Note:** This is a frontend-only demo; all data is mocked.

---

## Features

### 1. Authentication
- Login/Signup with:
  - Email & password
  - Phone (OTP simulated)
  - Google account (simulated)
- Password reset (simulated)

### 2. Ride Booking
- Request a ride (choose pickup/drop-off, ride type)
- Map view (mocked, shows user & nearby drivers)
- Fare estimation (based on mock data)
- Booking confirmation and status updates
- Schedule a ride (optional, simulated)

### 3. During Ride
- Live ride tracking (simulated updates)
- In-app chat and call with driver (UI only)
- Cancel ride

### 4. Post-Ride
- Rate and review driver
- View trip summary

### 5. History and Payments
- View past rides
- Payment methods (Cash, bKash, Nagad, Card – simulated)
- Apply promo codes (mocked)

### 6. Profile & Support
- Edit personal info (name, phone, email, photo)
- View and edit saved addresses
- Help & FAQ section (static)
- Contact support (simulated)

### 7. Notifications
- Booking and ride status
- Promotions

---

## Pages / Screens

1. **Onboarding & Welcome**
2. **Login / Signup**
3. **Phone OTP Verification** (simulated)
4. **Home/Map** (default screen after login)
5. **Book a Ride**
    - Pickup & drop-off selection
    - Ride type selection
    - Fare estimation
6. **Ride Confirmation**
7. **Live Ride Tracking**
8. **Payment Selection**
9. **Promo Code Entry**
10. **Trip Summary & Rating**
11. **Ride History**
12. **Profile & Account Settings**
13. **Saved Addresses**
14. **Notifications**
15. **Support / Help / FAQ**

---

## Data Structure (Mocked Example)

```json
{
  "users": [
    {
      "id": 1,
      "name": "Rahim",
      "phone": "017XXXXXXXX",
      "email": "rahim@email.com",
      "photo": "url-to-photo",
      "savedAddresses": [
        {"label": "Home", "address": "Gulshan, Dhaka"},
        {"label": "Work", "address": "Banani, Dhaka"}
      ]
    }
  ],
  "rides": [
    {
      "id": 101,
      "userId": 1,
      "pickup": "Gulshan",
      "dropoff": "Banani",
      "status": "completed",
      "driver": {
        "name": "Karim",
        "vehicle": "Toyota Axio",
        "plate": "DHAKA METRO GA 1234"
      },
      "fare": 200,
      "date": "2025-04-10T09:15:00Z",
      "ratingGiven": 5
    }
  ],
  "notifications": [
    {
      "id": 1,
      "userId": 1,
      "type": "booking",
      "message": "Your ride is confirmed!",
      "timestamp": "2025-04-10T09:10:00Z"
    }
  ],
  "promos": [
    {
      "code": "FIRST50",
      "discount": "50%",
      "description": "50% off on your first ride"
    }
  ]
}
```

---

## User Flow Example

1. **Open App** → **Welcome/Onboard** → **Login/Signup**
2. **Home/Map** → Enter **pickup/drop-off** → Select **ride type**
3. View **fare estimate** → **Confirm booking**
4. **Track ride** (simulated) → **Arrive**
5. **Rate driver** → View **trip summary**
6. Access **history**, **profile**, **notifications**, **support** as needed

---

## Technologies

| Component        | Recommendation          |
|------------------|------------------------|
| Mobile Framework | React Native/Flutter   |
| Maps             | Google Maps (mocked)   |
| State/Data       | In-memory, local JSON  |
| Styling          | Tailwind/MUI/NativeBase|

---

## Limitations

- No backend; all data is mocked and resets on reload (unless localStorage is used).
- No real payments, authentication, or live tracking.
- All interactions are simulated for demonstration only.

---

## Suggestions for Demo

- Use Bangla and English language toggle in UI.
- Include Bangladesh payment methods in payment selection UI.
- Show multiple ride types (Car, Bike, CNG) for local relevance.
- Display static map images or use a mock map component.

---

**End of User App Documentation**