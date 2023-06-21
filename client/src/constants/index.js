import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
  mountain,


    DART,

    movie,
    geolocation,
    calculator,
    threejs,
    PostgreSQL,
    Aws,
    Firebase,
    Numpy,
    Cimage,
    python,
    heroku,


  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Web Developer",
      icon: web,
    },
    {
      title: "React Native Developer",
      icon: mobile,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },

  ];
  
  const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "figma",
      icon: figma,
    },
    {
      name: "docker",
      icon: docker,
    },
    {
      name: "python",
      icon: python,
    },
    {
      name: "PostgreSQL",
      icon: PostgreSQL,
    },
    {
      name: "C",
      icon: Cimage,
    },
    {
      name: "Numpy",
      icon: Numpy,
    },
    {
      name: "Firebase",
      icon: Firebase,
    },
    {
      name: "Aws",
      icon: Aws,
    },
    {
      name: "heroku",
      icon: heroku,
    },
  ];
  
  const experiences = [
    {
      title: "Lead Developer",
      company_name: "CARBON FOOTPRINT CALCULATOR WEB |MOUNTAINTOP PROJECT",
      icon:   mountain,
      iconBg: "#ffffff",
      date: "May 2022 - Aug 2022",
      points: [
        "Led the design and implementations of a web carbon calculator for dining hall workers to calculate carbon footprint of food to better educate people in dining hall.",
        "Implemented Raygun Crash Reporting on Heroku to find and fix most common web crashes.",
        "Created PostgresSQL database to save recipe and ingredients.",
        "Documents configurations variable and environment variable; Performed and documented team members’ code.",
      ],
    },{
      title: "Frontend Developer",
      company_name: "DART|LEHIGH PROFESSOR RESEARCH",
      icon: DART,
      iconBg: "#ffffff",
      date: "Sep 2022 - Present",
      points: [
        "Design the frontend an educational study module for scam prevention for senior citizens",
        "Collect users answer in MongoDB",
        "Design and implement login page based on figma design from design team",
      ],
    },
    
    
  ];
  
  const testimonials = [

  ];
  
  const projects = [
    
    {
      name: "GEO LOCATION RECOMMENDER",
      description:
        "A React Native app using Google Geolocation API to recommend nearby restaurant or location of interested based on user input keyword",
      tags: [
        {
          name: "React Native",
          color: "blue-text-gradient",
        },
        {
          name: "expo",
          color: "green-text-gradient",
        },
        {
          name: "googleMap-API",
          color: "pink-text-gradient",
        },
      ],
      image: geolocation,
      source_code_link: "https://github.com/anvu21/geolocation/tree/main/hw1",
    },
    {
      name: "Movie API",
      description:
        "Web application that enables users to look up movie links. A sign-in system that allow user to stay in session with JWT token via cookies",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "JWT Token",
          color: "green-text-gradient",
        },
        {
          name: "MongoDB",
          color: "pink-text-gradient",
        },
        {
          name: "AWS Amplify",
          color: "blue-text-gradient",
        },
      ],
      image: movie,
      source_code_link: "https://github.com/anvu21/movie-api-amazon",
    },
    {
      name: "Carbon Calculator",
      description:
        "A React app that calculates recipe carbon emissions based on ingredients and weight",
      tags: [
        {
          name: "React",
          color: "blue-text-gradient",
        },
        {
          name: "PostgreSQL",
          color: "green-text-gradient",
        },
        {
          name: "Heroku",
          color: "pink-text-gradient",
        },
      ],
      image: calculator,
      source_code_link: "https://github.com/anvu21/carbonFootprintCalculator",
    },
    
  ];
  
  export { services, technologies, experiences, testimonials, projects };