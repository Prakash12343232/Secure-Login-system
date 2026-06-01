# Software Requirement Specification (SRS)
## Project: Secure Login System (Presentation Sandbox)

---

## 1. Introduction
This Software Requirement Specification (SRS) establishes the technical parameters for the **Secure Login System (Presentation Prototype)**. This application represents a lightweight, browser-isolated authentication terminal developed for evaluation and presentation. It highlights premium UI layouts, form validators, password meters, and responsive columns operating entirely client-side.

---

## 2. Project Objectives
* **Presentation Portability:** Achieve absolute installation-free execution, enabling developers to run and present the complete flow from local storage keys in any modern browser without database installations.
* **UI/UX Excellence:** Design a professional corporate **Blue and White visual theme** featuring subtle shadows, rounded outlines, input icons, and micro-hover states.
* **Core Validator Demonstration:** Provide interactive visual validators checking password complexity length and confirm-password matches in real-time as users type.

---

## 3. Functional Requirements

### FR1: User Registration
* **FR1.1:** The system shall capture Name, Email, Username, Password, and Password Confirmation fields.
* **FR1.2:** The system shall check all fields for empty inputs on submission, highlighting errors with warning banners.
* **FR1.3:** The system shall assess password length dynamically as the user types, updating a multi-color progress indicator (Red for weak, Green for excellent).
* **FR1.4:** The system shall check whether the confirm-password field matches the primary password in real-time.
* **FR1.5:** The system shall verify username and email uniqueness by scanning local storage entries.

### FR2: Login System
* **FR2.1:** The system shall support logging in with either the Username or Email.
* **FR2.2:** The system shall match credentials against registered local storage users and a pre-populated default presentation user (`admin` / `Password123!`).
* **FR2.3:** The system shall display non-revealing credential alerts during login failures.
* **FR2.4:** The system shall redirect successfully authenticated users to `dashboard.html`.

### FR3: Session Management
* **FR3.1:** The system shall establish an active session token (`active_session`) in `localStorage` upon successful login.
* **FR3.2:** The system shall clear active session keys on Logout, returning users to the login screen with a success banner.
* **FR3.3:** The system shall intercept guest attempts to open `dashboard.html`, automatically routing them to `login.html`.

### FR4: Profile Dashboard
* **FR4.1:** The dashboard shall extract session details dynamically, greeting the user with their name and displaying their username, email, and registration date.
* **FR4.2:** The dashboard shall render dynamic diagnostic records showing current mockup security criteria.
* **FR4.3:** The dashboard shall feature sandbox activity logs listing active session times.

---

## 4. Non-Functional Requirements

### NFR1: Presentation Performance
* **Zero Latency:** Session routing and validations must execute instantly (under 10ms) to ensure an ultra-smooth presentation during evaluations.
* **Visual Polish:** Maintain a high contrast blue/white color scale with transitions on active controls.

### NFR2: Cross-Browser Compatibility
* **Universal Support:** The system must function identically across all modern HTML5/CSS3 engines (Google Chrome, Firefox, Safari, Microsoft Edge, Opera).

### NFR3: Responsiveness
* **Fluid Grids:** The layout columns must adjust dynamically to ensure dashboard grids and login panels align correctly on devices from 320px to 1920px in width.

---

## 5. Mock Sandbox Database (LocalStorage Layout)

Data resides entirely in the client browser's local sandbox storage using standard JSON arrays:

* **Keys:**
  * `secure_auth_users`: Contains list of user records.
    ```json
    [
      {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "username": "janedoe",
        "password": "Password123!",
        "joined": "June 01, 2026"
      }
    ]
    ```
  * `active_session`: Houses details of the currently logged-in user.
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "username": "janedoe",
      "joined": "June 01, 2026",
      "loginTime": "07:35:14 PM"
    }
    ```
