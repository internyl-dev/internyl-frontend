# <a href="https://internyl.org">Internyl</a>
This is the repository for the Frontend of Internyl, focusing on UI/UX. <br>
Other Repositories for Internyl <br>

* [data-augmentor-agent](https://github.com/internyl-dev/data-augmentor-agent) <br>
* [program-discovery-agent](https://github.com/internyl-dev/program-discovery-agent) <br>
* [data-acquisition-pipeline](https://github.com/internyl-dev/data-acquisition-pipeline) <br>

**Link:** https://internyl.org


### What is Internyl?
Internyl is a website that **scrapes the internet for extracurricular opportunities** and displays them all in one place. It uses a **one-of-a-kind AI system** to find the most important information about any internship and displays it in an intuitive, **user-friendly interface**. 
And this website is **accessible to all**, allowing any kid to find their perfect extracurricular opportunity and much more. Using our filters, students can find *extracurricular opportunities* perfectly tailored to their needs. 
In summary, Internyl.org provides students, especially those who come from *under-represented backgrounds*, with access to all the **tools, information, and opportunities** they need to start out in their chosen professional fields.

<hr >

### Developers and Contact

<a href="https://github.com/cold-muffin">
  <img src="https://github.com/cold-muffin.png" width="36" height="36" alt="Efrat Hossain's GitHub" />
</a>
<a href="https://github.com/mohammadr09">
  <img src="https://github.com/mohammadr09.png" width="36" height="36" alt="Mohammad Rahman's GitHub"/>
</a>
<a href="https://github.com/Tahmidd2">
  <img src="https://github.com/Tahmidd2.png" width="36" height="36" alt="Tahmid Islam's GitHub"/>
</a>

**Contact Us:** contactinternyl@gmail.com

<br />

# Table of Contents
1. [Features](#features)
    - [User Dashboard](#user-dashboard)
      - [Suggested Internships](#suggested-internships)
    - [Internships Page](#internships-page)
      - [Filters](#filters)
      - [Eligiblity Checklist](#eligibility-checklist)
    - [Report Page](#report-page)

2. [Structure](#structure)

3. [Technology](#technology)

    - [NextJS with Typescript](#nextjs-with-typescript)
    - [Tailwind CSS](#tailwind-css)
    - [Firebase Authentication](#firebase-athentication)
    - [Firestore Database](#firestore-database)

4. [Feature Updates](#future-updates)

    - [Program Information Clarity](#Improving-Program-Information-Clarity)
    - [Scholarships](#Expansion-Toward-Scholarships)
    - [Organization Integrations](#School-&-Organization-Integrations)

5. [Reflection](#reflection)

    - [Takeaways](#Takeaways)
    - [Long Term Mission](#Internyl’s-Long-Term-Mission)

## Features
### User Dashboard
Users can make an account on our website to access their personal dashboard, where they can view all the internships they've saved, follow their progress with our simple progress bar, and take advantage of our smart recommendation algorithm.

#### Suggested Internships
Users can take advantage of our smart recommendation algorithm, which recommends new internships based on what you've saved or hovered over, so the more you browse, the better matches you'll see.

### Internships Page
Each internship card gives you everything at a glance. At the top, you’ll see the title and provider, then subjects, and eligibility in terms of grade. It lists the location and cost.

#### Filters
You can filter opportunities to find the perfect fit. You can sort by Subject, Due Date, Cost (free, paid, or financial aid), Eligibility, and Duration through the hundreds of internships we have (adding even more as we speak). There’s also a Search Bar for specifics and a Bookmarked Only filter to review saved options. With these tools, finding an internship becomes fast, simple, and accessible for everyone.

#### Eligibility Checklist
 There’s also a quick eligibility checklist for requirements so that a student can make sure that they have all parts of their application, and an info icon for extra details, helping a student truly decide if an internship is right for them.

### Report Page
Internyl has a Report Page where users can point out bugs, bad links, or missing information, thus reiterating the reliability and community-focused nature of the project.

## Structure
```bash
internyl/
├── .next/
├── public/
└── src/
    ├── app/
    │   ├── admin/
    │   ├── admin1/
    │   ├── api/
    │   ├── pages/
    │   │   ├── about/
    │   │   ├── account/
    │   │   ├── contact/
    │   │   ├── faq/
    │   │   ├── guidelines/
    │   │   ├── internships/
    │   │   ├── login/
    │   │   ├── report/
    │   │   ├── signup/
    │   │   └── verify-email/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    └── lib/
        ├── components/
        │   ├── Brushstroke.tsx
        │   ├── Footer.tsx
        │   ├── InternshipCard.tsx
        │   ├── InternshipRecommendationCard.tsx
        │   ├── Navbar.tsx
        │   └── SearchBar.tsx
        ├── config/
        │   ├── context/
        │   ├── firebaseConfig.ts
        │   └── initGlobals.ts
        ├── hooks/
        │   ├── useAdminCheck.ts
        │   └── useRecommendationEngine.ts
        ├── modules/
        │   ├── dateUtils.ts
        │   ├── getDueDateIcon.ts
        │   ├── getDueDateText.ts
        │   ├── getTimeRemaining.ts
        │   ├── scoreInternship.ts
        │   └── toggleBookmark.ts
        ├── test/
        │   └── sample.ts
        └── types/
            ├── internshipCard.ts
            ├── report.ts
            └── userPreferences.ts
```


## Technology

### NextJS with Typescript
We used the NextJS with React framework to develop a full-stack, high-performance web application. Typescript helps to prevent errors at compile time and also ensures a trustworthy codebase. 

### Tailwind CSS
This is the CSS framework we used that allowed us to make a modern, 
esponsive, and sleek interface for our users while also allowing us to minimize without writing huge CSS files.

### Firebase Athentication
We used Firebase Authentication to allow users to create accounts and log in to access all of their saved data on the website, which is saved via. Firestore.

### Firestore Database
We used Firestore to save user's internships, user's progress of internships eligibility checklists, submitted reports of errors and bugs on the website, and all of our internships displayed on the website. 
We used Firestore to save user's internships, user's progress of internships eligibility checklists, submitted reports of errors and bugs on the website, and all of our internships displayed on the website. 

# Future Updates

### Improving Program Information Clarity
As we created Internyl, we realized that many programs lack clear information about deadlines, eligibility, and requirements. Some even provide incomplete or unclear details.  
That’s why we've already developed an efficient and curated database of internships that compiles accurate information—even discovering details not always publicly listed on program pages.  
We aim to expand this by adding insights such as predicted future deadlines (based on periodic patterns) and statistical data like average GPA of accepted students and general acceptance rates—data sourced directly through user surveys.

### Expansion Toward Scholarships
The development of Internyl 2.0 is not just possible—it's inevitable. We are committed to expanding our reach and impact.  
Beyond internships, we want to enhance Internyl’s mission by connecting students with scholarships aligned with their academic success, interests, and lifestyles.  
We are currently building an extensive scholarship directory with accurate requirements, deadlines, and eligibility patterns.  
This addition will allow students to view learning opportunities and financial support in one place, making higher education more accessible.

### School & Organization Integrations
One of the most ambitious features in the 2.0 roadmap is partnering with schools to give them dedicated login portals for their students.  
This would allow organizations to offer school-only application codes, host exclusive internships, and add custom interfaces and services.  
Through these collaborations, we hope to create deeper connections between schools, students, and programs—making the search and application process more streamlined than ever.


# Reflection
### Takeaways
Developing this project was always a constant challenge but a learning journey nonetheless. Not only did we gain a deeper understanding of the architecture of modern web apps, we learned its language and core design principles which we will utilize for the rest of our professional career. 
Our most valuable lessons went beyond technology. Learning how to plan, communicate, and adapt proved to be crucial not only here but for any of our future projects. Delegating tasks and constantly reviewing code became essential to making our ambitions a reality. Overcoming challenges as a group became central to our success.

Planning was especially crucial. Before we even started to write the first line of code, we needed to define what we wanted, identify potential issues, and choose a structure that would form the basis of our project. Just as architects produce blueprints, we thought of design and usability as being essential pieces of a bigger picture. We came to appreciate the way software engineering was both an art and a science, possible to perfect with practice, time, and ambition.

Ultimately, this project allowed us to grow as both developers and professionals. We gained a lot of strengths and hope to build connections through the large network of alumni, through the Congressional App Challenge, who are just as passionate about building “meaningful” technology. 

### Internyl’s Long-Term Mission
At its core, Internyl aims to do more than just list internships. Our goal is to reimagine how students discover and interact with real-world opportunities.  
Bringing Internyl 2.0 to life is a crucial step toward that mission—expanding our reach, improving access to opportunities, and unlocking the potential within students.
