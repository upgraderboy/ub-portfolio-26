export interface MemoryEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  images: string[];
}

export const defaultMemories: MemoryEvent[] = [
  {
    id: "mem-1",
    title: "Smart India Hackathon",
    date: "March 2024",
    description: "Won the first prize in the national level Smart India Hackathon. An incredible 36-hour team effort building solutions for public sector problems.",
    category: "Hackathons",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mem-2",
    title: "College Graduation",
    date: "May 2024",
    description: "Graduated with Honors in Computer Applications (BCA). A proud milestone celebrating years of hard work, learning, and growth with friends.",
    category: "College",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mem-3",
    title: "MERN Stack Meetup",
    date: "June 2024",
    description: "Delivered a technical talk on high-performance React architectures at the local developer meetup. Connected with several talented tech enthusiasts.",
    category: "Meetups",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mem-4",
    title: "Internship Farewell",
    date: "April 2024",
    description: "Wrapped up an amazing, learning-filled internship as a frontend web developer. Gained invaluable experience building real-world products.",
    category: "Internships",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mem-5",
    title: "Product Launch Day",
    date: "July 2024",
    description: "Collaborated with cross-functional teams to launch our main SaaS application. Celebrated reaching 1,000+ signups within the first 24 hours.",
    category: "Work",
    images: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mem-6",
    title: "Web Summit Expo",
    date: "August 2024",
    description: "Attended the Tech Expo conference to discover latest advancements in developer tools, AI agents, cloud orchestration, and performance tuning.",
    category: "Conferences",
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
